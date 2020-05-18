<template>
	<div id="main-container">
		<AppHeader />
		<router-view />
	</div>
</template>

<script>
import AppHeader from './components/layout/AppHeader';

export default {
	name: 'App',
	components: {
		AppHeader
	}
}
</script>

<style>
	#main-container {
		min-height: 100vh;
		width: auto;
		font-family: 'Poppins', sans-serif;
		background-color: #F9F9F9;
	}

	.header {
		font-size: 1.5em;
		margin-bottom: 30px;
	}

	/* th {
		border-width: 0 0 1px !important;
	} */

	.table td, .table th {
		border-width: 0 0 1px !important;
		border-bottom: 1px solid #F9F9F9 !important;
	}

	.table tbody tr:last-child td, .table tbody tr:last-child th {
		border-bottom-width: 0 !important;
	}
		
</style>