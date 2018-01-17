<template>
    <div id="editTransport">
        <admin-nav></admin-nav>
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span v-if='transport.id' class="text-bold text-italic">Transport ({{ transport.name }})</span>
                <span v-else class="text-bold text-italic">Add a New Transport</span>

                <span v-if='transport.id' class="label bg-blue float-right"><small>Last Updated {{ transport.updatedAt }}</small></span>
            </div>
            <div class="card-content card-force-top-padding">
                <div class="row gutter">
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <label class="text-primary">Select a Company</label>
                            <button v-if="companySearchTerm" class="autocomplete-clear" @click="transport.companyid = null; companySearchTerm = '';">
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
                                <input :class="{'has-error': $v.transport.companyid.$error}"
                                       v-model="companySearchTerm"
                                       class="full-width"
                                       placeholder="Start Typing (Company Name)"/>
                            </q-autocomplete>

                        </div>
                        <div>
                            <span v-if="$v.transport.companyid.$error" class="text-red">Select a company.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="transport.companyLocationID"
                                :options="locationSelect"
                                :class="{'has-error': $v.transport.companyLocationID.$error}"
                                label="Company Branch Location">
                        </q-select>
                        <div>
                            <span v-if="$v.transport.companyLocationID.$error" class="text-red">Select a company location.</span>
                        </div>
                    </div>
                    <div class="width-1of3">
                        <div class="stacked-label">
                            <label class="text-primary">Select an Asset</label>
                            <button v-if="assetSearchTerm" class="autocomplete-clear" @click="transport.assetid = null; assetSearchTerm = '';">
                                <i class="mat-only">clear</i>
                                <i class="ios-only">cancel</i>
                            </button>
                            <q-autocomplete
                                    ref="assetSearch"
                                    v-model="assetSearchTerm"
                                    :delay="300"
                                    :class="{ disabled: !transport.companyid }"
                                    :max-results="8"
                                    @search="assetSearch"
                                    @selected="assetSelected"
                                    :delimiter="true"
                            >
                                <input v-model="assetSearchTerm" class="full-width" placeholder="Start Typing (Asset Name)"/>
                            </q-autocomplete>
                        </div>
                        <!--
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="transport.assetid"
                                :options="assetSelect"
                                label="Asset">
                        </q-select>
                        -->
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of2">
                        <div class="stacked-label">
                            <input v-model="transport.name" class="full-width">
                            <label>Name</label>
                        </div>
                    </div>
                    <div class="width-1of2">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="transport.type"
                                :options="typeSelect"
                                @input="$forceUpdate()"
                                :class="{'has-error': $v.transport.type.$error}"
                                label="Type">
                        </q-select>
                        <div>
                            <span v-if="$v.transport.type.$error" class="text-red">Transport type is a required field.</span>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input  v-model="transport.engineSerialNumber"  class="full-width">
                            <label>Engine Serial Number</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input type="number" v-model="transport.engineHours" class="full-width" :class="{'has-error': $v.transport.engineHours.$error}">
                            <label>Engine Hours</label>
                        </div>
                        <div>
                            <span v-if="$v.transport.engineHours.$error" class="text-red">Enter a valid number for engine hours.</span>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input v-model="transport.chassisSerialNumber" class="full-width">
                            <label>Chassis Serial Number</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input v-model="transport.licensePlate" class="full-width">
                            <label>License Plate</label>
                        </div>
                    </div>
                </div>
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input v-model="transport.manufacturer" class="full-width">
                            <label>Manufacturer (Farm wagons only)</label>
                        </div>
                    </div>
                </div>

                <button v-if="!transport.id" class="positive float-right full-width m-10" @click="save()">
                    Save Transport
                </button>
                <button v-if="transport.id" class="positive float-right full-width m-10" @click="update()">
                    Update Transport
                </button>

            </div>
        </div>
    </div>
</template>

<script src="./EditTransport.js"></script>
<style src="./../Admin/Admin.css"></style>
