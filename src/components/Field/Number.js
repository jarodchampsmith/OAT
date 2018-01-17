import { mfForm, isDecimal } from '../../mixins';
import {required} from 'vuelidate/lib/validators';

export default {
	mixins: [
		mfForm
	],
	data () {
		return {
			answerType: 'number'
		};
	},
	name: 'mf-number',
	validations: {
		value: {
			answer: {
				content: {
					isDecimal
				}
			}
		}
	}
};
