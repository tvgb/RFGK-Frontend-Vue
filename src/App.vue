<template>
	<div id="main-container">
		<AppHeader v-if="!isMobile()" />
		<Navigator />
		<router-view />
	</div>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue';
import Navigator from './components/layout/Navigator.vue';

export default {
	name: 'App',
	components: {
		AppHeader,
		Navigator
	},

	methods: {
		isMobile() {
			return screen.width <= 600;
		}
	}
};
</script>

<style lang="scss">
	html, body {
		background-color: $main-grey-100;
	}

	#main-container {
		min-height: 100vh;
		width: 100%;
		font-family: 'Poppins', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;;
		background-color: #F9F9F9;
	}

	.table td, .table th {
		border-width: 0 0 1px !important;
		border-bottom: 1px solid #F9F9F9 !important;
	}

	.table tbody tr:last-child td, .table tbody tr:last-child th {
		border-bottom-width: 0 !important;
	}

	.navbar, .navbar-menu.is-active {
		background-color: transparent !important;
	}
		
</style>