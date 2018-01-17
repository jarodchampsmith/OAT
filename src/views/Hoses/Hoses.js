import {Platform, Utils, Toast, Loading} from 'quasar'
import Fab from '../../components/Fab/Fab.vue';
import AdminNav from '../../components/AdminNav/AdminNav.vue';
export default {
	name: 'hoses',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	data () {
		let vm = this;
		return {
			hoses : {
				items: []
			},
			tableConfig : {
				rowHeight: '50px',
				title: 'Hoses',
				noHeader: false,
				refresh: true,
				columnPicker: false,
				leftStickyColumns: 0,
				rightStickyColumns: 0,
				bodyStyle: {
					maxHeight: '800px',
					maxWidth: '100%'
				},
				responsive: true,
				pagination: {
					rowsPerPage: 15,
					options: [5, 10, 15, 30, 50, 500]
				},
				selection: false,
				messages: {
					noData: '<i>warning</i> No data available to show.',
					noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
				},
			},
			tableColumns: [
				{
					label: 'Serial #',
					field: 'serialNumber',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Related Asset',
					field: 'assetid',
					format (value) {
						if (!value) {
							return "N/A";
						}
						let asset = vm.getAsset(value);
						return asset.name;
					},
					sort: true,
					filter: false,
					width: '80px'
				},
				{
					label: 'Type',
					field: 'type',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Retest Date',
					field: 'retestDate',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Replacement Yr',
					field: 'replacementYear',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Options',
					field: 'id',
					format (value) {
						return 'optionscol';
					},
					sort: false,
					filter: false,
					width: '50px'
				}
			],
		}
	},
	computed: {
		user: function () {
			return this.$store.getters.currentUser;
		}
	},
	created () {
		Loading.show();
		setTimeout(() => {
			this.hoses = this.$store.getters.hoses;
			Loading.hide();
		}, 1000);
	},
	mounted () {},
	methods: {
		editItem(hose) {
			this.$router.push({
				name: 'editHose',
				params: { id : hose.id}
			});
		},
		addItem() {
			this.$router.push({
				name: 'newHose',
			});
		},
		editAsset(hose) {
			this.$router.push({
				name: 'editAsset',
				params: {id: hose.assetid}
			});
		},
		getAsset(id) {
			if (!id) {
				return "N/A";
			}

			let asset = this.$store.getters.fetchItem({
				type: 'assets',
				lookup: 'id',
				value: id,
				field: '*'
			});

			if (!asset) {
				return "N/A";
			}

			return asset.name;
		},
	}
};
