import { mfForm, isFullDate } from '../../mixins';

export default {
	mixins: [
		mfForm
	],
	data () {
		return {
			answerFormat: 'YYYY-MM-DD',
			answerType: 'date'
		};
	},
	name: 'mf-fulldate',
	validations: {
		value: {
			answer: {
				content: {
					isFullDate
				}
			}
		}
	}
};
