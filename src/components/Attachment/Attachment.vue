<template>
	<div id="attachment">
		<div class="row gutter">
			<div class="width-1of5 md-width-1of1">
				<q-select
					class="full-width"
					type="list"
					v-model="attachment.type"
					:options="options.Types"
					label="Type"
					placeholder="Type"
					:class="{'has-error': $v.attachment.type.$error}"
				></q-select>
				<div>
					<span v-if="$v.attachment.type.$error" class="text-red">Type is a required field.</span>
				</div>
			</div>
			<div class="width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="attachment.serialNumber">
					<label>Serial #</label>
				</div>
			</div>
			<div class="width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="attachment.hoseType">
					<label>Hose Type</label>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of3">
				<q-select
						class="stacked-label"
						type="list"
						v-model="attachment.size"
						:options="options.sizeSelect"
						label="Hose Size">
				</q-select>
			</div>
			<div class="width-1of3">
				<div class="stacked-label">
					<input class="full-width" v-model="attachment.length" :class="{'has-error': $v.attachment.length.$error}">
					<label>Length</label>
				</div>
				<div>
					<span v-if="$v.attachment.length.$error" class="text-red">Enter a valid length (numeric).</span>
				</div>
			</div>
			<div class="width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="attachment.lengthUnit"
					:options="options.unitLengths"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.attachment.lengthUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.attachment.lengthUnit.$error" class="text-red">Select a length unit.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of3">
				<q-select
						class="stacked-label"
						type="list"
						v-model="attachment.retestDate"
						:options="yearSelect"
						label="Retest Date">
				</q-select>
			</div>
			<div class="width-1of3">
				<q-select
						class="stacked-label"
						type="list"
						v-model="attachment.replacementYear"
						:options="yearSelect"
						label="Replacement Year">
				</q-select>
			</div>
			<div class="width-1of3">
				<q-select
						class="stacked-label"
						type="list"
						v-model="attachment.testIntervalInYears"
						:options="options.testIntervals"
						label="Test Interval">
				</q-select>

			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of3">
				<div class="stacked-label">
					<input class="full-width" v-model="attachment.testPresure" :class="{'has-error': $v.attachment.testPresure.$error}">
					<label>Test Pressure (psi)</label>
				</div>
				<div>
					<span v-if="$v.attachment.testPresure.$error" class="text-red">Enter a valid test pressure (numeric).</span>
				</div>
			</div>
			<div class="width-1of3">
				<div class="stacked-label">
					<input class="full-width" v-model="attachment.HAWP" :class="{'has-error': $v.attachment.HAWP.$error}">
					<label>HAWP (psi)</label>
				</div>
				<div>
					<span v-if="$v.attachment.HAWP.$error" class="text-red">Enter a valid HAWP (numeric)</span>
				</div>
			</div>
			<div class="width-1of3">
				<q-dialog-select
						class="stacked-label"
						type="radio"
						v-model="attachment.lastTestResult"
						:options="options.testResults"
						label="Test Result"
						ok-label="Update"
						cancel-label="Cancel"
						title="Test Result"
						@input="updateTestResults()"
				></q-dialog-select>
			</div>
		</div>
	</div>
</template>

<script src="./Attachment.js"></script>
