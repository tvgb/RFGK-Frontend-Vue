<template>
	<div class="bottom-nav-bar">
		<div class="gradient" />
		<div class="icons-wrapper">
			<b-icon class="nav-icon" icon="user" :class="{selected: currentRoute === 'ProfilePage'}" @click.native="goToRoute('/profile')" />
			<span class="rfgk-icon nav-icon" :class="{selected: currentRoute === 'Scorecard'}" @click="goToRoute('/')">
				RF<br>GK
			</span>
			<b-icon class="nav-icon" :class="{selected: currentRoute === 'LeaguePage'}" icon="trophy" @click.native="goToRoute('/league')" />
			<b-icon class="nav-icon" icon="plus" :class="{selected: currentRoute === 'SubmitScorecardPage'}" @click.native="goToRoute('/submitscorecard')" />
		</div>
	</div>
</template>

<script>

export default {
	name: 'Navigator',

	data: () => {
		return {
			currentRoute: null
		};
	},

	watch:{
		$route (to, from) {
			this.currentRoute = to.name;
		}
	},

	methods: {
		goToRoute(route) {
			this.$router.push({path: route});
		}
	}
}
</script>

<style lang="scss" scoped>
	.bottom-nav-bar {
		position: fixed;
		z-index: 9999;
		background-color: transparent;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100px;
	}

	.gradient {
		background-image: linear-gradient(0deg, $main-grey-100 0%, $main-grey-100 20%, rgba(0, 0, 0, 0) 100%);
		height: 50%;
	}

	.icons-wrapper {
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 20px;
		align-items: center;
		text-align: center;
		background-color: $main-grey-100;
	}

	.nav-icon {
		width: 50px;
		font-size: 1.1rem;
		cursor: pointer;
		color: $main-grey-500;
	}

	.rfgk-link {
		width: 50px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 3px;
	}

	.rfgk-icon {
		line-height: 70%;
		text-align: center;
		cursor: pointer;
		font-weight: 700;
		font-size: 13px;
		font-family: 'Montserrat';
	}

	.selected {
		color: $main-blue-100;
	}
</style>