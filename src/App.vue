<template>
	<div id="app" class="q-app">
		<q-layout>
			<div slot="header" class="toolbar">
				<q-toolbar-title :padding="0">
					MaXfield OATS <small class="text-faded">v1.0.0</small>
				</q-toolbar-title>
				<button :class="{'disabled': !this.$store.getters.isOnline}">
					<i v-if="this.$store.getters.isOnline" @click="$store.state.online = false;">wifi</i>
					<i v-if="!this.$store.getters.isOnline" @click="$store.state.online = true;">signal_wifi_off</i>
				</button>
			</div>
			<transition name="fade" mode="out-in">
				<div class="layout-view">
					<div class="layout-padding">
						<transition name="fade" mode="out-in">
							<router-view class="view"></router-view>
						</transition>
					</div>
				</div>
			</transition>
			<q-ajax-bar></q-ajax-bar>
		</q-layout>
	</div>
</template>

<script>
	export default {
		data () {
			return {};
		},
		methods: {}
	};
</script>

<style>
	.comment-modal {
		padding: 50px;
	}
	input[type="text"],
	input[type="date"],
	input[type="month"] {
		min-width: 200px;
	}
	.shorty {
		width: 100px;
	}
	.q-picker-textfield {
		min-width: 60px;
	}
	.q-picker-textfield .q-picker-textfield-value {
		height: auto;
	}
	.datePicker {
		min-width: 150px;
	}
	.q-range-label {
		left: -5px;
		width: 35px;
	}
	.q-range-label.label-always {
		transform: translateY(-50%) scale(0.85);
	}
	.form-margin > div {
		margin: 12px 0;
	}
</style>
