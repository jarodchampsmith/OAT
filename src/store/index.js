import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import { Utils, Events } from 'quasar';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		online: false,
		importStatus: '',
		lastLocalUpdate: 0,
		lastCompletedSync: 0,
		api: {
			url: 'http://maxfield.staging.intoria.com/mobile/v1/',
			env: 'dev',
			// url: 'http://oats2.maxfield.ca/mobile/v1/',
			// env: 'production',
			forgotPassword: 'http://oats2.maxfield.ca/forgot-password'
		},
		hardwareID: 'browser',
		currentPage: 'dashboard',
		currentConnection: {
			EXPIRESAT: 0,
			ID: ''
		},
		currentUser: {
			COMPANYID: '',
			EMAIL: '',
			FIRSTNAME: '',
			ID: '',
			LASTNAME: '',
			PHONE: '',
			PHONEEXT: '',
			ROLEID: ''
		},
		db: {
			answers: {
				fields: 'inspectionid,categoryid,questionid,userid,isrequired,answer,comment,defectOutcome,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			assets: {
				fields: 'id,companyid,companyLocationID,locationid,name,unitInformation,type,maxProduct,originalTestDate,appGeneratedID,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			attachments: {
				fields: 'id,type,assetid,companyid,companyLocationID,serialNumber,hoseType,size,sizeUnit,length,lengthUnit,retestDate,replacementYear,testPressure,HAWP,appGeneratedID,createdAt,updatedAt,deletedAt,testPresure,lastTestResult,testedAt,testIntervalInYears',
				synced: 0,
				items: []
			},
			categories: {
				fields: 'id,type,name,tabName,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			companies: {
				fields: 'id,statusid,name,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			inspections: {
				fields: 'id,jobid,userid,companyid,companyLocationID,locationid,assetid,appGeneratedID,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			photos: {
				fields: 'id,userid,assetid,categoryid,inspectionid,title,description,location,filename,filetype,thumbnail,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			jobs: {
				fields: 'id,companyid,companyLocationID,locationid,inspectedAt,createdAt,updatedAt,deletedAt,externalEpicorJobID',
				synced: 0,
				items: []
			},
			locations: {
				fields: 'id,companyid,type,name,address1,address2,city,region,postCode,country,phone,lat,lng,createdAt,updatedAt,deleatedAt',
				synced: 0,
				items: []
			},
			meters: {
				fields: 'id,vesselid,companyid,companyLocationID,type,serialNumber,make,size,reading,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			questions: {
				fields: 'id,categoryid,question,type,options,isrequired,allowComments,overrideByTemplateIDs,previousId,tooltip,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			templates: {
				fields: 'id,categoryid,templateid,name,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			transports: {
				fields: 'id,assetid,companyid,companyLocationID,type,name,manufacturer,engineSerialNumber,engineHours,chassisSerialNumber,licensePlate,appGeneratedID,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			users: {
				fields: 'id,statusid,roleid,companyid,companyLocationID,firstName,lastName,email,phone,phoneExt,comments,passwordSalt,encryptedPassword,approvedBy,approvedAt,resetUuid,resetExpiresAt,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			},
			vessels: {
				fields: 'id,assetid,companyid,companyLocationID,TCSpecification,alteredBy,diameter,diameterUnit,headMaterial,headThickness,headThicknessUnit,headType,listedCapacity,listedCapacityUnit,manufacturer,MAWP,MAWPUnit,MDMT,MDMTUnit,nationalBoardNumber,plateLocation,provincialNumber,constructedOf,seamToSeamLength,seamToSeamLengthUnit,serialNumber,shellMaterial,shellThickness,shellThicknessUnit,stressRelieved,CRNorTCRN,truckMileage,truckMileageUnit,uStamped,wagonManufacturer,yearBuilt,appGeneratedID,createdAt,updatedAt,deletedAt',
				synced: 0,
				items: []
			}
		}
	},
	mutations: {
		setOnline (state) {
			state.online = navigator.onLine;
		},
		setImportStatus (state, status) {
			state.importStatus = status;
		},
		currentUser (state, user) {
			/* Map user keys to all upper case */
			let keys = Object.keys(user);
			let newUser = {};
			keys.forEach(function (key) {
				newUser[key.toUpperCase()] = user[key];
			});

			state.currentUser = newUser;
		},
		currentConnection (state, connection) {
			state.currentConnection = connection;
		},
		currentPage (state, page) {
			state.currentPage = page;
		},
		db (state, db) {
			let itemUpdates = [];
			/* Loop through each item returned from the API and check whether it already
			   exists in the locaal database. If the item does NOT exist it can be added immediately.
			   If the item DOES exist then store */
			db.items.forEach((item, itemIndex) => {
				let matchedItem = false;
				for (let [index, existingItem] of state.db[db.name].items.entries()) {
					if (db.name === 'answers' &&
						existingItem.inspectionid === item.inspectionid &&
						existingItem.questionid === item.questionid &&
						existingItem.categoryid === item.categoryid) {
						itemUpdates.push({
							index: index,
							item: item
						});
						matchedItem = true;
						break;
					}

					if (db.name === 'photos' &&
						existingItem.inspectionid === item.inspectionid &&
						((existingItem.id && existingItem.id === item.id) || (existingItem.appGeneratedID && existingItem.appGeneratedID === item.appGeneratedID))
					) {
						itemUpdates.push({
							index: index,
							item: item
						});
						matchedItem = true;
						break;
					}

					if (db.name !== 'photos' && db.name !== 'answers') {
						if (existingItem.id === item.id) {
							itemUpdates.push({
								index: index,
								item: item
							});
							matchedItem = true;
							break;
						}
						if (existingItem.appGeneratedID && existingItem.appGeneratedID === item.appGeneratedID) {
							itemUpdates.push({
								index: index,
								item: item
							});
							matchedItem = true;
							break;
						}
					}
				}

				if (matchedItem) {
					// console.log(`Updating existing item for ${db.name} - item id is ${item.id}`);
				} else {
					// console.log(`Adding new item for ${db.name} - item id is ${item.id}`);
					state.db[db.name].items.push(item);
				}
			});

			// console.log(`Updating ${itemUpdates.length} item(s) for ${db.name} `);
			itemUpdates.forEach((updatedItem) => {
				// console.log(updatedItem);
				state.db[db.name].items[updatedItem.index] = updatedItem.item;
			});

			// state.db[db.name].synced = parseInt(moment.utc().format('X'));
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		lastUpdate (state) {
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		lastSync (state) {
			state.lastCompletedSync = parseInt(moment.utc().format('X'));
		},
		dbSyncTime (state, db) {
			state.db[db.name].synced = parseInt(moment.utc().format('X'));
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));

			console.log(`Updating sync time for ${db.name} - ${state.db[db.name].synced}`);
		},
		addId (state, opts) {
			opts.item.id = opts.id;
		},
		addCreated (state, opts) {
			opts.item.created = opts.value;
		},
		answer (state, opts) {
			state.db.answers.items[opts.index].answer = opts.answer;
			state.db.answers.items[opts.index].comment = opts.comment;
			state.db.answers.items[opts.index].defectOutcome = opts.defectOutcome;
			state.db.answers.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.db.answers.items[opts.index].userid = state.currentUser.ID;
			state.db.inspections.items.forEach((inspection, index) => {
				if (inspection.id === opts.inspectionid) {
					state.db.inspections.items[index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				}
			});
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		photoInspectionId (state, opts) {
			opts.photo.inspectionid = opts.id;
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		answerInspectionId (state, opts) {
			opts.answer.inspectionid = opts.id;
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		inspectionAssetId (state, opts) {
			opts.inspection.assetid = opts.id;
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		updateVesselId (state, opts) {
			opts.item.vesselid = opts.id;
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		vessel (state, opts) {
			state.db.vessels.items[opts.index] = opts.value;
			state.db.vessels.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		photo (state, opts) {
			state.db.photos.items[opts.index] = opts.value;
			state.db.photos.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		inspectionUpdate (state, opts) {
			opts.inspection.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		transport (state, opts) {
			state.db.transports.items[opts.index] = opts.value;
			state.db.transports.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		meter (state, opts) {
			state.db.meters.items[opts.index] = opts.value;
			state.db.meters.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		hose (state, opts) {
			state.db.attachments.items[opts.index] = opts.value;
			state.db.attachments.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		assetAdmin (state, opts) {
			state.db.assets.items[opts.index] = opts.value;
			state.db.assets.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		defect (state, opts) {
			state.db.answers.items[opts.index].defectOutcome = opts.defectOutcome.defectOutcome;
			state.db.answers.items[opts.index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			state.db.answers.items[opts.index].userid = state.currentUser.ID;
			state.db.inspections.items.forEach((inspection, index) => {
				if (inspection.id === opts.inspectionid) {
					state.db.inspections.items[index].updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
				}
			});
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		inspection (state, opts) {
			const createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			opts.createdAt = createdAt;
			opts.userid = state.currentUser.ID;
			opts.appGeneratedID = Utils.uid();
			opts.companyLocationID = opts.locationid;
			opts.id = opts.appGeneratedID;
			const inspectionsLength = state.db.inspections.items.push(opts);
			opts.answers.forEach((answer) => {
				answer.inspectionid = opts.appGeneratedID;
				answer.createdAt = createdAt;
				state.db.answers.items.push(answer);
			});
			delete state.db.inspections.items[inspectionsLength - 1].answers;
			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		},
		asset (state, opts) {
			const createdAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			let attachments = [];
			let meters = [];
			let transports = [];
			let vessels = [];
			if (opts.hasOwnProperty('attachments')) {
				attachments = opts.attachments;
				delete opts.attachments;
				attachments.forEach((attachment) => {
					if (attachment.id === attachment.appGeneratedID) {
						attachment.createdAt = createdAt;
					} else {
						attachment.updatedAt = createdAt;
					}
				});
			}
			if (opts.hasOwnProperty('transports')) {
				transports = opts.transports;
				delete opts.transports;
				transports.forEach((transport) => {
					if (transport.id === transport.appGeneratedID) {
						transport.createdAt = createdAt;
					} else {
						transport.updatedAt = createdAt;
					}
				});
			}
			if (opts.hasOwnProperty('vessels')) {
				vessels = opts.vessels;
				delete opts.vessels;
				vessels.forEach((vessel) => {
					if (vessel.id === vessel.appGeneratedID) {
						vessel.createdAt = createdAt;
					} else {
						vessel.updatedAt = createdAt;
					}
					if (vessel.hasOwnProperty('meters')) {
						meters = vessel.meters;
						delete vessel.meters;
						meters.forEach((meter) => {
							if (meter.id === meter.appGeneratedID) {
								meter.createdAt = createdAt;
							} else {
								meter.updatedAt = createdAt;
							}
						});
					}
				});
			}
			let foundAsset = false;
			state.db.assets.items.forEach((asset, index) => {
				if (asset.id === opts.id) {
					opts.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
					state.db.assets.items[index] = opts;
					foundAsset = true;
				}
			});
			if (!foundAsset) {
				state.db.assets.items.push(opts);
			}
			attachments.forEach((attachment) => {
				let foundAttachment = false;
				state.db.attachments.items.forEach((attachmentStored, index) => {
					if (attachmentStored.id === attachment.id) {
						attachment.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
						state.db.attachments.items[index] = attachment;
						foundAttachment = true;
					}
				});
				if (!foundAttachment) {
					state.db.attachments.items.push(attachment);
				}
			});
			transports.forEach((transport) => {
				let foundTransport = false;
				state.db.transports.items.forEach((transportStored, index) => {
					if (transportStored.id === transport.id) {
						transport.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
						state.db.transports.items[index] = transport;
						foundTransport = true;
					}
				});
				if (!foundTransport) {
					state.db.transports.items.push(transport);
				}
			});
			vessels.forEach((vessel) => {
				let foundVessel = false;
				state.db.vessels.items.forEach((vesselStored, index) => {
					if (vesselStored.id === vessel.id) {
						vessel.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
						state.db.vessels.items[index] = vessel;
						foundVessel = true;
					}
				});
				if (!foundVessel) {
					state.db.vessels.items.push(vessel);
				}
			});
			meters.forEach((meter) => {
				let foundMeter = false;
				state.db.meters.items.forEach((meterStored, index) => {
					if (meterStored.id === meter.id) {
						meter.updatedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
						state.db.meters.items[index] = meter;
						foundMeter = true;
					}
				});
				if (!foundMeter) {
					state.db.meters.items.push(meter);
				}
			});

			state.lastLocalUpdate = parseInt(moment.utc().format('X'));
		}
	},
	actions: {
		logout ({state}, db) {
			state.currentUser = {
				COMPANYID: '',
				EMAIL: '',
				FIRSTNAME: '',
				ID: '',
				LASTNAME: '',
				PHONE: '',
				PHONEEXT: '',
				ROLEID: ''
			};

			state.currentConnection = {
				EXPIRESAT: 0,
				ID: ''
			};
		},
		createLocalStorage ({state}) {
			return window.pdb.put({
				_id: 'oatsdb',
				state: state
			});
		},
		persist ({state}) {
			let persist = Utils.throttle(function (state) {
				window.pdb.get('oatsdb').then(function (doc) {
					return window.pdb.put({
						_id: 'oatsdb',
						_rev: doc._rev,
						state: state
					});
				}).then(function (response) {
					console.log(`local DB updated`);
					console.log(parseInt(moment.utc().format('X')));
				}).catch(function (err) {
					console.log(err);
				});
			}, 3000);

			persist(state);
		},
		fetchCount ({ getters, state }, opts) {
			/* All items except answers, questions  should be updated if the updatedAt timestamp
			   has been changed. Answers and questions use createdAt to preserve past question/answer state for
			   inspections.
			 */
			let queryType = 'updatedAt';
			if (opts.name !== 'answers' && opts.name !== 'questions') {
				queryType = 'updatedAt';
			}

			if (getters.isOnline && state.db[opts.name].synced < parseInt(moment.utc().format('X'))) {
				let querystring = [];
				if (!opts.querystring) {
					opts.querystring = {};
				}
				if (!opts.querystring.where) {
					opts.querystring.where = '';
				}
				Object.keys(opts.querystring).forEach((key) => {
					if (key === 'where') {
						if (opts.querystring[key]) {
							opts.querystring[key] += ` AND `;
						}
						let queryTime = moment.unix(state.db[opts.name].synced).utc().add(60 * 60 * 6, 'seconds').unix();
						opts.querystring[key] += `${queryType} > FROM_UNIXTIME(${queryTime})`;
					}
					querystring.push(`${key}=${opts.querystring[key]}`);
				});

				return Vue.axios.get(state.api.url + opts.name + (querystring.length > 0 ? `?${querystring.join('&')}` : ''));
			}
		},
		db ({ state }, db) {
			console.log(`Fetching page ${db.page} from ${db.name} limit of ${db.perPage}`);

			let orderType = 'updatedAt DESC';
			// eslint-disable-next-line
			return Vue.axios.get(state.api.url + db.name, {
				params: {
					// connectionid: state.currentConnection.ID,
					select: state.db[db.name].fields,
					page: db.page,
					perPage: db.perPage,
					order: orderType
				}
			})
			.catch(function (error) {
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
				console.log(error);
			});
		},
		/**
		 * Update an existing item via the API.
		 * @param getters
		 * @param state
		 * @param params
		 * @returns {Promise}
		 */
		updateItem ({getters, state}, params) {
			return new Promise((resolve, reject) => {
				/* params.payload._method = 'PUT' */
				let request = params.payload;
				// request.connectionid = state.currentConnection.ID;

				/* Photos can not be updated, only created */
				if (params.name === 'photos') {
					resolve({});
					return;
				}

				/* If we are not online, store the object so it can be synced later */
				if (!getters.isOnline) {
					Events.$emit(`${params.name}:updatedSync`, params);
					resolve({});
					return;
				}

				Vue.axios.put(`${state.api.url}${params.name}/${params.key}`, request)
					.then((response) => {
						setTimeout(function () {
							Events.$emit(`${params.name}:updated`, params);
						}, 100);

						resolve(response);
					})
					.catch((error) => {
						window._oatsVue.$root.logError('apiError', 'error', error.response.status,
							/* Error data */
							{
								message: error.response.statusText,
								details: 'Api error during updateItem function in index.js'
							},
							/* Meta data */
							{
								url: error.config.url,
								itemType: params.name,
								itemKey: params.key
							}
						);
						if (error.response) {
							switch (parseInt(error.response.status, 10)) {
								case 401:
									Events.$emit(`${params.name}:error`, params, 'Your session has expired, please login.');
									break;
								case 400:
									Events.$emit(`${params.name}:error`, params, 'Please make sure you have entered all the required fields.');
									break;
								default:
									Events.$emit(`${params.name}:error`, params, 'An unknown error has occurred.');
									break;
							}
						}

						resolve(error);
					});
			});
		},
		/**
		 * Add a new item via the API
		 * @param getters
		 * @param state
		 * @param commit
		 * @param params
		 * @returns {Promise}
		 */
		putItem ({getters, state, commit}, params) {
			return new Promise((resolve, reject) => {
				let itemKey = params.name.substr(0, params.name.length - 1);

				/* Assign a new app ID if the item does not have one */
				if (!params.payload[itemKey].appGeneratedID) {
					params.payload[itemKey].appGeneratedID = Utils.uid();
				}

				/* Photos need the actual inspection id before they can be saved */
				if (params.name === 'photos' && params.payload.photo.inspectionid.length === 36) {
					params.payload[itemKey].created = false;
					commit('db', {
						name: params.name,
						items: [params.payload[itemKey]]
					});
					commit('lastUpdate');
					resolve({});
					return;
				}

				/* If we are not online, store the object so it can be synced later */
				if (!getters.isOnline) {
					if (!params.payload[itemKey].id) {
						params.payload[itemKey].id = params.payload[itemKey].appGeneratedID;
					}

					Events.$emit(`${params.name}:createdSync`, params);
					params.payload[itemKey].created = false;
					commit('db', {
						name: params.name,
						items: [params.payload[itemKey]]
					});
					// state.db[params.name].items.push(params.payload[itemKey]);
					commit('lastUpdate');
					resolve({});
					return;
				}

				/* Don't post item if the vessel or asset id is an app generated ID and has not been updated yet */
				if (params.payload[itemKey].vesselid && params.payload[itemKey].vesselid.toString().length === 36) {
					resolve({});
					return;
				}

				if (params.payload[itemKey].assetid && params.payload[itemKey].assetid.toString().length === 36) {
					resolve({});
					return;
				}

				/* Dont post item if inspectionid has not been updated yet */
				if (params.name === 'answers' && params.payload[itemKey].inspectionid && params.payload[itemKey].inspectionid.toString().length === 36) {
					resolve({});
					return;
				}

				/* If the item already has an ID that is not app generated, it should not be posted again */
				if (params.payload[itemKey].id && params.payload[itemKey].id.toString().length !== 36) {
					console.log('Not posting item that already has an ID.');
					resolve({});
					return;
				}

				let request = params.payload;

				/* Photos need inspection id or asset id in the root of the request */
				if (params.name === 'photos') {
					request.inspectionid = request.photo.inspectionid;
					request.assetid = request.photo.assetid;
				}

				// console.log(`performing POST for ${params.name} with ID of ${params.payload[itemKey].id}`);

				params.payload[itemKey].id = null;
				Vue.axios.post(state.api.url + params.name, request)
					.then((response) => {
						params.payload[itemKey].id = response.data.DATA.ID;
						params.payload[itemKey].created = true;
						params.payload[itemKey].inQueue = false;

						commit('db', {
							name: params.name,
							items: [params.payload[itemKey]]
						});

						setTimeout(function () {
							Events.$emit(`${params.name}:created`, params);
						}, 100);

						resolve(response);
					})
					.catch((error) => {
						window._oatsVue.$root.logError('apiError', 'error', error.response.status,
							/* Error data */
							{
								message: error.response.statusText,
								details: 'API error during putItem function in index.js'
							},
							/* Meta data */
							{
								url: error.config.url,
								itemType: params.name,
								itemId: params.payload[itemKey].id,
								itemAppId: params.payload[itemKey].appGeneratedID
							}
						);

						params.payload[itemKey].id = null;
						if (error.response) {
							switch (parseInt(error.response.status, 10)) {
								case 401:
									Events.$emit(`${params.name}:error`, params, 'Your session has expired, please login.');
									break;
								case 400:
									Events.$emit(`${params.name}:error`, params, 'Please make sure you have entered all the required fields.');
									break;
								default:
									Events.$emit(`${params.name}:error`, params, 'An unknown error has occurred.');
									break;
							}
						}

						resolve(error);
					});
			});
		},
		fetchItems ({ state }, opts) {
			return new Promise((resolve, reject) => {
				let returned = [];
				if (opts.hasOwnProperty('lookup')) {
					if (!Array.isArray(opts.value)) {
						opts.value = [opts.value];
					}
					state.db[opts.name].items.forEach((item) => {
						if (opts.value.includes(item[opts.lookup])) {
							if (opts.field === '*') {
								returned.push(item);
							} else {
								returned.push(item[opts.field]);
							}
						} else if (opts.value.toString().length === 36 && opts.value.includes(item.appGeneratedID)) {
							if (opts.field === '*') {
								returned.push(item);
							} else {
								returned.push(item[opts.field]);
							}
						}
					});
				} else {
					returned = state.db[opts.name].items;
				}
				resolve(returned);
			});
		},
		fetchItem ({ state }, opts) {
			return new Promise((resolve, reject) => {
				let returned = null;
				state.db[opts.type].items.forEach((item) => {
					// console.log(item);
					/* Match either the look up field or app generated iD */
					if ((item[opts.lookup] === opts.value) || (opts.lookup === 'id' && opts.value.toString().length === 36 && item.appGeneratedID === opts.value)) {
						if (opts.field === '*') {
							returned = item;
						} else {
							returned = item[opts.field];
						}
					}
				});
				resolve(returned);
			});
		},
		/**
		 * Remove an item from the local store
		 * @param state
		 * @param commit
		 * @param opts
		 */
		removeItem ({state, commit}, opts) {
			let dbName = `${opts.objectName.toLowerCase()}s`;
			if (dbName === 'companys') {
				dbName = 'companies';
			}

			console.log(`Removing item from DB (${dbName}) `);
			console.log(opts);
			switch (opts.objectName) {
				case 'ANSWER':
					// inspectionId, categoryId, questionId
					let answerIds = opts.objectID.split(',');
					let inspectionId = answerIds[0];
					let categoryId = parseInt(answerIds[1]);
					let questionId = parseInt(answerIds[2]);
					for (let [index, item] of state.db[dbName].items.entries()) {
						if (inspectionId === item.inspectionid &&
							questionId === item.questionid &&
							categoryId === item.categoryid) {
							console.log(opts);
							console.log(`Found matching answer to delete. ${item.id} - ${index}`);

							/* Delete the matching enser */
							state.db.answers.items.splice(index, 1);
							break;
						}
					}
					break;
				default:
					for (let [index, item] of state.db[dbName].items.entries()) {
						if (item.id === opts.objectID) {
							console.log(`Found matching item to delete. ${item.id}  - ${index}`);
							state.db[dbName].items.splice(index, 1);
							break;
						}
					}
					break;
			}
		},
		/**
		 * Reset an item in the local store.
		 * @param state
		 * @param commit
		 * @param opts
		 */
		resetItem ({state, commit}, opts) {
			let dbName = `${opts.objectName.toLowerCase()}s`;
			if (dbName === 'companys') {
				dbName = 'companies';
			}
			console.log(`Resetting item in DB (${dbName}) `);
			console.log(opts);

			switch (opts.objectName) {
				case 'ANSWER':
					// inspectionId, categoryId, questionId
					let answerIds = opts.objectID.split(',');
					console.log(answerIds);
					let inspectionId = parseInt(answerIds[0]);
					let categoryId = parseInt(answerIds[1]);
					let questionId = parseInt(answerIds[2]);

					for (let [index, item] of state.db[dbName].items.entries()) {
						/* Break early if we can */
						if (inspectionId !== item.inspectionid) {
							continue;
						}
						// console.log(`checking ${inspectionId} vs. ${item.inspectionid} and ${categoryId} vs ${item.categoryid} and ${questionId} and vs ${item.questionid}`);
						if (inspectionId === item.inspectionid &&
							questionId === item.questionid &&
							categoryId === item.categoryid) {
							// console.log(opts);
							console.log(`Found matching answer to reset. ${item.id}  - ${index}`);

							/* Reset the matching answer */
							item.answer = '';
							item.comment = '';
							item.defectOutcome = '';
							state.db[dbName].items[index] = item;

							break;
						}
					}
					break;
				default:
					let skipFields = [
						'createdAt',
						'updatedAt',
						'id',
						'appGeneratedID',
						'inspectionid',
						'questionid',
						'vesselid',
						'assetid',
						'categoryid',
						'locationid',
						'companyLocationID',
						'companyid'
					];

					for (let [index, item] of state.db[dbName].items.entries()) {
						if (item.id === opts.objectID) {
							console.log(opts);
							console.log(`Found matching item to reset. ${item.id}  - ${index}`);

							/* Reset all the item fields, except for the fields that we want to skip, namely relation ids */
							let itemFields = state.db[dbName].fields.split(',');
							itemFields.forEach((field) => {
								if (!skipFields.includes(field)) {
									item[field] = null;
								}
							});
							break;
						}
					}
					break;
			}
		},
		removePhoto ({ state, commit }, opts) {
			state.db.photos.items.forEach((photo, index) => {
				if (photo.appGeneratedID === opts.appGeneratedID) {
					console.log(`removing photo ${photo.appGeneratedID}`);
					state.db.photos.items.splice(index, 1);
				}
			});
		},
		answer ({ state, commit }, opts) {
			state.db.answers.items.forEach((answer, index) => {
				if (answer.questionid === opts.questionId && answer.inspectionid === opts.inspectionId) {
					commit('answer', {
						index,
						answer: opts.answer.answer,
						comment: opts.answer.comment,
						defectOutcome: opts.answer.defectOutcome,
						inspectionid: answer.inspectionid
					});
				}
			});
		},
		comment ({ state, commit }, opts) {
			state.db.answers.items.forEach((answer, index) => {
				if (answer.questionid === parseInt(opts.questionId) && answer.inspectionid === parseInt(opts.inspectionId)) {
					commit('answer', {
						index,
						answer: answer.answer,
						comment: opts.comment,
						defectOutcome: answer.defectOutcome,
						inspectionid: answer.inspectionid
					});
				}
			});
		},
		asset ({state, commit}, opts) {
			state.db.vessels.items.forEach((asset, index) => {
				if (asset.id === opts.id) {
					commit('asset', {
						index,
						value: opts.value
					});
				}
			});
		},
		assetAdmin ({state, commit}, opts) {
			state.db.assets.items.forEach((asset, index) => {
				if (asset.id === opts.id) {
					commit('assetAdmin', {
						index,
						value: opts.value
					});
				}
			});
		},
		vessel ({state, commit}, opts) {
			state.db.vessels.items.forEach((vessel, index) => {
				if (vessel.id === opts.id) {
					commit('vessel', {
						index,
						value: opts.value
					});
				}
			});
		},
		photo ({state, commit}, opts) {
			state.db.photos.items.forEach((photo, index) => {
				if (photo.id === opts.id) {
					commit('photo', {
						index,
						value: opts.value
					});
				}
			});
		},
		transport ({state, commit}, opts) {
			state.db.transports.items.forEach((transport, index) => {
				if (transport.id === opts.id) {
					commit('transport', {
						index,
						value: opts.value
					});
				}
			});
		},
		meter ({state, commit}, opts) {
			state.db.meters.items.forEach((meter, index) => {
				if (meter.id === opts.id) {
					commit('meter', {
						index,
						value: opts.value
					});
				}
			});
		},
		hose ({state, commit}, opts) {
			state.db.attachments.items.forEach((hose, index) => {
				if (hose.id === opts.id) {
					commit('hose', {
						index,
						value: opts.value
					});
				}
			});
		},
		defect ({ state, commit }, opts) {
			state.db.answers.items.forEach((answer, index) => {
				if (answer.questionid === parseInt(opts.questionId) && answer.inspectionid === parseInt(opts.inspectionId)) {
					commit('defect', {
						index,
						defectOutcome: opts.value,
						inspectionid: answer.inspectionid
					});
				}
			});
		}
	},
	getters: {
		state: (state) => {
			return state;
		},
		importStatus: (state) => {
			return state.importStatus;
		},
		isOnline: (state) => {
			// return false;
			return state.online;
		},
		lastUpdate: (state) => {
			return state.lastLocalUpdate;
		},
		lastSync: (state) => {
			return state.lastCompletedSync;
		},
		currentUser: (state) => {
			return state.currentUser;
		},
		currentConnection: (state) => {
			return state.currentConnection;
		},
		currentPage: (state) => {
			return state.currentPage;
		},
		api: (state) => {
			return state.api;
		},
		dbNames: (state) => {
			return Object.keys(state.db);
		},
		attachmentFields: (state) => {
			return state.db.attachments.fields.split(',');
		},
		assetFields: (state) => {
			return state.db.assets.fields.split(',');
		},
		meterFields: (state) => {
			return state.db.meters.fields.split(',');
		},
		transportFields: (state) => {
			return state.db.transports.fields.split(',');
		},
		vesselFields: (state) => {
			return state.db.vessels.fields.split(',');
		},
		answers: (state) => {
			return state.db.answers;
		},
		assets: (state) => {
			return state.db.assets;
		},
		attachments: (state) => {
			return state.db.attachments;
		},
		vessels: (state) => {
			return state.db.vessels;
		},
		photos: (state) => {
			return state.db.photos;
		},
		hoses: (state) => {
			return state.db.attachments;
		},
		companies: (state) => {
			return state.db.companies;
		},
		locations: (state) => {
			return state.db.locations;
		},
		meters: (state) => {
			return state.db.meters;
		},
		transports: (state) => {
			return state.db.transports;
		},
		inspections: (state) => {
			return state.db.inspections;
		},
		users: (state) => {
			return state.db.users;
		},
		fetchItem: (state) => (opts) => {
			let returned = null;
			state.db[opts.type].items.forEach((item) => {
				if (item[opts.lookup] === opts.value) {
					if (opts.field === '*') {
						returned = item;
					} else {
						returned = item[opts.field];
					}
				}
			});

			return returned;
		}
	}
});
