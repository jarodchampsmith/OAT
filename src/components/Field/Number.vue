<template>
	<div class="row wrap gutter mf-number">
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
		<div class="width-1of1">
			<q-numeric
				v-model.trim.number="value.answer.content"
				placeholder="0"
			    @input="update"
				:class="{'has-error': $v.value.answer.content.$error}"
			></q-numeric>
			<div>
				<span v-if="$v.value.answer.content.$error" class="text-red">Enter a valid number.</span>
			</div>
		</div>
		<q-modal ref="commentModal" class="minimized comment-modal" :content-css="{padding: '20px'}">
			<h5>Add a Comment</h5>
			<p>
				<textarea rows="4" v-model="value.comment" @input="update" class="full-width"></textarea>
			</p>
			<button class="primary" @click="$refs.commentModal.close()">Close</button>
		</q-modal>
	</div>
</template>

<script src="./Number.js"></script>
