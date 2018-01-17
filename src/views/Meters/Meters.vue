<template>
    <div id="meters">
        <admin-nav></admin-nav>
        <fab></fab>
        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span>Manage Meters ({{ meters.items.length }})</span>
                <button class="primary float-right  m-t-n-5" @click="addItem()">
                    <small><i>add</i> Add Meter</small>
                </button>
            </div>
            <q-data-table
                :data="meters.items"
                :config="tableConfig"
                :columns="tableColumns">

                <template slot="col-id" scope="cell">
                  <button class="secondary small circular" @click="editItem(cell.row)">
                    <i>edit</i>
                  </button>
                </template>

                <template slot="col-vesselid" scope="cell">
                    <span v-if="cell.data" class="text-primary cursor-pointer" @click="editVessel(cell.row)">{{ getVessel(cell.data) }}</span>
                    <span v-else>{{ getVessel(cell.data) }}</span>
                </template>


            </q-data-table>

        </div>
    </div>
</template>

<script src="./Meters.js"></script>
<style src="./../Admin/Admin.css"></style>
