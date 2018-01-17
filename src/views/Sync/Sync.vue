<template>
	<div id="sync">
		<div class="card">
			<div class="card-title bg-primary text-white">
				Sync
			</div>
			<div class="card-content card-force-top-padding">
				<p>Syncronizing with OATS website</p>
				<q-progress :percentage="syncProgress" class="stripe" :class="{ animate: syncProgress < 100, indeterminate: syncProgress === 0 }" style="height: 10px"></q-progress>
				<p>
					<span v-for="message in syncMessages">{{ message}} <br/></span>
				</p>
			</div>
			<div class="pull-right generic-margin">
				<button class="negative small" @click="abortSync()">
					<i>cancel</i> Abort Sync & Go To Dashboard
				</button>
			</div>
		</div>
	</div>
</template>

<script src="./Sync.js"></script>

<style src="./Sync.css"></style>
