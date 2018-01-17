import {required} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

export default {
	name: 'meter',
	data () {
		return {
			options: {
				Sizes: [
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
					}
				],
				Types: [
					{
						label: 'Meter',
						value: 'Meter'
					},
					{
						label: 'Register',
						value: 'Register'
					},
				]
			}
		};
	},
	validations: {
		meter: {
			companyid: {
				required
			},
			reading: {
				isDecimal
			}
		}
	},
	props: {
		meter: {
			type: Object,
			default: {
				id: null
			}
		}
	},
	created: function () {
		const fields = this.$store.getters.meterFields;
		fields.forEach((field) => {
			this.$set(this.meter, field, null);
		});
	},
	methods: {}
};
