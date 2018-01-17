import { Toast, Events } from 'quasar';
import Fab from '../../components/Fab/Fab.vue';
import moment from 'moment';
import AdminNav from '../../components/AdminNav/AdminNav.vue';
import {required} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

export default {
	name: 'editTransport',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	validations: {
		transport: {
			type: {
				required
			},
			companyid: {
				required
			},
			companyLocationID: {
				required
			},
			engineHours: {
				isDecimal
			}
		}
	},
	data () {
		return {
			transport : {
				"assetid": null,
				"chassisSerialNumber": "",
				"updatedAt": "",
				"createdAt": "",
				"engineSerialNumber": "",
				"deletedAt": "",
				"appGeneratedID": "",
				"companyid": null,
				"companyLocationId": "",
				"id": null,
				"manufacturer": "",
				"licensePlate": "",
				"name": "",
				"type": null
			},
			companySearchTerm: '',
			assetSearchTerm: '',
			companies: [],
			assets: [],
			locations: [],
			currentTab: '',
			typeSelect: [
				{
					label : 'Lead Unit',
					value: 'Lead Unit'
				},
				{
					label : 'Trail Unit',
					value: 'Trail Unit'
				},
				{
					label : 'Tandem Trailer',
					value: 'Tandem Trailer'
				},
				{
					label : 'Triaxle Trailer',
					value: 'Triaxle Trailer'
				},
				{
					label : 'Bobtail',
					value: 'Bobtail'
				},
				{
					label : 'TDU',
					value: 'TDU'
				},
				{
					label: 'Farm Wagon',
					value: 'Farm Wagon'
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
		locationSelect: function () {
			let locationSelect = [{
				label: '-- UNASSIGNED --',
				value: null,
			}];

			if (!this.transport.companyid) {
				return locationSelect;
			}

			let vm = this;
			this.locations.forEach(function (location) {

				if (vm.transport.companyid && location.companyid != vm.transport.companyid) {
					return;
				}

				locationSelect.push({
					label: location.name + ", " + location.address1 + ", " + location.city + ", " + location.region,
					value: location.id
				});
			});

			return locationSelect;

		},
		assetSearchSelect: function () {
			let assetSelect = [];
			let vm = this;
			if (!this.transport.companyid) {
				return assetSelect;
			}

			this.assets.forEach(function (asset) {

				if (asset.companyid != vm.transport.companyid) {
					return;
				}

				assetSelect.push({
					label: `${asset.name}`,
					value: `${asset.name}`,
					id: asset.id !== null ? asset.id : asset.appGeneratedID
				});
			});
			return assetSelect.sort(this.selectSort);
		},
	},
	created: function () {
		/* Load selected transport */
		if (this.$route.params.id) {
			let id = parseInt(this.$route.params.id);
			if (this.$route.params.id.toString().length === 36) {
				id = this.$route.params.id;
			}
			this.$store.dispatch('fetchItem', {
				type: 'transports',
				lookup: 'id',
				value: id,
				field: '*'
			}).then((transport) => {
				this.$set(this, 'transport', transport);
			});
		}


		/* Load companies */
		setTimeout(() => {
			this.assets = this.$store.getters.assets.items;
			this.companies = this.$store.getters.companies.items;
			this.locations = this.$store.getters.locations.items;

			/* Preset the autocomplete search terms if we have a company or a vessel already */
			if (this.transport.companyid) {
				for (let [index, company] of this.companies.entries()) {
					if (company.id == this.transport.companyid) {
						this.companySearchTerm = company.name;
						break;
					}
				}
			}

			if (this.transport.assetid) {
				for (let [index, asset] of this.assets.entries()) {
					if (asset.id == this.transport.assetid) {
						this.assetSearchTerm = asset.name;
						break;
					}
				}
			}
		}, 1000);


	},
	mounted () {
		let vm = this;
		/* Listen for update events */
		Events.$on('transports:updated', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'transports'
			});
		});

		Events.$on('transports:created', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'transports'
			});
		});

		Events.$on('transports:updatedSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'transports'
			});
		});

		Events.$on('transports:createdSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'transports'
			});
		});

		Events.$on('transports:error', function (params, errorMsg) {
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
			this.$set(this.transport, 'companyid', asset.id !== null ? asset.id : asset.appGeneratedID);
			this.$set(this.transport, 'companyLocationID', null);
		},
		assetSearch: function (term, done) {
			let results = this.assetSearchSelect.filter((asset) => {
				return asset.label.toLowerCase().includes(term.toLowerCase());
			}).sort(this.selectSort);

			if (!results) {
				results = [];
				results.push({
					label: 'No matching assets.',
					value: '',
					id: null
				})
			}

			done(results);
		},
		assetSelected: function (asset) {
			/* Set asset ID or app generated asset ID if no asset id is available */
			this.$set(this.transport, 'assetid', asset.id !== null ? asset.id : asset.appGeneratedID);
		},
		save() {

			if (this.$v && this.$v.transport) {
				this.$v.transport.$touch();
				if (this.$v.transport.$error) {
					Toast.create.negative("Error saving transport. Please review all form fields for accuracy.");
					return;
				}
			}			
			
			this.transport.createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.transport.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.$store.dispatch('putItem',
				{
					name: 'transports',
					payload: {
						transport: this.transport
					}
				}
			);
		},
		update() {

			if (this.$v && this.$v.transport) {
				this.$v.transport.$touch();
				if (this.$v.transport.$error) {
					Toast.create.negative("Error updating transport. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$store.dispatch('transport', {
				id: this.transport.id,
				value: this.transport
			});

			this.$store.dispatch('updateItem', {
				name: 'transports',
				key: this.transport.id,
				payload: {
					transport: this.transport
				}
			});

		},
	}
};
