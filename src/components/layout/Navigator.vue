<template>
	<div class="top-nav-bar">
		<div class="header-row">
			<span class="icon-span" />
			<h1 class="header" :class="{'league-page-header': currentRoute === 'LeaguePage', 'small-header': currentRoute === 'GetResetPasswordEmailPage'}">
				{{ getCurrentHeader() }}
				<b-icon v-if="!navBarExpanded" icon="chevron-down" class="nav-chevron" :class="{'league-page-chevron': currentRoute === 'LeaguePage'}" @click.native="toggleNavBar()" />
			</h1>
			<b-icon v-if="navBarExpanded" icon="chevron-up" class="nav-chevron" :class="{'league-page-chevron': currentRoute === 'LeaguePage'}" @click.native="toggleNavBar()" />
		</div>
		
		<div v-if="navBarExpanded" class="scroll-div">
			<div class="nav-btns-wrapper">
				<div class="spacer-nav-btn"> SPACER </div>
				<div class="nav-btn" @click="goToRoute('/')"> Scorecards </div>
				<div class="nav-btn" @click="goToRoute('/league')"> Serie </div>
				<div class="nav-btn" @click="goToRoute('/submitscorecard')"> Legg til runde </div>
				<div class="nav-btn" @click="goToRoute('/profile')"> Profil </div>
				<div class="spacer-nav-btn"> SPACER </div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'Navigator',

	data: () => {
		return {
			currentRoute: null,
			navBarExpanded: false
		};
	},

	watch:{
		$route (to, from) {
			this.navBarExpanded = false;
			this.currentRoute = to.name;
		}
	},

	methods: {
		goToRoute(route) {
			this.navBarExpanded = false;
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
		// animation: colour-animation 5s infinite alternate;
	}

	.league-page-chevron {
		color: #eb774d;
	}

	.scroll-div {
		height: 60px;
		overflow-x: auto;
		overflow-y: hidden;
		display: flex;
		align-items: center;
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}

	.scoll-div::-webkit-scrollbar {
		display: none;
	}

	.nav-btns-wrapper {
		display: flex;
		align-items: center;
	}

	.nav-btn {
		text-transform: uppercase;
		border: 1px solid $main-grey-200;
		font-size: 0.9rem;
		border-radius: 4px;
		padding: 10px;
		height: 40px;
		margin: 0 8px;
		white-space: nowrap;
		cursor: pointer;
	}

	.spacer-nav-btn {
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