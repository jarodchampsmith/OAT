import Vue from 'vue';
import moment from 'moment';
import {Toast, Events, Platform, Utils} from 'quasar';

export default {
	name: 'sync',
	components: {},
	data () {
		return {
			posters: [
				'assets'
			],
			postCounts: {
				photos: 0,
				answers: 0,
				inspections: 0,
				assets: 0,
				vessels: 0,
				attachments: 0,
				transports: 0,
				meters: 0
			},
			subPosterCount: 0,
			postersCount: 0,
			subPosters: [
				'inspections',
				'vessels',
				'attachments',
				'transports'
			],
			tertiaryPosters: [
				'meters',
				'photos',
				'answers'
			],
			stage: 'put',
			syncEndpoints: 0,
			syncMessage: 'Syncing with OATS website...',
			syncMessages: [],
			syncPostSteps: 0,
			syncProgress: 0,
			syncs: [],
			syncedPhotos: [],
			syncSteps: 0,
			syncStepsTaken: 0,
			syncTotal: 0,
			syncComplete: false,
			timeDelay: 0,
			inProgress: 0,
		};
	},
	watch: {
		syncMessage: function(newMessage) {
			this.syncMessages.push(newMessage);
		},
		syncStepsTaken: function (newSyncStepsTaken) {
			if (this.stage === 'put' && newSyncStepsTaken >= this.syncPostSteps) {
				// his.stage = 'get';
				// this.gets();
			}
		},
		/** Update any sub posters after all main posters have been completed **/
		postersCount: function(newPostersCount) {
			let vm = this;
			if (newPostersCount >= (this.postCounts.assets)) {
				this.subPosters.forEach((name) => {
					console.log(`Running sub poster for ${name}`);
					vm.puts(name, false,
						/* Added callback */
						(appId, id) => {
							if (name === 'vessels') {
								vm.$store.dispatch('fetchItems', {
									name: 'meters',
									lookup: 'vesselid',
									value: appId,
									field: '*'
								}).then((meters) => {
									meters.forEach((meter) => {
										vm.$store.commit('updateVesselId', {
											item: meter,
											id
										});
									});
									if (meters.length > 0) {
										console.log(`Re-putting meters with updated id's`);
										vm.puts('meters', false);
									}

								});
								this.subPosterCount += 1;
							}

							/* Update inspection relations after inspection was created */
							if (name === 'inspections') {
								console.log(`Updating answer inspection ids.`);

								/* Update the answers with the new inspection ID */
								vm.$store.dispatch('fetchItems', {
									name: 'answers',
									lookup: 'inspectionid',
									value: appId,
									field: '*'
								}).then((answers) => {
									 console.log(`found answers to update ids for`);
									 console.log(answers);
									answers.forEach((answer) => {
										vm.$store.commit('answerInspectionId', {
											answer,
											id
										});
									});

									/* Trigger a put for all of the answers with updated ID's */
									console.log(`Re-putting answers with updated id's`);
									setTimeout(() => {
										vm.puts('answers', true);
									},1000);
								});

								/* Updatephotos with the new inspection ID */
								vm.$store.dispatch('fetchItems', {
									name: 'photos',
									lookup: 'inspectionid',
									value: appId,
									field: '*'
								}).then((photos) => {
									// console.log(`found photos to update ids for`);
									// console.log(photos);
									photos.forEach((photo) => {
										vm.$store.commit('photoInspectionId', {
											photo,
											id
										});
									});

									/* Trigger a put for all of the photos with updated ID's */
									console.log(`Re-putting photos with updated id's`);
									setTimeout(() => {
										vm.puts('photos', true);
									}, 1000);
								});

								vm.subPposterCount += 1;
							}

						},
						/* Updated callback */
						() => {
							if (name === 'inspections') {
								setTimeout(() => {
									vm.puts('answers', true);
									vm.puts('photos', true);
								}, 1000);
							}

							vm.subPosterCount += 1;
						},
						/* Not Added callback */
						() => {
							vm.subPosterCount += 1;
						});


				});
			}
		},

		/** Update tertiary posters after all sub posters have completed **/
		subPosterCount: function (newSubPosterCount) {
			let vm = this;
			if (newSubPosterCount >= (this.postCounts.vessels + this.postCounts.transports + this.postCounts.attachments + this.postCounts.inspections)) {
				this.tertiaryPosters.forEach((name) => {
					if (name === 'answers' || name === 'photos') {
						this.puts(name, true);
					} else {
						this.puts(name, false);
					}

				});

				setTimeout(() => {
					console.log('running gets');
					vm.stage = 'get';
					vm.gets();
				}, 6000);

			}
		}
	},
	mounted () {
		let vm = this;
		Events.$off('inspection:complete');
		Events.$on('inspection:complete', function (inspection) {
			console.log('Firing inspection complete sync action.');
			if (vm.$store.getters.currentUser.ID && vm.$store.getters.isOnline) {
				vm.postSyncAction('INSPECTION', inspection.id, 'COMPLETE');
			}
		});

		setTimeout(function () {
			try {
				/* Perform offline sync if user is not online */
				if (!vm.$store.getters.isOnline) {
					window.pdb.get('oatsdb').then(function (doc) {
						vm.$store.replaceState(doc.state);
						vm.syncMessage = `Completed offline sync.`;
						Events.$emit('sync:complete');
						Toast.create.positive({
							html: `You are currently working offline, please sync all changes next time you are online.`,
							timeout: 3000
						});
						vm.$router.push('dashboard');
					}).catch(function (err) {
						console.log(err);
						Events.$emit('sync:error');
						Toast.create.negative({
							html: `There was an error syncing the application, you may need to connect to the internet and perform a sync.`,
							timeout: 3000
						});
					});
				}

				/* Skip sync on first import */
				if (vm.$store.getters.importStatus === 'firstImport') {
					vm.$router.push('dashboard');
					Events.$emit('sync:complete');
					vm.$store.commit('setImportStatus', 'importComplete');
					return;
				}

				/* Perform sync is user is logged in and online */
				if (vm.$store.getters.currentUser.ID && vm.$store.getters.isOnline) {

					/* Check for and apply any sync actions */
					vm.syncMessages.push(`Checking for new sync actions...`);
					vm.checkSyncActions();

					vm.syncMessages.push(`Checking for changes...`);
					console.log('checking for changes');

					/**
					 * Run through each main poster (items that can have relations) and perform a put.
					 * Update any relations with the new ID if the item has been newly created.
					 */
					vm.posters.forEach((name) => {
						vm.puts(name, false,
							/* Added callback */
							(appId, id) => {
								console.log(`running added callback with app ID of ${appId} and id of ${id} for ${name}`);

								/* Update asset relations after asset was created */
								if (name === 'assets') {
									vm.$store.dispatch('fetchItems', {
										name: 'inspections',
										lookup: 'assetid',
										value: appId,
										field: '*'
									}).then((inspections) => {
										inspections.forEach((inspection) => {
											vm.$store.commit('inspectionAssetId', {
												inspection,
												id
											});
										});
										/* Trigger a put for all of the inspections with updated ID's */
										console.log(`Re-putting inspections with updated id's`);
										vm.puts('inspections', false,
											/* Added callback */
											(appId, id) => {
												/* Update inspection relations after inspection was created */
													console.log(`Updating answer inspection ids.`);

													/* Update the answers with the new inspection ID */
													vm.$store.dispatch('fetchItems', {
														name: 'answers',
														lookup: 'inspectionid',
														value: appId,
														field: '*'
													}).then((answers) => {
														 console.log(`found answers to update ids for`);
														 console.log(answers);
														answers.forEach((answer) => {
															vm.$store.commit('answerInspectionId', {
																answer,
																id
															});
														});

														/* Trigger a put for all of the answers with updated ID's */
														console.log(`Re-putting answers with updated id's`);
														setTimeout(() => {
															vm.puts('answers', true);
														}, 1000);
													});

													/* Updatephotos with the new inspection ID */
													vm.$store.dispatch('fetchItems', {
														name: 'photos',
														lookup: 'inspectionid',
														value: appId,
														field: '*'
													}).then((photos) => {
														// console.log(`found photos to update ids for`);
														// console.log(photos);
														photos.forEach((photo) => {
															vm.$store.commit('photoInspectionId', {
																photo,
																id
															});
														});

														/* Trigger a put for all of the photos with updated ID's */
														console.log(`Re-putting photos with updated id's`);
														setTimeout(() => {
															vm.puts('photos', true);
														}, 1000);
													});
											},
											/* Updated callback */
											() => {
												if (name === 'inspections') {
													setTimeout(() => {
														vm.puts('answers', true);
														vm.puts('photos', true);
													}, 1000);
												}
											},
											/* Not Added callback */
											() => {
											});
									});
									vm.$store.dispatch('fetchItems', {
										name: 'attachments',
										lookup: 'assetid',
										value: appId,
										field: '*'
									}).then((attachments) => {
										attachments.forEach((attachment) => {
											vm.$store.commit('inspectionAssetId', {
												inspection: attachment,
												id
											});
										});

										/* Trigger a put for all of the attachments with updated ID's */
										console.log(`Re-putting attachments with updated id's`);
										vm.puts('attachments', false);
									});
									vm.$store.dispatch('fetchItems', {
										name: 'transports',
										lookup: 'assetid',
										value: appId,
										field: '*'
									}).then((transports) => {
										transports.forEach((transport) => {
											vm.$store.commit('inspectionAssetId', {
												inspection: transport,
												id
											});
										});

										/* Trigger a put for all of the transports with updated ID's */
										console.log(`Re-putting transports with updated id's`);
										vm.puts('transports', false);
									});
									vm.$store.dispatch('fetchItems', {
										name: 'vessels',
										lookup: 'assetid',
										value: appId,
										field: '*'
									}).then((vessels) => {
										vessels.forEach((vessel) => {
											vm.$store.commit('inspectionAssetId', {
												inspection: vessel,
												id
											});

											vm.puts('vessels', false,
												/* Added callback */
												(appId, id) => {
													vm.$store.dispatch('fetchItems', {
														name: 'meters',
														lookup: 'vesselid',
														value: appId,
														field: '*'
													}).then((meters) => {
														meters.forEach((meter) => {
															vm.$store.commit('updateVesselId', {
																item: meter,
																id
															});
														});
														if (meters.length > 0) {
															console.log(`Re-putting meters with updated id's`);
															vm.puts('meters', false);
														}

													});
												},
												/* Updated callback */
												() => {

												},
												/* Not Added callback */
												() => {

												});
										});
									});

									this.postersCount += 1;
								}

							},

							/* Updated Callback */
							() => {
								if (name === 'assets') {
									vm.postersCount += 1;
								}
							},
							/* Not added callback */
							() => {
									vm.postersCount += 1;
							});
					});

					if (vm.syncPostSteps === 0) {

					}
				}
			} catch (error) {
				vm.$root.logError('syncError', 'error', 1, {name: error.name, message: error.message}, {'details' : 'Unknown error occured while performing sync operation in sync.js'});
				Toast.create.negative({
					html: `An error occured during the sync operation. The error has been submitted to an admin for review. `,
					timeout: 3000
				});
				vm.$router.push('dashboard');
			}
		}, 1000);
	},
	methods: {
		abortSync() {
			let vm = this;
			vm.$router.push('dashboard');
		},
		/**
		 * Check for and perform any sync actions as reported by the API
		 * Actions: COMPLETE, DELETE, RESET
		 * API Returns: {objectId, action, objectName}
		 */
		checkSyncActions() {
			let queryTime = this.$store.getters.lastSync + 60 * 60 * 6;
			let vm = this;
			// eslint-disable-next-line
			Vue.axios.get(this.$store.getters.api.url + 'sync-actions', {
				params: {
					where: `createdAt>FROM_UNIXTIME(${queryTime})`
				}
			}).then(function (response) {
				if (response.data && response.data.DATA && response.data.DATA.length > 0) {
					vm.applySyncActions(response.data.DATA);
				}
			}).catch(function (error) {
					console.log(error);
					if (!error.response) {
						return;
					}
					window._oatsVue.$root.logError('apiError', 'error', error.response.status,
						/* Error data */
						{
							message: error.response.statusText
						},
						/* Meta data */
						{
							url: error.config.url,
							itemType: db.name
						}
					);

				});
		},
		/**
		 * Apply any sync actions fetched from the API.
		 * @param syncActions
		 */
		applySyncActions(syncActions) {
				console.log(`Applying ${syncActions.length} sync actions`);

				/* Override For Testing
				let tmpSyncActions = [
					{
					 "objectID": '100,1,8',
					 "action": "RESET",
					 "objectName": "ANSWER"
					}
				];
				 */

				syncActions.forEach((action) => {
					switch (action.action) {
						case 'DELETE':
						case 'COMPLETE':
							this.$store.dispatch('removeItem', action);
							break;
						case 'RESET':
							this.$store.dispatch('resetItem', action);
							break;
					}
				});
		},
		/**
		 * Send a new syncAction to the API
		 * @param objectName
		 * @param objectId
		 * @param action
		 */
		postSyncAction(objectName, objectId, action) {
			let vm = this;
			let request = {
				syncAction: {
					objectName: objectName,
					objectId: objectId,
					action: action
				}
			};

			// eslint-disable-next-line
			Vue.axios.post(this.$store.getters.api.url + 'sync-actions', request)
				.then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
					if (!error.response) {
						return;
					}
					window._oatsVue.$root.logError('apiError', 'error', error.response.status,
						/* Error data */
						{
							message: error.response.statusText
						},
						/* Meta data */
						{
							url: error.config.url,
							itemType: db.name
						}
					);
				});
		},
		/**
		 * Send all updated and newly created items to the API
		 * @param name
		 * @param answerTime
		 * @param addedCallback
		 * @param updatedCallback
		 * @param notAddedCallback
		 */
		puts (name, answerTime = false, addedCallback = null, updatedCallback = null, notAddedCallback = null) {
			let vm = this;
			console.log(`Running puts for ${name}`);

			let db = this.$store.getters[name];
			let added = [];
			let updated = [];
			let dbSyncNiceDate = moment.unix(db.synced).utc().format('MMMM, DD YYYY HH:mm:ss');
			let itemsLength = db.items.length;
			for (let i = 0; i < itemsLength; i++) {

				/**
				 * @todo - Keep local array of answers to make sure they aren't double posted or put.
				 */

				if (name === 'photos' && db.items[i].appGeneratedID && vm.syncedPhotos.includes(db.items[i].appGeneratedID)) {
					console.log('Skipping photo, already synced.');
					continue;
				}

				if (name === 'photos' && db.items[i].appGeneratedID) {
					vm.syncedPhotos.push(db.items[i].appGeneratedID);
				}

				/**
				 * @todo - POST inspections & assets that still has an app generated ID.
				 */
				if ((name === 'assets' || name === 'inspections') && db.items[i].id.toString.length === 36) {
					added.push(db.items[i]);
					continue;
				}

				/**
				 * To prevent answers from potentially being created twice, we're checking to see
				 * if an answer already has a valid inspectionid (not an app generated inspectionid).
				 * Wrapped in a secondary if to keep the loop speedy.
				 */
				if (name === 'answers') {
					if (db.items[i].created === false) {
						added.push(db.items[i]);
						continue;
					} else if (db.items[i].inspectionid && db.items[i].inspectionid.toString.length !== 36 && moment(db.items[i].updatedAt).utc().isAfter(dbSyncNiceDate)) {
						console.log('Forcing update of answer.');
						updated.push(db.items[i]);
						continue;
					}
				}
				if (moment(db.items[i].createdAt).utc().isAfter(dbSyncNiceDate) || db.items[i].created === false) {
					 console.log(` ${i} (Index of ${name})  ${db.items[i].createdAt} is after ${dbSyncNiceDate}`);
					 console.log(db.items[i]);
					 added.push(db.items[i]);
					 continue;
				} else if (moment(db.items[i].updatedAt).utc().isAfter(dbSyncNiceDate)) {
					updated.push(db.items[i]);
				}

			}

			/* Update post counts so we know when the items are done via callbacks */
			this.postCounts[name] = updated.length + added.length;
			// console.log(`${updated.length} updated items`);
			// console.log(`${added.length} newly added items`);


			if ((!answerTime && name != 'answers') || (answerTime && name === 'answers')) {
				this.syncSteps += added.length;
				this.syncPostSteps += added.length;
				this.syncSteps += updated.length;
				this.syncPostSteps += updated.length;
			}

			this.syncMessage = `Posting ${this.syncPostSteps} changes...`;
			if ( ((name !== 'answers' && !answerTime) && (name !== 'photos' && !answerTime))
				|| ((name === 'answers' && answerTime) || (name === 'photos' && answerTime))) {

				added.forEach((item) => {
					/* Check if inspection is complete, if so fire inspection complete event */
					if (name === 'inspection' && item.completedLocally) {
						Events.$emit('inspection:complete', item);
					}

					let payloadName = name.substr(0, name.length - 1);
					let params = {
						name,
						payload: {}
					};
					params.payload[payloadName] = JSON.parse(JSON.stringify(item));
					if (name === 'answers') {
						params.key = `${item.inspectionid},${item.categoryid},${item.questionid}`;
						params.payload.answer.answer = JSON.stringify(params.payload.answer.answer);
						params.payload.answer.defectOutcome = JSON.stringify(params.payload.answer.defectOutcome);
					}

					if (params.payload[payloadName].created === true) {
						this.syncStepsTaken += 1;
						this.updateProgress();
						if (notAddedCallback) {
							notAddedCallback();
						}
						return;
					}

					this.$store.dispatch('putItem', params).then((response) => {
						if (response && response.data && response.data.DATA && response.data.DATA.ID) {
							this.$store.commit('addId', {
								name,
								item,
								id: response.data.DATA.ID
							});
							this.syncStepsTaken += 1;
							if (addedCallback) {
								// console.log(`calling PUTS ADDED callback for ${name}`);
								addedCallback(params.payload[payloadName].appGeneratedID, response.data.DATA.ID);
							}
							this.updateProgress();
						} else {

							/* Unserialize answers */
							if (name === 'answers') {
								try {
									console.log('unserializing answer');
									params.payload.answer.answer = JSON.parse(params.payload.answer.answer);
									if (params.payload.answer.defectOutcome) {
										params.payload.answer.defectOutcome = JSON.parse(params.payload.answer.defectOutcome);
									}
								} catch (err) {
									console.log(err);
								}
							}

							console.log(`No ID returned for ${name}`);
							console.log(response);

							if (updatedCallback && params.payload[payloadName].id) {
								// console.log(`calling PUTS ADDED callback for ${name}`);
								updatedCallback(params.payload[payloadName].id);
							}

							this.syncStepsTaken += 1;
							this.updateProgress();
						}
					}).catch((error) => {

						/* Unserialize answers */
						if (name === 'answers') {
							try {
								console.log('unserializing answer');
								params.payload.answer.answer = JSON.parse(params.payload.answer.answer);
								if (params.payload.answer.defectOutcome) {
									params.payload.answer.defectOutcome = JSON.parse(params.payload.answer.defectOutcome);
								}
							} catch (err) {
								console.log(err);
							}
						}

						/* Update the sync steps so the app doesn't hang on the sync page */
						vm.syncStepsTaken += 1
						this.updateProgress();
						console.log(error);
					});
				});

				updated.forEach((item) => {
					let params = {
						name,
						key: '',
						payload: {}
					};

					/* Check if inspection is complete, if so fire inspection complete event */
					if (name === 'inspection' && item.completedLocally) {
						Events.$emit('inspection:complete', item);
					}

					params.payload[name.substr(0, name.length - 1)] = JSON.parse(JSON.stringify(item));
					if (name === 'answers') {
						params.key = `${item.inspectionid},${item.categoryid},${item.questionid}`;
						params.payload.answer.answer = JSON.stringify(params.payload.answer.answer);
						params.payload.answer.defectOutcome = JSON.stringify(params.payload.answer.defectOutcome);
					} else {
						params.key = item.id;
					}
					this.$store.dispatch('updateItem', params).then((response) => {

						/* Unserialize answers */
						if (name === 'answers') {
							try {
								console.log('unserializing answer');
								params.payload.answer.answer = JSON.parse(params.payload.answer.answer);
								if (params.payload.answer.defectOutcome) {
									params.payload.answer.defectOutcome = JSON.parse(params.payload.answer.defectOutcome);
								}
							} catch (err) {
								console.log(err);
							}
						}

						this.syncStepsTaken += 1;
						if (updatedCallback) {
							// console.log(`calling PUTS UPDATED callback for ${name}`);
							updatedCallback(item.id);
						}
						this.updateProgress();
					}).catch((error) => {

						/* Unserialize answers */
						if (name === 'answers') {
							try {
								console.log('unserializing answer');
								params.payload.answer.answer = JSON.parse(params.payload.answer.answer);
								if (params.payload.answer.defectOutcome) {
									params.payload.answer.defectOutcome = JSON.parse(params.payload.answer.defectOutcome);
								}
							} catch (err) {
								console.log(err);
							}
						}

						/* Update the sync steps so the app doesn't hang on the sync page */
						vm.syncStepsTaken += 1
						this.updateProgress();
						console.log(error);
					});
				});
			} else {
				console.log(`not saving ${name}`);
			}
			if (added.length === 0) {
				if (notAddedCallback) {
					notAddedCallback();
				}
			}
		},
		/**
		 * Fetch any new items from the API.
		 * First fetch the counts then use the counts to fetch the items.
		 */
		gets () {
			this.syncProgress = 0;
			this.syncSteps = 0;
			this.syncTotal = this.syncStepsTaken;
			this.syncStepsTaken = 0;
			this.syncs = this.$store.getters.dbNames;
			this.syncs.forEach((name) => {
				if (!['answers', 'inspections', 'jobs'].includes(name)) {
					this.sync(name);
				}
			});
			this.sync('jobs', null, (jobs) => {
				let jobids = new Set();
				jobs.forEach((job) => {
					jobids.add(job.id);
				});

				if (jobids.size == 0) {
					return;
				}

				this.sync('inspections', {
					where: `jobid in (${[...jobids]})`
				}, (inspections) => {
					let inspectionids = new Set();
					inspections.forEach((inspection) => {
						/* Make sure no app generated id's are checked */
						if (inspection.id.toString().length !== 36) {
							inspectionids.add(inspection.id);
						}
					});
					this.sync('answers', {
						where: `inspectionid in (${[...inspectionids]})`
					}, null, (answers) => {
						answers.forEach((answer, index) => {
							if (answer.answer) {
								try {
									answers[index].answer = JSON.parse(answer.answer);
								} catch (err) {
									console.log(answers[index]);
									answers[index].answer = {};
									console.log(err);
								}

							}
							if (answer.defectOutcome) {
								answers[index].defectOutcome = JSON.parse(answer.defectOutcome);
							}
						});
					});
				});
			});
		},
		/**
		 * Run through all the sync operations (syncActions > puts > gets > complete)
		 * @param name
		 * @param querystring
		 * @param callback
		 * @param transform
		 */
		sync (name, querystring = null, callback = null, transform = null) {
			let vm = this;

			// console.log(`${this.inProgress} syncs in progress`);\/
			/* Throttle syncs so only so many requests run at a given time */
			if (this.inProgress >= 3) {
				setTimeout(function () {
					vm.sync(name, querystring, callback, transform)
				}, 300);
				return;
			}
			if (Platform.is.cordova) {
				this.timeDelay += 500;
			} else {
				this.timeDelay += 150;
			}

			this.inProgress++;

			vm.$store.dispatch('fetchCount', {
				name,
				querystring
			}).then(Utils.debounce((response) => {
				vm.inProgress--;
				if (response && response.data && response.data.DATA && response.data.DATA.length > 0) {

					vm.syncSteps += response.data.DATA.length;
					vm.syncMessage = `Syncing ${vm.syncSteps} items with OATS website...`;
					let itemsFetched = 0;
					let totalItems = response.data.DATA.length + 20;
					let curPage = 0;

					console.log(`${totalItems} items for ${name}`);

					while (itemsFetched < totalItems) {
						itemsFetched += Math.min(1000, totalItems);
						curPage++;
						vm.$store.dispatch('db', {
							name,
							items: response.data.DATA,
							page: curPage,
							perPage: Math.min(1000, totalItems)
						}).then((response) => {
							vm.syncStepsTaken += response.data.DATA.length;
							vm.syncEndpoints += 1;
							const items = response.data.DATA;
							if (transform) {
								transform(items);
							}
							vm.$store.commit('db', {
								name,
								items
							});
							if (callback) {
								callback(items);
							}
							setTimeout(function () {
								vm.updateProgress();
							}, 700);
						}).catch((error) => {
							/* Update the sync steps so the app doesn't hang on the sync page */
							vm.syncStepsTaken += Math.min(1000, totalItems);
							vm.syncEndpoints += 1;
							console.log(error);
						});
					}
				} else {
					vm.syncEndpoints += 1;
					if (callback) {
						callback(vm.$store.state.db[name].items);
					}
					setTimeout(function () {
						vm.updateProgress();
					}, 1000);

				}
			}), 300)
			.catch((error) => {
				/* Update the sync steps so the app doesn't hang on the sync page */
				vm.syncEndpoints += 1;
				setTimeout(function () {
					vm.updateProgress();
				}, 1000);
				console.log(error);
			});

		},
		/**
		 * Update the sync progress based on the # of items updated/fetched.
		 * Fire a sync:complete event upon completion.
		 */
		updateProgress () {
			if (this.syncSteps > 0 && this.syncStepsTaken > 0 && this.syncProgress < 100) {
				this.syncProgress = parseInt(this.syncStepsTaken / this.syncSteps * 100);
			}

			// console.log(`${this.syncProgress}% sync progress , ${this.syncSteps} sync steps, ${this.syncStepsTaken} steps taken, ${this.inProgress} in progress, ${this.syncEndpoints} endpoints, ${this.sync.length} syncs length`);

			let vm = this;
			let completeDelay = 6000;
			if (Platform.is.cordova) {
				completeDelay = 6000;
			}

			setTimeout(function () {
				if ((vm.syncProgress >= 100 && vm.syncSteps > 0 && !vm.syncComplete && vm.syncEndpoints > 0)
					|| (vm.syncProgress === 0 && vm.inProgress === 0 && vm.syncSteps === 0 && !vm.syncComplete)
				) {

					/* Dont fire complete event until sync is 100% complete */
					if (vm.syncSteps > 0 && vm.syncStepsTaken < vm.syncSteps) {
						return;
					}

					console.log('sync completed');
					vm.syncComplete = true;
					vm.syncMessage = `Completed sync.`;

					vm.$store.commit('lastSync');

					/* Update db sync times for all items */
					vm.posters.forEach((item) => {
						vm.$store.commit('dbSyncTime', {
							name: item
						});
					});

					vm.subPosters.forEach((item) => {
						vm.$store.commit('dbSyncTime', {
							name: item
						});
					});

					vm.tertiaryPosters.forEach((item) => {
						vm.$store.commit('dbSyncTime', {
							name: item
						});
					});


					Events.$emit('sync:complete');
					Toast.create.positive({
						html: `Synced ${vm.syncTotal + vm.syncStepsTaken} items.`,
						timeout: 1000
					});
					setTimeout(() => {
						vm.$router.push('dashboard');
					},2200);

				}
			}, completeDelay);

		}
	}
};
