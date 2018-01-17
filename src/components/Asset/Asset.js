import { Utils, Toast, Events } from 'quasar';
import moment from 'moment';
import {required} from 'vuelidate/lib/validators';

import Attachment from '../../components/Attachment/Attachment.vue';
import Transport from '../../components/Transport/Transport.vue';
import Vessel from '../../components/Vessel/Vessel.vue';

export default {
	name: 'asset',
	components: {
		'attachment': Attachment,
		'transport': Transport,
		'vessel': Vessel
	},
	validations: {
		asset: {
			name: {
				required
			}
		}
	},
	data () {
		return {
			attachments: [],
			company: {},
			config: {
				vessels: {
					table: {
						rowHeight: '55px',
						refresh: false,
						leftStickyColumns: 1,
						selection: false
					},
					columns: [
						{
							label: 'Serial #',
							field: 'serialNumber',
							width: '120px',
							sort: true,
							filter: true
						},
						{
							label: 'Manufacturer',
							field: 'manufacturer',
							width: '160px',
							sort: true,
							filter: true
						},
						{
							label: 'Actions',
							field: 'id',
							format (value) {
								return 'Actions';
							},
							sort: false,
							filter: false,
							width: '50px'
						}
					]
				},
				transports: {
					table: {
						rowHeight: '55px',
						refresh: false,
						leftStickyColumns: 1,
						selection: false
					},
					columns: [
						{
							label: 'Name',
							field: 'name',
							width: '160px',
							sort: true,
							filter: true
						},
						{
							label: 'License',
							field: 'licensePlate',
							width: '80px',
							sort: true,
							filter: true
						},
						{
							label: 'Chassis Serial #',
							field: 'chassisSerialNumber',
							width: '100px',
							sort: true,
							filter: true
						},
						{
							label: 'Engine Serial #',
							field: 'engineSerialNumber',
							width: '100px',
							sort: true,
							filter: true
						},
						{
							label: 'Actions',
							field: 'id',
							format (value) {
								return 'Actions';
							},
							sort: false,
							filter: false,
							width: '50px'
						}
					]
				},
				attachments: {
					table: {
						rowHeight: '55px',
						refresh: false,
						leftStickyColumns: 1,
						selection: false
					},
					columns: [
						{
							label: 'Serial #',
							field: 'serialNumber',
							width: '120px',
							sort: true,
							filter: true
						},
						{
							label: 'Hose Type',
							field: 'hoseType',
							width: '100px',
							sort: true,
							filter: true
						},
						{
							label: 'Retest Date',
							field: 'retestDate',
							width: '100px',
							sort: true,
							filter: true
						},
						{
							label: 'Replacement Year',
							field: 'replacementYear',
							width: '100px',
							sort: true,
							filter: true
						},
						{
							label: 'Actions',
							field: 'id',
							format (value) {
								return 'Actions';
							},
							sort: false,
							filter: false,
							width: '50px'
						}
					]
				}
			},
			current: {
				attachment: {},
				attachmentId: null,
				transport: {},
				transportId: null,
				vessel: {},
				vesselId: null
			},
			location: {},
			options: {
				assetTypes: [
					{
						label: 'Farm Wagon',
						value: 'farm'
					},
					{
						label: 'Highway Tanks',
						value: 'highway'
					},
					{
						label: 'Portable Tanks',
						value: 'portable'
					},
					{
						label: 'LPG Storage Vessel',
						value: 'LPG'
					},
					{
						label: 'NH3 Storage Vessel',
						value: 'NH3'
					}
				]
			},
			transports: [],
			vessels: []
		};
	},
	props: {
		asset: {
			type: Object,
			default: {
				id: null
			}
		}
	},
	watch: {
		'asset.id': function () {
			this.populate();
		}
	},
	computed: {
		vesselsTable: function() {
			return this.vessels;
		},
		transportsTable: function () {
			return this.transports;
		}		,
		attachmentsTable: function () {
			return this.attachments;
		}
	},
	created: function () {
		const fields = this.$store.getters.assetFields;
		fields.forEach((field) => {
			this.$set(this.asset, field, null);
		});
		this.populate();
	},
	methods: {
		populate: function () {
			this.$store.dispatch('fetchItems', {
				name: 'vessels',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((vessels) => {
				this.vessels = vessels;
				if (!this.asset.hasOwnProperty('vessels')) {
					this.asset.vessels = [];
				}
				this.asset.vessels.forEach((vessel) => {
					let found = false;
					this.vessels.forEach((innerVessel) => {
						if (innerVessel.id === vessel.id) {
							found = true;
							innerVessel = vessel;
						}
					});
					if (!found) {
						this.vessels.push(vessel);
					}
				});
			});
			this.$store.dispatch('fetchItems', {
				name: 'attachments',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((attachments) => {
				this.attachments = attachments;
			});
			this.$store.dispatch('fetchItems', {
				name: 'transports',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((transports) => {
				this.transports = transports;
			});
			this.$store.dispatch('fetchItems', {
				name: 'attachments',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((attachments) => {
				this.attachments = attachments;
			});
		},
		editVessel: function (vessel) {
			if (vessel) {
				this.$set(this.current, 'vesselId', vessel.id);
				this.$set(this.current, 'vessel', JSON.parse(JSON.stringify(vessel)));
				this.$set(this.current.vessel, 'companyLocationID', this.asset.companyLocationID);
			} else {
				this.$set(this.current, 'vessel', {});
				const fields = this.$store.getters.vesselFields;
				fields.forEach((field) => {
					this.$set(this.current.vessel, field, null);
				});
				this.$set(this.current.vessel, 'id', Utils.uid());
				this.$set(this.current.vessel, 'appGeneratedID', this.current.vessel.id);
				this.$set(this.current.vessel, 'assetid', this.asset.id !== null ? this.asset.id : this.asset.appGeneratedID);
				this.$set(this.current.vessel, 'companyid', this.asset.companyid);
				this.$set(this.current.vessel, 'companyLocationID', this.asset.companyLocationID);
			}
			this.$refs.vesselModal.open();
		},
		cancelVessel: function () {
			this.$set(this.current, 'vessel', {});
			this.$set(this.current, 'vesselId', null);
			this.$refs.vesselModal.close();
		},
		saveVessel: function () {

			console.log('saving vessel');
			if (this.$refs.vesselEditor.$v && this.$refs.vesselEditor.$v.vessel) {
				this.$refs.vesselEditor.$v.vessel.$touch();
				if (this.$refs.vesselEditor.$v.vessel.$error) {
					Toast.create.negative("Error saving vessel. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$set(this.current, 'vesselId', this.current.vessel.id);
			let found = false;
			this.vessels.forEach((vessel, index) => {
				if (vessel.id === this.current.vesselId) {
					found = index;
				}
			});
			if (found === false) {
				this.vessels.push(this.current.vessel);
			} else {
				console.log('found matching vessel');
				this.current.vessel.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				this.vessels[found] = this.current.vessel;
			}
			this.$refs.vesselModal.close();
			this.asset.vessels = this.vessels;
			/* Trigger asset save */
			Events.$emit('save:assetRelation');

			setTimeout(() => {
				this.$refs.tableVessels.filtering.terms = '1';
				this.$refs.tableVessels.filtering.terms = '';
			}, 200);

			this.$forceUpdate();
		},
		editTransport: function (transport) {
			if (transport) {
				this.$set(this.current, 'transportId', transport.id);
				this.$set(this.current, 'transport', JSON.parse(JSON.stringify(transport)));
				this.$set(this.current.transport, 'companyLocationID', this.asset.companyLocationID);
			} else {
				this.$set(this.current, 'transport', {});
				const fields = this.$store.getters.transportFields;
				fields.forEach((field) => {
					this.$set(this.current.transport, field, null);
				});
				this.$set(this.current.transport, 'id', Utils.uid());
				this.$set(this.current.transport, 'appGeneratedID', this.current.transport.id);
				this.$set(this.current.transport, 'assetid', this.asset.id !== null ? this.asset.id : this.asset.appGeneratedID);
				this.$set(this.current.transport, 'companyid', this.asset.companyid);
				this.$set(this.current.transport, 'companyLocationID', this.asset.companyLocationID);
			}
			this.$refs.transportModal.open();
		},
		cancelTransport: function () {
			this.$set(this.current, 'transport', {});
			this.$set(this.current, 'transportId', null);
			this.$refs.transportModal.close();
		},
		saveTransport: function () {

			if (this.$refs.transportEditor.$v && this.$refs.transportEditor.$v.transport) {
				this.$refs.transportEditor.$v.transport.$touch();
				if (this.$refs.transportEditor.$v.transport.$error) {
					Toast.create.negative("Error saving transport. Please review all form fields for accuracy.");
					return;
				}
			}
			
			this.$set(this.current, 'transportId', this.current.transport.id);
			let found = false;
			this.transports.forEach((transport, index) => {
				if (transport.id === this.current.transportId) {
					found = index;
				}
			});
			if (found === false) {
				this.transports.push(this.current.transport);
			} else {
				this.current.transport.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				this.transports[found] = this.current.transport;
			}
			this.$refs.transportModal.close();
			this.asset.transports = this.transports;
			/* Trigger asset save */
			Events.$emit('save:assetRelation');
			setTimeout(() => {
				this.$refs.tableTransports.filtering.terms = '1';
				this.$refs.tableTransports.filtering.terms = '';
			},200);

			this.$forceUpdate();
		},
		editAttachment: function (attachment) {
			if (attachment) {
				this.attachments.forEach((item, index) => {
					if (attachment.id === item.id) {
						this.$set(this.current, 'attachmentId', item.id);
						this.$set(this.current, 'attachment', JSON.parse(JSON.stringify(item)));
						this.$set(this.current.attachment, 'companyLocationID', this.asset.companyLocationID);
					}
				});

			} else {
				this.$set(this.current, 'attachment', {});
				const fields = this.$store.getters.attachmentFields;
				fields.forEach((field) => {
					this.$set(this.current.attachment, field, null);
				});
				this.$set(this.current.attachment, 'id', Utils.uid());
				this.$set(this.current.attachment, 'appGeneratedID', this.current.attachment.id);
				this.$set(this.current.attachment, 'assetid', this.asset.id !== null ? this.asset.id : this.asset.appGeneratedID);
				this.$set(this.current.attachment, 'companyid', this.asset.companyid);
				this.$set(this.current.attachment, 'companyLocationID', this.asset.companyLocationID);
			}
			this.$refs.attachmentModal.open();
		},
		cancelAttachment: function () {
			this.$set(this.current, 'attachment', {});
			this.$set(this.current, 'attachmentId', null);
			this.$refs.attachmentModal.close();
		},
		saveAttachment: function () {

			if (this.$refs.attachmentEditor.$v && this.$refs.attachmentEditor.$v.attachment) {
				this.$refs.attachmentEditor.$v.attachment.$touch();
				if (this.$refs.attachmentEditor.$v.attachment.$error) {
					console.log(this.$refs.attachmentEditor.$v.attachment);
					Toast.create.negative("Error saving attachment. Please review all form fields for accuracy.");
					return;
				}
			}

			this.$set(this.current, 'attachmentId', this.current.attachment.id);
			let found = false;
			this.attachments.forEach((attachment, index) => {
				if (attachment.id === this.current.attachmentId) {
					found = index;
				}
			});
			if (found === false) {
				this.attachments.push(this.current.attachment);
			} else {
				this.current.attachment.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				this.attachments[found] = this.current.attachment;
			}
			this.$refs.attachmentModal.close();

			this.asset.attachments = this.attachments;
			/* Trigger asset save */
			Events.$emit('save:assetRelation');

			setTimeout(() => {
				this.$refs.tableAttachments.filtering.terms = '1';
				this.$refs.tableAttachments.filtering.terms = '';
			}, 200);
			this.$forceUpdate();



		},
		update: function (response) {
			console.log('asset update', response);
		}
	}
};
