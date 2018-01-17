<template>
	<div class="">
		<pre>
			{{ state }}
		</pre>
	</div>
</template>

<script>
	export default {
		name: 'error404',
		data () {
			return {
			};
		},
		computed: {
			state: function () {
				return this.$store.getters.state;
			}
		},
		methods: {

		}
	};
</script>
