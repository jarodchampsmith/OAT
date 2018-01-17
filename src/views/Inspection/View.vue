<template>
	<div id="inspection">
		<fab></fab>
		<add-photos ref="addPhotos" :inspection="inspection"></add-photos>
		<button class="categories primary small circular" @click="$refs.categories.open()">
			<i>menu</i>
		</button>
		<q-drawer ref="categories">
			<div class="list platform-delimiter">
				<div class="toolbar light">
					<q-toolbar-title :padding="1">
						Categories
					</q-toolbar-title>
				</div>
				<div class="list no-border platform-delimiter">
					<div v-for="category in categories">
						<div class="item multiple-lines" :class="{ active: currentTab == category.id }" @click="click(category.id)">
							<div class="item-content">
								{{ (category.tabName || category.name) }}
							</div>
						</div>
						<hr>
					</div>
				</div>
			</div>
		</q-drawer>
		<div class="card">
			<div class="card-title bg-primary text-white">
				<span class="text-bold text-italic">{{ inspection.jobid }}</span>: {{ asset.name }} @ {{ location ? location.name : 'Location N/A' }}
				<span class="label bg-blue float-right"><small>{{ answered }} / {{ answerCount }}</small></span>
			</div>
			<div class="card-content card-force-top-padding no-padding">
					<div class="row shadow-1 group " v-for="category in categories">
							<div class="width-1of1 generic-margin" v-if="currentTab == category.id" >
								<div class="width-1of-1 cursor-pointer" @click.stop="toggleTab(category.id)">
									<h6 @click.stop="toggleTab(category.id)" class="pull-left generic-margin text-primary">{{ (category.tabName || category.name) }}</h6>
									<span @click.stop="toggleTab(category.id)" class="pull-right"><i>keyboard_arrow_up</i></span>
								</div>
								<div style="clear: both;">
									<div v-if="category.id === 'mf-info'" class="generic-margin">
										<div class="row gutter">
											<div class="width-3of5 md-width-1of1">
												<h5>Details</h5>
												<dl>
													<dt v-if="company.name">Company</dt>
													<dd v-if="company.name">{{ company.name }}</dd>
													<dt v-if="job.inspectedAt">Inspection Date</dt>
													<dd v-if="job.inspectedAt">{{ job.inspectedAt | dateOnly }}</dd>
													<dt v-if="inspector.firstName || inspector.lastName">Inspector</dt>
													<dd v-if="inspector.firstName || inspector.lastName">{{ inspector.firstName }} {{ inspector.lastName }}</dd>
												</dl>
											</div>
											<div class="width-2of5 md-width-1of1">
												<h5>Asset: {{ asset.name }}</h5>
												<dl>
													<dt v-if="asset.type">Asset Type</dt>
													<dd v-if="asset.type">{{ assetTypes[asset.type] }}</dd>
												</dl>
											</div>
										</div>
										<div class="row gutter">
											<div class="width-1of2 md-width-1of1">
												<h5>Vessels</h5>
												<div v-for="vessel in vessels">
													<div class="card">
														<div class="card-title">
															{{ vessel.serialNumber }}
														</div>
														<div class="card-content">
															<dl>
																<dt v-if="vessel.TCSpecification">TC Specification</dt>
																<dd v-if="vessel.TCSpecification">{{ vessel.TCSpecification }}</dd>
																<dt v-if="vessel.plateLocation">ASME Plate Location</dt>
																<dd v-if="vessel.plateLocation">{{ vessel.plateLocation }}</dd>
																<dt v-if="vessel.uStamped !== ''">U Stamped</dt>
																<dd v-if="vessel.uStamped !== ''">{{ vessel.uStamped | yesNo }}</dd>
																<dt v-if="vessel.listedCapacity">Listed Capacity</dt>
																<dd v-if="vessel.listedCapacity">{{ vessel.listedCapacity }} {{ vessel.listedCapacityUnit }}</dd>
																<dt v-if="vessel.nationalBoardNumber">National Board Number</dt>
																<dd v-if="vessel.nationalBoardNumber">{{ vessel.nationalBoardNumber }}</dd>
																<dt v-if="vessel.provincialNumber">Provincial Number</dt>
																<dd v-if="vessel.provincialNumber">{{ vessel.provincialNumber }}</dd>
																<dt v-if="vessel.manufacturer">Manufacturer</dt>
																<dd v-if="vessel.manufacturer">{{ vessel.manufacturer }}</dd>
																<dt v-if="vessel.yearBuilt">Year Built</dt>
																<dd v-if="vessel.yearBuilt">{{ vessel.yearBuilt }}</dd>
																<dt v-if="vessel.MAWP">MAWP</dt>
																<dd v-if="vessel.MAWP">{{ vessel.MAWP }} {{ vessel.MAWPUnit }}</dd>
																<dt v-if="vessel.MDMT">MDMT</dt>
																<dd v-if="vessel.MDMT">{{ vessel.MDMT }} {{ vessel.MDMTUnit }}</dd>
																<dt v-if="vessel.CRNorTCRN">CRN or TCRN</dt>
																<dd v-if="vessel.CRNorTCRN">{{ vessel.CRNorTCRN }}</dd>
																<dt v-if="vessel.alteredBy">Altered By</dt>
																<dd v-if="vessel.alteredBy">{{ vessel.alteredBy }}</dd>
																<dt v-if="vessel.diameter">Diameter</dt>
																<dd v-if="vessel.diameter">{{ vessel.diameter }} {{ vessel.diameterUnit }}</dd>
																<dt v-if="vessel.headMaterial">Head Material</dt>
																<dd v-if="vessel.headMaterial">{{ vessel.headMaterial }}</dd>
																<dt v-if="vessel.headThickness">Head Thickness</dt>
																<dd v-if="vessel.headThickness">{{ vessel.headThickness }} {{ vessel.headThicknessUnit }}</dd>
																<dt v-if="vessel.shellMaterial">Shell Material</dt>
																<dd v-if="vessel.shellMaterial">{{ vessel.shellMaterial }}</dd>
																<dt v-if="vessel.shellThickness">Shell Thickness</dt>
																<dd v-if="vessel.shellThickness">{{ vessel.shellThickness }} {{ vessel.shellThicknessUnit }}</dd>
																<dt v-if="vessel.headType">Head Type</dt>
																<dd v-if="vessel.headType">{{ vessel.headType }}</dd>
																<dt v-if="vessel.seamToSeamLength">Seam-to-Seam Length</dt>
																<dd v-if="vessel.seamToSeamLength">{{ vessel.seamToSeamLength }} {{ vessel.seamToSeamLengthUnit }}</dd>
																<dt v-if="vessel.constructedOf">Constructed of</dt>
																<dd v-if="vessel.constructedOf">{{ vessel.constructedOf }}</dd>
																<dt v-if="vessel.stressRelieved !== ''">Stress Relieved</dt>
																<dd v-if="vessel.stressRelieved !== ''">{{ vessel.stressRelieved | yesNo }}</dd>
															</dl>
															<div v-if="meters.length">
																<div v-for="meter in meters">
																	<div v-if="meter.vesselid === vessel.id">
																		<div class="card">
																			<div class="card-title">
																				<strong>Meter:</strong> {{ meter.serialNumber }}
																			</div>
																			<div class="card-content">
																				<dl>
																					<dt v-if="meter.type">Type</dt>
																					<dd v-if="meter.type">{{ meter.type }}</dd>
																					<dt v-if="meter.size">Size</dt>
																					<dd v-if="meter.size">{{ meter.size }}</dd>
																					<dt v-if="meter.make">Make</dt>
																					<dd v-if="meter.make">{{ meter.make }}</dd>
																					<dt v-if="meter.reading">Reading</dt>
																					<dd v-if="meter.reading">{{ meter.reading }}</dd>
																				</dl>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="width-1of2 md-width-1of1">
												<h5>Transports</h5>
												<div v-for="transport in transports">
													<div class="card">
														<div class="card-title">
															{{ transport.name }}
														</div>
														<div class="card-content">
															<dl>
																<dt v-if="transport.type">Type</dt>
																<dd v-if="transport.type">{{ transport.type }}</dd>
																<dt v-if="transport.engineSerialNumber">Engine Serial #</dt>
																<dd v-if="transport.engineSerialNumber">{{ transport.engineSerialNumber }}</dd>
																<dt v-if="transport.engineHours">Engine Hours</dt>
																<dd v-if="transport.engineHours">{{ transport.engineHours }}</dd>
																<dt v-if="transport.chassisSerialNumber">Chassis Serial #</dt>
																<dd v-if="transport.chassisSerialNumber">{{ transport.chassisSerialNumber }}</dd>
																<dt v-if="transport.licensePlate">License Plate</dt>
																<dd v-if="transport.licensePlate">{{ transport.licensePlate }}</dd>
																<dt v-if="transport.manufacturer">Manufacturer</dt>
																<dd v-if="transport.manufacturer">{{ transport.manufacturer }}</dd>
															</dl>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div v-if="attachments.length">
											<div class="row">
												<div class="width-1of1">
													<div class="row gutter">
														<div>
															<div class="width-1of1 sm-width-1of1">
																<div class="card">
																	<div class="card-title">
																		<h5 class="float-left">Attachments (Hoses)</h5>
																		<button class="primary float-right m-t-n-5" @click="openAttachment(asset.id)">
																			<small><i>add</i> Add Attachment</small>
																		</button>
																	</div>
																	<div class="card-content">
																		<table class="q-table horizontal-delimiter striped-even responsive">
																			<thead>
																				<tr>
																					<th class="">Serial #</th>
																					<th class="">Type</th>
																					<th class="">RHB</th>
																					<th class="">Test Date</th>
																					<th class="">HAWP</th>
																					<th class="">Size</th>
																					<th class="">Length</th>
																					<th class="">Test Press.</th>
																					<th class="">Test Result</th>
																					<th class="">Options</th>
																				</tr>
																			</thead>
																			
																			<tbody>
																				<tr v-for="attachment in attachments">
																					<td data-th="Serial #">{{ attachment.serialNumber }} #</td>
																					<td data-th="Type">{{ attachment.type ? attachment.type : "N/A" }}</td>
																					<td data-th="RHB Year">{{ attachment.replacementYear ? attachment.replacementYear : "N/A" }}</td>
																					<td data-th="test Date">{{ attachment.testedAt ? attachment.testedAt : "N/A" }}</td>
																					<td data-th="HAWP">{{ attachment.HAWP ? attachment.HAWP + ' PSI' : "N/A" }}</td>
																					<td data-th="Size">
																						<span v-if="attachment.size">
																							{{ attachment.size }} {{ attachment.sizeUnit }}
																						</span>
																						<span v-else>
																							N/A
																						</span>
																					</td>
																					<td data-th="Length">
																						<span v-if="attachment.length">
																							{{ attachment.length }} {{ attachment.lengthUnit }}
																						</span>
																						<span v-else>
																							N/A
																						</span>
																					</td>
																					<td data-th="Test Pressure">
																						{{ attachment.testPresure ? attachment.testPresure + ' PSI' : "N/A" }}
																					</td>
																					<td data-th="Test Result">
																						<q-dialog-select
																								class="stacked-label"
																								type="radio"
																								v-model="attachment.lastTestResult"
																								:options="attachmentTestResults"
																								label="Test Result"
																								ok-label="Update"
																								cancel-label="Cancel"
																								title="Test Result"
																								@input="updateAttachmentTestResults(attachment)"
																						></q-dialog-select>
																					</td>
																					<td data-th="Options">
																						<button class="secondary small circular" @click="openAttachment(asset.id, attachment)">
																							<i>edit</i>
																						</button>
																					</td>
																				</tr>																				
																			</tbody>
																		</table>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<button class="primary small" @click="openAsset(asset.id)">Edit Asset</button>
									</div>
									<div v-else-if="category.id === 'mf-defects'" class="generic-margin">
										<div class="row gutter">
											<div class="dynamic-content width-1of1">
												<div v-for="(answer, questionid) in answers">
													<div v-if="answer.answer && answer.answer.content === 'Not Acceptable'">
														<mf-defect :questionId="questionid" :inspectionId="inspection.id" :answer="answer" @input="updateDefect"></mf-defect>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div v-else-if="category.id === 'mf-notes'" class="generic-margin">
										<div class="row gutter">
											<div class="dynamic-content width-1of1">
												<div v-for="(answer, questionid) in answers">
													<div v-if="answer.comment !== ''">
														<mf-note :questionid="questionid" :answer="answer" :comment="answer.comment" @mf-note:input="updateComment"></mf-note>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div v-else-if="category.id === 'mf-photos'" class="generic-margin">
										<div class="row gutter">
											<div class="dynamic-content width-1of1">

												<button class="pull-right primary" @click="addPhotos(category)"><i>add</i> Add Photos</button>

												<div class="row gutter wrap">
													<div v-for="(img,index) in uniquePhotos" :key="img.name" class="width-1of4">
														<div class="card">
															<div class="card-title">
																{{ img.title }}
															</div>
															<div class="card-media">
																<img v-if="!$store.getters.isOnline && !img.file" src="../../assets/no-photo.png">
																<img v-if="!$store.getters.isOnline && img.file" :src="img.file">
																<img v-if="$store.getters.isOnline && img.created !== false" :src="photoUrl(img)">
																<img v-if="$store.getters.isOnline && img.created === false" :src="img.file">
															</div>
															<div class="card-content">
																<div class="row items-center">
																	<span class="text-faded">{{ img.description ? img.description : "No description"}}</span>
																	<div class="auto"></div>
																	<button
																			v-if="img.created === false"
																			class="negative clear small"
																			@click="removePhoto(img.appGeneratedID, index)"
																	><i>close</i>
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
												<p v-if="!$store.getters.isOnline">Photo previews are not available in offline mode.</p>
											</div>
										</div>
									</div>
									<div v-else class="generic-margin">
										<div>
											<p v-for="question in questions[category.id]">
												<mf-area v-if="question.type === 'area'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-area>
												<mf-default v-if="question.type === 'default'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-default>
												<mf-fulldate v-if="question.type === 'fullDate'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-fulldate>
												<mf-gps v-if="question.type === 'GPS'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-gps>
												<mf-length v-if="question.type === 'length'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-length>
												<mf-monthyearonly v-if="question.type === 'monthYearOnly'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-monthyearonly>
												<mf-number v-if="question.type === 'number'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-number>
												<mf-pressure v-if="question.type === 'pressure'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-pressure>
												<mf-select v-if="question.type === 'select'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-select>

												<mf-signature v-if="question.type === 'signature'"
															  :numPhotos="numPhotos"
															  :questionId="question.id"
															  :inspectionId="inspection.id"
															  :answer="answers[question.id]"
															  @input="update">
												</mf-signature>

												<mf-temperature v-if="question.type === 'temperature'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-temperature>
												<mf-text v-if="question.type === 'text'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-text>
												<mf-volume v-if="question.type === 'volume'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-volume>
												<mf-weight v-if="question.type === 'weight'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-weight>
												<mf-year v-if="question.type === 'yearOnly'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-year>
												<mf-yesno v-if="question.type === 'yesNo'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-yesno>
												<mf-yesnona v-if="question.type === 'yesNoNA'" :questionId="question.id" :inspectionId="inspection.id" :answer="answers[question.id]" @input="update"></mf-yesnona>
											</p>
										</div>
									</div>
								</div>
							</div>

							<div v-else class="width-1of1 generic-margin cursor-pointer" @click.stop="toggleTab(category.id)">
								<h6 @click.stop="toggleTab(category.id)" class="pull-left  generic-margin">{{ (category.tabName || category.name) }}</h6>
								<span @click.stop="toggleTab(category.id)" class="pull-right"><i>keyboard_arrow_down</i></span>
							</div>

					</div>
			</div>
		</div>

		<q-modal ref="assetModal" class="maximized" :content-css="{padding: '50px'}">
			<q-layout>
				<div slot="header" class="toolbar">
					<button @click="cancelAsset">
						<i>keyboard_arrow_left</i>
					</button>
					<q-toolbar-title :padding="1">
						<div v-if="current.assetId">Edit Asset</div>
						<div v-if="!current.assetId">Add Asset</div>
					</q-toolbar-title>
				</div>
				<div class="layout-view">
					<div class="layout-padding form-margin">
						<asset ref="assetEditor" :asset="current.asset" @input="update"></asset>
						<hr style="clear:both;">
						<button class="warning float-right generic-margin" @click="cancelAsset()">
							Cancel Asset
						</button>
						<button class="positive float-right generic-margin" @click="saveAsset()">
							Save Asset
						</button>
					</div>
				</div>
			</q-layout>
		</q-modal>

	</div>
</template>

<script src="./View.js"></script>

<style src="./View.css"></style>
