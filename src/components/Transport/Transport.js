import {required} from 'vuelidate/lib/validators';
import {isDecimal} from '../../mixins';

export default {
	name: 'transport',
	data () {
		return {
			options: {
				Types: [
					{
						label: 'Lead Unit',
						value: 'Lead Unit'
					},
					{
						label: 'Trail Unit',
						value: 'Trail Unit'
					},
					{
						label: 'Tandem Trailer',
						value: 'Tandem Trailer'
					},
					{
						label: 'Triaxle Trailer',
						value: 'Triaxle Trailer'
					},
					{
						label: 'Bobtail',
						value: 'Bobtail'
					},
					{
						label: 'TDU',
						value: 'TDU'
					},
					{
						label: 'Farm Wagon',
						value: 'Farm Wagon'
					}
				]
			}
		};
	},
	validations: {
		transport: {
			type: {
				required
			},
			companyid: {
				required
			},
			engineHours: {
				isDecimal
			}
		}
	},
	props: {
		transport: {
			type: Object,
			default: {
				id: null
			}
		}
	},
	created: function () {
		const fields = this.$store.getters.transportFields;
		fields.forEach((field) => {
			this.$set(this.transport, field, null);
		});
	},
	methods: {
		update: function (response) {
			console.log('transport update', response);
		}
	}
};
