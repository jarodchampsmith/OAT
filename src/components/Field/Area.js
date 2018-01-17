import { mfForm, isDecimal } from '../../mixins';
import {required} from 'vuelidate/lib/validators';

export default {
	mixins: [
		mfForm
	],
	name: 'mf-area',
	validations: {
		value: {
			answer: {
				option: {
					required
				},
				content: {
					isDecimal
				}
			}
		}
	}
};
