<template>
	<div id="vessel">
		<div class="row gutter">
			<div class="width-1of2 md-width-1of1">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.TCSpecification"
					:options="options.TCSpecification"
					label="TC Specification"
					placeholder="TC Specification"
				></q-select>
			</div>
			<div class="width-1of2 md-width-1of1">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.plateLocation"
					:options="options.PlateLocations"
					label="ASME Plate Location"
					placeholder="Plate Location"
				></q-select>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of5 sm-width-1of1">
				U Stamp<br>
				<label>
					<q-radio v-model="vessel.uStamped" val="1"></q-radio>
					Yes
				</label>
				<label>
					<q-radio v-model="vessel.uStamped" val="0"></q-radio>
					No
				</label>
			</div>
			<div class="width-3of5 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.listedCapacity" :class="{'has-error': $v.vessel.listedCapacity.$error}">
					<label>Listed Capacity</label>
				</div>
				<div>
					<span v-if="$v.vessel.listedCapacity.$error" class="text-red">Enter a valid capacity (numeric).</span>
				</div>
			</div>
			<div class="width-1of5 sm-width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.listedCapacityUnit"
					:options="options.Units"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.vessel.listedCapacityUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.listedCapacityUnit.$error" class="text-red">Select a capacity unit type.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of2 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.nationalBoardNumber">
					<label>National Board Number</label>
				</div>
			</div>
			<div class="width-1of2 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.provincialNumber">
					<label>Provincial Number</label>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of2 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.manufacturer">
					<label>Manufacturer</label>
				</div>
			</div>
			<div class="width-1of2 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.serialNumber" :class="{'has-error': $v.vessel.serialNumber.$error}">
					<label>Serial #</label>
				</div>
				<div>
					<span v-if="$v.vessel.serialNumber.$error" class="text-red">Serial number is a required field for vessels.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of1">
				<q-select
						class="stacked-label"
						type="list"
						v-model="vessel.yearBuilt"
						:options="yearSelect"
						label="Year Built">
				</q-select>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of4 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.MAWP" :class="{'has-error': $v.vessel.MAWP.$error}">
					<label>MAWP</label>
				</div>
				<div>
					<span v-if="$v.vessel.MAWP.$error" class="text-red">Enter a valid MAWP (numeric)</span>
				</div>
			</div>
			<div class="width-1of4 sm-width-2of3">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.MAWPUnit"
					:options="options.UnitPressures"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.vessel.MAWPUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.MAWPUnit.$error" class="text-red">Select a MAWP unit.</span>
				</div>
			</div>
			<div class="width-1of4 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.MDMT" :class="{'has-error': $v.vessel.MDMT.$error}">
					<label>MDMT</label>
				</div>
				<div>
					<span v-if="$v.vessel.MDMT.$error" class="text-red">Enter a valid MDMT (numeric)</span>
				</div>
			</div>
			<div class="width-1of4 sm-width-2of3">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.MDMTUnit"
					:options="options.UnitTemperatures"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.vessel.MDMTUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.MDMTUnit.$error" class="text-red">Select a MDMT unit.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of2 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.CRNorTCRN">
					<label>CRN or TCRN</label>
				</div>
			</div>
			<div class="width-1of2 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.alteredBy">
					<label>Altered By</label>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of5 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.diameter" :class="{'has-error': $v.vessel.diameter.$error}">
					<label>Diameter</label>
				</div>
				<div>
					<span v-if="$v.vessel.diameter.$error" class="text-red">Enter a valid diameter (numeric).</span>
				</div>
			</div>
			<div class="width-1of5 sm-width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.diameterUnit"
					:options="options.UnitLengths"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.vessel.diameterUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.diameterUnit.$error" class="text-red">Select a diameter unit.</span>
				</div>
			</div>
			<div class="width-1of5 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.headMaterial">
					<label>Head Material</label>
				</div>
			</div>
			<div class="width-1of5 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.headThickness" :class="{'has-error': $v.vessel.headThickness.$error}">
					<label>Head Thickness</label>
				</div>
				<div>
					<span v-if="$v.vessel.headThickness.$error" class="text-red">Enter a valid head thickness (numeric).</span>
				</div>
			</div>
			<div class="width-1of5 sm-width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.headThicknessUnit"
					:options="options.UnitLengths"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.vessel.headThicknessUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.headThicknessUnit.$error" class="text-red">Select a head thickness unit.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-2of5 sm-width-1of1">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.shellMaterial">
					<label>Shell Material</label>
				</div>
			</div>
			<div class="width-2of5 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.shellThickness" :class="{'has-error': $v.vessel.shellThickness.$error}">
					<label>Shell Thickness</label>
				</div>
				<div>
					<span v-if="$v.vessel.shellThickness.$error" class="text-red">Enter a valid shell thickness (numeric).</span>
				</div>
			</div>
			<div class="width-1of5 sm-width-1of3">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.shellThicknessUnit"
					:options="options.UnitLengths"
					label="Unit"
					placeholder="Unit"
					:class="{'has-error': $v.vessel.shellThicknessUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.shellThicknessUnit.$error" class="text-red">Select a shell thickness unit.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-2of5 sm-width-1of1">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.headType"
					:options="options.HeadTypes"
					label="Head Type"
					placeholder="Head Type"
				></q-select>
			</div>
			<div class="width-2of5 sm-width-2of3">
				<div class="stacked-label">
					<input class="full-width" v-model="vessel.seamToSeamLength" :class="{'has-error': $v.vessel.seamToSeamLength.$error}">
					<label>Seam-to-Seam Length</label>
				</div>
				<div>
					<span v-if="$v.vessel.seamToSeamLength.$error" class="text-red">Enter a valid seam length (numeric).</span>
				</div>
			</div>
			<div class="width-1of5 sm-width-1of3">
				<q-select
						class="full-width"
						type="list"
						v-model="vessel.seamToSeamLengthUnit"
						:options="options.UnitLengths"
						label="Unit"
						placeholder="Unit"
						:class="{'has-error': $v.vessel.seamToSeamLengthUnit.$error}"
				></q-select>
				<div>
					<span v-if="$v.vessel.seamToSeamLengthUnit.$error" class="text-red">Select a seam length unit.</span>
				</div>
			</div>
		</div>
		<div class="row gutter">
			<div class="width-1of2 sm-width-1of1">
				<q-select
					class="full-width"
					type="list"
					v-model="vessel.constructedOf"
					:options="options.ConstructedOf"
					label="Tank is Constructed Of"
					placeholder="Tank is Constructed Of"
				></q-select>
			</div>
			<div class="width-1of2 sm-width-1of1">
				Tank stress relieved after manufacture<br>
				<label>
					<q-radio v-model="vessel.stressRelieved" val="1"></q-radio>
					Yes
				</label>
				<label>
					<q-radio v-model="vessel.stressRelieved" val="0"></q-radio>
					No
				</label>
			</div>
		</div>
		<div class="card">
			<div class="card-title bg-primary text-white">
				Meters
			</div>
			<div class="card-content card-force-top-padding">
				<q-data-table
					ref="meterTable"
					v-if="vessel.id"
					:data="meters"
					:config="config.meters.table"
					:columns="config.meters.columns"
				>
					<template slot="col-id" scope="cell">
						<button class="secondary small circular" @click="editMeter(cell.row)">
							<i>edit</i>
						</button>
					</template>
				</q-data-table>
				<button class="primary float-right generic-margin" @click="editMeter()">
					Add Meter
				</button>
			</div>
		</div>
		<q-modal ref="meterModal" class="maximized" :content-css="{padding: '50px'}">
			<q-layout>
				<div slot="header" class="toolbar">
					<button @click="cancelMeter">
						<i>keyboard_arrow_left</i>
					</button>
					<q-toolbar-title :padding="1">
						<template v-if="current.meterId">Edit Meter</template>
						<template v-if="!current.meterId">Add Meter</template>
					</q-toolbar-title>
				</div>
				<div class="layout-view">
					<div class="layout-padding form-margin">
						<meters ref="meterEditor" :meter="current.meter" @input="update"></meters>
						<hr style="clear:both;">
						<button class="warning float-right generic-margin" @click="cancelMeter()">
							Cancel Meter
						</button>
						<button class="positive float-right generic-margin" @click="saveMeter()">
							Save Meter
						</button>
					</div>
				</div>
			</q-layout>
		</q-modal>
	</div>
</template>

<script src="./Vessel.js"></script>
