<template>
    <div id="editAsset">
        <admin-nav></admin-nav>
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span v-if='asset.id' class="text-bold text-italic">Asset #{{ asset.name }}</span>
                <span v-else class="text-bold text-italic">Add a New Asset</span>
                <span v-if='asset.id' class="label bg-blue float-right"><small>Last Updated {{ asset.updatedAt }}</small></span>
            </div>
            <div class="card-content card-force-top-padding">
                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <input required v-model="asset.name" class="full-width" :class="{'has-error': $v.asset.name.$error}">
                            <label>Name</label>
                        </div>
                        <div>
                            <span v-if="$v.asset.name.$error" class="text-red">Enter a valid asset name.</span>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of1">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="asset.type"
                                :options="typeSelect"
                                :class="{'has-error': $v.asset.type.$error}"
                                label="Type">
                        </q-select>
                        <div>
                            <span v-if="$v.asset.type.$error" class="text-red">Select an asset type.</span>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of1">
                        <div class="stacked-label">
                            <label class="text-primary">Select a Company</label>
                            <button v-if="companySearchTerm" class="autocomplete-clear" @click="asset.companyid = null; companySearchTerm = '';">
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
                                <input :class="{'has-error': $v.asset.companyid.$error}"
                                       v-model="companySearchTerm"
                                       class="full-width"
                                       placeholder="Start Typing (Company Name)"/>
                            </q-autocomplete>

                        </div>
                        <div>
                            <span v-if="$v.asset.companyid.$error" class="text-red">Select a company.</span>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of1">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="asset.companyLocationID"
                                :options="locationSelect"
                                :class="{'has-error': $v.asset.companyLocationID.$error}"
                                label="Company Branch Location">
                        </q-select>
                        <div>
                            <span v-if="$v.asset.companyLocationID.$error" class="text-red">Select a company location.</span>
                        </div>
                    </div>
                </div>

                <div class="row gutter">
                    <div class="width-1of1">
                        <q-select
                                class="full-width stacked-label"
                                type="list"
                                v-model="asset.locationid"
                                :options="locationSelect"
                                :class="{'has-error': $v.asset.locationid.$error}"
                                label="Location">
                        </q-select>
                    </div>
                </div>

                <button v-if="!asset.id" class="positive float-right full-width m-10" @click="save()">
                    Save Asset
                </button>
                <button v-if="asset.id" class="positive float-right full-width m-10" @click="update()">
                    Update Asset
                </button>


            </div>
        </div>
    </div>
</template>

<script src="./EditAsset.js"></script>
<style src="./../Admin/Admin.css"></style>
