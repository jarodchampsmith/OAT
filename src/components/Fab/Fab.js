export default {
	name: 'fab',
	data () {
		return {
			hideFrom: [
				'login',
				'sync'
			]
		};
	},
	methods: {
		click (name) {
			this.$router.push({
				name: name
			});
		}
	}
};
