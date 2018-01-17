<template>
	<div class="row wrap gutter mf-signature">
		<div class="width-1of1">
			<strong>{{ question.question }}</strong>
			<span class="pull-right">
				<button class="primary small" @click="addNewSignature">
					<i>add</i> Add Signature
				</button>
			</span>
		</div>
		<div v-for="(signature,index) in currentSignatures" class="width-1of1">
			<button class="circular generic-margin" :class="{ light: !signature.signature, positive: signature.signature }" @click="addSignature(signature)">
				<i>touch_app</i>
			</button>
			<img v-if="signature.signature" :src="signature.signature" class="signature-image shadow-1 generic-margin">
			<button class="pull-right clear red small" @click="removeSignature(index)">
				<i>close</i> Remove
			</button>
		</div>
		<q-modal ref="signatureModal" class="maximized signature-modal" :content-css="{padding: '20px'}" @open="setupSignature">
			<q-layout>
				<div slot="header" class="toolbar">
					<button @click="$refs.signatureModal.close()">
						<i>keyboard_arrow_left</i>
					</button>
					<q-toolbar-title :padding="1">
						<h5>Add your signature</h5>
					</q-toolbar-title>
				</div>
				<div class="layout-view">
					<div class="signature-panel shadow-1 full-width"></div>
					<br>
					<button class="tertiary generic-margin" @click="resetSignature">Reset</button>
					<button class="secondary generic-margin" @click="clearSignature">Clear</button>
					<button class="primary float-right generic-margin" @click="closePad">Save</button>
				</div>
			</q-layout>


		</q-modal>
	</div>
</template>

<script src="./Signature.js"></script>

<style src="./Signature.css"></style>
