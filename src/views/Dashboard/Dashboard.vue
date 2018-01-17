<template>
	<div id="dashboard">
		<fab></fab>
		<div class="list">
			<template v-for="job in uniqueJobs">
				<div class="list-label">Job: {{ job.id }} <span v-if="job.externalEpicorJobID">({{ job.externalEpicorJobID}})</span>
					<!--
					<button class="secondary small circular float-right add-inspection" @click="goHosesInspection(job.id)">
						<i>gesture</i>
					</button>
					-->
					<button class="secondary small circular float-right add-inspection" @click="addInspection(job.id)">
						<i>add</i>
					</button>
				</div>
				<div>
					<template v-for="inspection in uniqueInspections" v-if="inspection.jobid === job.id">
						<div class="item three-lines" @click="goInspection(inspection.id)">
							<div class="item-content inset has-secondary">
								<div>{{ assetNames[inspection.assetid] }} @ {{ locationNames[inspection.locationid] }}</div>
								<div>
									<span>Company: {{ companyNames[inspection.companyid] }}</span>
									{{ job.inspectedAt | timeAgo }} ({{ job.inspectedAt | dateOnly }})
								</div>
							</div>
							<div class="item-secondary stamp">
								{{ answered[inspection.id] }} / {{ answerCount[inspection.id] }}
							</div>
						</div>
						<hr class="inset">
					</template>
				</div>
				<hr>
			</template>
			<div class="list-label" v-if="jobs.length === 0">
				There are currently no jobs available. You can add new jobs from the admin backend. <br/>
			</div>
		</div>
	</div>
</template>

<script src="./Dashboard.js"></script>

<style src="./Dashboard.css"></style>
