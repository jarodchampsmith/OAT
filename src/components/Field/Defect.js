export default {
	name: 'mf-defect',
	data () {
		return {
			defectOutcome: {
				comment: '',
				labour: [],
				parts: [],
				value: ''
			},
			hasPartsOrLabour: false,
			inspection_id: 0,
			question: {},
			valid: [
				'Repaired',
				'Repair not required',
				'Repair required, not completed',
				'Remove from service'
			]
		};
	},
	props: {
		answer: {
			type: Object
		},
		inspectionId: {
			type: [Number, String]
		},
		questionId: {
			type: [Number, String]
		}
	},
	computed: {
		parts: {
			get: function () {
				if (!this.defectOutcome.hasOwnProperty('parts')) {
					this.$set(this.defectOutcome, 'parts', []);
				}
				return this.defectOutcome.parts;
			},
			set: function (value) {
				if (!this.defectOutcome.hasOwnProperty('parts')) {
					this.$set(this.defectOutcome, 'parts', []);
				}
				this.parts.push(value);
			}
		},
		labour: {
			get: function () {
				if (!this.defectOutcome.hasOwnProperty('labour')) {
					this.$set(this.defectOutcome, 'labour', []);
				}
				return this.defectOutcome.labour;
			},
			set: function (value) {
				if (!this.defectOutcome.hasOwnProperty('labour')) {
					this.$set(this.defectOutcome, 'labour', []);
				}
				this.labour.push(value);
			}
		}
	},
	created: function () {
		if (this.inspectionId) {
			this.$set(this, 'inspection_id', parseInt(this.inspectionId));
		}
		if (this.questionId) {
			this.$store.dispatch('fetchItem', {
				type: 'questions',
				lookup: 'id',
				value: parseInt(this.questionId),
				field: '*'
			}).then((question) => {
				this.$set(this, 'question', question);
			});
		}
		if (this.answer.hasOwnProperty('defectOutcome') && this.answer.defectOutcome) {
			this.$set(this, 'defectOutcome', this.answer.defectOutcome);
		}
		this.checkPartsOrLabour();
	},
	methods: {
		checkPartsOrLabour: function () {
			this.hasPartsOrLabour = (this.parts.length || this.labour.length);
		},
		openPartsModal: function () {
			this.$refs.labourModal.open();
			this.checkPartsOrLabour();
		},
		addPart: function () {
			this.parts = {
				quantity: 0,
				number: '',
				description: '',
				notes: ''
			};
			this.checkPartsOrLabour();
		},
		addLabour: function () {
			this.labour = {
				hours: 0,
				description: ''
			};
			this.checkPartsOrLabour();
		},
		update: function () {
			this.$emit('input', {
				inspectionId: this.inspection_id,
				questionId: this.question.id,
				defectOutcome: this.defectOutcome
			});
			this.checkPartsOrLabour();
		},
		del: function (name, index) {
			this[name].splice(index, 1);
			this.update();
			this.checkPartsOrLabour();
		}
	}
};
