<template>
	<div class="container">
		<h2 style="font-size: 0.9rem; margin-bottom: 15px;">
			Få tilsendt en link til din email-adresse som lar deg endre passordet ditt. 
		</h2>

		<b-field label="Email">
			<b-input v-model="email" type="email" />
		</b-field>

		<div class="btn-row">
			<button :disabled="!email" class="button is-primary" @keyup.enter="sendLinkBtnPressed()" @click="sendLinkBtnPressed()">
				Send link!
			</button>
		</div>

		<div v-if="emailSent" class="confirmation-text">
			Hvis email-adressen er korrekt vil du motta en epost i løpet av kort tid!
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'GetResetPasswordEmailPage',
	
	data() {
		return {
			email: '',
			emailSent: false
		};
	},

	created() {
		if (this.$route.query.email) {
			this.email = this.$route.query.email;
		}
	},

	methods: {
		...mapActions([
			'sendResetPasswordEmail'
		]),

		sendLinkBtnPressed() {

			if (this.email) {
				this.sendResetPasswordEmail({email: this.email}).finally(() => {
					this.email = '';
					this.emailSent = true;
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
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
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
	}

	.confirmation-text {
		margin-top: 20px;
		font-size: 0.8rem;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
			padding: 30px;
		}
	}

</style>