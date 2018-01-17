<template>
	<div id="loginForm">
		<div class="card">
			<div class="card-title bg-primary text-white">
				Login
			</div>
			<div class="card-content card-force-top-padding">
				<img src="../../assets/maxfield-logo.png" class="responsive big-logo" />
				<div class="stacked-label">
					<input
						type="email"
						v-model="form.email"
						@input="$v.form.email.$touch()"
						:class="{'has-error': $v.form.email.$error}"
					>
					<label>Email Address</label>
				</div>
				<div class="stacked-label">
					<input
						type="password"
						v-model="form.password"
						@input="$v.form.password.$touch()"
						:class="{'has-error': $v.form.password.$error}"
					>
					<label>Password</label>
				</div>
				<button class="primary" @click="fireLogin">
					Login
				</button>
				<div class="block generic-margin">
					<a :href="forgotPasswordLink" target="_blank">Forgot password?</a>
				</div>

			</div>
		</div>
	</div>
</template>

<script src="./Login.js"></script>

<style src="./Login.css"></style>
