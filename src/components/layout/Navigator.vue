<template>
	<div class="bottom-nav-bar">
		<!-- <b-dropdown aria-role="menu" @change="onHeaderChange($event)">
			<template #trigger="{ active }">
				<div class="navigator-container">
					<span style="width: 40px" />
					<span class="current-header" role="button">
						{{ currentHeader }}
					</span>
					<span style="width: 40px; display: flex; align-items: center;"> 
						<b-icon v-if="active" icon="angle-up" />
						<b-icon v-if="!active" icon="angle-down" />
					</span>
				</div>
			</template>
				
			<b-dropdown-item v-for="header in currentHeaders" :key="header" aria-role="menuitem" :value="header"> {{ header }} </b-dropdown-item>
		</b-dropdown> -->
		<router-link class="nav-icon" :style="getColour('ProfilePage')" to="profile">
			<b-icon class="nav-icon" icon="user" />
		</router-link>
		<router-link class="nav-icon rfgk-icon" :style="getColour('Scorecard')" to="/">
			RF<br>GK
		</router-link>
		<router-link class="nav-icon" :style="getColour('LeaguePage')" to="league">
			<b-icon class="nav-icon" icon="trophy" />
		</router-link>
		<router-link class="nav-icon" :style="getColour('SubmitScorecardPage')" to="submitScorecard">
			<b-icon class="nav-icon" icon="plus" />
		</router-link>
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
		getColour(route) {
			if (this.currentRoute === route) {
				return 'color: #7EDEFE;';
			}

			return 'color: #4A4A4A;';
		},

		navToRoute(route) {
			this.$router.push({path: route});
		}
	}
};

</script>

<style scoped>
	.bottom-nav-bar {
		position: fixed;
		z-index: 9999;
		background-color: #f9f9f9;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;

		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 20px;
	}

	.nav-icon {
		width: 50px;
		font-size: 1rem;
		cursor: pointer;
	}

	.rfgk-icon {
		line-height: 73%;
		text-align: center;
		font-weight: 600;
		letter-spacing: -1%;
	}
</style>