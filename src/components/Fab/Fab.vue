<template>
	<q-fab
		class="absolute-bottom-right"
		classNames="secondary"
		icon="keyboard_arrow_left"
		direction="left"
	>
		<q-small-fab
				class="negative"
				@click.native="click('logout')"
				icon="power_settings_new"
		></q-small-fab>
		<q-small-fab
			class="primary"
			@click.native="click('dashboard')"
			icon="home"
		></q-small-fab>
		<q-small-fab
				class="primary"
				@click.native="click('admin')"
				icon="settings"
		></q-small-fab>
		<q-small-fab
			v-if="this.$store.getters.isOnline"
			class="info"
			@click.native="click('sync')"
			icon="cloud"
		></q-small-fab>
		<q-small-fab
			v-if="!this.$store.getters.isOnline"
			class="info disabled"
			icon="cloud_off"
		></q-small-fab>

	</q-fab>
</template>

<script src="./Fab.js"></script>
<style type="text/css">
	.q-fab {
		z-index: 1000 !important;
	}
</style>
