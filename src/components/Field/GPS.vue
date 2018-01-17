<template>
	<div class="row wrap gutter mf-gps">
		<div class="width-1of1">
			<strong>{{ question.question }}</strong>
			<button v-if="question.tooltip" class="small circular light">
				<i>live_help</i>
				<q-tooltip>
					<strong>{{ question.tooltip }}</strong>
				</q-tooltip>
			</button>
		</div>
		<div class="width-1of1">
			<button class="circular generic-margin" :class="{ light: !answer.answer, positive: answer.answer, disabled: gettingPosition }" @click="addLocation">
				<i>my_location</i>
			</button>
			<input placeholder="Latitude" v-model.trim="latitude" @input="updateLatLng"></input>
			<input placeholder="Longitude" v-model.trim="longitude" @input="updateLatLng"></input>
		</div>
	</div>
</template>

<script src="./GPS.js"></script>
