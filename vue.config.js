const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
module.exports = {
	// 关键配置：设置静态资源前缀
	publicPath: process.env.BASE_URL || '/tools/', // 动态或固定前缀
	configureWebpack: {
		devtool: 'source-map',
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'meta','aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	}
}