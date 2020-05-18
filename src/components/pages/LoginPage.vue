<template>
	<div class="container">
		<h1 class="header">
			Logg inn
		</h1>

		<b-field label="Email">
			<b-input expanded="true" type="email" value=""></b-input>
		</b-field>

		<b-field label="Passord">
			<b-input value="" type="password"></b-input>
		</b-field>

		<b-field horizontal><!-- Label left empty for spacing -->
			<p class="control">
				<button class="button is-primary">
					Logg inn
				</button>
			</p>
		</b-field>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'LoginPage',
	
	methods: {
		...mapActions([
			'login'
		])
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