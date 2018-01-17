<template>
	<div id="admin">
		<admin-nav></admin-nav>
		<fab></fab>
		<div class="card">
			<div class="list bordered inner-delimiter">
				<div class="item multiple-lines">
					<div class="item-content">
						<div class="row">
							<div class="width-2of3">
								<h5 class="flex">Assets</h5>
							</div>
							<div class="width-1of3 text-right caption">{{ assets.items.length }} Asset(s)</div>
						</div>

						<div class="justify-center">
							<div class="row">
								<div class="auto text-center">
									<button @click="go('newAsset')" class="primary circular big"><i>add</i></button>
								</div>
								<div class="auto text-center">
									<button @click="go('assets')" class="primary circular big"><i>brightness_auto</i></button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr/>
				<div class="item multiple-lines">
					<div class="item-content">
						<div class="row">
							<div class="width-2of3">
								<h5 class="flex">Vessels</h5>
							</div>
							<div class="width-1of3 text-right caption">{{ vessels.items.length }} Vessel(s)</div>
						</div>
						<div class="justify-center">
							<div class="row">
								<div class="auto text-center">
									<button @click="go('newVessel')" class="primary circular big"><i>add</i></button>
								</div>
								<div class="auto text-center">
									<button @click="go('vessels')" class="primary circular big"><i>nature</i></button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr/>
				<div class="item multiple-lines">
					<div class="item-content">
						<div class="row">
							<div class="width-2of3">
								<h5 class="flex">Transports</h5>
							</div>
							<div class="width-1of3 text-right caption">{{ transports.items.length }} Transports(s)</div>
						</div>
						<div class="justify-center">
							<div class="row">
								<div class="auto text-center">
									<button @click="go('newTransport')" class="primary circular big"><i>add</i></button>
								</div>
								<div class="auto text-center">
									<button @click="go('transports')" class="primary circular big"><i>local_shipping</i></button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr/>
				<div class="item multiple-lines">
					<div class="item-content">
						<div class="row">
							<div class="width-2of3">
								<h5 class="flex">Meters</h5>
							</div>
							<div class="width-1of3 text-right caption">{{ meters.items.length }} Meter(s)</div>
						</div>
						<div class="justify-center">
							<div class="row">
								<div class="auto text-center">
									<button @click="go('newMeter')" class="primary circular big"><i>add</i></button>
								</div>
								<div class="auto text-center">
									<button @click="go('meters')" class="primary circular big"><i>av_timer</i></button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr/>
				<div class="item multiple-lines">
					<div class="item-content">
						<div class="row">
							<div class="width-2of3">
								<h5 class="flex">Hoses</h5>
							</div>
							<div class="width-1of3 text-right caption">{{ hoses.items.length }} Hose(s)</div>
						</div>
						<div class="justify-center">
							<div class="row">
								<div class="auto text-center">
									<button @click="go('newHose')" class="primary circular big"><i>add</i></button>
								</div>
								<div class="auto text-center">
									<button @click="go('hoses')" class="primary circular big"><i>gesture</i></button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./Admin.js"></script>
<style src="./../Admin/Admin.css"></style>
