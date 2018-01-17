<template>
	<div id="transport">
		<div class="row gutter">
			<div class="width-1of2">
				<q-select
					class="full-width"
					type="list"
					v-model="transport.type"
					:options="options.Types"
					label="Transport Type"
					placeholder="Transport Type"
					:class="{'has-error': $v.transport.type.$error}"
				></q-select>
				<div>
					<span v-if="$v.transport.type.$error" class="text-red">Transport type is a required field.</span>
				</div>
			</div>
			<div class="width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="transport.name">
					<label>Name</label>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of4 md-width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="transport.engineSerialNumber">
					<label>Engine Serial #</label>
				</div>
			</div>
			<div class="width-1of4 md-width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="transport.engineHours" :class="{'has-error': $v.transport.engineHours.$error}">
					<label>Engine Hours</label>
				</div>
				<div>
					<span v-if="$v.transport.engineHours.$error" class="text-red">Enter a valid number for engine hours.</span>
				</div>
			</div>
			<div class="width-1of4 md-width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="transport.chassisSerialNumber">
					<label>Chassis Serial #</label>
				</div>
			</div>
			<div class="width-1of4 md-width-1of2">
				<div class="stacked-label">
					<input class="full-width" v-model="transport.licensePlate">
					<label>License Plate</label>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="transport.manufacturer">
					<label>Manufacturer</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./Transport.js"></script>
