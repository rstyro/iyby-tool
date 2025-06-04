<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onShow() {
			// todo
		},
		//下拉刷新
		onPullDownRefresh: function() {
			// todo
			setTimeout(function() {
				// 可以停止当前页面的下拉刷新
				uni.stopPullDownRefresh();
			}, 1000);
		
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
page {
		height: 100%;
	}

</style>
