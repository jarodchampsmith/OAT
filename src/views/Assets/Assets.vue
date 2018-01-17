<template>
    <div id="assets">
        <admin-nav></admin-nav>
        <fab></fab>

        <div class="card no-border-radius">
            <div class="card-title bg-primary text-white">
                <span>Manage Assets ({{ assets.items.length }})</span>
                <button class="primary float-right  m-t-n-5" @click="addItem()">
                    <small><i>add</i> Add Asset</small>
                </button>
            </div>
            <q-data-table
                :data="assets.items"
                :config="tableConfig"
                :columns="tableColumns">

                <template slot="col-id" scope="cell">
                    <button class="secondary small circular" @click="editItem(cell.row)">
                        <i>edit</i>
                    </button>
                </template>

            </q-data-table>

        </div>
    </div>
</template>

<script src="./Assets.js"></script>
<style src="./../Admin/Admin.css"></style>
