<template>
    <div id="hoses">
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span>Hose Inspections For Job {{ job.id }}</span>
                <button class="primary float-right  m-t-n-5" @click="addItem()"><small><i>add</i> Add Hose Inspection</small></button>
            </div>
            <q-data-table
                :data="hoses.items"
                :config="tableConfig"
                :columns="tableColumns">

                <template slot="col-id" scope="cell">
                    <button class="secondary small circular" @click="editItem(cell.row)">
                        <i>edit</i>
                    </button>
                </template>

                <template slot="col-assetid" scope="cell">
                    <span class="text-primary cursor-pointer" @click="editAsset(cell.row)">{{ getAsset(cell.data) }}</span>
                </template>

            </q-data-table>

        </div>
    </div>
</template>

<script src="./HoseInspections.js"></script>
<style src="./../Admin/Admin.css"></style>
