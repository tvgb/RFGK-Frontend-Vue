<template>
	<div class="container">
		<h1 class="header">
			Logg inn
		</h1>

		<b-field label="Email">
			<b-input v-model="email" type="email"></b-input>
		</b-field>

		<b-field label="Passord">
			<b-input v-model="password" type="password"></b-input>
		</b-field>

		<b-field horizontal><!-- Label left empty for spacing -->
			<p class="control">
				<button v-on:keyup.enter="startLogin()" @click="startLogin()" class="button is-primary">
					Logg inn
				</button>
			</p>
		</b-field>

		<div v-if="!loginSuccessful">
			Wrong email or password.
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'LoginPage',
	
	data() {
		return {
			email: '',
			password: '',
			loginSuccessful: true
		}
	},
	
	methods: {
		...mapActions([
			'login',
			'getPlayers'
		]),

		async startLogin() {
			this.loginSuccessful = await this.login({
				email: this.email,
				password: this.password
			});

			this.email = '';
			this.password = '';
		}
	}
}
</script>

<style>
	.container {
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.field {
		height: auto;
		width: 100%;
	}

	.field p button {
		float: right;;
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 300px;
			padding: 0;
		}
	}

</style>