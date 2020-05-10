<template>

<b-navbar>
	<template slot="brand">
		<b-navbar-item tag="router-link" :to="{ path: '/' }">
			<span id="logo">
				RFGK
			</span>
		</b-navbar-item>
	</template>

	<template slot="end">
		<b-navbar-item tag="div">
			<div class="buttons">
				<a class="button is-light">
					Logg inn
				</a>
			</div>
		</b-navbar-item>
	</template>
</b-navbar>

</template>

<script>

export default {
	name: 'AppHeader'
}

</script>

<style scoped>
.navbar {
	background-color: transparent;
}

#logo {
	letter-spacing: 5px;
	font-size: 1.7em;
	font-weight: 500;
}
</style>