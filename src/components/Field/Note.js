export default {
	name: 'mf-note',
	data () {
		return {
			question: {}
		};
	},
	props: {
		answer: {
			type: Object
		},
		questionid: {
			type: [Number, String]
		},
		comment: {
			type: String
		}
	},
	created: function () {
		if (this.questionid) {
			this.$store.dispatch('fetchItem', {
				type: 'questions',
				lookup: 'id',
				value: parseInt(this.questionid),
				field: '*'
			}).then((question) => {
				this.$set(this, 'question', question);
			});
		}
	},
	methods: {
		update: function () {
			this.$emit('mf-note:input', {
				inspectionid: this.answer.inspectionid,
				questionid: this.questionid,
				comment: this.comment
			});
		}
	}
};
