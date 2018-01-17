<template>
	<div class="row wrap big-gutter mf-defect">
		<div class="width-3of5">
			<div>
				<strong>{{ question.question }}</strong>
				<button class="small circular defect-button" :class="{ light: !hasPartsOrLabour, positive: hasPartsOrLabour }" @click="openPartsModal">
					<i>person_add</i>
				</button>
				<button v-if="question.tooltip" class="small circular light">
					<i>live_help</i>
					<q-tooltip>
						<strong>{{ question.tooltip }}</strong>
					</q-tooltip>
				</button>
			</div>
			<textarea class="full-width" v-model.trim="defectOutcome.comment" @input="update"></textarea>
		</div>
		<div class="width-2of5">
			<template v-for="entry in valid">
				<div class="generic-margin">
					<label>
						<q-radio :val="entry" v-model.trim="defectOutcome.value" @input="update"></q-radio>
						{{ entry }}
					</label>
				</div>
			</template>
		</div>
		<q-modal ref="labourModal" class="maximized" :content-css="{padding: '50px'}">
			<q-layout>
				<div slot="header" class="toolbar">
					<button @click="$refs.labourModal.close()">
						<i>keyboard_arrow_left</i>
					</button>
					<q-toolbar-title :padding="1">
						Parts & Labour
					</q-toolbar-title>
				</div>
				<div class="layout-view">
					<div class="layout-padding">
						<div class="card">
							<div class="card-title bg-primary text-white">
								Parts
								<button class="add-part tertiary circular small absolute-right" @click="addPart">
									<i>add</i>
								</button>
							</div>
							<div class="card-content card-force-top-padding">
								<template v-for="(part, index) in parts">
									<div class="row gutter justify-between">
										<div class="shrink-1">
											<q-numeric
												v-model.trim="part.quantity"
												:min="1"
												@input="update"
											></q-numeric>
										</div>
										<div class="shrink-1">
											<div class="stacked-label">
												<input type="text" v-model.trim="part.number" @input="update">
												<label>Part #</label>
											</div>
										</div>
										<div class="grow-3">
											<div class="stacked-label">
												<input type="text" v-model.trim="part.description" @input="update">
												<label>Description</label>
											</div>
										</div>
										<div class="grow-6">
											<div class="stacked-label">
												<input type="text" v-model.trim="part.notes" @input="update">
												<label>Notes</label>
											</div>
										</div>
										<div class="shrink-1">
											<button class="negative circular" @click="del('parts', index)">
												<i>delete_forever</i>
											</button>
										</div>
									</div>
								</template>
							</div>
						</div>
						<div class="card">
							<div class="card-title bg-primary text-white">
								Labour
								<button class="add-part tertiary circular small absolute-right" @click="addLabour">
									<i>add</i>
								</button>
							</div>
							<div class="card-content card-force-top-padding">
								<template v-for="(labours, index) in labour">
									<div class="row gutter justify-between">
										<div class="shrink-1">
											<div class="stacked-label">
												<input type="text" v-model.trim="labours.hours" @input="update">
												<label>Hours</label>
											</div>
										</div>
										<div class="grow-10">
											<div class="stacked-label">
												<input type="text" v-model.trim="labours.description" @input="update">
												<label>Description</label>
											</div>
										</div>
										<div class="shrink-1">
											<button class="negative circular" @click="del('labour', index)">
												<i>delete_forever</i>
											</button>
										</div>
									</div>
								</template>
							</div>
						</div>
						<button class="primary float-right big" @click="$refs.labourModal.close()">Save</button>
					</div>
				</div>
			</q-layout>
		</q-modal>
	</div>
</template>

<script src="./Defect.js"></script>

<style src="./Defect.css"></style>
