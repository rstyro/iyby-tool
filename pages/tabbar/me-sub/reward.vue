<template>
	<view class="container">
		<view class="ti">长按如下图片，识别赞赏码</view>
		<image :src="imgUrl" mode="aspectFit" show-menu-by-longpress="true"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:"../../../static/images/reward.png"
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">

.container{
	text-align: center;
	margin-top: 50px;
	
	.ti{
		font-size: 16px;
		font-weight: bold;
		padding: 30upx 0;
	}
}
</style>
