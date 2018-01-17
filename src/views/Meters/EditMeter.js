import { Toast, Events } from 'quasar';
import Fab from '../../components/Fab/Fab.vue';
import moment from 'moment';
import AdminNav from '../../components/AdminNav/AdminNav.vue';
import {required} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

export default {
	name: 'editMeter',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	validations: {
		meter: {
			companyid: {
				required
			},
			companyLocationID: {
				required
			},
			reading: {
				isDecimal
			}
		}
	},
	data () {
		return {
			meter : {
				"serialNumber": "",
				"vesselid": null,
				"updatedAt": "",
				"size": "1 ½",
				"createdAt": "",
				"companyid": null,
				"companyLocationId": "",
				"deletedAt": "",
				"id": null,
				"make": "",
				"reading": null,
				"type": "Meter"
			},
			companies: [],
			companySearchTerm: '',
			assets: [],
			vessels: [],
			currentTab: '',
			typeSelect: [
				{
					label: 'Meter',
					value: 'Meter'
				},
				{
					label: 'Register',
					value: 'Register'
				},
			],
			sizeSelect: [
				{
					label: '¾"',
					value: '¾"'
				},
				{
					label: '1 ½"',
					value: '1 ½"'
				},
				{
					label: '2"',
					value: '2"'
				},
				{
					label: '3"',
					value: '3"'
				},
			]
		}
	},
	computed: {
		companiesSelect: function() {
			let companySelect = [];
			this.companies.forEach(function(company) {
				companySelect.push({
					label: company.name,
					value: company.name,
					id: company.id
				});
			});

			return companySelect.sort(this.selectSort);

		},
		assetSelect: function () {
			let assetSelect = [{
				label: '-- UNASSIGNED --',
				value: null,
			}];

			if (!this.meter.companyid) {
				return assetSelect;
			}

			let vm = this;
			this.assets.forEach(function (asset) {
				if (asset.companyid != vm.meter.companyid) {
					return;
				}
				assetSelect.push({
					label: asset.name.toString(),
					value: asset.id
				});
			});
			return assetSelect.sort(this.selectSort);

		},
		locationSelect: function () {
			let locationSelect = [{
				label: '-- UNASSIGNED --',
				value: null,
			}];

			if (!this.meter.companyid) {
				return locationSelect;
			}

			let vm = this;
			this.locations.forEach(function (location) {

				if (vm.meter.companyid && location.companyid != vm.meter.companyid) {
					return;
				}

				locationSelect.push({
					label: location.name + ", " + location.address1 + ", " + location.city + ", " + location.region,
					value: location.id
				});
			});

			return locationSelect;

		},
		vesselSelect: function () {
			let vesselSelect = [{
				label: '-- UNASSIGNED --',
				value: null,
			}];

			if (!this.meter.companyid) {
				return vesselSelect;
			}

			let vm = this;
			this.vessels.forEach(function (vessel) {
				if (vessel.companyid != vm.meter.companyid) {
					return;
				}

				vesselSelect.push({
					label: vessel.serialNumber.toString(),
					value: vessel.id !== null ? vessel.id : vessel.appGeneratedID
				});
			});
			return vesselSelect.sort(this.selectSort);

		}		
	},
	created: function () {
		/* Load selected meter */
		if (this.$route.params.id) {
			let id = parseInt(this.$route.params.id);
			if (this.$route.params.id.toString().length === 36) {
				id = this.$route.params.id;
			}
			this.$store.dispatch('fetchItem', {
				type: 'meters',
				lookup: 'id',
				value: id,
				field: '*'
			}).then((meter) => {
				this.$set(this, 'meter', meter);
			});
		}


		/* Load companies */
		setTimeout(() => {
			this.assets = this.$store.getters.assets.items;
			this.companies = this.$store.getters.companies.items;
			this.locations = this.$store.getters.locations.items;

			/* Preset the autocomplete search terms if we have a company or a vessel already */
			if (this.meter.companyid) {
				for (let [index, company] of this.companies.entries()) {
					if (company.id == this.meter.companyid) {
						this.companySearchTerm = company.name;
						break;
					}
				}
			}
		}, 1000);

		setTimeout(() => {
			this.vessels = this.$store.getters.vessels.items;
		}, 1500);


	},
	mounted () {
		let vm = this;
		/* Listen for update events */
		Events.$on('meters:updated', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'meters'
			});
		});

		Events.$on('meters:created', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'meters'
			});
		});

		Events.$on('meters:updatedSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'meters'
			});
		});

		Events.$on('meters:createdSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'meters'
			});
		});

		Events.$on('meters:error', function (params, errorMsg) {
			Toast.create.negative(errorMsg);
		});
	},
	beforeDestroy () {
		Events.$off();
	},
	methods: {
		selectSort: function (a, b) {
			if (a.label < b.label) {
				return -1;
			}

			if (a.label > b.label) {
				return 1;
			}

			return 0;
		},
		companySearch: function (term, done) {
			let results = this.companiesSelect.filter((company) => {
				return company.label.toLowerCase().includes(term.toLowerCase());
			}).sort(this.selectSort);

			if (!results) {
				results = [];
				results.push({
					label: 'No matching companies.',
					value: '',
					id: null
				})
			}

			done(results);
		},
		companySelected: function (asset) {
			/* Set asset ID or app generated asset ID if no asset id is available */
			this.$set(this.meter, 'companyid', asset.id !== null ? asset.id : asset.appGeneratedID);
			this.$set(this.meter, 'companyLocationID', null);
		},
		save() {

			if (this.$v && this.$v.meter) {
				this.$v.meter.$touch();
				if (this.$v.meter.$error) {
					Toast.create.negative("Error saving meter. Please review all form fields for accuracy.");
					return;
				}
			}

			this.meter.createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.meter.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.$store.dispatch('putItem',
				{
					name: 'meters',
					payload: {
						meter: this.meter
					}
				}
			);
		},
		update() {
			if (this.$v && this.$v.meter) {
				this.$v.meter.$touch();
				if (this.$v.meter.$error) {
					Toast.create.negative("Error updating meter. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$store.dispatch('meter', {
				id: this.meter.id,
				value: this.meter
			});

			this.$store.dispatch('updateItem', {
				name: 'meters',
				key: this.meter.id,
				payload: {
					meter: this.meter
				}
			});

		},
	}
};
