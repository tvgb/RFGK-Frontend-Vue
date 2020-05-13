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
		font-size: 2em;
		margin-bottom: 30px;
	}
</style>