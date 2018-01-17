<template>
    <q-modal ref="photoModal" class="maximized" :content-css="{padding: '20px'}">
        <q-layout>
            <div slot="header" class="toolbar">
                <button @click="$refs.photoModal.close()">
                    <i>keyboard_arrow_left</i>
                </button>
                <q-toolbar-title :padding="3">
                    Add Photos
                </q-toolbar-title>
                <button @click="getPhoto()">
                    <i>add</i>
                </button>
                <button @click="save()">
                    <i>save</i>
                </button>
                <button @click="removeAll()">
                    <i>clear_all</i>
                </button>
            </div>
            <div class="layout-view generic-margin">
                <div class="row gutter  wrap">
                    <div v-for="img in images" :key="img.name" class="width-1of4">
                        <div class="card">
                            <div class="card-title">
                                <div class="floating-label">
                                    <input v-model="img.name" class="full-width">
                                    <label>Title</label>
                                </div></div>
                            <div class="card-media">
                                <img :src="img.src">
                            </div>
                            <div class="card-content">
                                <div class="row items-center">
                                    <span class="text-faded">{{ img.__file.__size }}</span>
                                    <div class="auto"></div>
                                    <button
                                            class="negative clear small"
                                            @click="remove(img.name)"
                                    ><i>close</i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="images.length === 0" class="text-center card-force-top-padding">
                    <div class="text-center">
                        <h5>No Photos Added Yet</h5>
                    </div>

                </div>
                <div class="pull-right generic-margin">
                    <button class="negative" @click="removeAll()">Remove All Photos</button>
                    <button class="primary" @click="getPhoto()">Add Photo</button>
                    <button class="positive" @click="save()">Save & Continue</button>
                </div>
                <input
                        class="hidden"
                        type="file"
                        ref="file"
                        :accept="extensions"
                        :multiple="multiple"
                        @change="addPhotoFromBrowser"
                >

            </div>
        </q-layout>
    </q-modal>

</template>

<script src="./AddPhotos.js"></script>
