const GoogleFontsPlugin = require('google-fonts-webpack-plugin');

module.exports = {
	chainWebpack: config => {
		plugins: [
			new GoogleFontsPlugin({
				fonts: [
					{ family: 'Poppins' },
					{ family: 'montserrat'}
				],
			})
		];
	},

	css: {
		loaderOptions: {
			sass: {
				additionalData: '@import "@/assets/scss/colours.scss"; @import "@/assets/scss/classes.scss";'
			}
		}
	}
};