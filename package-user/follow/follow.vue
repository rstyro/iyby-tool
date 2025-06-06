<template>
	<view class="container">
		<view class="ti">长按识别二维码，关注公众号</view>
		<image :src="imgUrl" mode="aspectFit" show-menu-by-longpress="true"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: "/static/images/follow.jpg"
			}
		},
		//分享
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"「朋友问我怎么涨粉这么快？我把答案放这里了👇 」#实用工具",
					"「关注公众号，回复【关键词】，立抢限量福利！」",
					"「别再问我怎么涨粉了！公众号二维码甩这里，🙃」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-user/follow/follow',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		text-align: center;
		margin-top: 50px;

		.ti {
			font-size: 16px;
			font-weight: bold;
			padding: 30upx 0;
		}
	}
</style>