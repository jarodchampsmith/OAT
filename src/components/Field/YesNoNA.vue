<template>
	<div class="row wrap gutter mf-yesnona">
		<div class="width-1of1">
			<strong>{{ question.question }}</strong>
			<button v-if="question.allowComments" class="small circular" :class="{ light: !answer.comment, positive: answer.comment }" @click="addComment">
				<i>comment</i>
			</button>
			<button v-if="question.tooltip" class="small circular light">
				<i>live_help</i>
				<q-tooltip>
					<strong>{{ question.tooltip }}</strong>
				</q-tooltip>
			</button>
		</div>
		<template v-for="entry in valid">
			<div class="width-1of1">
				<label>
					<q-radio :val="entry" v-model.trim="value.answer.content" @input="update"></q-radio>
					{{ entry }}
				</label>
			</div>
		</template>
		<q-modal ref="commentModal" class="minimized comment-modal" :content-css="{padding: '20px'}">
			<h5>Add a Comment</h5>
			<p>
				<textarea rows="4" v-model.trim="value.comment" @input="update" class="full-width"></textarea>
			</p>
			<button class="primary" @click="$refs.commentModal.close()">Close</button>
		</q-modal>
	</div>
</template>

<script src="./YesNoNA.js"></script>
