<template>
	<view class="container">
		<view>长按识别二维码，关注公众号</view>
		<image :src="imgUrl" mode="aspectFit" show-menu-by-longpress="true"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:"../../../static/images/follow.jpg"
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
}
</style>
