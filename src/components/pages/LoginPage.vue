<template>
	<div class="outer-login-container">
		<div class="login-container" v-if="!forgotPasswordInitiated">
			<h1 class="header">
				Logg inn
			</h1>

			<b-field :message="validationMessage" class="input-field" label="Email">
				<b-input ref="emailInput" v-model="email" type="email"></b-input>
			</b-field>

			<b-field :message="validationMessage" class="input-field" label="Passord">
				<b-input ref="passwordInput" v-model="password" type="password"></b-input>
			</b-field>

			<div class="checkbox-field">
				<b-checkbox size="is-small">
					Forbli innlogget
				</b-checkbox>
			</div>

			<b-field class="input-field" horizontal><!-- Label left empty for spacing -->
				<p class="control">
					<button v-on:keyup.enter="startLogin()" @click="startLogin()" class="button is-primary">
						Logg inn
					</button>
				</p>
			</b-field>

			<div style="text-align: center" v-if="!loginSuccessful" v-on:click="forgotPasswordInitiated = true">
				<a style="text-align: center">
					Trykk her hvis du klart å glemme passordet...
				</a>				
			</div>
		</div>
		<div class="new-email-sent" v-else>
			Instruksjoner for å få et nytt passord har blitt sendt til epost-addressen {{ email }}.
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
			loginSuccessful: true,
			validationMessage: '',
			forgotPasswordInitiated: false
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

			if (!this.loginSuccessful) {
				this.validationMessage = 'Feil email eller passord';
				this.$refs.emailInput.setInvalid();
				this.$refs.passwordInput.setInvalid();
			}

			this.password = '';
		}
	}
}
</script>

<style scoped>

	.outer-login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 300px;
	}

	.input-field {
		height: auto;
		width: 100%;
	}

	.input-field p button {
		float: right;;
	}

	.checkbox-field {
		align-self: flex-start;
		margin-left: 2px;
	}

	.new-email-sent {
		margin-top: 100px;
	}

	@media only screen and (max-width: 600px) {
		.outer-login-container {
			width: 100%;
			padding: 20px;
		}
	}

</style>