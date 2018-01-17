import {Platform, Utils, Toast} from 'quasar'
import Fab from '../../components/Fab/Fab.vue';
import AdminNav from '../../components/AdminNav/AdminNav.vue';

export default {
	name: 'meters',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	data () {
		let vm = this;
		return {
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
					label: 'Serial #',
					field: 'serialNumber',
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
						switch (value) {
							case 'meter':
								return 'Meter';
							case 'register':
								return 'Register';
						}

						return value
					},
					sort: true,
					filter: true,
					width: '60px'
				},
				{
					label: 'Size',
					field: 'size',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '60px'
				},
				{
					label: 'Make',
					field: 'make',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '60px'
				},
				{
					label: 'Reading',
					field: 'reading',
					format (value) {
						return value
					},
					sort: true,
					filter: true,
					width: '60px'
				},
                {
					label: 'Related Vessel',
					field: 'vesselid',
					format (value) {
						return "";
					},
					sort: true,
					filter: false,
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
		},
		meters: function () {
			return this.$store.getters.meters;
		},
	},
	mounted () {},
	methods: {
		getVessel(id) {
			/* Load selected vessel */
			return this.$store.getters.fetchItem({
				type: 'vessels',
				lookup: 'id',
				value: id,
				field: '*'
			});
		},
		editItem(meter) {
			this.$router.push({
				name: 'editMeter',
				params: {id: meter.id}
			});
		},
		addItem() {
			this.$router.push({
				name: 'newMeter',
			});
		},
		editVessel(meter) {
			this.$router.push({
				name: 'editVessel',
				params: {id: meter.vesselid}
			});
		},
		getVessel(id) {
			if (!id) {
				return "N/A";
			}

			if (id.toString().length === 36) {
				return "Not Synced Yet";
			}

			let vessel = this.$store.getters.fetchItem({
				type: 'vessels',
				lookup: 'id',
				value: id,
				field: '*'
			});

			if (!vessel) {
				return "N/A";
			}

			return vessel.serialNumber;
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
		}		
	}
};
