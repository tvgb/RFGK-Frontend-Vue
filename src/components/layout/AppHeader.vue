<template>
	<div class="nav-wrapper">
		<b-navbar>
			<template slot="brand">
				<b-navbar-item tag="router-link" :to="{ path: '/' }">
					<span id="logo">
						RFGK
					</span>
				</b-navbar-item>
			</template>

			<template slot="end">
				<b-navbar-item tag="router-link" :to="{ path: '/league' }">
					<div class="buttons">
						<a class="button">
							<b-icon pack="fas" icon="trophy" />
						</a>
					</div>
				</b-navbar-item>
				<b-navbar-item v-if="isAuthenticated" tag="router-link" :to="{ path: '/profile' }">
					<div class="buttons">
						<a class="button">
							<b-icon pack="fas" icon="user" />
						</a>
					</div>
				</b-navbar-item>
				<b-navbar-item v-if="isAuthenticated" @click="startLogout()">
					<div class="buttons">
						<a class="button">
							Logg ut
						</a>
					</div>
				</b-navbar-item>
				<b-navbar-item v-if="!isAuthenticated" tag="router-link" :to="{ path: '/login' }">
					<div class="buttons">
						<a class="button">
							Logg inn
						</a>
					</div>
				</b-navbar-item>
			</template>
		</b-navbar>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
	name: 'AppHeader',

	computed: mapState({
		isAuthenticated: state => state.player.isAuthenticated
	}),

	methods: {
		...mapActions([
			'logout'
		]),

		startLogout() {
			this.logout();
		}
	}
}

</script>

<style lang="scss" scoped>
	.navbar, .navbar-menu.is-active, .navbar-end, .navbar-item, .buttons, .button {
		background-color: transparent !important;
		box-shadow: none;
	}

	#logo {
		letter-spacing: 5px;
		font-size: 1.7em;
		font-weight: 500;
	}

	.buttons {
		display: flex;
		justify-content: flex-end;
	}

	.nav-wrapper {
		display: none;
	}

	@media only screen and (min-width: 600px) {
		.nav-wrapper {
			display: block;
		}
	}
</style>

<style>
#main-container > .navbar > div.navbar-menu.is-active {
	-webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}
</style>