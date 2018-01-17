import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/index';

Vue.use(VueRouter);

const view = (component) => () => System.import(`./views/${component}.vue`);

const router = new VueRouter({
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/debug',
			name: 'debug',
			component: view('Debug')
		},
		{
			path: '/logout',
			name: 'logout',
			component: view('Login/Login')
		},
		{
			path: '/login',
			name: 'login',
			component: view('Login/Login')
		}, // Default
		{
			path: '/dashboard',
			name: 'dashboard',
			component: view('Dashboard/Dashboard')
		},
		{
			path: '/sync',
			name: 'sync',
			component: view('Sync/Sync')
		},
		{
			path: '/inspection/add/:jobid',
			name: 'addinspection',
			component: view('Inspection/New')
		},
		{
			path: '/job/:jobid/hoses',
			name: 'hoseInspections',
			component: view('Dashboard/HoseInspections')
		},
		{
			path: '/inspection/:id',
			name: 'inspection',
			component: view('Inspection/View')
		},
		{
			path: '/admin',
			name: 'admin',
			component: view('Admin/Admin')
		},
		{
			path: '/assets',
			name: 'assets',
			component: view('Assets/Assets')
		},
		{
			path: '/assets/:id/edit',
			name: 'editAsset',
			component: view('Assets/EditAsset')
		},
		{
			path: '/assets/new',
			name: 'newAsset',
			component: view('Assets/EditAsset')
		},
		{
			path: '/transports',
			name: 'transports',
			component: view('Transports/Transports')
		},
		{
			path: '/transports/:id/edit',
			name: 'editTransport',
			component: view('Transports/EditTransport')
		},
		{
			path: '/transports/new',
			name: 'newTransport',
			component: view('Transports/EditTransport')
		},
		{
			path: '/meters',
			name: 'meters',
			component: view('Meters/Meters')
		},
		{
			path: '/meters/:id/edit',
			name: 'editMeter',
			component: view('Meters/EditMeter')
		},
		{
			path: '/meters/new',
			name: 'newMeter',
			component: view('Meters/EditMeter')
		},
		{
			path: '/vessels',
			name: 'vessels',
			component: view('Vessels/Vessels')
		},
		{
			path: '/vessels/:id/edit',
			name: 'editVessel',
			component: view('Vessels/EditVessel')
		},
		{
			path: '/vessels/new',
			name: 'newVessel',
			component: view('Vessels/EditVessel')
		},
		{
			path: '/hoses',
			name: 'hoses',
			component: view('Hoses/Hoses')
		},
		{
			path: '/hoses/:id/edit',
			name: 'editHose',
			component: view('Hoses/EditHose')
		},
		{
			path: '/hoses/new',
			name: 'newHose',
			component: view('Hoses/EditHose')
		},
		{
			path: '*',
			name: 'error404',
			component: view('Error404')
		} // Not found
	]
});
router.beforeEach((to, from, next) => {
	if (to.name !== 'login' && to.name !== 'debug' && to.name !== 'error404') {
		if (!store.getters.currentUser.ID) {
			router.push({name: 'login'});
		}
	}

	if (to.name === 'logout') {
		store.dispatch('logout');
	}
	next();
});

export default router;
