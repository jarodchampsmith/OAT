import moment from 'moment';
import {Utils} from 'quasar';

export const isFullDate = (value) => moment(value, 'YYYY-MM-DD', true).isValid();
export const isMonthDate = (value) => moment(value, 'YYYY-MM', true).isValid();
export const isDecimal = (value) => {
	const decimals = '*';
	if (Array.isArray(value)) {
		return false;
	}

	if (value === null || value === undefined || value === '') {
		return true;
	}

	if (Number(decimals) === 0) {
		return /^-?\d*$/.test(value);
	}

	const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
	const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

	if (!regex.test(value)) {
		return false;
	}

	const parsedValue = parseFloat(value);

	// eslint-disable-next-line
	return parsedValue === parsedValue;
};

export const mfForm = {
	data () {
		return {
			answerCallback: null,
			answerFormat: '',
			answerType: 'string',
			inspection_id: '',
			question: {},
			updateOptions: [
				'default',
				'select',
				'yesNo',
				'yesNoNA'
			],
			valid: [],
			value: {
				answer: {
					content: '',
					option: '',
					extended: {},
					signatures: []
				},
				comment: '',
				defectOutcome: null
			}
		};
	},
	props: {
		numPhotos: {
			type: Number,
			required: false
		},
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
		validObject: function () {
			let validObject = [];
			this.valid.forEach((item) => {
				validObject.push({
					label: item,
					value: item
				});
			});
			return validObject;
		}
	},
	created: function () {
		if (this.inspectionId) {
			this.$set(this, 'inspection_id', this.inspectionId);
		}
		if (this.questionId) {
			this.$store.dispatch('fetchItem', {
				type: 'questions',
				lookup: 'id',
				value: parseInt(this.questionId),
				field: '*'
			}).then((question) => {
				this.$set(this, 'question', question);

				/* Handle special cases when default answer does not exist */
				if (!this.answer) {
					console.log(this.answer);
					console.log(`No answer for question: ${this.questionId}, using default model.`);
					this.answer = Utils.extend(false, this.value);
					this.$forceUpdate();
				}

				if (!this.answer.questionid || !this.answer.inspectionid || !this.answer.categoryid) {
					this.answer.questionid = question.id;
					this.answer.categoryid = question.categoryid;
					this.answer.inspectionid = this.inspectionId;
					this.answer.isRequired = true;
					this.answer.createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				}

				if (question.options) {
					this.$set(this, 'valid', question.options.split(',').map((name) => {
						return name.trim();
					}));
					if (!this.updateOptions.includes(question.type) && !this.value.answer.option) {
						this.value.answer.option = this.validObject[0].value;
					}
				}
			});
		}
		if (this.answer.hasOwnProperty('answer') && this.answer.answer) {
			this.$set(this.value, 'answer', this.answer.answer);
			switch (this.answerType) {
				case 'date':
					this.$set(this.value.answer, 'content', moment.utc(this.value.answer.content, this.answerFormat).format(this.answerFormat));
					break;
				case 'number':
					this.$set(this.value.answer, 'content', parseInt(this.value.answer.content));
					break;
			}
			if (this.answerCallback) {
				this.answerCallback();
			}
		}
		if (this.answer.hasOwnProperty('comment') && this.answer.comment) {
			this.$set(this.value, 'comment', this.answer.comment);
		}
		if (this.answer.hasOwnProperty('defectOutcome') && this.answer.defectOutcome) {
			this.$set(this.value, 'defectOutcome', this.answer.defectOutcome);
		}

		this.$forceUpdate();
	},
	methods: {
		addComment: function () {
			this.$refs.commentModal.open();
		},
		update: Utils.debounce(function () {
			if (this.$v && this.$v.value) {
				if (this.$v.value.answer.option) {
					this.$v.value.answer.option.$touch();
				}

				if (this.$v.value.answer.content) {
					this.$v.value.answer.content.$touch();
				}

				if (this.$v.value.answer && this.$v.value.answer.$error) {
					console.log('not updating answer');
					console.log(this.$v.value.answer.$error);
					return;
				}
			}

			console.log('updating answer');

			if (this.updateOptions.includes(this.question.type)) {
				this.$set(this.value.answer, 'option', this.value.answer.content); // Unavoidable VueX warning here :(
			}

			this.$emit('input', {
				inspectionId: this.inspection_id,
				questionId: this.question.id,
				answer: this.value,
				fullAnswer: this.answer
			});
		}, 100)
	}
};
