import { Loading, Toast } from 'quasar';

import { mfForm } from '../../mixins';

export default {
	mixins: [
		mfForm
	],
	name: 'mf-gps',
	data () {
		return {
			answerCallback: function () {
				if (this.value.answer.content) {
					[this.latitude, this.longitude] = this.value.answer.content.split(',');
				}
			},
			gettingPosition: false,
			latitude: null,
			longitude: null
		};
	},
	methods: {
		addLocation: function () {
			if ('geolocation' in navigator && !this.gettingPosition) {
				this.gettingPosition = true;
				Loading.show();
				navigator.geolocation.getCurrentPosition((position) => {
					this.latitude = position.coords.latitude;
					this.longitude = position.coords.longitude;
					this.updateLatLng();
					this.gettingPosition = false;
					Loading.hide();
				}, (error) => {
					Toast.create.negative({
						html: `There was a problem getting your location (code ${error.code}).`,
						timeout: 1000
					});
					console.log('gps error', error);
					this.gettingPosition = false;
					Loading.hide();
				}, {
					enableHighAccuracy: true,
					maximumAge: 30000,
					timeout: 27000
				});
			} else {
				Toast.create.warning({
					html: 'GPS is not available',
					timeout: 1000
				});
			}
		},
		updateLatLng: function () {
			const coordinates = [this.latitude, this.longitude].filter((coordinate) => {
				return String(coordinate).trim() !== '';
			});
			this.$set(this.value.answer, 'content', coordinates.join(','));
			this.$set(this.value.answer, 'extended', {
				latitude: this.latitude,
				longitude: this.longitude
			});
			this.update();
		}
	}
};
