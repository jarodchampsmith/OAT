import {Platform, Utils, Toast, Loading} from 'quasar'
import Fab from '../../components/Fab/Fab.vue';
import AdminNav from '../../components/AdminNav/AdminNav.vue';

export default {
	name: 'assets',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	data () {
		let vm = this;
		return {
			assets: {
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
					label: 'Asset #',
					field: 'name',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '60px'
				},
				{
					label: 'Type',
					field: 'type',
					format (value) {
						switch(value) {
							case 'farm':
								return 'Farm Wagon';
							case 'highway':
								return 'Highway Tanks';
							case 'portable':
								return 'Portable Tanks';
							case 'LPG':
								return 'LPG Storage Vessel';
							case 'NH3':
								return 'NH3 Storage Vessel';
						}

						return value
					},
					sort: true,
					filter: true,
					width: '60px'
				},
				{
					label: 'Company',
					field: 'companyid',
					format (value) {
						let company = vm.getCompany(value);
						if (!company) {
							return "N/A";
						}
						return company.name;
					},
					sort: true,
					filter: true,
					width: '60px'
				},
				{
					label: 'Location',
					field: 'locationid',
					format (value) {
						let location = vm.getLocation(value);
						if (!location) {
							return "N/A";
						}
						return location.name + "," + location.address1 + "," + location.city + "," + location.region;
					},
					sort: true,
					filter: true,
					width: '120px'
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
			this.assets = this.$store.getters.assets;
			Loading.hide();
		}, 1000);
	},
	mounted () {},
	methods: {
		editItem(item) {
			this.$router.push({
				name: 'editAsset',
				params: {id: item.id}
			});
		},
		addItem() {
			this.$router.push({
				name: 'newAsset',
			});
		},
		editAsset(asset) {
			this.$router.push({
				name: 'editAsset',
				params: {id: asset.id}
			});
		},
		getLocation(id) {
			/* Load selected vessel */
			return this.$store.getters.fetchItem({
				type: 'locations',
				lookup: 'id',
				value: id,
				field: '*'
			});
		},
		getCompany(id) {
			/* Load selected vessel */
			return this.$store.getters.fetchItem({
				type: 'companies',
				lookup: 'id',
				value: id,
				field: '*'
			});
		},
	}
};
