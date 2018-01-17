import { Toast, Events } from 'quasar';
import Fab from '../../components/Fab/Fab.vue';
import moment from 'moment';
import {required, requiredIf} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

import AdminNav from '../../components/AdminNav/AdminNav.vue';
export default {
	name: 'editVessel',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	validations: {
		vessel: {
			serialNumber: {
				required
			},
			companyid: {
				required
			},
			MAWP: {
				isDecimal
			},
			MAWPUnit: {
				requiredIfMAWP: requiredIf('MAWP')
			},
			MDMT: {
				isDecimal
			},
			MDMTUnit: {
				requiredIfMDMT: requiredIf('MDMT')
			},
			listedCapacity: {
				isDecimal
			},
			listedCapacityUnit: {
				requiredIfListedCapacity: requiredIf('listedCapacity')
			},
			diameter: {
				isDecimal
			},
			diameterUnit: {
				requiredIfDiameter: requiredIf('diameter')
			},
			headThickness: {
				isDecimal
			},
			headThicknessUnit: {
				requiredIfHeadThickness: requiredIf('headThickness')
			},
			shellThickness: {
				isDecimal
			},
			shellThicknessUnit: {
				requiredIfShellThickness: requiredIf('shellThickness')
			},
			seamToSeamLength: {
				isDecimal
			},
			seamToSeamLengthUnit: {
				requiredIfSeamToSeamLength: requiredIf('seamToSeamLength')
			},
			companyLocationID: {
				required
			},
		}
	},
	data () {
		return {
			vessel : {
				"companyLocationID" : "",
				"stressRelieved": 0,
				"seamToSeamLengthUnit": "in",
				"serialNumber": "",
				"MAWPUnit": "",
				"listedCapacityUnit": "",
				"seamToSeamLength": null,
				"alteredBy": "",
				"MDMTUnit": "",
				"MAWP": null,
				"headThicknessUnit": "in",
				"wagonManufacturer": "",
				"nationalBoardNumber": "",
				"diameterUnit": "in",
				"companyid": null,
				"shellMaterial": "",
				"appGeneratedID": "",
				"deletedAt": "",
				"MDMT": "",
				"id": null,
				"constructedOf": "",
				"listedCapacity": "",
				"shellThicknessUnit": "in",
				"headMaterial": "",
				"truckMileageUnit": "",
				"assetid": null,
				"CRNorTCRN": "",
				"shellThickness": null,
				"yearBuilt": null,
				"updatedAt": "",
				"headType": "",
				"plateLocation": "",
				"manufacturer": "",
				"headThickness": null,
				"diameter": null,
				"uStamped": null,
				"createdAt": "",
				"truckMileage": "",
				"provincialNumber": "",
				TCSpecification: null
			},
			companies: [],
			assets: [],
			locations: [],
			currentTab: '',
			assetSearchTerm: '',
			companySearchTerm: '',
			plateLocationSelect: [
				{
					label : 'End',
					value: 'End'
				},
				{
					label : 'Passenger Side',
					value: 'Passenger Side'
				},
				{
					label : 'Drivers Side',
					value: 'Drivers Side'
				}
			],
			headTypeSelect: [
				{
					label: 'Hemi',
					value: 'Hemi'
				},
				{
					label: 'Semi',
					value: 'Semi'
				},
				{
					label: 'Other',
					value: 'Other'
				}
			],
			constructedOfSelect: [
				{
					label: 'NQT Steel',
					value: 'NQT'
				},
				{
					label: 'QT Steel',
					value: 'QT'
				}
			],
			unitSelect: [
				{
					label: 'Litres',
					value: 'L'
				},
				{
					label: 'Gallon',
					value: 'gal'
				}
			],
			unitLengthSelect: [
				{
					label: 'in',
					value: 'in'
				},
				{
					label: 'cm',
					value: 'cm'
				}
			],
			unitTempSelect: [
				{
					label: '°C',
					value: 'C'
				},
				{
					label: '°F',
					value: 'F'
				}
			],
			unitPressureSelect: [
				{
					label: 'psi',
					value: 'psi'
				},
				{
					label: 'kPa',
					value: 'kPa'
				}
			],
			tcsSelect: [
				{
					label: '--- NOT APPLICABLE ---',
					value: '--- NOT APPLICABLE ---'
				},
				{
					label: 'MC 330',
					value: 'MC 330'
				},
				{
					label: 'MC 331',
					value: 'MC 331'
				},
				{
					label: 'MC 331/TC 331',
					value: 'MC 331/TC 331'
				},
				{
					label: 'TC 51',
					value: 'TC 51'
				},
				{
					label: 'TC 60',
					value: 'TC 60'
				},
				{
					label: 'TC 331',
					value: 'TC 331'
				},
				{
					label: 'TC 338',
					value: 'TC 338'
				},
				{
					label: 'TC 350',
					value: 'TC 350'
				},
				{
					label: 'TC 406',
					value: 'TC 406'
				},
				{
					label: 'TC 407',
					value: 'TC 407'
				},
				{
					label: 'TC 412',
					value: 'TC 412'
				},
				{
					label: 'Exempt as per CSA B622-09 SR 54',
					value: 'Exempt as per CSA B622-09 SR 54'
				},
				{
					label: 'Exempt as per CSA B622-09 SR 55',
					value: 'Exempt as per CSA B622-09 SR 55'
				},
				{
					label: 'Exempt as per CSA B622-09 SR 73',
					value: 'Exempt as per CSA B622-09 SR 73'
				}
			],

		}
	},
	computed: {
		companiesSelect: function() {
			let companySelect = [];
			this.companies.forEach(function(company) {
				companySelect.push({
					label : company.name,
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

			if (!this.vessel.companyid) {
				return locationSelect;
			}

			let vm = this;
			this.locations.forEach(function (location) {

				if (vm.vessel.companyid && location.companyid != vm.vessel.companyid) {
					return;
				}

				locationSelect.push({
					label: location.name + ", " + location.address1 + ", " + location.city + ", " + location.region,
					value: location.id
				});
			});

			return locationSelect.sort(this.selectSort);

		},
		assetSearchSelect: function () {
			let assetSelect = [];
			let vm = this;
			if (!this.vessel.companyid) {
				return assetSelect;
			}

			this.assets.forEach(function (asset) {

				if (asset.companyid != vm.vessel.companyid) {
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
		yearMax: function () {
			return parseInt(moment().format('YYYY'));
		},
		yearSelect: function() {
			let yearSelect = [];

			for (var i = this.yearMax; i >= 1950; i--) {
				yearSelect.push({
					label: i.toString(),
					value: i
				});
			}
			return yearSelect;
		}
	},
	created: function () {
		/* Load selected vessel */
		if (this.$route.params.id) {
			let id = parseInt(this.$route.params.id);
			if (this.$route.params.id.toString().length === 36) {
				id = this.$route.params.id;
			}
			this.$store.dispatch('fetchItem', {
				type: 'vessels',
				lookup: 'id',
				value: id,
				field: '*'
			}).then((vessel) => {
				this.$set(this, 'vessel', vessel);
			});
		}


		/* Load companies */
		 setTimeout(() => {
			 this.assets = this.$store.getters.assets.items;
			 this.companies = this.$store.getters.companies.items;
		 	 this.locations = this.$store.getters.locations.items;

		 	 /* Preset the autocomplete search terms if we have a company or a vessel already */
			 if (this.vessel.companyid) {
				 for (let [index, company] of this.companies.entries()) {
					 if (company.id == this.vessel.companyid) {
						 this.companySearchTerm = company.name;
						 break;
					 }
				 }
			 }

			 if (this.vessel.assetid) {
				 for (let [index, asset] of this.assets.entries()) {
					 if (asset.id == this.vessel.assetid) {
						 this.assetSearchTerm = asset.name;
						 break;
					 }
				 }
			 }

		 }, 1000);

	},
	beforeCreate () {
		console.time('init');
	},
	mounted: function () {
		let vm = this;
		/* Listen for update events */
		Events.$on('vessels:updated', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'vessels'
			});
		});

		Events.$on('vessels:created', function (event) {
			Toast.create.positive('Item saved successfully.');
			vm.$router.push({
				name: 'vessels'
			});
		});

		Events.$on('vessels:updatedSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'vessels'
			});
		});

		Events.$on('vessels:createdSync', function (event) {
			Toast.create.positive('Item will be saved when you are online and perform a sync.');
			vm.$router.push({
				name: 'vessels'
			});
		});

		Events.$on('vessels:error', function (params, errorMsg) {
			Toast.create.negative(errorMsg);
		});

		console.timeEnd('init');
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
			this.$set(this.vessel, 'assetid', asset.id !== null ? asset.id : asset.appGeneratedID);
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
			this.$set(this.vessel, 'companyid', asset.id !== null ? asset.id : asset.appGeneratedID);
			this.$set(this.vessel, 'companyLocationID', null);
		},
		save() {

			if (this.$v && this.$v.vessel) {
				this.$v.vessel.$touch();
				if (this.$v.vessel.$error) {
					Toast.create.negative("Error saving vessel. Please review all form fields for accuracy.");
					return;
				}
			}

			this.vessel.createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.vessel.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			this.$store.dispatch('putItem',
				{
					name: 'vessels',
					payload: {
						vessel: this.vessel
					}
				}
			);
		},
		update() {

			if (this.$v && this.$v.vessel) {
				this.$v.vessel.$touch();
				if (this.$v.vessel.$error) {
					Toast.create.negative("Error updating vessel. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$store.dispatch('vessel', {
				id: this.vessel.id,
				value: this.vessel
			});

			this.$store.dispatch('updateItem', {
				name: 'vessels',
				key: this.vessel.id,
				payload: {
					vessel: this.vessel
				}
			});

		},
	}
};
