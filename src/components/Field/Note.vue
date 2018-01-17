<template>
	<div>
		<div class="row wrap gutter">
			<div class="width-1of1">
				<strong>{{ question.question }}</strong>
				<button v-if="question.tooltip" class="small circular light">
					<i>live_help</i>
					<q-tooltip>
						<strong>{{ question.tooltip }}</strong>
					</q-tooltip>
				</button>
				<br>
				<textarea rows="4" class="full-width" v-model.trim="comment" @input="update">{{ comment }}</textarea>
			</div>
		</div>
	</div>
</template>

<script src="./Note.js"></script>
