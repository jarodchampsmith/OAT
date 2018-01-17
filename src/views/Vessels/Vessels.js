import {Platform, Utils, Toast, Loading} from 'quasar'
import Fab from '../../components/Fab/Fab.vue';
import AdminNav from '../../components/AdminNav/AdminNav.vue';
export default {
	name: 'vessels',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	data () {
		return {
			vessels: {
				items: []
			},
			tableConfig : {
				rowHeight: '50px',
				title: 'Vessels',
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
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Manufacturer',
					field: 'manufacturer',
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Related Asset',
					field: 'assetid',
					sort: true,
					filter: false,
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
			this.vessels = this.$store.getters.vessels;
			Loading.hide();
		}, 1000);
	},
	beforeCreate () {
		console.time('init');
	},
	mounted () {
		console.timeEnd('init');
	},
	methods: {
		editItem(vessel) {
			this.$router.push({
				name: 'editVessel',
				params: { id : vessel.id}
			});
		},
		addItem() {
			this.$router.push({
				name: 'newVessel',
			});
		},
		editAsset(vessel) {
			this.$router.push({
				name: 'editAsset',
				params: {id: vessel.assetid}
			});
		},
		getAsset(id) {
			if (!id) {
				return "N/A";
			}

			if (id.toString().length === 36) {
				return "Not Synced Yet";
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
