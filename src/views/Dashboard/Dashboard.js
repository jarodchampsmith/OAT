import Fab from '../../components/Fab/Fab.vue';
import {Events} from 'quasar';

export default {
	name: 'dashboard',
	data () {
		return {
			jobs: [],
			inspections: [],
			companyNames: {},
			locationNames: {},
			assetNames: {},
			answers: {},
			answerCount: {},
			answered: {}
		};
	},
	components: {
		'fab': Fab
	},
	computed: {
		uniqueInspections: function () {
			let uniqueInspections = {
				ids: [],
				appIds: []
			}

			let filtered = this.inspections.filter((inspection, index) => {
				let idExists = uniqueInspections.appIds.includes(inspection.id);
				let appIdExists = uniqueInspections.appIds.includes(inspection.appGeneratedID);
				uniqueInspections.ids.push(inspection.id);
				uniqueInspections.appIds.push(inspection.appGeneratedID);
				if (idExists || appIdExists) {
					return false;
				}
				return true;
			});

			return filtered;
		},
		uniqueJobs: function () {
			let uniqueJobs = [];
			let filtered = this.jobs.filter((job, index) => {
				let idExists = uniqueJobs.includes(job.id);
				uniqueJobs.push(job.id);
				if (idExists) {
					return false;
				}
				return true;
			});

			return filtered;
		},
	},
	created: function () {
		Events.$on('sync:complete', () => {
			this.$forceUpdate();
		});

		setTimeout(() => {
			this.$forceUpdate();
		},4000);

		this.$store.dispatch('fetchItems', {
			name: 'jobs'
		}).then((jobs) => {
			this.jobs = jobs;
		});
		this.$store.dispatch('fetchItems', {
			name: 'inspections'
		}).then((inspections) => {
			this.inspections = inspections;
			this.inspections = this.inspections.sort(function (a, b) {
				if (a.id < b.id) {
					return -1;
				}

				if (a.id > b.id) {
					return 1;
				}

				return 0;
			});
			inspections.forEach((inspection) => {
				this.$store.dispatch('fetchItem', {
					type: 'assets',
					lookup: 'id',
					value: inspection.assetid,
					field: 'name'
				}).then((asset) => {
					this.$set(this.assetNames, inspection.assetid, asset);
					this.$store.dispatch('fetchItems', {
						name: 'answers',
						lookup: 'inspectionid',
						value: inspection.id,
						field: '*'
					}).then((answers) => {
						let answerIds = [];
						answers = answers.filter(function(answer) {
							let exists = !answerIds.includes(answer.questionid);
							answerIds.push(answer.questionid);
							return exists;
						})
						this.$set(this.answers, inspection.id, answers);
						this.$set(this.answerCount, inspection.id, answers.length);
						let answered = 0;
						answers.forEach((answer) => {
							if (answer.answer && (answer.answer.content || answer.answer.signatures)) {
								answered += 1;
							}
						});
						this.$set(this.answered, inspection.id, answered);
					});
				});
			});
			this.$store.dispatch('fetchItems', {
				name: 'companies'
			}).then((companies) => {
				companies.forEach((company) => {
					this.$set(this.companyNames, company.id, company.name);
				});
			});
			this.$store.dispatch('fetchItems', {
				name: 'locations'
			}).then((locations) => {
				locations.forEach((location) => {
					this.$set(this.locationNames, location.id, location.name);
				});
			});
		});
	},
	methods: {
		goInspection (id) {
			this.$router.push({
				name: 'inspection',
				params: {
					id
				}
			});
		},
		goHosesInspection(jobId) {
			this.$router.push({
				name: 'hoseInspections',
				params: {jobid: jobId}
			});
		},
		addInspection (jobid) {
			this.$router.push({
				name: 'addinspection',
				params: {
					jobid
				}
			});
		}
	}
};
