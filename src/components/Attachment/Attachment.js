import moment from 'moment';
import {required, requiredIf} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

export default {
	name: 'attachment',
	data () {
		return {
			options: {
				Types: [
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
				unitSizes: [
					{
						label: 'in',
						value: 'in'
					},
					{
						label: 'cm',
						value: 'cm'
					}
				],
				unitLengths: [
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
				sizeSelect: [
					{
						label: '1/2"',
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
						label: '1 1/4"',
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
			}
		};
	},
	validations: {
		attachment: {
			type: {
				required
			},
			companyid: {
				required
			},
			length: {
				isDecimal
			},
			lengthUnit: {
				requiredIfSize: requiredIf('length')
			},
            testPresure: {
				isDecimal
			},
			HAWP: {
				isDecimal
			}
		}
	},
	props: {
		attachment: {
			type: Object,
			default: {
				id: null
			}
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
	},
	created: function () {
		const fields = this.$store.getters.attachmentFields;
		fields.forEach((field) => {
			this.$set(this.attachment, field, null);
		});
	},
	methods: {
		updateTestResults() {
			if (this.attachment.lastTestResult === 'pass' || this.attachment.lastTestResult === 'fail') {
				this.attachment.testedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			}
		},
		update: function (response) {
			console.log('attachment update', response);
		}
	}
};
