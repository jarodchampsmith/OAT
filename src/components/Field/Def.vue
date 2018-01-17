<template>
	<div class="row wrap gutter">
		<div class="width-1of1">
			<strong>{{ question }}</strong>
			<button v-if="question.tooltip" class="small circular light">
				<i>live_help</i>
				<q-tooltip>
					<strong>{{ question.tooltip }}</strong>
				</q-tooltip>
			</button>
		</div>
		<template v-for="entry in valid">
			<div>
				<label>
					<q-radio :val="entry" v-model="value" @input="update"></q-radio>
					{{ entry }}
				</label>
			</div>
		</template>
	</div>
</template>

<script src="./Def.js"></script>
