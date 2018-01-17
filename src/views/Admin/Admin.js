import { Toast } from 'quasar';
import Fab from '../../components/Fab/Fab.vue';
import AdminNav from '../../components/AdminNav/AdminNav.vue';

export default {
	name: 'admin',
	components: {
		'fab': Fab,
		'adminNav': AdminNav,
	},
	data () {
		return {}
	},
	computed: {
		user: function() {
			return this.$store.getters.currentUser;
		},
		vessels: function () {
			return this.$store.getters.vessels;
		},
		assets: function () {
			return this.$store.getters.assets;
		},
		transports: function () {
			return this.$store.getters.transports;
		},
		meters: function () {
			return this.$store.getters.meters;
		},
		hoses: function () {
			return this.$store.getters.hoses;
		}
	},
	mounted () {},
	methods: {
		go(name) {
			this.$router.push({
				name: name
			});
		},

	}
};
