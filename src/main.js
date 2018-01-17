import Vue from 'vue';
import Quasar from 'quasar'; // eslint-disable-line
import Vuelidate from 'vuelidate';
import router from './router';
import store from './store/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import PouchDB from 'pouchdb';
import App from './App.vue';
import * as filters from './filters';
import {Events, Toast} from 'quasar'; // eslint-disable-line
import qs from 'qs';
import {sha256} from 'js-sha256';

require(`quasar/dist/quasar.${__THEME}.css`);
// require('./themes/app.' + __THEME + '.styl');

/* Auto compaction will delete each stale revision after each write */
window.pdb = new PouchDB('oatsdb', {auto_compaction: true});

Vue.use(Quasar);
Vue.use(Vuelidate);
Vue.use(VueAxios, axios);

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]);
});

Quasar.start(() => {
	/* eslint-disable no-new */
	window._oatsVue = new Vue({
		el: '#q-app',
		router,
		store,

		data: {
			syncComplete: false,
			// impellerPrivateKey: '2f7ac531-6869-4f1c-bfdd-24b57a7c448d',
			// impellerPublicKey: '28d2bc3e-668b-4b5a-bbc2-ddaad44086f4',
			impellerPrivateKey: 'd52f3a29-cf99-4d8e-ba58-6f1c51048e02',
			impellerPublicKey: '0e0128a3-90e2-4507-b8f0-47737270924c',
			impellerUrl: 'http://impeller.intoria.com/api/1/entry'
		},
		render: (h) => {
			Vue.axios.defaults.headers.common = {
				'X-Requested-With': 'XMLHttpRequest',
				'X-Requested-By': 'OATS'
			};
			Vue.axios.defaults.params = {};

			/* Add interceptor for expired sessions */
			Vue.axios.interceptors.response.use(function (response) {
				return response;
			}, function (error) {
				console.log(error);
				if (parseInt(error.response.status, 10) === 401) {
					router.push({
						name: 'logout'
					});
				}
				return Promise.reject(error);
			});

			return h(App);
		},
		created: function () {
			let vm = this;
			this.$store.commit('setOnline');
			window.addEventListener('online', () => {
				this.$store.commit('setOnline');
			});
			window.addEventListener('offline', () => {
				this.$store.commit('setOnline');
			});

			/* Subscibe to all state changes to update local db */
			Events.$on('sync:complete', function (event) {
				vm.$store.dispatch('persist');

				/* Once a sync has been completed add a watcher to persist any local changes to the local DB */
				if (!vm.syncComplete) {
					setInterval(function () {
						vm.$store.dispatch('persist');
					}, 60000);
				}
				vm.syncComplete = true;
			});
		},

		methods: {
			/**
			 * Send an error report to Impeller service.
			 * @param name
			 * @param code
			 * @param payload
			 * @param meta
			 */
			logError: function (name, level, code, payload, meta) {
				let errorMeta = meta !== undefined ? meta : {};
				let errorLevel = level !== undefined ? level : 'debug';
				errorMeta.userId = this.$store.getters.currentUser.ID;

				if (errorMeta.itemType === 'answers') {
					console.log('Not reporting error for answers.');
					return;
				}

				/* Assign an item id if there is none as null values will result in an invalid hash */
				if (!errorMeta.itemId) {
					errorMeta.itemId = 'N/A';
				}

				/* The order of the error fields is important for the hash to pass */
				let errorReport = {
					code: code,
					filename: 'main.js',
					format: 'json',
					key: this.impellerPublicKey,
					line: 0,
					meta: errorMeta,
					name: name !== undefined ? name : 'genericError',
					payload: payload !== undefined ? payload : {message: 'No message available'},
					payload_format: 'json',
					referrer: '/',
					remote_ip: 'localhost',
					request_uri: '/',
					severity: errorLevel,
					user_agent: 'OATS V1.0'
				};

				let params = errorReport;
				let hash = sha256(JSON.stringify(errorReport) + this.impellerPrivateKey);
				params._hash = hash;

				/**
				 * qs.stringify is used to form encode the params
				 */
				Vue.axios.post(this.impellerUrl, qs.stringify(errorReport))
					.then((response) => {
						// console.log(response);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	});
});
