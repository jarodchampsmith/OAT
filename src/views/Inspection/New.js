import { Utils, Loading, Toast } from 'quasar';

import Asset from '../../components/Asset/Asset.vue';
import Fab from '../../components/Fab/Fab.vue';

export default {
	name: 'addinspection',
	components: {
		'asset': Asset,
		'fab': Fab
	},
	data () {
		return {
			job: {},
			answers: [],
			assets: [],
			companies: [],
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
							filter: true
						},
						{
							label: 'Manufacturer',
							field: 'manufacturer',
							width: '120px',
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
				asset: {},
				assetId: null,
				attachments: [],
				transports: [],
				vessels: []
			},
			locations: [],
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
				],
				TCSpecification: [
					{
						label: '--- NOT APPLICABLE ---',
						value: '--- NOT APPLICABLE ---'
					},
					{
						label: 'MC 330',
						value: 'MC 330'
					},
					{
						label: 'MC 331',
						value: 'MC 331'
					},
					{
						label: 'MC 331/TC 331',
						value: 'MC 331/TC 331'
					},
					{
						label: 'TC 51',
						value: 'TC 51'
					},
					{
						label: 'TC 60',
						value: 'TC 60'
					},
					{
						label: 'TC 331',
						value: 'TC 331'
					},
					{
						label: 'TC 338',
						value: 'TC 338'
					},
					{
						label: 'TC 350',
						value: 'TC 350'
					},
					{
						label: 'TC 406',
						value: 'TC 406'
					},
					{
						label: 'TC 407',
						value: 'TC 407'
					},
					{
						label: 'TC 412',
						value: 'TC 412'
					},
					{
						label: 'Exempt as per CSA B622-09 SR 54',
						value: 'Exempt as per CSA B622-09 SR 54'
					},
					{
						label: 'Exempt as per CSA B622-09 SR 55',
						value: 'Exempt as per CSA B622-09 SR 55'
					},
					{
						label: 'Exempt as per CSA B622-09 SR 73',
						value: 'Exempt as per CSA B622-09 SR 73'
					}
				]
			},
			selected: {
				asset: {},
				assetId: null,
				company: {},
				companyId: null,
				location: {},
				locationId: null,
				companyLocationID: null,
				template: {},
				templateId: null
			},
			assetSearchTerm: '',
			templates: []
		};
	},
	computed: {
		validCompanies: function (name) {
			let validObject = [];
			this.companies.forEach((item) => {
				validObject.push({
					label: item.name,
					value: item.id
				});
			});
			return validObject.sort(this.selectSort);
		},
		locationSelect: function () {
			let locationSelect = [];
			let vm = this;
			if (!vm.selected.companyId) {
				return locationSelect;
			}

			this.locations.forEach(function (location) {

				if (vm.selected.companyId && location.companyid != vm.selected.companyId) {
					return;
				}

				locationSelect.push({
					label: location.name + ", " + location.address1 + ", " + location.city + ", " + location.region,
					value: location.id
				});
			});

			return locationSelect.sort(this.selectSort);

		},
		assetSearchSelect: function () {
			let assetSelect = [];
			let vm = this;
			if (!vm.selected.companyId) {
				return assetSelect;
			}
			this.assets.forEach(function (asset) {

				if (asset.companyid != vm.selected.companyId) {
					return;
				}

				assetSelect.push({
					label: `${asset.name}`,
					value: `${asset.name}`,
					id: asset.id !== null ? asset.id : asset.appGeneratedID
				});
			});
			return assetSelect.sort(this.selectSort);
		},
		validTemplates: function (name, index) {

			let uniqueTemplates = [];
			let filtered = this.templates.filter((template, index) => {
				let idExists = uniqueTemplates.includes(template.id);
				uniqueTemplates.push(template.id);
				if (idExists) {
					return false;
				}
				return true;
			});
			
			let validObject = [];
			filtered.forEach((item) => {
				validObject.push({
					label: item.name,
					value: item.id
				});
			});
			return validObject.sort(this.selectSort);
		}
	},
	created: function () {

		Loading.show();
		setTimeout(() => {

			this.$store.dispatch('fetchItems', {
				name: 'companies'
			}).then((companies) => {
				this.companies = companies;
			});
			this.$store.dispatch('fetchItems', {
				name: 'templates'
			}).then((templates) => {
				this.templates = templates;
			});

			/* Load the selected job */
			if (this.$route.params.jobid) {
				this.$store.dispatch('fetchItem', {
					type: 'jobs',
					lookup: 'id',
					value: parseInt(this.$route.params.jobid),
					field: '*'
				}).then((job) => {
					this.$set(this, 'job', job);
					this.$set(this.selected, 'companyid', job.companyid);
					this.$set(this.selected, 'companyId', job.companyid);

				});
			}


			const fields = this.$store.getters.assetFields;
			setTimeout(() => {
				this.locations = this.$store.getters.locations.items;
				this.$set(this.selected, 'companyLocationID', this.job.companyLocationID);
				this.$set(this.selected, 'locationId', this.job.companyLocationID);
			}, 1000);
			setTimeout(() => {
				this.assets = this.$store.getters.assets.items;
			},2000);


			fields.forEach((field) => {
				this.$set(this.current.asset, field, null);
			});


			/* Add the watchers for this vue instance */
			this.$watch('selected.companyId', function (newId) {
				this.companies.forEach((company) => {
					if (company.id === newId) {
						this.$set(this.selected, 'company', company);
					}
				});

				this.$set(this.selected, 'locationId', null);
				this.$set(this.selected, 'assetId', null);
			});

			this.$watch('selected.locationId', function (newId) {
				this.locations.forEach((location) => {
					if (location.id === newId) {
						this.$set(this.selected, 'location', location);
						this.$set(this.selected, 'companyLocationId', location.id);
					}
				});
				this.$set(this.selected, 'assetId', null);
			});

			this.$watch('selected.assetId', function (newId) {
				this.assets.forEach((asset) => {
					if (asset.id === newId) {
						this.$set(this.selected, 'asset', asset);
					}
				});
				this.$set(this.current, 'attachments', []);
				this.$set(this.current, 'transports', []);
				this.$set(this.current, 'vessels', []);
				this.$store.dispatch('fetchItems', {
					name: 'vessels',
					lookup: 'assetid',
					value: newId,
					field: '*'
				}).then((vessels) => {
					this.current.vessels = vessels;
				});
			});

			this.$watch('selected.templateId', function (newId) {
				this.templates.forEach((template) => {

					if (template.id === newId) {
						this.$set(this.selected, 'template', template);
						this.$set(this, 'answers', []);
						let categoryIds = new Set();
						this.selected.template.templateCategories.forEach((category) => {
							categoryIds.add(category.categoryid);
						});
						this.$store.dispatch('fetchItems', {
							name: 'questions',
							lookup: 'categoryid',
							value: [...categoryIds],
							field: '*'
						}).then((questions) => {
							[...categoryIds].forEach((categoryid) => {

								let excludedIds = [];
								/* Just in case we have duplicates, we are iterating over the questions first
								   to make a list of any excluded question ID's. Then we'll use the excluded ID's to exclude
								   any questions from being added on the second iteration.
								 */
								questions.forEach((question) => {
									if (question.deletedAt) {
										console.log(`Question ID: ${question.id} - Category ID: ${question.categoryid} has deleted at field set.`);
									}

									/* Don't add answer if the question has been soft deleted */
									if (question.categoryid !== categoryid || question.deletedAt) {
										excludedIds.push(question.id);
										return;
									}

									/* Don't add answer if this question has been overridden*/
									if (question.overrideByTemplateIDs) {
										let overrides = question.overrideByTemplateIDs.toString().split(',');
										let overridden = false;
										overrides.forEach((templateId) => {
											if (templateId == template.id) {
												overridden = true;
											}
										});

										if (overridden) {
											excludedIds.push(question.id)
											return;
										}
									}
								});

								questions.forEach((question) => {
									// console.log(`Question ID: ${question.id} - Category ID: ${question.categoryid}`);
									// console.log(question);

									if (excludedIds.includes(question.id)) {
										console.log(`Excluding question with id of ${question.id}`);
										return;
									}

									this.answers.push({
										inspectionid: null,
										categoryid,
										questionid: question.id,
										userid: null,
										isrequired: question.isrequired,
										answer: null,
										comment: null,
										defectOutcome: null,
										created: false
									});
								});
							});
						});
					}
				});
			});

			Loading.hide();
		}, 1000);

	},
	methods: {
		selectSort: function(a,b) {
			if (a.label < b.label) {
				return -1;
			}

			if (a.label > b.label) {
				return 1;
			}

			return 0;
		},
		assetSearch: function(term, done) {
			let results = this.assetSearchSelect.filter((asset) => {
				return asset.label.toLowerCase().includes(term.toLowerCase());
			}).sort(this.selectSort);

			if (!results) {
				results = [];
				results.push({
					label: 'No matching assets.',
					value: '',
					id: null
				})
			}

			done(results);
		},
		assetSelected: function(asset) {
			/* Set asset ID or app generated asset ID if no asset id is available */
			this.$set(this.selected,'assetId', asset.id !== null ? asset.id : asset.appGeneratedID);
		},
		createInspection: function () {
			this.$store.commit('inspection', {
				jobid: this.$route.params.jobid,
				companyid: this.selected.companyId,
				locationid: this.selected.locationId,
				assetid: this.selected.assetId,
				answers: this.answers
			});

			Toast.create.positive('New inspection added successfully.');

			this.$router.push({
				name: 'dashboard'
			});
		},
		openAsset: function (assetId = null) {
			if (assetId) {
				this.$set(this.current, 'assetId', assetId);
				this.$set(this.current, 'asset', JSON.parse(JSON.stringify(this.selected.asset)));
			} else {
				this.$set(this.current, 'asset', {});
				const fields = this.$store.getters.assetFields;
				fields.forEach((field) => {
					this.$set(this.current.asset, field, null);
				});
				this.$set(this.current.asset, 'id', Utils.uid());
				this.$set(this.current.asset, 'appGeneratedID', this.current.asset.id);
				this.$set(this.current.asset, 'locationid', this.selected.locationId);
				this.$set(this.current.asset, 'companyid', this.selected.companyId);
			}
			this.$refs.assetModal.open();
		},
		cancelAsset: function () {
			this.$set(this.current, 'asset', {});
			this.$set(this.current, 'assetId', null);
			this.$refs.assetModal.close();
		},
		saveAsset: function () {
			this.$set(this.current, 'assetId', this.current.asset.id);
			let found = false;
			this.assets.forEach((asset, index) => {
				if (asset.id === this.current.assetId) {
					found = index;
				}
			});
			if (found === false) {
				this.assets.push(this.current.asset);
			} else {
				this.assets[found] = this.current.asset;
			}
			this.$refs.assetModal.close();
			this.selected.assetId = this.current.assetId;
			// Save to store.
			this.$store.commit('asset', this.current.asset);
		},
		update: function (response) {
			console.log('inspection update', response);
		}
	}
};
