<template>
	<div class="container">
		<h1 class="header">
			Lag nytt passord
		</h1>

		<b-field label="Nytt passord">
			<b-input v-model="newPassword" type="password" />
		</b-field>

		<b-field label="Gjenta passordet">
			<b-input v-model="repeatPassword" type="password" />
		</b-field>

		<div class="btn-row">
			<button class="button is-primary" @keyup.enter="saveBtnClicked()" @click="saveBtnClicked()">
				Lagre
			</button>
		</div>

		<div v-if="resetFailed" class="reset-failed-text">
			Noe gikk galt under oppdateringen av passordet.
		</div>
		
		<div v-if="wrongRepeatPassword" class="reset-failed-text">
			Passordene stemmer ikke overens.
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'ResetPasswordPage',
	
	data() {
		return {
			newPassword: '',
			repeatPassword: '',
			resetFailed: false,
			wrongRepeatPassword: false
		}
	},

	methods: {
		...mapActions([
			'resetPassword'
		]),

		saveBtnClicked() {
			this.wrongRepeatPassword = false;
			this.resetFailed = false;

			if (this.newPassword !== this.repeatPassword) {
				this.wrongRepeatPassword = true;
			} else {
				this.resetPassword({password: this.newPassword})
					.then((res) => {
						this.$router.push({path: '/login', query: {email: res.email}})
					})
					.catch(() => {
						this.resetFailed = true;
					})
					.finally(() => {
						this.newPassword = '';
						this.repeatPassword = '';
					});
			}
		},
	},

	beforeRouteLeave (to, from, next) {
		this.$cookies.remove('access_token');
		next();
	}
}
</script>

<style scoped>
	.container {
		width: 400px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.field {
		height: auto;
		width: 100%;
	}

	.forgot-pw-text {
		color: #7957d5;
		margin-left: 5px;
		cursor: pointer;
	}

	.btn-row {
		margin-top: 30px;
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
		width: 100%;
	}

	.reset-failed-text {
		margin-top: 20px;
		color: #E85F5C;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
			padding: 30px;
		}
	}

</style>