<template>
	<div class="container">
		<b-field label="Email">
			<b-input ref="emailInput" v-model="email" type="email" @keyup.enter.native="emailInputEnter()" />
		</b-field>

		<b-field label="Passord">
			<b-input ref="passwordInput" v-model="password" type="password" @keyup.enter.native="startLogin()" />
		</b-field>

		<div class="btn-row">
			<span class="forgot-pw-text" @click="forgotPwBtnClicked()">
				Glemt passordet?
			</span>

			<button class="button is-primary" @click="startLogin()">
				Logg inn
			</button>
		</div>

		<div v-if="!loginSuccessful" class="wrong-email-pw">
			Feil email eller passord.
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
		};
	},
	
	methods: {
		...mapActions([
			'login',
			'getPlayers'
		]),

		created() {
			if (this.$route.query.email) {
				this.email = this.$route.query.email;
			}
		},

		startLogin() {
			this.login({
				email: this.email,
				password: this.password
			}).then(() => {
				this.loginSuccessful = true;
				this.email = '';
				this.password = '';
			}).catch(() => {
				this.loginSuccessful = false;
			});
		},

		emailInputEnter() {
			if (this.$refs.emailInput.checkHtml5Validity()) {
				this.$refs.passwordInput.focus();
			}
		},

		forgotPwBtnClicked() {
			this.$router.push({path: 'getResetPasswordEmail', query: {email: this.email}});
		}
	}
};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.field {
		height: auto;
		width: 100%;
	}

	.forgot-pw-text {
		color: $main-blue-100;
		font-weight: 500;
		margin-left: 5px;
		cursor: pointer;
	}

	.wrong-email-pw {
		margin-top: 20px;
		color: #E85F5C;
	}

	.btn-row {
		margin-top: 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: black;
		width: 100%;
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 400px;
			padding: 20px;
		}
	}

</style>