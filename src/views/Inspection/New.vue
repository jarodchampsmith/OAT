<template>
	<div id="addinspection">
		<fab></fab>
		<div class="card">
			<div class="card-title bg-primary text-white">
				Add Inspection
			</div>
			<div class="card-content card-force-top-padding">

				<q-dialog-select
					type="radio"
					v-model="selected.companyId"
					:options="validCompanies"
					ok-label="Done"
					cancel-label="Cancel"
					title="Select a Company"
					placeholder="Select Company"
					readonly
				></q-dialog-select>
				<br>
				<q-select
					type="list"
					:class="{ disabled: !selected.companyId }"
					v-model="selected.locationId"
					:options="locationSelect"
					placeholder="Select Location"
					:readonly="selected.locationId && selected.locationId.length > 0"
				></q-select>
				<br>
				<q-autocomplete
						ref="assetSearch"
						v-model="assetSearchTerm"
						:class="{ disabled: !selected.locationId }"
						:delay="300"
						:max-results="10"
						@search="assetSearch"
						@selected="assetSelected"
						:delimiter="true"
				>
					<input v-model="assetSearchTerm" placeholder="Start Typing (Asset Name)"/>
				</q-autocomplete>


				<button v-show="selected.assetId" class="primary small circular" @click="openAsset(selected.assetId)"><i>edit</i></button>
				<button v-show="selected.locationId" class="secondary small circular" @click="openAsset()"><i>add</i></button>
				<hr>
				<q-select
					type="list"
					v-model="selected.templateId"
					:options="validTemplates"
					placeholder="Select Inspection Template"
				></q-select>
				<br>
				<button v-show="selected.companyId && selected.locationId && selected.assetId && selected.templateId && answers.length" class="primary float-right generic-margin" @click="createInspection">Create</button>
			</div>
		</div>
		<q-modal ref="assetModal" class="maximized" :content-css="{padding: '50px'}">
			<q-layout>
				<div slot="header" class="toolbar">
					<button @click="cancelAsset">
						<i>keyboard_arrow_left</i>
					</button>
					<q-toolbar-title :padding="1">
						<template v-if="current.assetId">Edit Asset</template>
						<template v-if="!current.assetId">Add Asset</template>
					</q-toolbar-title>
				</div>
				<div class="layout-view">
					<div class="layout-padding form-margin">
						<asset :asset="current.asset" @input="update"></asset>
						<hr style="clear:both;">
						<button class="warning float-right generic-margin" @click="cancelAsset()">
							Cancel Asset
						</button>
						<button class="positive float-right generic-margin" @click="saveAsset()">
							Save Asset
						</button>
					</div>
				</div>
			</q-layout>
		</q-modal>
	</div>
</template>

<script src="./New.js"></script>
