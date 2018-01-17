<template>
    <div id="editMeter">
        <admin-nav></admin-nav>
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span v-if='meter.id' class="text-bold text-italic">Meter #{{ meter.serialNumber }}</span>
                <span v-else class="text-bold text-italic">Add a New Meter</span>

                <span v-if='meter.id' class="label bg-blue float-right"><small>Last Updated {{ meter.updatedAt }}</small></span>
            </div>
            <div class="card-content card-force-top-padding">
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <label class="text-primary">Select a Company</label>
                            <button v-if="companySearchTerm" class="autocomplete-clear" @click="meter.companyid = null; companySearchTerm = '';">
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
                                <input :class="{'has-error': $v.meter.companyid.$error}"
                                       v-model="companySearchTerm"
                                       class="full-width"
                                       placeholder="Start Typing (Company Name)"/>
                            </q-autocomplete>

                        </div>
                        <div>
                            <span v-if="$v.meter.companyid.$error" class="text-red">Select a company.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="meter.companyLocationID"
                                :options="locationSelect"
                                :class="{'has-error': $v.meter.companyLocationID.$error}"
                                label="Company Branch Location">
                        </q-select>
                        <div>
                            <span v-if="$v.meter.companyLocationID.$error" class="text-red">Select a company location.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="meter.vesselid"
                                :options="vesselSelect"
                                label="Vessel">
                        </q-select>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input required v-model="meter.serialNumber" class="full-width">
                            <label>Serial Number</label>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="meter.make" class="full-width">
                            <label>Make</label>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="meter.type"
                                :options="typeSelect"
                                label="Type">
                        </q-select>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="meter.reading" class="full-width" :class="{'has-error': $v.meter.reading.$error}">
                            <label>Reading</label>
                        </div>
                        <div>
                            <span v-if="$v.meter.reading.$error" class="text-red">Enter a valid meter reading (numeric).</span>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="meter.size"
                                :options="sizeSelect"
                                label="Size">
                        </q-select>
                    </div>
                </div>

                <button v-if="!meter.id" class="positive float-right full-width m-10" @click="save()">
                    Save Meter
                </button>
                <button v-if="meter.id" class="positive float-right full-width m-10" @click="update()">
                    Update Meter
                </button>


            </div>
        </div>
    </div>
</template>

<script src="./EditMeter.js"></script>
<style src="./../Admin/Admin.css"></style>
