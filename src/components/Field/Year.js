import moment from 'moment';

import { mfForm } from '../../mixins';

export default {
	mixins: [
		mfForm
	],
	data () {
		return {
			answerType: 'number',
			yearBack: 40,
			yearForward: 2
		};
	},
	name: 'mf-year',
	computed: {
		yearSelect: function () {
			let yearSelect = [];

			for (var i = this.yearMax; i >= this.yearMin; i--) {
				yearSelect.push({
					label: i.toString(),
					value: i
				});
			}
			return yearSelect;
		},
		yearMin: function () {
			return parseInt(moment().format('YYYY')) - this.yearBack;
		},
		yearMax: function () {
			return parseInt(moment().format('YYYY')) + this.yearForward;
		}
	}
};
