import {Toast, Events} from 'quasar';
import Fab from '../../components/Fab/Fab.vue';
import moment from 'moment';
import AdminNav from '../../components/AdminNav/AdminNav.vue';
import {required, requiredIf, minLength} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

export default {
	name: 'editHose',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	validations: {
		hose: {
			companyid: {
				required
			},
			companyLocationID: {
				required
			},
			length: {
				isDecimal
			},
			lengthUnit: {
				requiredIfSize: requiredIf('length')
			},
			testPressure: {
				isDecimal
			},
			HAWP: {
				isDecimal
			}
		}
	},	
	data () {
		return {
			hose: {
				"lengthUnit": "in",
				"assetid": null,
				"hoseType": "",
				"serialNumber": null,
				"length": null,
				"updatedAt": "",
				"size": null,
				"replacementYear": null,
				"HAWP": null,
				"sizeUnit": "in",
				"retestDate": null,
				"createdAt": "",
				"companyid": null,
				"companyLocationID": null,
				"appGeneratedID": "",
				"deletedAt": "",
				"id": null,
				"type": "hose",
				testedAt : '',
				lastTestResult : '',
				testIntervalInYears: null
			},
			companies: [],
			companySearchTerm: '',
			assetSearchTerm: '',
			assets: [],
			vessels: [],
			locations: [],
			currentTab: '',
			typeSelect: [
				{
					label: 'Hose',
					value: 'hose'
				}
			],
			testIntervals: [
				{
					label: '1 Year',
					value: 1
				},
				{
					label: '5 Years',
					value: 5
				},
				{
					label: '10 Years',
					value: 10
				}
			],
			sizeSelect: [
				{
					label : '1/2"',
					value: '1/2"'
				},
				{
					label: '3/4"',
					value: '3/4"'
				},
				{
					label: '1"',
					value: '1"'
				},
				{
					label : '1 1/4"',
					value: '1 1/4"'
				},
				{
					label: '1 1/2"',
					value: '1 1/2"'
				},
				{
					label: '2"',
					value: '2"'
				},
			],
			unitSizeSelect: [
				{
					label: 'in',
					value: 'in'
				},
				{
					label: 'cm',
					value: 'cm'
				}
			],
			unitLengthSelect: [
				{
					label: 'm',
					value: 'm'
				},
				{
					label: 'cm',
					value: 'cm'
				},
				{
					label: 'inches',
					value: 'in'
				},
				{
					label: 'feet',
					value: 'feet'
				}
			],
			testResults: [
				{
					label: 'Pass',
					value: 'pass'
				},
				{
					label: 'Fail',
					value: 'fail'
				},
			],
		}
	},
	computed: {
		yearMin: function () {
			return parseInt(moment().format('YYYY')) - 10;
		},
		yearMax: function () {
			return parseInt(moment().format('YYYY')) + 10;
		},
		yearSelect: function () {
			let yearSelect = [];
			for (var i = this.yearMax; i >= this.yearMin; i--) {
				yearSelect.push({
					label: i.toString(),
					value: i
				});
			}
			return yearSelect;
		},
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

			if (!this.hose.companyid) {
				return locationSelect;
			}

			let vm = this;
			this.locations.forEach(function (location) {

				if (vm.hose.companyid && location.companyid != vm.hose.companyid) {
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
			if (!this.hose.companyid) {
				return assetSelect;
			}

			this.assets.forEach(function (asset) {

				if (asset.companyid != vm.hose.companyid) {
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
		/* Load selected hose */
		if (this.$route.params.id) {
			let id = parseInt(this.$route.params.id);
			if (this.$route.params.id.toString().length === 36) {
				id = this.$route.params.id;
			}
			this.$store.dispatch('fetchItem', {
				type: 'attachments',
				lookup: 'id',
				value: id,
				field: '*'
			}).then((hose) => {
				this.$set(this, 'hose', hose);
			});
		}


		/* Load companies */
		setTimeout(() => {
			this.assets = this.$store.getters.assets.items;
			this.companies = this.$store.getters.companies.items;
			this.locations = this.$store.getters.locations.items;

			/* Preset the autocomplete search terms if we have a company or a vessel already */
			if (this.hose.companyid) {
				for (let [index, company] of this.companies.entries()) {
					if (company.id == this.hose.companyid) {
						this.companySearchTerm = company.name;
						break;
					}
				}
			}

			if (this.hose.assetid) {
				for (let [index, asset] of this.assets.entries()) {
					if (asset.id == this.hose.assetid) {
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
		Events.$on('attachments:updated', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'hoses'
			});
		});

		Events.$on('attachments:created', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'hoses'
			});
		});

		Events.$on('attachments:updatedSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'hoses'
			});
		});

		Events.$on('attachments:createdSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'hoses'
			});
		});

		Events.$on('attachments:error', function (params, errorMsg) {
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
			this.$set(this.hose, 'companyid', asset.id !== null ? asset.id : asset.appGeneratedID);
			this.$set(this.hose, 'companyLocationID', null);
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
			this.$set(this.hose, 'assetid', asset.id !== null ? asset.id : asset.appGeneratedID);
		},
		save() {

			if (this.$v && this.$v.hose) {
				this.$v.hose.$touch();
				if (this.$v.hose.$error) {
					Toast.create.negative("Error saving hose. Please review all form fields for accuracy.");
					return;
				}
			}			
			
			this.hose.createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.hose.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.$store.dispatch('putItem',
				{
					name: 'attachments',
					payload: {
						attachment: this.hose
					}
				}
			);
		},
		updateTestResults() {
			if (this.hose.lastTestResult === 'pass' || this.hose.lastTestResult === 'fail') {
				this.hose.testedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			}
		},
		update() {

			if (this.$v && this.$v.hose) {
				this.$v.hose.$touch();
				if (this.$v.hose.$error) {
					Toast.create.negative("Error updating hose. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$store.dispatch('hose', {
				id: this.hose.id,
				value: this.hose
			});

			this.$store.dispatch('updateItem', {
				name: 'attachments',
				key: this.hose.id,
				payload: {
					attachment: this.hose
				}
			});

		},
	}
};
