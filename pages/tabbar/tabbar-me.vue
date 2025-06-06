<template>
	<view class="page">
		<view class="top">
			<view class="background"></view>
		</view>
		<view class="user-card">
			<view class="card">
				<view class="top">
					<view class="userImage">
						<!-- <open-data type="userAvatarUrl"></open-data> -->
						<!-- <img src="@/static/1.png" /> -->
						<image :src="userInfo.avatarUrl" style="width: 150rpx; height: 150rpx;" :mode="mode"></image>
					</view>
				</view>
				<view class="bottom">
					<view class="left">
						<view class="user-text">
							<!-- <open-data type="userNickName"></open-data> -->
							{{userInfo.nickName}}
						</view>
						<view class="user-phone"> 我就是我不一样的烟火 🎉 </view>
					</view>
					<view class="right flex-center">
						<uni-icons class="icon" type="right"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<view class="list-card">
			<view class="card">
				<view class="item" @click="toFollow">
					<view class="left flex-center">
						<cl-icon class="icon" type="icon-chatbubble-filled" size="25"></cl-icon>
						<!-- <image src="/static/logo.png" mode="aspectFit"></image> -->
					</view>
					<view class="center">
						<text>关注公众号</text>
					</view>
					<view class="right flex-center">
						<cl-icon class="icon" type="icon-right" color="#ccc"></cl-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="quit flex-center">
			<!-- #ifdef MP-WEIXIN -->
			<view class="btn flex-center" v-if="userInfo.needLogin" @click="wxLogin">登录</view>
			<!-- #endif -->

			<!-- #ifndef MP-WEIXIN -->
			<button class="btn flex-center" v-if="userInfo.needLogin" open-type="getUserInfo"
				@getuserinfo="onGotUserInfo">登录</button>
			<!-- #endif -->
			<view class="btn flex-center" v-else @click="logout">退出登录</view>
		</view>

	</view>
</template>


<script>
	export default {
		data() {
			return {
				userInfo: {
					avatarUrl: '/static/images/avatar.jpg',
					nickName: '胖不了小陆',
					needLogin: true,
					city: "",
					country: "",
					gender: 0,
					language: "zh_CN",
					province: ""
				},
				mode: "widthFix"
			};
		},
		onLoad() {

		},

		methods: {
			logout() {
				this.userInfo.nickName = '胖不了小陆';
				this.userInfo.avatarUrl = '../../static/avatar.jpg';
				this.userInfo.needLogin = true;
				saveUserInfoCache(this.userInfo);
			},
			wxLogin() {

			},
			toFollow() {
				// 关注
				this.$Router.push({
					name: "follow"
				});
			},
			
			onGotUserInfo(e) {
				let userInfo = e.detail.userInfo;
				console.log("userIinfo", userInfo);
			}
		},
	};
</script>
<style lang="scss" scoped>
	.page {
		background-color: #eee;
		height: 100vh;
	}

	.top {
		height: 250rpx;
		position: relative;

		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 180rpx;
			width: 100%;
		}
	}

	.icon {
		color: #96a1ae;
		font-size: 40rpx;
	}

	.user-card {
		height: 170rpx;
		padding: 0 15px;

		.card {
			position: relative;
			bottom: 62px;
			height: 250rpx;
			background-color: white;
			border-radius: 5px;

			.top {
				height: 30%;
				position: relative;

				.userImage {
					position: absolute;
					bottom: 24%;
					left: 10%;
					width: 150rpx;
					height: 150rpx;
					overflow: hidden;
					border-radius: 50%;
					border: 2px solid white;

				}
			}

			.bottom {
				display: flex;
				height: 70%;

				.left {
					width: 80%;
					height: 100%;
					position: relative;

					.user-text {
						width: 100%;
						font-size: 1.6em;
						padding-left: 80rpx;
						height: 50%;
					}

					.user-phone {
						color: #96a1ae;
						padding-left: 80rpx;
						height: 50%;
						width: 100%;
						font-size: 0.9em;
					}
				}

				.right {
					width: 20%;
					height: 50%;
				}
			}
		}
	}

	.list-card {
		padding: 0 15px;

		.card {
			border-radius: 5px;
			position: relative;
			background-color: white;
			border-radius: 5px;
			padding: 5px 30px;

			.item {
				display: flex;
				height: 120rpx;

				.left {
					width: 15%;

					image {
						width: 70rpx;
						height: 70rpx;
					}
				}

				.center {
					width: 65%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: 1.1em;
				}

				.right {
					width: 20%;
					justify-content: flex-end;
				}
			}
		}
	}

	.item-bottom-solid {
		border-bottom: 1px solid #d4d6da;
	}

	.quit {
		height: 100rpx;
		margin-top: 50px;

		.btn {
			background-color: #4f99ff;
			border-radius: 30px;
			width: 80%;
			color: white;
			font-size: 1.2em;
			height: 100%;
		}
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>