import moment from 'moment';
import {Events, Toast, Platform, Utils} from 'quasar';

export default {
	name: 'add-photos',
	mounted: function() {

	},
	props: {
		inspection: {
			type: Object
		},
	},
	computed: {
		platform: function() {
			return Platform;
		}
	},
	data () {
		return {
			extensions: '.gif,.jpg,.jpeg,.png',
			multiple: true,
			files: [],
			uploading: false,
			uploadedSize: 0,
			totalSize: 0,
			images: [],
			otherFiles: [],
			category: {},
			iosTest: []
		}
	},
	methods: {
		open(category) {
			this.category = category;
			this.$refs.file.click();
			this.$refs.photoModal.open();
		},
		getPhoto: function() {
			let vm = this;
			if (Platform.is.cordova) {
				navigator.camera.getPicture(
					function (imageData) {
						let img = new Image()
						img.src = `data:image/jpeg;base64,${imageData}`;
						img.name = `No Name (${vm.images.length})`,
						img.filename = `Unknown-${vm.images.length}.jpg`
						img.description = "";
						img.__file = {
							__size : "N/A"
						}
						vm.images.push(img);
					},
					function (error) {
						console.log(error);
					},
					{quality: 17, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true}
				);
			}

			if (!Platform.is.cordova) {

				this.$refs.file.click();

			}
		},
		removeAll: function() {
			this.images = [];
			this.otherFiles = [];
			this.files = [];
		},
		remove: function(name) {
			this.images = this.images.filter(file => file.name !== name)
			this.otherFiles = this.otherFiles.filter(file => file.name !== name)
			this.files = this.files.filter(file => file.name !== name)
		},
		save: function() {
			let photo = {};
			this.images.forEach( (image) => {
				photo = {
					userid: this.$store.getters.currentUser.ID,
					inspectionid : this.inspection.id,
					title : image.name,
					description: image.description,
					filename: image.filename,
					file: image.src,
					createdAt: moment.utc().format('MMMM, DD YYYY HH:mm:ss'),
					updateddAt: moment.utc().format('MMMM, DD YYYY HH:mm:ss'),
				}

				this.$store.dispatch('putItem',
					{
						name: 'photos',
						payload: {
							photo: photo
						}
					}
				);

				Events.$emit('photos:saved');
			});

			Events.$emit('photos:allSaved');
			this.removeAll();
			this.$refs.photoModal.close()
		},
		addPhotoFromBrowser: function(e) {
			if (!this.multiple && this.files.length >= 1) {
				return
			}

			let files = Array.prototype.slice.call(e.target.files)

			files = files
				.filter(file => !this.files.some(f => file.name === f.name))
				.map(file => {
					file.__failed = false
					file.__uploaded = 0
					file.__progress = 0
					file.__size = Utils.format.humanStorageSize(file.size)
					return file
				})

			files.filter(file => file.type.startsWith('image')).forEach((file, index) => {
				var reader = new FileReader()
				reader.onload = (e) => {
					let img = new Image()
					img.src = e.target.result;
					img.name = file.name;
					img.filename = file.name;
					img.description = "";
					img.__file = file;
					this.images.push(img);
				}
				reader.readAsDataURL(file)
			})
			this.otherFiles = this.otherFiles.concat(files.filter(file => !file.type.startsWith('image')))
			this.files = this.files.concat(files)
		}
	}
};
