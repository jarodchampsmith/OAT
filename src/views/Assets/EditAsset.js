import { Toast, Events } from 'quasar';
import Fab from '../../components/Fab/Fab.vue';
import moment from 'moment';
import {required} from 'vuelidate/lib/validators';

import AdminNav from '../../components/AdminNav/AdminNav.vue';
export default {
	name: 'editAsset',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	validations: {
		asset: {
			name: {
				required
			},
			type: {
				required
			},
			companyid: {
				required
			},
			companyLocationID: {
				required
			},
			locationid: {
				required
			}
		}
	},
	data () {
		return {
			asset: {
				"locationid": "",
				"companyLocationID": "",
				"originalTestDate": "",
				"unitInformation": "",
				"updatedAt": "",
				"createdAt": "",
				"appGeneratedID": "",
				"companyid": null,
				"deletedAt": "",
				"id": null,
				"maxProduct": "",
				"type": "",
				"name": ""
			},
			companies: [],
			companySearchTerm: '',
			user: {},
			assets: [],
			locations: [],
			currentTab: '',
			typeSelect: [
				{
					label : 'Highway Tanks',
					value: 'highway'
				},
				{
					label : 'Portable Tanks',
					value: 'portable'
				},
				{
					label : 'Farm Wagon',
					value: 'farm'
				},
				{
					label : 'LPG Storage',
					value: 'LPG'
				},
				{
					label : 'NH3 Storage',
					value: 'NH3'
				}
			]
		}
	},
	computed: {
		companiesSelect: function () {
			let companySelect = [];
			this.companies.forEach(function (company) {
				companySelect.push({
					label: company.name,
					value: company.name,
					id: company.id
				});
			});

			return companySelect.sort(this.selectSort);
		},
		locationSelect: function () {
			let locationSelect = [{
				label: '-- UNASSIGNED --',
				value: null,
			}];

			if (!this.asset.companyid) {
				return locationSelect;
			}

			let vm = this;
			this.locations.forEach(function (location) {

				if (vm.asset.companyid && location.companyid != vm.asset.companyid) {
					return;
				}

				locationSelect.push({
					label: location.name + ", " + location.address1 + ", " + location.city + ", " + location.region,
					value: location.id
				});
			});

			return locationSelect;

		},
		assetSelect: function () {
			let assetSelect = [{
				label: '-- UNASSIGNED --',
				value: null,
			}];

			if (!this.asset.companyid) {
				return locationSelect;
			}

			let vm = this;
			this.assets.forEach(function (asset) {

				if (asset.companyid != vm.asset.companyid) {
					return;
				}

				assetSelect.push({
					label: asset.name,
					value: asset.id
				});
			});
			return assetSelect.sort(this.selectSort);

		}
	},
	mounted: function() {
		let vm = this;
		/* Listen for update events */
		Events.$on('assets:updated', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'assets'
			});
		});

		Events.$on('assets:created', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'assets'
			});
		});

		Events.$on('assets:updatedSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'assets'
			});
		});

		Events.$on('assets:createdSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'assets'
			});
		});

		Events.$on('assets:error', function (params, errorMsg) {
			Toast.create.negative(errorMsg);
		});

		console.timeEnd('init');
	},
	beforeDestroy () {
		Events.$off();
	},
	beforeCreate () {
		console.time('init');
	},
	created: function () {
		/* Load selected asset */
		if (this.$route.params.id) {
			let id = parseInt(this.$route.params.id);
			if (this.$route.params.id.toString().length === 36) {
				id = this.$route.params.id;
			}
			this.$store.dispatch('fetchItem', {
				type: 'assets',
				lookup: 'id',
				value: id,
				field: '*'
			}).then((asset) => {
				this.$set(this, 'asset', asset);
			});
		}


		/* Load companies  */
		setTimeout(() => {
			this.assets = this.$store.getters.assets.items;
			this.companies = this.$store.getters.companies.items;
			this.locations = this.$store.getters.locations.items;
			this.user = this.$store.getters.currentUser;

			/* Preset the autocomplete search terms if we have a company or a vessel already */
			if (this.asset.companyid) {
				for (let [index, company] of this.companies.entries()) {
					if (company.id == this.asset.companyid) {
						this.companySearchTerm = company.name;
						break;
					}
				}
			}
		},1000);
	},
	methods: {
		updateComputed() {
			this.$forceUpdate();
		},
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
			this.$set(this.asset, 'companyid', asset.id !== null ? asset.id : asset.appGeneratedID);
			this.$set(this.asset, 'companyLocationID', null);
		},
		save() {

			if (this.$v && this.$v.asset) {
				this.$v.asset.$touch();
				if (this.$v.asset.$error) {
					Toast.create.negative("Error saving asset. Please review all form fields for accuracy.");
					return;
				}
			}
			
			this.asset.createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.asset.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.$store.dispatch('putItem',
				{
					name: 'assets',
					payload: {
						asset: this.asset
					}
				}
			);
		},
		update() {

			if (this.$v && this.$v.asset) {
				this.$v.asset.$touch();
				if (this.$v.asset.$error) {
					Toast.create.negative("Error updating asset. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$store.dispatch('assetAdmin', {
				id: this.asset.id,
				value: this.asset
			});

			this.$store.dispatch('updateItem', {
				name: 'assets',
				key: this.asset.id,
				payload: {
					asset: this.asset
				}
			});

		},
	}
};
