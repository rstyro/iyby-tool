<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// 底部导航栏角标
			// setTimeout(() => {
			// 	uni.setTabBarBadge({
			// 		index: 1,
			// 		text: '31'
			// 	});
			// 	uni.showTabBarRedDot({
			// 		index: 3
			// 	});
			// }, 1000);
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	/*每个页面公共css */
	.text-box {
		width: 100%;
		border: 1px solid antiquewhite;
	}
</style>
