<template>
	<div class="top-nav-bar">
		<div class="header-row" @click="toggleNavBar()">
			<span class="icon-span" />
			<h1 class="header" :class="{'league-page-header': currentRoute === 'LeaguePage', 'small-header': currentRoute === 'GetResetPasswordEmailPage'}">
				{{ getCurrentHeader() }}
			</h1>
			<b-icon 
				icon="chevron-down" 
				class="nav-chevron" 
				:class="{'league-page-chevron': currentRoute === 'LeaguePage', 'active': navBarExpanded}" />
		</div>
		
		<div class="scroll-div" :class="{'active': navBarExpanded}">
			<div class="nav-btns-wrapper">
				<div class="spacer-nav-btn"> SPACER </div>
				<span v-if="!isAuthenticated" class="nav-btn" :class="{'active': currentRoute === 'LoginPage'}" @click="goToRoute('/login')"> Logg inn </span>
				<span class="nav-btn" :class="{'active': currentRoute === 'Scorecard'}" @click="goToRoute('/')"> Scorecards </span>
				<span class="nav-btn league-nav-btn" :class="{'active': currentRoute === 'LeaguePage'}" @click="goToRoute('/league')"> Serie </span>
				<span v-if="isAuthenticated" class="nav-btn" :class="{'active': currentRoute === 'SubmitScorecardPage'}" @click="goToRoute('/submitscorecard')"> Legg til runde </span>
				<span v-if="isAuthenticated" class="nav-btn" :class="{'active': currentRoute === 'ProfilePage'}" @click="goToRoute('/profile')"> Profil </span>
				<div class="spacer-nav-btn"> SPACER </div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Navigator',

	data: () => {
		return {
			currentRoute: null,
			currentPath: null,
			navBarExpanded: false
		};
	},

	computed: {
		...mapState({
			isAuthenticated: state => state.player.isAuthenticated
		})
	},

	watch:{
		$route (to, from) {
			this.navBarExpanded = false;
			this.currentRoute = to.name;
			this.currentPath = to.path;
		}
	},

	methods: {
		goToRoute(route) {
			this.navBarExpanded = false;
			if (route === this.currentPath) {
				return;
			}
			this.$router.push({path: route});
		},

		getCurrentHeader() {
			switch(this.currentRoute) {
				case 'Scorecard':
					return 'SCORECARDS';
				case 'LeaguePage':
					return 'RFGK Serie 2021';
				case 'SubmitScorecardPage':
					return 'Legg til runde';
				case 'ProfilePage':
					return 'Profil';
				case 'LoginPage':
					return 'Logg inn';
				case 'ResetPasswordPage':
					return 'Lag nytt passord';
				case 'GetResetPasswordEmailPage':
					return 'Gjenopprett passordet';
				default:
					return 'SCORECARDS';
			}
		},

		toggleNavBar() {
			this.navBarExpanded = !this.navBarExpanded;
		}
	}
}
</script>

<style lang="scss" scoped>
	.top-nav-bar {
		padding: 15px 0px;
	}

	.header-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.small-header {
		font-size: 1.4rem;
	}

	.league-page-header {
		font-size: 1.6rem;
		background-image: $main-gradient-yellow-red;
		background-size: 100%;
	}

	.icon-span {
		width: 50px;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.nav-chevron {
		width: 50px;
		height: 100%;
		color: $main-blue-100;
		font-weight: 900;
		font-size: 20px;
		cursor: pointer;
		transition: transform 200ms ease-out;
	}

	.nav-chevron.active {
		transform: rotate(180deg);
	}

	.league-page-chevron {
		color: #eb774d;
	}

	.scroll-div {
		height: 0px;
		overflow-x: auto;
		overflow-y: hidden;
		display: flex;
		align-items: center;
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
		transition: height 100ms ease-out;
	}

	.scroll-div::-webkit-scrollbar {
		display: none;
	}

	.scroll-div.active {
		height: 40px;
	}

	.nav-btns-wrapper {
		display: flex;
		align-items: center;
	}

	.nav-btn {
		line-height: 36px;
		text-align: center;
		text-transform: uppercase;
		color: $main-grey-300;
		font-size: 1rem;
		font-weight: 400;
		padding: 2px 10px;
		height: 40px;
		margin: 0 8px;
		white-space: nowrap;
		cursor: pointer;
	}

	span.nav-btn.active {
		font-weight: 500;
		background-size: 300%;
		background-position-x: 50%;
		background-image: $main-gradient-blue;
		background-clip: text;
		color: transparent;
	}

	.nav-btn.league-nav-btn.active {
		font-weight: 500;
		color: transparent;
		background-image: $main-gradient-yellow-red;
		background-size: 300%;
		background-position-x: 50%;
		background-clip: text;
	}

	.spacer-nav-btn {
		width: 30px;
		color: transparent;
		cursor: default;
	}

	.rfgk-icon {
		line-height: 70%;
		text-align: center;
		cursor: pointer;
		font-weight: 700;
		font-size: 13px;
		font-family: 'Montserrat', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	@media only screen and (min-width: 600px) {
		.nav-chevron, .league-page-chevron, .icon-span {
			display: none;
		}
	}

</style>