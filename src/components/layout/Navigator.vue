<template>
	<div v-if="currentHeader" class="container">
		<b-dropdown aria-role="menu" @change="onHeaderChange($event)">
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
		</b-dropdown>
	</div>
</template>

<script>

export default {
	name: 'Navigator',

	data: () => {
		return {
			headers: [
				'RFGK Parken Closed 2021',
				'Siste runder'
			],
			currentHeaders: [],
			currentHeader: null
		};
	},	

	watch:{
		$route (to, from) {
			let header = null;

			switch (to.name) {
				case 'LeaguePage':
					header = 'RFGK Parken Closed 2021';
					break;

				case 'Scorecard':
					header = 'Siste runder';
					break;
			}

			this.currentHeader = header;
			this.currentHeaders = this.headers.filter(h => h !== header);
		}
	},

	methods: {
		onHeaderChange(header) {
			switch (header) {
				case 'RFGK Parken Closed 2021':
					this.$router.push({path: 'league'});
					break;

				case 'Siste runder':
					this.$router.push({path: '/'});
					break;
			}
		}
	}
};

</script>

<style scoped>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 50px;
		margin-bottom: 15px;
	}

	.current-header {
		font-size: 1.3rem;
		height: 100%;
		margin: 0px 5px;
	}

	.navigator-container {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>

<style>
	@media only screen and (min-width: 600px) {
		.dropdown-menu {
			width: 100%;
		}

		.dropdown-content {
			width: fit-content;
			margin: 0px auto;
		}
	}
</style>