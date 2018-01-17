<template>
	<div id="meter">
		<div class="row gutter">
			<div class="width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="meter.type"
					:options="options.Types"
					label="Meter Type"
					placeholder="Meter Type"
				></q-select>
			</div>
			<div class="width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="meter.serialNumber">
					<label>Serial #</label>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="meter.make">
					<label>Make</label>
				</div>
			</div>
			<div class="width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="meter.size"
					:options="options.Sizes"
					label="Size"
					placeholder="Size"
				></q-select>
			</div>
			<div class="width-2of3">
				<div class="stacked-label">
					<input type="number" class="full-width" v-model="meter.reading" :class="{'has-error': $v.meter.reading.$error}">
					<label>Reading</label>
				</div>
				<div>
					<span v-if="$v.meter.reading.$error" class="text-red">Enter a valid meter reading (numeric).</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./Meter.js"></script>
