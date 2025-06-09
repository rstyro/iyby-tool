<template>
	<view class="page">
		<!-- 顶部渐变背景区域 -->
		<view class="top-banner">
			<!-- <image class="banner-wave" src="/static/logo.png" mode="scaleToFill"></image> -->
		</view>

		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="card-content">
				<view class="user-avatar-wrapper">
					<image :src="userInfo.avatarUrl" class="user-avatar" :mode="mode"></image>
					<view class="status-dot"></view>
				</view>
				<view class="user-info">
					<view class="user-name">{{userInfo.nickName}}</view>
					<view class="user-tagline">我就是我不一样的烟火 🎉</view>
					<view class="user-badges">
						<view class="badge" :class="userInfo.vip?'vip':'normal'">{{userInfo.vip?'VIP会员':'普通会员'}}</view>
						<!-- <view class="badge normal">铂金用户</view> -->
					</view>
				</view>
			</view>
			<view class="stats-bar">
				<view class="stat-item">
					<text class="stat-number">{{userInfo.score}}</text>
					<text class="stat-label">积分</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-number">{{userInfo.badge}}</text>
					<text class="stat-label">勋章</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-number">0</text>
					<text class="stat-label">关注</text>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="list-card">
			<view class="card">
				<view class="item" @click="toFollow">
					<view class="left flex-center">
						<cl-icon class="icon" type="icon-guanzhugongzhonghao" size="25" color="#4f99ff"></cl-icon>
					</view>
					<view class="center">
						<text>关注公众号</text>
					</view>
					<view class="right flex-center">
						<cl-icon class="icon" type="icon-right" color="#aaa"></cl-icon>
					</view>
				</view>
				<view class="item item-bottom-solid" @click="toOtherMiniProgram">
					<view class="left flex-center">
						<cl-icon class="icon" type="icon-rocket" size="23" color="#4f99ff"></cl-icon>
					</view>
					<view class="center">
						<text>我的其他小程序</text>
						<text class="item-tag">新功能</text>
					</view>
					<view class="right flex-center">
						<cl-icon class="icon" type="icon-right" color="#aaa"></cl-icon>
					</view>
				</view>
				<!-- <view class="item">
					<view class="left flex-center">
						<cl-icon class="icon" type="icon-heart" size="25" color="#FF5252"></cl-icon>
					</view>
					<view class="center">
						<text>我的收藏</text>
					</view>
					<view class="right flex-center">
						<cl-icon class="icon" type="icon-right" color="#aaa"></cl-icon>
					</view>
				</view> -->
			</view>
		</view>

		<!-- 其他功能卡片 -->
		<!-- 		<view class="list-card">
			<view class="card">
				<view class="item" @click="navigateTo('settings')">
					<view class="left flex-center">
						<cl-icon class="icon" type="icon-setting" size="25" color="#4f99ff"></cl-icon>
					</view>
					<view class="center">
						<text>系统设置</text>
					</view>
					<view class="right flex-center">
						<cl-icon class="icon" type="icon-right" color="#aaa"></cl-icon>
					</view>
				</view>
				<view class="item" @click="navigateTo('feedback')">
					<view class="left flex-center">
						<cl-icon class="icon" type="icon-yijianfankui" size="25" color="#4f99ff"></cl-icon>
					</view>
					<view class="center">
						<text>问题反馈</text>
					</view>
					<view class="right flex-center">
						<cl-icon class="icon" type="icon-right" color="#aaa"></cl-icon>
					</view>
				</view>
			</view>
		</view> -->


		<!-- 退出/登录按钮 -->
		<view class="button-area">

			<!-- H5专用点击区域 -->
			<!-- #ifdef H5 -->
			<button class="login-btn" v-if="userInfo.needLogin" @click="chooseAvatarForH5">
				登录账号
			</button>
			<!-- #endif -->
			
			
			<!-- 微信小程序专用按钮 -->
			<!-- #ifndef H5 -->
			<button :disabled="isChoosingAvatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"
				v-if="userInfo.needLogin" class="login-btn">获取头像</button>
			<!-- #endif -->


			<button v-else class="logout-btn" @click="logout">退出登录</button>


		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					avatarUrl: '/static/images/avatar.jpg',
					// avatarUrl: '/static/logo.png',
					nickName: '胖不了小陆',
					needLogin: true,
					vip: true,
					score: 999,
					badge: 10

				},
				isChoosingAvatar: false,
				mode: "aspectFill"
			};
		},
		methods: {
			async onChooseAvatar(e) {
				try {
					this.isChoosingAvatar = true;
					let tempPath = '';
					if (e.detail?.avatarUrl) {
						tempPath = e.detail.avatarUrl;
					}
					if (!tempPath) {
						uni.showToast({
							title: '获取头像失败',
							icon: 'none'
						});
						return;
					}
					this.userInfo.avatarUrl = tempPath;
					this.userInfo.needLogin = false;
					this.userInfo.vip = false;
					this.userInfo.score = 0;
					this.userInfo.badge = 0;

				} catch (error) {
					console.error('头像处理失败:', error);
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					});
				} finally {
					this.isChoosingAvatar = false;
				}
			},
			// H5专用头像选择方法
			async chooseAvatarForH5() {
				uni.showToast({
					title: '未开放登录功能',
					icon: 'success'
				});
			},
			logout() {
				uni.showModal({
					title: '确认退出',
					content: '确定要退出当前账号吗？',
					success: (res) => {
						if (res.confirm) {
							this.userInfo.nickName = '胖不了小陆';
							this.userInfo.avatarUrl = '/static/images/avatar.jpg';
							this.userInfo.needLogin = true;
							this.userInfo.score = 999;
							this.userInfo.badge = 10;
							uni.showToast({
								title: '已退出',
								icon: 'success'
							});
						}
					}
				});
			},
			toFollow() {
				this.$Router.push({
					name: "follow"
				});
			},
			toOtherMiniProgram() {
				uni.showModal({
					title: '打开小程序',
					content: '即将打开关联小程序，是否继续？',
					success: (res) => {
						if (res.confirm) {
							// #ifdef MP-WEIXIN
							uni.navigateToMiniProgram({
								appId: 'wxb17c548aacf18210', // 替换为目标小程序的appid
								success: () => {
									console.log('打开小程序成功');
								},
								fail: (err) => {
									uni.showToast({
										title: '打开失败，请重试',
										icon: 'none'
									});
									console.error('打开小程序失败:', err);
								}
							});
							// #endif
							// #ifndef MP-WEIXIN
							uni.showToast({
								title: '请在微信小程序中使用此功能',
								icon: 'none'
							});
							// #endif
						}
					}
				});
			},
			navigateTo(page) {
				// console.log('跳转到:', page);
				uni.showToast({
					title: '正在开发中',
					icon: 'none'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		background: linear-gradient(to bottom, #f9fafd, #f0f5ff);
		min-height: 100vh;
		padding-bottom: 120rpx;
		position: relative;
	}

	.top-banner {
		height: 300rpx;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #5199ff, #7e8cfa);

		.banner-wave {
			position: absolute;
			width: 100%;
			bottom: 0;
			height: 80rpx;
		}
	}

	.user-card {
		position: relative;
		margin: -100rpx 25rpx 40rpx;
		background: #ffffff;
		border-radius: 24rpx;
		box-shadow: 0 10rpx 30rpx rgba(79, 153, 255, 0.15);
		overflow: hidden;
		z-index: 10;

		.card-content {
			padding: 40rpx 30rpx 30rpx;
			display: flex;
			align-items: center;
		}

		.user-avatar-wrapper {
			position: relative;
			margin-right: 30rpx;

			.user-avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 5rpx solid #fff;
				box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
				background: #f5f5f5;
			}

			.status-dot {
				position: absolute;
				width: 24rpx;
				height: 24rpx;
				background: #4bd48d;
				border-radius: 50%;
				border: 3rpx solid #fff;
				bottom: 10rpx;
				right: 5rpx;
			}
		}

		.user-info {
			flex: 1;

			.user-name {
				font-size: 38rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 8rpx;
			}

			.user-tagline {
				font-size: 26rpx;
				color: #7e8cfa;
				margin-bottom: 16rpx;
			}

			.user-badges {
				display: flex;

				.badge {
					font-size: 22rpx;
					color: #fff;

					padding: 4rpx 16rpx;
					border-radius: 30rpx;
					margin-right: 10rpx;
				}

				.vip {
					background: linear-gradient(to right, #ffa87d, #ff7e67);
				}

				.normal {
					background: linear-gradient(to right, #7e8cfa, #5199ff);
				}


			}
		}

		.stats-bar {
			display: flex;
			height: 100rpx;
			background: #f9faff;
			border-top: 1rpx solid #f0f5ff;

			.stat-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.stat-number {
					font-size: 36rpx;
					font-weight: 700;
					color: #5199ff;
				}

				.stat-label {
					font-size: 24rpx;
					color: #8a9bb9;
					margin-top: 6rpx;
				}
			}

			.stat-divider {
				width: 1px;
				height: 50rpx;
				background: #f0f5ff;
				margin: auto 0;
			}
		}
	}

	.list-card {
		margin: 0 25rpx 30rpx;

		.card {
			background: #ffffff;
			border-radius: 20rpx;
			overflow: hidden;
			box-shadow: 0 8rpx 25rpx rgba(151, 169, 217, 0.12);
		}

		.item {
			display: flex;
			height: 100rpx;
			align-items: center;
			padding: 0 30rpx;
			position: relative;

			&:active {
				background-color: #f9fafd;
			}

			.left {
				width: 80rpx;

				.icon {
					color: #5199ff;
				}
			}

			.center {
				flex: 1;
				font-size: 32rpx;
				color: #333;
				display: flex;
				align-items: center;

				.item-tag {
					font-size: 22rpx;
					background: linear-gradient(to right, #ff9b9c, #ff6b77);
					color: white;
					border-radius: 20rpx;
					padding: 2rpx 15rpx;
					margin-left: 20rpx;
					transform: scale(0.85);
				}
			}

			.right {
				width: 60rpx;

				.icon {
					color: #ccc;
				}
			}
		}

		.item-bottom-solid {
			&::after {
				content: '';
				position: absolute;
				left: 30rpx;
				right: 30rpx;
				bottom: 0;
				height: 1px;
				background: linear-gradient(to right, transparent, #f0f5ff, transparent);
			}
		}
	}

	.button-area {
		margin: 50rpx 30rpx;

		button {
			height: 95rpx;
			line-height: 95rpx;
			font-size: 32rpx;
			border-radius: 50rpx;
			transition: all 0.3s;
			box-shadow: 0 10rpx 20rpx rgba(79, 153, 255, 0.3);

			&:active {
				transform: translateY(5rpx);
				box-shadow: 0 5rpx 10rpx rgba(79, 153, 255, 0.2);
			}
		}

		.login-btn {
			background: linear-gradient(to right, #7e8cfa, #5199ff);
			color: white;
		}

		.logout-btn {
			background: linear-gradient(to right, #ff9b9c, #ff6b77);
			color: white;
		}
	}


	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 在style区域添加以下样式 */
	// .feedback-btn {
	//   width: 100%;
	//   height: 100%;
	//   background: transparent;
	//   color: #333;
	//   font-size: 32rpx;
	//   text-align: left;
	//   padding: 0;
	//   margin: 0;
	//   border: none;
	//   border-radius: 0;
	//   line-height: 1;
	//   display: flex;
	//   align-items: center;
	// }

	// .feedback-btn::after {
	//   border: none !important;
	// }

	// .item .center {
	//   height: 100%;
	// }
</style>