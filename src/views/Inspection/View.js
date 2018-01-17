import { Events, Utils, Toast } from 'quasar';

import moment from 'moment';
import Fab from '../../components/Fab/Fab.vue';
import Asset from '../../components/Asset/Asset.vue';
import AddPhotos from '../../components/AddPhotos/AddPhotos.vue';
import * as Field from '../../components/Field';
import {required} from 'vuelidate/lib/validators';

export default {
	name: 'inspection',
	components: {
		'asset': Asset,
		'add-photos': AddPhotos,
		'fab': Fab,
		'mf-area': Field.Area,
		'mf-default': Field.Default,
		'mf-defect': Field.Defect,
		'mf-fulldate': Field.FullDate,
		'mf-gps': Field.GPS,
		'mf-length': Field.Length,
		'mf-monthyearonly': Field.MonthYearOnly,
		'mf-note': Field.Note,
		'mf-number': Field.Number,
		'mf-pressure': Field.Pressure,
		'mf-select': Field.Select,
		'mf-signature': Field.Signature,
		'mf-temperature': Field.Temperature,
		'mf-text': Field.Text,
		'mf-volume': Field.Volume,
		'mf-weight': Field.Weight,
		'mf-year': Field.Year,
		'mf-yesno': Field.YesNo,
		'mf-yesnona': Field.YesNoNA
	},
	data () {
		return {
			answered: 0,
			answeredCategories: {},
			answers: [],
			answerCount: 0,
			asset: {},
			assetTypes: {
				farm: 'Farm Wagon',
				highway: 'Highway Tanks',
				portable: 'Portable Tanks',
				LPG: 'LPG Storage Vessel',
				'NH3': 'NH3 Storage Vessel'
			},
			attachmentTestResults: [
				{
					label:  'Pass',
					value: 'pass'
				},
				{
					label:  'Fail',
					value: 'fail'
				},
			],
			attachments: [],
			categories: [],
			closeOutId: 0,
			company: {},
			current: {
				asset: {},
				assetId: null
			},
			currentTab: 'mf-info',
			inspection: {},
			inspector: {},
			job: {},
			location: {},
			meters: [],
			photos: [],
			numPhotos: 0,
			questions: {},
			allQuestions: [],
			transports: [],
			vessels: [],
			completeEventFired: false
		}
		;
	},
	computed: {
		uniquePhotos: function() {
			let uniquePhotos = [];
			 return this.photos.filter((photo, index) => {
			 	let exists = false;
			 	if (photo.appGeneratedID) {
					exists = !uniquePhotos.includes(photo.appGeneratedID);
					uniquePhotos.push(photo.appGeneratedID);
				} else {
					exists = !uniquePhotos.includes(photo.id);
					uniquePhotos.push(photo.id);
				}

				return exists;
			});
		}
	},
	created: function () {

		Events.$off('save:assetRelation');
		Events.$off('photos:saved');
		Events.$off('photos:allSaved');

		Events.$on('q:collapsible:close', (tab) => {
			this.currentTab = tab.$el.id;
		});

		Events.$on('sync:complete', () => {
			this.$forceUpdate();
		});

		Events.$on('save:assetRelation', () => {
			this.saveAsset(false);
		});

		Events.$on('photos:saved', (event, error) => {
			this.numPhotos++;
			this.$forceUpdate();
		});

		Events.$on('photos:allSaved', (event, error) => {
			if (!this.$store.getters.isOnline) {
				Toast.create.positive("You are in offline mode. Photos will be added during the next online sync.");
			}
			this.$store.commit('inspectionUpdate', {
				inspection: this.inspection,
			});
			this.$store.dispatch('fetchItems', {
				name: 'photos',
				lookup: 'inspectionid',
				value: this.inspection.id,
				field: '*'
			}).then((photos) => {
				this.$set(this, 'photos', photos);
				this.$set(this,'numPhotos', photos.length);
			});
			this.$forceUpdate();
		});

		Events.$on('photos:error', (event, error) => {
			console.log(event);
			console.log(error);
			Toast.create.negative(error)
		});

		Events.$on('photos:created',  (event) => {
			this.$store.dispatch('fetchItems', {
				name: 'photos',
				lookup: 'inspectionid',
				value: this.inspection.id,
				field: '*'
			}).then((photos) => {
				this.$set(this, 'photos', photos);
			});
		});

		Events.$on('photos:createdSync',  (event) => {
			this.$store.dispatch('fetchItems', {
				name: 'photos',
				lookup: 'inspectionid',
				value: this.inspection.id,
				field: '*'
			}).then((photos) => {
				this.$set(this, 'photos', photos);
			});
		});

		this.$store.dispatch('fetchItem', {
			type: 'inspections',
			lookup: 'id',
			value: this.$route.params.id,
			field: '*'
		}).then((inspection) => {
			this.$set(this, 'inspection', inspection);
			this.$store.dispatch('fetchItem', {
				type: 'jobs',
				lookup: 'id',
				value: inspection.jobid,
				field: '*'
			}).then((job) => {
				this.$set(this, 'job', job);
			});
			this.$store.dispatch('fetchItem', {
				type: 'users',
				lookup: 'id',
				value: inspection.userid,
				field: '*'
			}).then((inspector) => {
				this.$set(this, 'inspector', inspector);
			});
			this.$store.dispatch('fetchItem', {
				type: 'assets',
				lookup: 'id',
				value: inspection.assetid,
				field: '*'
			}).then((asset) => {
				this.$set(this, 'asset', asset);
				this.$store.dispatch('fetchItems', {
					name: 'attachments',
					lookup: 'assetid',
					value: asset.id,
					field: '*'
				}).then((attachments) => {
					this.$set(this, 'attachments', attachments);
				});
				this.$store.dispatch('fetchItems', {
					name: 'transports',
					lookup: 'assetid',
					value: asset.id,
					field: '*'
				}).then((transports) => {
					this.$set(this, 'transports', transports);
				});
				this.$store.dispatch('fetchItems', {
					name: 'vessels',
					lookup: 'assetid',
					value: asset.id,
					field: '*'
				}).then((vessels) => {
					this.$set(this, 'vessels', vessels);
					let vesselIds = new Set();
					vessels.forEach((vessel) => {
						vesselIds.add(vessel.id);
					});
					this.$store.dispatch('fetchItems', {
						name: 'meters',
						lookup: 'vesselid',
						value: [...vesselIds],
						field: '*'
					}).then((meters) => {
						this.$set(this, 'meters', meters);
					});
				});
			});

			this.$store.dispatch('fetchItems', {
				name: 'locations',
				lookup: 'id',
				value: inspection.locationid,
				field: '*'
			}).then((location) => {
				this.$set(this, 'location', location[0]);
			});
			this.$store.dispatch('fetchItems', {
				name: 'photos',
				lookup: 'inspectionid',
				value: inspection.id,
				field: '*'
			}).then((photos) => {
				this.$set(this, 'photos', photos);
				this.$set(this, 'numPhotos', this.photos.length);
			});
			this.$store.dispatch('fetchItem', {
				type: 'companies',
				lookup: 'id',
				value: inspection.companyid,
				field: '*'
			}).then((company) => {
				this.$set(this, 'company', company);
			});
			this.$store.dispatch('fetchItems', {
				name: 'answers',
				lookup: 'inspectionid',
				value: inspection.id,
				field: '*'
			}).then((answers) => {
				this.$set(this, 'answerCount', answers.length);
				let categoryIds = new Set();
				answers.forEach((answer) => {
					categoryIds.add(answer.categoryid);
				});
				this.$store.dispatch('fetchItems', {
					name: 'questions',
					lookup: 'categoryid',
					value: [...categoryIds],
					field: '*'
				}).then((questions) => {
					let questionList = {};
					questions.forEach((question) => {
						if (!questionList.hasOwnProperty(question.categoryid)) {
							questionList[question.categoryid] = [];
						}

						/* Only include questions that have an associated answer with a matching question id */
						let hasAnswer = answers.find(answer => (answer.questionid === question.id));
						if (!hasAnswer) {
							// console.log(`no matching answer for ${question.id}`)
							return;
						}

						questionList[question.categoryid].push(question);
						if (question.type === 'signature') {
							this.closeOutId = question.categoryid;
						}

						this.updateAnswered();
						this.$forceUpdate();

					});
					this.$set(this, 'questions', questionList);
					this.$store.dispatch('fetchItems', {
						name: 'categories',
						lookup: 'id',
						value: [...categoryIds],
						field: '*'
					}).then((categories) => {
						let categoryList = [];
						let closeOut = [];
						categories.forEach((category) => {
							if (category.id !== this.closeOutId) {
								categoryList.push(category);
							} else {
								closeOut.push(category);
							}
						});
						categoryList = [...[
							{
								id: 'mf-info',
								name: 'Inspection Info',
								tabName: '',
								type: 'all'
							}
						], ...categoryList, ...[
							{
								id: 'mf-notes',
								name: 'Notes',
								tabName: '',
								type: 'all'
							},
							{
								id: 'mf-photos',
								name: 'Photos',
								tabName: '',
								type: 'all'
							},
							{
								id: 'mf-defects',
								name: 'Defects',
								tabName: '',
								type: 'all'
							}
						]];
						if (closeOut.length) {
							categoryList.push(closeOut[0]);
						}
						this.$set(this, 'categories', categoryList);
					});
				});

				let answerList = {};
				answers.forEach((answer) => {
					answerList[answer.questionid] = answer;
				});

				this.$set(this, 'answers', answerList);
				this.updateAnswered();
			});
		});
	},
	methods: {
		click (tab) {
			this.currentTab = tab;
			this.$refs.categories.close();
		},
		toggleTab(tab) {
			if (this.currentTab === tab) {
				this.currentTab = null;
			} else {
				this.currentTab = tab;
			}
			this.$forceUpdate();
		},
		photoUrl (photo) {
			let connectionid = this.$store.getters.currentConnection.ID;
			let url = this.$store.getters.api.url;
			return `${url}photos/${photo.id}/get-thumbnail?connectionid=${connectionid}`;
		},
		addPhotos (category) {
			this.$refs.addPhotos.open(category);
		},
		removePhoto (appId, photoIndex) {
			this.$store.dispatch('removePhoto', {
				appGeneratedID: appId
			});
			this.photos.splice(photoIndex, 1);
			this.numPhotos--;
		},
		updateAnswered () {
			let answered = 0;
			let answeredCategories = {};
			this.$set(this, 'answerCount', Object.keys(this.answers).length);

			Object.keys(this.answers).forEach((key) => {
				if (this.answers[key].answer && (this.answers[key].answer.content || this.answers[key].answer.signatures)) {
					answered += 1;
					if (!answeredCategories.hasOwnProperty(this.answers[key].categoryid)) {
						answeredCategories[this.answers[key].categoryid] = 0;
					}
					answeredCategories[this.answers[key].categoryid] += 1;
				}
			});
			this.answered = answered;
			this.answeredCategories = answeredCategories;

			/* Fire inspection complete event when all questions have been answered */
			setTimeout(() => {
				if (this.answered === this.answerCount && this.answerCount !== 0 && !this.completeEventFired) {
					console.log('All answers complete');
					this.completeEventFired = true;
					this.inspection.completedLocally = true;
					Events.$emit('inspection:complete', this.inspection);
				}
			},1000);
		},
		openAsset: function (assetId) {
			this.$set(this.current, 'assetId', assetId);
			this.$set(this.current, 'asset', JSON.parse(JSON.stringify(this.asset)));
			this.$refs.assetModal.open();
		},
		openAttachment: function (assetId,attachment) {
			this.$set(this.current, 'assetId', assetId);
			this.$set(this.current, 'asset', JSON.parse(JSON.stringify(this.asset)));
			this.$refs.assetModal.open();
			setTimeout(() => {
				this.$refs.assetEditor.editAttachment(attachment)
			},800);
		},
		updateAttachmentTestResults(attachment) {
			if (attachment.lastTestResult === 'pass' || attachment.lastTestResult === 'fail') {
				attachment.testedAt = moment.utc().format('MMMM, DD YYYY HH:mm:ss');
			}

			/* Update the attachment right away if the id is not app generated */
			if (attachment.id.toString().length !== 36) {
				this.$store.dispatch('updateItem', {
					name: 'attachments',
					key: attachment.id,
					payload: {
						attachment: attachment
					}
				});
			}

			this.$forceUpdate();
		},
		cancelAsset: function () {
			this.$set(this.current, 'asset', {});
			this.$set(this.current, 'assetId', null);
			this.$refs.assetModal.close();
		},
		saveAsset: function (closeModal) {

			if (this.$refs.assetEditor && this.$refs.assetEditor.$v && this.$refs.assetEditor.$v.asset) {
				this.$refs.assetEditor.$v.asset.name.$touch();
				if (this.$refs.assetEditor.$v.asset.$error) {
					return;
				}
			}

			this.$set(this.current, 'assetId', this.current.asset.id);
			this.$set(this, 'asset', this.current.asset);

			if (closeModal !== false) {
				this.$refs.assetModal.close();
			}

			this.$store.commit('asset', this.current.asset);
			this.$store.dispatch('fetchItems', {
				name: 'vessels',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((vessels) => {
				this.$set(this, 'vessels', vessels);
				let vesselIds = new Set();
				vessels.forEach((vessel) => {
					vesselIds.add(vessel.id);
				});
				this.$store.dispatch('fetchItems', {
					name: 'meters',
					lookup: 'vesselid',
					value: [...vesselIds],
					field: '*'
				}).then((meters) => {
					this.$set(this, 'meters', meters);
				});
			});
			this.$store.dispatch('fetchItems', {
				name: 'attachments',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((attachments) => {
				this.$set(this, 'attachments', attachments);
			});
			this.$store.dispatch('fetchItems', {
				name: 'transports',
				lookup: 'assetid',
				value: this.asset.id,
				field: '*'
			}).then((transports) => {
				this.$set(this, 'transports', transports);
			});
		},
		update: Utils.throttle(function(answer) {
			this.$store.dispatch('answer', answer);
			this.updateAnswered();
		}, 300),
		updateComment (comment) {
			this.$store.dispatch('comment', {
				questionId: comment.questionid,
				inspectionId: comment.inspectionid,
				comment: comment.comment
			});
		},
		updateDefect (defectOutcome) {
			this.$store.dispatch('defect', {
				questionId: defectOutcome.questionId,
				inspectionId: defectOutcome.inspectionId,
				value: defectOutcome
			});
		}
	}
};
