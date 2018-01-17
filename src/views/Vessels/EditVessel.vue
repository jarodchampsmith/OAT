<template>
    <div id="editVessel">
        <admin-nav></admin-nav>
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span v-if='vessel.id' class="text-bold text-italic">Vessel #{{ vessel.serialNumber }}</span>
                <span v-else class="text-bold text-italic">Add a New Vessel</span>

                <span v-if='vessel.id' class="label bg-blue float-right"><small>Last Updated {{ vessel.updatedAt }}</small></span>
            </div>
            <div class="card-content card-force-top-padding">
                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <label class="text-primary">Select a Company</label>
                            <button v-if="companySearchTerm" class="autocomplete-clear" @click="vessel.companyid = null; companySearchTerm = '';">
                                <i class="mat-only">clear</i>
                                <i class="ios-only">cancel</i>
                            </button>
                            <q-autocomplete
                                    ref="companySearch"
                                    v-model="companySearchTerm"
                                    :delay="300"
                                    :max-results="8"
                                    @search="companySearch"
                                    @selected="companySelected"
                                    :delimiter="true"
                            >
                                <input :class="{'has-error': $v.vessel.companyid.$error}"
                                       v-model="companySearchTerm"
                                       class="full-width"
                                       placeholder="Start Typing (Company Name)"/>
                            </q-autocomplete>

                        </div>
                        <div>
                            <span v-if="$v.vessel.companyid.$error" class="text-red">Select a company.</span>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="vessel.companyLocationID"
                                :options="locationSelect"
                                :class="{'has-error': $v.vessel.companyLocationID.$error}"
                                label="Company Branch Location">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.companyLocationID.$error" class="text-red">Select a company location.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <label class="text-primary">Select an Asset</label>
                            <button v-if="assetSearchTerm" class="autocomplete-clear" @click="vessel.assetid = null; assetSearchTerm = '';">
                                <i class="mat-only">clear</i>
                                <i class="ios-only">cancel</i>
                            </button>
                            <q-autocomplete
                                    ref="assetSearch"
                                    v-model="assetSearchTerm"
                                    :delay="300"
                                    :class="{ disabled: !vessel.companyid }"
                                    :max-results="8"
                                    @search="assetSearch"
                                    @selected="assetSelected"
                                    :delimiter="true"
                            >
                                <input v-model="assetSearchTerm" class="full-width"  placeholder="Start Typing (Asset Name)"/>
                            </q-autocomplete>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="vessel.plateLocation"
                                :options="plateLocationSelect"
                                label="ASME Plate Location">
                        </q-select>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="vessel.TCSpecification"
                                :options="tcsSelect"
                                label="TC Specification">
                        </q-select>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of3">
                        <label>U Stamp</label> <br/>
                        <div class="m-10">
                            <label>
                                <q-radio v-model="vessel.uStamped" val="1"></q-radio>
                                Yes
                            </label>
                            <label>
                                <q-radio v-model="vessel.uStamped" val="0"></q-radio>
                                No
                            </label>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <div class=" stacked-label">
                            <input v-model="vessel.listedCapacity" class="full-width" :class="{'has-error': $v.vessel.listedCapacity.$error}">
                            <label>List Capacity</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.listedCapacity.$error" class="text-red">Enter a valid capacity (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.listedCapacityUnit"
                                :options="unitSelect"
                                :class="{'has-error': $v.vessel.listedCapacityUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.listedCapacityUnit.$error" class="text-red">Select a capacity unit type.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="vessel.nationalBoardNumber" class="full-width">
                            <label>National Board Number</label>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="vessel.provincialNumber" class="full-width">
                            <label>Provincial Number</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input v-model="vessel.manufacturer" class="full-width">
                            <label>Manufacturer</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-2of3">
                        <div class="stacked-label">
                            <input required v-model="vessel.serialNumber" class="full-width" :class="{'has-error': $v.vessel.serialNumber.$error}">
                            <label>Serial Number</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.serialNumber.$error" class="text-red">Serial number is a required field for vessels.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
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
                    <div class="width-2of3">
                        <div class="stacked-label ">
                            <input v-model="vessel.MAWP" class="full-width" :class="{'has-error': $v.vessel.MAWP.$error}">
                            <label>MAWP</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.MAWP.$error" class="text-red">Enter a valid MAWP (numeric)</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.MAWPUnit"
                                :options="unitPressureSelect"
                                :class="{'has-error': $v.vessel.MAWPUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.MAWPUnit.$error" class="text-red">Select a MAWP unit.</span>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class=" width-2of3 ">
                        <div class="stacked-label">
                            <input v-model="vessel.MDMT" class="full-width" :class="{'has-error': $v.vessel.MDMT.$error}">
                            <label>MDMT</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.MDMT.$error" class="text-red">Enter a valid MDMT (numeric)</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.MDMTUnit"
                                :options="unitTempSelect"
                                :class="{'has-error': $v.vessel.MDMTUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.MDMTUnit.$error" class="text-red">Select a MDMT unit.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class=" width-2of3 ">
                        <div class="stacked-label">
                            <input v-model="vessel.diameter" class="full-width" :class="{'has-error': $v.vessel.diameter.$error}">
                            <label>Diameter</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.diameter.$error" class="text-red">Enter a valid diameter (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.diameterUnit"
                                :options="unitLengthSelect"
                                :class="{'has-error': $v.vessel.diameterUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.diameterUnit.$error" class="text-red">Select a diameter unit.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="vessel.headType"
                                :options="headTypeSelect"
                                label="Head Type">
                        </q-select>
                    </div>
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="vessel.constructedOf"
                                :options="constructedOfSelect"
                                label="This tank is constructed of:">
                        </q-select>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <input v-model="vessel.headMaterial" class="full-width">
                            <label>Head Material</label>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <input v-model="vessel.headThickness" class="full-width" :class="{'has-error': $v.vessel.headThickness.$error}">
                            <label>Head Thickness</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.headThickness.$error" class="text-red">Enter a valid head thickness (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.headThicknessUnit"
                                :options="unitLengthSelect"
                                :class="{'has-error': $v.vessel.headThicknessUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.headThicknessUnit.$error" class="text-red">Select a head thickness unit.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <input v-model="vessel.shellMaterial" class="full-width">
                            <label>Shell Material</label>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <div class="stacked-label ">
                            <input v-model="vessel.shellThickness" class="full-width" :class="{'has-error': $v.vessel.shellThickness.$error}">
                            <label>Shell Thickness</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.shellThickness.$error" class="text-red">Enter a valid shell thickness (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.shellThicknessUnit"
                                :options="unitLengthSelect"
                                :class="{'has-error': $v.vessel.shellThicknessUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.shellThicknessUnit.$error" class="text-red">Select a shell thickness unit.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class=" width-2of3 ">
                        <div class="stacked-label">
                            <input v-model="vessel.seamToSeamLength" class="full-width" :class="{'has-error': $v.vessel.seamToSeamLength.$error}">
                            <label>Seam to Seam Length</label>
                        </div>
                        <div>
                            <span v-if="$v.vessel.seamToSeamLength.$error" class="text-red">Enter a valid seam length (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="vessel.seamToSeamLengthUnit"
                                :options="unitLengthSelect"
                                :class="{'has-error': $v.vessel.seamToSeamLengthUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.vessel.seamToSeamLengthUnit.$error" class="text-red">Select a seam length unit.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="vessel.CRNorTCRN" class="full-width">
                            <label>CRN or TCRN</label>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="vessel.alteredBy" class="full-width">
                            <label>Altered By</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <label>Tank stress relieved after manufacture?</label> <br/>
                        <div class="m-10">
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
                </div>
                <button v-if="!vessel.id" class="positive float-right full-width m-10" @click="save()">
                    Save Vessel
                </button>
                <button v-if="vessel.id" class="positive float-right full-width m-10" @click="update()">
                    Update Vessel
                </button>


            </div>
        </div>
    </div>
</template>

<script src="./EditVessel.js"></script>
<style src="./../Admin/Admin.css"></style>
