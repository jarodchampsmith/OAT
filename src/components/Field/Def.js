export default {
	name: 'mf-default',
	data () {
		return {
			valid: [
				'N/A',
				'Acceptable',
				'Not Acceptable'
			]
		};
	},
	model: {
		prop: 'checked',
		event: 'update'
	},
	props: {
		question: {
			type: String
		},
		id: {},
		value: {
			type: String,
			validator: (value) => {
				return [
					'N/A',
					'Acceptable',
					'Not Acceptable',
					''
				].includes(value);
			}
		}
	},
	methods: {
		update: function () {
			this.$emit('input', this.value);
		}
	}
};
