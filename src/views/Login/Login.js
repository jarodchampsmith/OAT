import { Loading, Toast, Events } from 'quasar';
import { required, email } from 'vuelidate/lib/validators';
import { sha512 } from 'js-sha512';
import moment from 'moment';

export default {
	name: 'login',
	data () {
		return {
			form: {
				email: '',
				password: ''
			}
		};
	},
	beforeCreate () {
		if (this.$store.getters.currentUser.ID) {
			this.$router.push({ name: 'dashboard' });
		}


		/* Import Local DB */
		let vm = this;
		window.pdb.get('oatsdb').then(function (doc) {
			vm.$store.replaceState(doc.state);
			vm.$store.commit('lastUpdate');
			console.log('db already seeded');
		}).catch(function (error) {
			/* No document yet, seed database and create local storage db */
			if (error.status === 404) {
				Loading.show();

				let seedPath = `statics/seed.json`;
				if (vm.$store.getters.api.env === 'production') {
					seedPath = `statics/production-seed.json`;
				}

				console.log(`loading seed database ${seedPath}`);
				setTimeout(() => {
					vm.axios.get(seedPath).then((response) => {

						vm.$store.replaceState(response.data);
						console.log('seed database loaded');
						vm.$store.dispatch('createLocalStorage');
						setTimeout(function () {
							vm.$store.commit('lastUpdate');
							vm.$store.commit('setOnline');
							vm.$store.commit('setImportStatus', 'firstImport');
							Loading.hide();
							Toast.create.positive({
								html: `Initial import complete, you can now login.`,
								timeout: 2000
							});
						}, 500);
					}).catch((error) => {
						Loading.hide();
						Toast.create.negative({
							html: `There was an error importing the initial asset database, please try again.`,
							timeout: 3000
						});
						console.log('error loading seed database');
						console.log(error);
					});
				},1000);

				return;
			}

			Events.$emit('sync:error');
			Toast.create.negative({
				html: `There was an error syncing the application, you may need to connect to the internet and perform a sync.`,
				timeout: 3000
			});

		});

	},
	computed: {
		forgotPasswordLink: function () {
			return this.$store.getters.api.forgotPassword;
		}
	},
	validations: {
		form: {
			email: {
				required, email
			},
			password: { required }
		}
	},
	methods: {
		fireLogin ($event = null) {
			if ($event) {
				this.$v.form.$touch();
				if (this.$v.form.$error) {
					const items = [];
					if (!this.$v.form.email.required || !this.$v.form.email.email) {
						items.push('email address');
					}
					if (!this.$v.form.password.required) {
						items.push('password');
					}
					Toast.create.warning(`Please enter a valid ${items.join(' and ')}.`);
					return null;
				}
				Loading.show();

				/* Attempt offline login */
				if (!this.$store.getters.isOnline) {
					let vm = this;

					/* Can't login if the DB has never been synced */
					if (this.$store.getters.users.items.length === 0) {
						Toast.create.negative({
							html: 'Unable to login. You are currently offline and you have not synced with the OATS website. Please connect to the internet to login.',
							timeout: 5000
							});
						Loading.hide();
						vm.$router.push({name: 'login'});
						return null;
					}

					/* For security dissallow logins if DB has not been synced in past 5 days */
					if (this.$store.getters.lastSync < (parseInt(moment.utc().format('X')) - (60 * 60 * 24 * 5))) {
						Toast.create.negative({
							html: 'Unable to login. You last synced with the database more then 5 days ago. For security reasons you need to connect to the internet before you can login.',
							timeout: 5000
						});
						Loading.hide();
						vm.$router.push({name: 'login'});
						return null;
					}

					/* Validate against existing users */
					let users = this.$store.getters.users.items;
					users.forEach(function(user) {
						if (user.email.trim().toLowerCase() !== vm.form.email.trim().toLowerCase()) {
							return;
						}

						/* Check the password using the users salt */
						let pass = vm.form.password.trim() + user.passwordSalt;
						if (sha512(pass) !== user.encryptedPassword.toLowerCase()) {
							console.log(sha512(pass));
							console.log(user.encryptedPassword);
							Loading.hide();
							Toast.create.negative('Incorrect email or password');
							vm.$router.push({name: 'login'});
							return;
						}

						/* Offline login was successful */
						vm.$store.commit('currentUser', user);
						Loading.hide();
						Toast.create.positive({
							html: `Welcome ${vm.$store.getters.currentUser.FIRSTNAME} ${vm.$store.getters.currentUser.LASTNAME}`,
							timeout: 1500
						});
						vm.$router.push({name: 'sync'});
					});

					return null;
				}

				this.axios.post(`${this.$store.state.api.url}users/login`, {
					email: this.form.email,
					password: this.form.password,
					hardwareID: this.$store.state.hardwareID
				}).then((response) => {
					this.$store.commit('currentConnection', response.data.DATA.CONNECTION);
					this.$store.commit('currentUser', response.data.DATA.USER);
					this.axios.defaults.params = {
						connectionid: response.data.DATA.CONNECTION.ID
					};
					Loading.hide();
					Toast.create.positive({
						html: `Welcome ${this.$store.getters.currentUser.FIRSTNAME} ${this.$store.getters.currentUser.LASTNAME}`,
						timeout: 1500
					});
					this.$router.push({ name: 'sync' });
				}).catch((error) => {
					Loading.hide();
					console.log(error);
					if (error.response) {
						switch (parseInt(error.response.status, 10)) {
							case 401:
								Toast.create.negative('Incorrect email or password');
								break;
							default:
								Toast.create.negative('An error has occurred');
								break;
						}
					} else {
						Toast.create.negative('The OATS website could not be reached.');
					}
				});
			}
		}
	}
};
