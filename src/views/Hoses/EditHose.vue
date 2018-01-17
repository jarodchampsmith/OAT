<template>
    <div id="editHose">
        <admin-nav></admin-nav>
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span v-if='hose.id' class="text-bold text-italic">Hose #{{ hose.serialNumber }}</span>
                <span v-else class="text-bold text-italic">Add a New Hose</span>

                <span v-if='hose.id' class="label bg-blue float-right"><small>Last Updated {{ hose.updatedAt }}</small></span>
            </div>
            <div class="card-content card-force-top-padding">
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <label class="text-primary">Select a Company</label>
                            <button v-if="companySearchTerm" class="autocomplete-clear" @click="hose.companyid = null; companySearchTerm = '';">
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
                                <input :class="{'has-error': $v.hose.companyid.$error}"
                                       v-model="companySearchTerm"
                                       class="full-width"
                                       placeholder="Start Typing (Company Name)"/>
                            </q-autocomplete>

                        </div>
                        <div>
                            <span v-if="$v.hose.companyid.$error" class="text-red">Select a company.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="hose.companyLocationID"
                                :options="locationSelect"
                                :class="{'has-error': $v.hose.companyLocationID.$error}"
                                label="Company Branch Location">
                        </q-select>
                        <div>
                            <span v-if="$v.hose.companyLocationID.$error" class="text-red">Select a company location.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <label class="text-primary">Select an Asset</label>
                            <button v-if="assetSearchTerm" class="autocomplete-clear" @click="hose.assetid = null; assetSearchTerm = '';">
                                <i class="mat-only">clear</i>
                                <i class="ios-only">cancel</i>
                            </button>
                            <q-autocomplete
                                    ref="assetSearch"
                                    v-model="assetSearchTerm"
                                    :delay="300"
                                    :class="{ disabled: !hose.companyid }"
                                    :max-results="8"
                                    @search="assetSearch"
                                    @selected="assetSelected"
                                    :delimiter="true"
                            >
                                <input v-model="assetSearchTerm" class="full-width" placeholder="Start Typing (Asset Name)"/>
                            </q-autocomplete>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input required v-model="hose.serialNumber" class="full-width">
                            <label>Serial Number</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="hose.hoseType" class="full-width">
                            <label>Hose Type</label>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="hose.type"
                                :options="typeSelect"
                                label="Type">
                        </q-select>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="hose.size"
                                :options="sizeSelect"
                                label="Hose Size">
                        </q-select>
                    </div>
                    <div class="width-1of3">
                        <div class="stacked-label">
                        <input v-model="hose.length" class="full-width" :class="{'has-error': $v.hose.length.$error}">
                        <label>Length</label>
                         </div>
                        <div>
                            <span v-if="$v.hose.length.$error" class="text-red">Enter a valid length (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="hose.lengthUnit"
                                :options="unitLengthSelect"
                                :class="{'has-error': $v.hose.lengthUnit.$error}"
                                label="Unit of Measure">
                        </q-select>
                        <div>
                            <span v-if="$v.hose.lengthUnit.$error" class="text-red">Select a length unit.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="hose.retestDate"
                                :options="yearSelect"
                                label="Retest Date">
                        </q-select>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="hose.replacementYear"
                                :options="yearSelect"
                                label="Replacement Year">
                        </q-select>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="stacked-label"
                                type="list"
                                v-model="hose.testIntervalInYears"
                                :options="testIntervals"
                                label="Test Interval">
                        </q-select>

                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <input v-model="hose.testPresure" class="full-width" :class="{'has-error': $v.hose.testPressure.$error}">
                            <label>Test Pressure (psi)</label>
                        </div>
                        <div>
                            <span v-if="$v.hose.testPressure.$error" class="text-red">Enter a valid test pressure (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <input v-model="hose.HAWP" class="full-width" :class="{'has-error': $v.hose.HAWP.$error}">
                            <label>HAWP (psi)</label>
                        </div>
                        <div>
                            <span v-if="$v.hose.HAWP.$error" class="text-red">Enter a valid HAWP (numeric)</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-dialog-select
                                class="stacked-label"
                                type="radio"
                                v-model="hose.lastTestResult"
                                :options="testResults"
                                label="Test Result"
                                ok-label="Update"
                                cancel-label="Cancel"
                                title="Test Result"
                                @input="updateTestResults()"
                        ></q-dialog-select>
                    </div>
                </div>
                <button v-if="!hose.id" class="positive float-right full-width m-10" @click="save()">
                    Save Hose
                </button>
                <button v-if="hose.id" class="positive float-right full-width m-10" @click="update()">
                    Update Hose
                </button>


            </div>
        </div>
    </div>
</template>

<script src="./EditHose.js"></script>
<style src="./../Admin/Admin.css"></style>
