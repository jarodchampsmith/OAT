import { mfForm, isDecimal } from '../../mixins';
import {required} from 'vuelidate/lib/validators';

export default {
	mixins: [
		mfForm
	],
	name: 'mf-weight',
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
