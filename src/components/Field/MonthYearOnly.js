import { mfForm, isMonthDate } from '../../mixins';

export default {
	mixins: [
		mfForm
	],
	data () {
		return {
			answerFormat: 'YYYY-MM',
			answerType: 'date'
		};
	},
	name: 'mf-monthyearonly',
	validations: {
		value: {
			answer: {
				content: {
					isMonthDate
				}
			}
		}
	}
};
