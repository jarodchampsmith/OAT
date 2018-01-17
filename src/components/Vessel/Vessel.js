import { Utils, Toast, Events } from 'quasar';
import moment from 'moment';
import {required, requiredIf} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

import Meter from '../Meter/Meter.vue';

export default {
	name: 'vessel',
	components: {
		'meters': Meter
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
			}
		}
	},
	data () {
		return {
			config: {
				meters: {
					table: {
						rowHeight: '55px',
						refresh: false,
						leftStickyColumns: 1,
						selection: false
					},
					columns: [
						{
							label: 'Serial #',
							field: 'serialNumber',
							width: '80px',
							sort: true,
							filter: true
						},
						{
							label: 'Type',
							field: 'type',
							width: '80px',
							sort: true,
							filter: true
						},
						{
							label: 'Size',
							field: 'size',
							width: '80px',
							sort: true,
							filter: true
						},
						{
							label: 'Make',
							field: 'make',
							width: '120px',
							sort: true,
							filter: true
						},
						{
							label: 'Reading',
							field: 'reading',
							width: '80px',
							sort: true,
							filter: true
						},
						{
							label: 'Actions',
							field: 'id',
							format (value) {
								return 'Actions';
							},
							sort: false,
							filter: false,
							width: '50px'
						}
					]
				}
			},
			current: {
				meter: {},
				meterId: null
			},
			meters: [],
			options: {
				ConstructedOf: [
					{
						label: 'NQT Steel',
						value: 'NQT'
					},
					{
						label: 'QT Steel',
						value: 'QT'
					}
				],
				HeadTypes: [
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
				PlateLocations: [
					{
						label: 'End',
						value: 'End'
					},
					{
						label: 'Passenger Side',
						value: 'Passenger Side'
					},
					{
						label: 'Drivers Side',
						value: 'Drivers Side'
					}
				],
				TCSpecification: [
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
				Units: [
					{
						label: 'Litres',
						value: 'l'
					},
					{
						label: 'Gallon',
						value: 'gal'
					}
				],
				UnitLengths: [
					{
						label: 'in',
						value: 'in'
					},
					{
						label: 'cm',
						value: 'cm'
					}
				],
				UnitPressures: [
					{
						label: 'psi',
						value: 'psi'
					},
					{
						label: 'kPa',
						value: 'kPa'
					}
				],
				UnitTemperatures: [
					{
						label: '°C',
						value: 'C'
					},
					{
						label: '°F',
						value: 'F'
					}
				]
			}
		};
	},
	props: {
		vessel: {
			type: Object,
			default: {
				id: null
			}
		}
	},
	computed: {
		yearMin: function () {
			return parseInt(moment().format('YYYY')) - 40;
		},
		yearMax: function () {
			return parseInt(moment().format('YYYY')) + 1;
		},
		yearSelect: function () {
			let yearSelect = [];

			for (var i = 2017; i >= 1950; i--) {
				yearSelect.push({
					label: i.toString(),
					value: i
				});
			}
			return yearSelect;
		}
	},
	watch: {
		'vessel.id': function () {
			this.populate();
		}
	},
	created: function () {
		const fields = this.$store.getters.vesselFields;
		fields.forEach((field) => {
			this.$set(this.vessel, field, null);
		});
		this.populate();
	},
	methods: {
		populate: function () {
			this.$store.dispatch('fetchItems', {
				name: 'meters',
				lookup: 'vesselid',
				value: this.vessel.id,
				field: '*'
			}).then((meters) => {
				this.meters = meters;
				if (!this.vessel.hasOwnProperty('meters')) {
					this.vessel.meters = [];
				}
				this.vessel.meters.forEach((meter) => {
					let found = false;
					this.meters.forEach((innerMeter) => {
						if (innerMeter.id === meter.id) {
							found = true;
							innerMeter = meter;
						}
					});
					if (!found) {
						this.meters.push(meter);
					}
				});
			});
		},
		editMeter: function (meter = null) {
			if (meter) {
				this.$set(this.current, 'meterId', meter.id);
				this.$set(this.current, 'meter', JSON.parse(JSON.stringify(meter)));
				this.$set(this.current.meter, 'companyLocationID', this.vessel.companyLocationID);
			} else {
				this.$set(this.current, 'meter', {});
				const fields = this.$store.getters.meterFields;
				fields.forEach((field) => {
					this.$set(this.current.meter, field, null);
				});
				this.$set(this.current.meter, 'id', Utils.uid());
				this.$set(this.current.meter, 'appGeneratedID', this.current.meter.id);
				this.$set(this.current.meter, 'vesselid', this.vessel.id !== null ? this.vessel.id : this.vessel.appGeneratedID);
				this.$set(this.current.meter, 'companyid', this.vessel.companyid);
				this.$set(this.current.meter, 'companyLocationID', this.vessel.companyLocationID);
			}
			this.$refs.meterModal.open();
		},
		cancelMeter: function () {
			this.$set(this.current, 'meter', {});
			this.$set(this.current, 'meterId', null);
			this.$refs.meterModal.close();
		},
		saveMeter: function () {

			if (this.$refs.meterEditor.$v && this.$refs.meterEditor.$v.meter) {
				this.$refs.meterEditor.$v.meter.$touch();
				if (this.$refs.meterEditor.$v.meter.$error) {
					Toast.create.negative("Error saving meter. Please review all form fields for accuracy.");
					return;
				}
			}
			
			this.$set(this.current, 'meterId', this.current.meter.id);
			let found = false;
			this.meters.forEach((meter, index) => {
				if (meter.id === this.current.meterId) {
					found = index;
				}
			});
			if (found === false) {
				this.meters.push(this.current.meter);
			} else {
				this.current.meter = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				this.meters[found] = this.current.meter;
			}
			this.$refs.meterModal.close();
			if (!this.vessel.hasOwnProperty('meters')) {
				this.vessel.meters = [];
			}
			this.vessel.meters = this.meters;
			/* Trigger asset save */
			Events.$emit('save:assetRelation');
		},
		update: function (response) {
			console.log('vessel update', response);
		}
	}
};
