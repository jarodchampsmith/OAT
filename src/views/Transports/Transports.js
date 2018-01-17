import {Platform, Utils, Toast, Loading} from 'quasar'
import Fab from '../../components/Fab/Fab.vue';
import AdminNav from '../../components/AdminNav/AdminNav.vue';

export default {
	name: 'transports',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	data () {
		let vm = this;
		return {
			transports: {
				items: []
			},
			tableConfig : {
				rowHeight: '50px',
				title: false,
				noHeader: false,
				refresh: false,
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
					label: 'Name',
					field: 'name',
					format (value) {
						return value ? value : 'N/A';
					},
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
					label: 'License Plate',
					field: 'licensePlate',
					format (value) {
						return value ? value : 'N/A';
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Chassis SN',
					field: 'chassisSerialNumber',
					format (value) {
						return value ? value : 'N/A';
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				{
					label: 'Motor SN',
					field: 'motorSerialNumber',
					format (value) {
						return value ? value : 'N/A';
					},
					sort: true,
					filter: true,
					width: '80px'
				},
				,
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
			this.transports = this.$store.getters.transports;
			Loading.hide();
		}, 1000);
	},
	mounted () {},
	methods: {
		editItem(item) {
			this.$router.push({
				name: 'editTransport',
				params: {id: item.id}
			});
		},
		addItem() {
			this.$router.push({
				name: 'newTransport',
			});
		},
		editTransport(transport) {
			this.$router.push({
				name: 'editTransport',
				params: {id: transport.id}
			});
		},
		editAsset(transport) {
			this.$router.push({
				name: 'editAsset',
				params: {id: transport.assetid}
			});
		},
		getLocation(id) {
			return this.$store.getters.fetchItem({
				type: 'locations',
				lookup: 'id',
				value: id,
				field: '*'
			});
		},
		getCompany(id) {
			return this.$store.getters.fetchItem({
				type: 'companies',
				lookup: 'id',
				value: id,
				field: '*'
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
