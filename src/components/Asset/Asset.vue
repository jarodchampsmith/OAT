<template>
	<div id="asset">
		<div>
			<div class="item-label">Asset Name:</div>
			<input class="auto full-width" v-model="asset.name" placeholder="Name" :class="{'has-error': $v.asset.name.$error}">
			<div>
				<span v-if="$v.asset.name.$error" class="text-red">Enter a valid asset name.</span>
			</div>
		</div>
		<br>
		<div>
			<div class="item-label">Asset Type:</div>
			<q-select
				type="list"
				placeholder="Type"
				v-model="asset.type"
				:options="options.assetTypes"
			></q-select>
		</div>
		<br>
		<q-tabs :refs="$refs" default-tab="tab-vessels" class="justified">
			<q-tab name="tab-vessels" icon="message">
				Vessels ({{ vessels.length }})
			</q-tab>
			<q-tab name="tab-transports" icon="message">
				Transports ({{ transports.length }})
			</q-tab>
			<q-tab name="tab-hoses" icon="message">
				Hoses ({{ attachments.length }})
			</q-tab>
		</q-tabs>
		<div ref="tab-vessels">
			<q-data-table
				ref="tableVessels"
				v-if="asset.id || asset.appGeneratedID"
				:data="vesselsTable"
				:config="config.vessels.table"
				:columns="config.vessels.columns"
			>
				<template slot="col-id" scope="cell">
					<button class="secondary small circular" @click="editVessel(cell.row)">
						<i>edit</i>
					</button>
				</template>
			</q-data-table>
			<button class="primary float-right generic-margin" @click="editVessel()">
				Add Vessel
			</button>
			<q-modal ref="vesselModal" class="maximized" :content-css="{padding: '50px'}">
				<q-layout>
					<div slot="header" class="toolbar">
						<button @click="cancelVessel">
							<i>keyboard_arrow_left</i>
						</button>
						<q-toolbar-title :padding="1">
							<template v-if="current.vesselId">Edit Vessel</template>
							<template v-if="!current.vesselId">Add Vessel</template>
						</q-toolbar-title>
					</div>
					<div class="layout-view">
						<div class="layout-padding form-margin">
							<vessel ref="vesselEditor" :vessel="current.vessel" @input="update"></vessel>
							<hr style="clear:both;">
							<button class="warning float-right generic-margin" @click="cancelVessel()">
								Cancel Vessel
							</button>
							<button class="positive float-right generic-margin" @click="saveVessel()">
								Save Vessel
							</button>
						</div>
					</div>
				</q-layout>
			</q-modal>
		</div>
		<div ref="tab-transports">
			<q-data-table
				ref="tableTransports"
				v-if="asset.id || asset.appGeneratedID"
				:data="transportsTable"
				:config="config.transports.table"
				:columns="config.transports.columns"
			>
				<template slot="col-id" scope="cell">
					<button class="secondary small circular" @click="editTransport(cell.row)">
						<i>edit</i>
					</button>
				</template>
			</q-data-table>
			<button class="primary float-right generic-margin" @click="editTransport()">
				Add Transport
			</button>
			<q-modal ref="transportModal" class="maximized" :content-css="{padding: '50px'}">
				<q-layout>
					<div slot="header" class="toolbar">
						<button @click="cancelTransport">
							<i>keyboard_arrow_left</i>
						</button>
						<q-toolbar-title :padding="1">
							<template v-if="current.transportId">Edit Transport</template>
							<template v-if="!current.transportId">Add Transport</template>
						</q-toolbar-title>
					</div>
					<div class="layout-view">
						<div class="layout-padding form-margin">
							<transport ref="transportEditor" :transport="current.transport" @input="update"></transport>
							<hr style="clear:both;">
							<button class="warning float-right generic-margin" @click="cancelTransport()">
								Cancel Transport
							</button>
							<button class="positive float-right generic-margin" @click="saveTransport()">
								Save Transport
							</button>
						</div>
					</div>
				</q-layout>
			</q-modal>
		</div>
		<div ref="tab-hoses">
			<q-data-table
				ref="tableAttachments"
				v-if="asset.id || asset.appGeneratedID"
				:data="attachmentsTable"
				:config="config.attachments.table"
				:columns="config.attachments.columns"
			>
				<template slot="col-id" scope="cell">
					<button class="secondary small circular" @click="editAttachment(cell.row)">
						<i>edit</i>
					</button>
				</template>
			</q-data-table>
			<button class="primary float-right generic-margin" @click="editAttachment()">
				Add Attachment
			</button>
			<q-modal ref="attachmentModal" class="maximized" :content-css="{padding: '50px'}">
				<q-layout>
					<div slot="header" class="toolbar">
						<button @click="cancelAttachment">
							<i>keyboard_arrow_left</i>
						</button>
						<q-toolbar-title :padding="1">
							<template v-if="current.attachmentId">Edit Attachment</template>
							<template v-if="!current.attachmentId">Add Attachment</template>
						</q-toolbar-title>
					</div>
					<div class="layout-view">
						<div class="layout-padding form-margin">
							<attachment ref="attachmentEditor" :attachment="current.attachment" @input="update"></attachment>
							<hr style="clear:both;">
							<button class="warning float-right generic-margin" @click="cancelAttachment()">
								Cancel Attachment
							</button>
							<button class="positive float-right generic-margin" @click="saveAttachment()">
								Save Attachment
							</button>
						</div>
					</div>
				</q-layout>
			</q-modal>
		</div>
	</div>
</template>

<script src="./Asset.js"></script>
