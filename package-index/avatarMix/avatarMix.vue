<template>
	<view class="container">
		<!-- 头像生成器 -->
		<view class="header">
			<text class="title">专属头像生成器</text>
			<text class="subtitle">选择装饰，打造个性化形象</text>
		</view>

		<!-- 装饰图标轮播 -->
		<scroll-view class="icon-carousel" scroll-x :scroll-with-animation="true">
			<view class="carousel-item" :class="{active: activeIndex === index}" v-for="(icon, index) in list"
				:key="index" @click="selectIcon(index)">
				<image class="carousel-image" :src="icon" mode="aspectFit" />
				<view class="checkmark" v-if="activeIndex === index">
					<view class="checkmark-stem"></view>
					<view class="checkmark-kick"></view>
				</view>
			</view>
		</scroll-view>

		<!-- 头像展示区域 -->
		<view class="avatar-wrapper">
			<canvas canvas-id="avatarCanvas" id="avatarCanvas" class="avatar-canvas" width="200" height="200"></canvas>
			<view class="frame-decoration">
				<text class="decoration-dot">•</text>
				<text class="decoration-dot">•</text>
				<text class="decoration-dot">•</text>
				<text class="decoration-dot">•</text>
			</view>
		</view>

		<!-- 操作按钮组 -->
		<view class="action-buttons">
			<button class="action-btn upload" @click="uploadImage">
				<text class="btn-text">上传底图</text>
			</button>
			<button class="action-btn save" @click="saveAvatar">
				<text class="btn-text">保存头像</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					"/static/images/avatar-meta/hat0.png",
					"/static/images/avatar-meta/hat1.png",
					"/static/images/avatar-meta/hat3.png",
					"/static/images/avatar-meta/hat4.png",
					"/static/images/avatar-meta/hat5.png",
					"/static/images/avatar-meta/hat6.png",
					"/static/images/avatar-meta/hat7.png",
					"/static/images/avatar-meta/hat8.png",
					"/static/images/avatar-meta/hat9.png",
					"/static/images/avatar-meta/hat10.png",
					"/static/images/avatar-meta/hat11.png",
					"/static/images/avatar-meta/hat12.png",
					"/static/images/avatar-meta/hat13.png",
					"/static/images/avatar-meta/hat14.png",
					"/static/images/avatar-meta/hat15.png",
					"/static/images/avatar-meta/hat16.png",
					"/static/images/avatar-meta/hat17.png",
					"/static/images/avatar-meta/hat18.png",
					"/static/images/avatar-meta/hat19.png",
					"/static/images/avatar-meta/hat20.png",
					"/static/images/avatar-meta/hat21.png",
					"/static/images/avatar-meta/hat22.png",
					"/static/images/avatar-meta/hat23.png",
					"/static/images/avatar-meta/hat24.png",
				],
				ctx: null,
				size: 200,
				activeIndex: 0,
				// avatarUrl: '/static/images/avatar.jpg',
				avatarUrl: '',
				isDefault: true,
				userInfo: {},
				canClick: true
			}
		},
		onLoad(option) {
			this.ctx = uni.createCanvasContext('avatarCanvas');
			// 获取缓存头像
			const info = uni.getStorageSync('qr_user_info');
			console.log("缓存获取1：", info);
			if (info && !info.needLogin) {
				this.isDefault = false;
				console.log("缓存获取2：", info);
				this.avatarUrl = info.avatarUrl;
			}
			this.mixAvatar();
		},
		methods: {
			mixAvatar() {
				this.ctx.clearRect(0, 0, this.size, this.size);
				console.log("this.avatarUrl:", this.avatarUrl);
				if (this.isDefault) {
					this.drawAvatar(this.avatarUrl, true).then(() => {
						this.drawAvatar(this.list[this.activeIndex], true);
					});
				} else {
					this.drawAvatar(this.avatarUrl, false).then(() => {
						this.drawAvatar(this.list[this.activeIndex], true);
					});
				}

			},
			uploadImage() {
				console.log("上传头像");
				uni.chooseImage({
					count: 1, //默认9
					success: (res) => {
						// console.log(JSON.stringify(res.tempFilePaths));
						if (res.tempFilePaths.length > 0) {
							this.isDefault = false;
							this.avatarUrl = res.tempFilePaths[0];
							this.mixAvatar();
						}
					},
					fail: (err) => {
						console.log(err);
					}
				});
			},
			drawAvatar(imgSrc, isLocal) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: (image) => {
							const imgW = image.width;
							const imgH = image.height;
							// 高度固定，宽度自适应
							let height = this.size;
							let width = imgW * this.size / imgH;
							if (imgH > imgW) {
								// 高度自适应
								height = imgH * this.size / imgW;
								width = this.size;
							}
							if (isLocal) {
								// 本地图片
								this.ctx.drawImage(imgSrc, 0, 0, width, height);
							} else {
								// 网络图片
								this.ctx.drawImage(image.path, 0, 0, width, height);
							}
							//绘制,参数：true,保留上一次绘制的内容，默认false
							this.ctx.draw(true);
							resolve();
						},
						fail: (err) => {
							console.log(err);
						}
					});
				});
			},
			selectIcon(index) {
				this.activeIndex = index;
				this.mixAvatar();
			},
			saveAvatar() {
				// 获取临时路径
				uni.canvasToTempFilePath({
					canvasId: 'avatarCanvas',
					x: 0,
					y: 0,
					success(res) {
						console.log("res.tempFilePath:", res.tempFilePath);
						// 保存图片
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: (path) => {
								console.log("path:", path);
								uni.showToast({
									title: '保存成功',
									icon: "success",
									duration: 500
								});
							}
						});

					},
					fail(res) {
						console.error(res);
					}
				})
			},
			getUserInfo() {
				return new Promise((resolve, reject) => {
					uni.getUserProfile({
						lang: 'zh_CN',
						desc: '用户登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，
						success: (res) => {
							resolve(res.userInfo)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			getLogin() {
				return new Promise((resolve, reject) => {
					uni.login({
						success: (res) => {
							//todo 客户端成功获取授权临时票据（code）,向业务服务器发起登录请求
							resolve(res)
						},
						fail: (err) => {
							console.log(err, 'logoer')
							reject(err)
						}
					})
				})
			},
			getAvatarInfo() {
				const info = uni.getStorageSync('qr_user_info');
				if (info && !info.needLogin) {
					// console.log("缓存获取2：", info);
					this.avatarUrl = info.avatarUrl;
					this.isDefault = false;
					this.mixAvatar();
				} else {
					uni.showLoading({
						title: '获取中...',
						mask: true
					});

					uni.getProvider({
						service: 'oauth',
						success: (res) => {
							//支持微信、qq和微博等
							if (~res.provider.indexOf('weixin')) {
								console.log('res：', res)
								let userInfo = this.getUserInfo();
								let loginRes = this.getLogin();
								Promise.all([userInfo, loginRes]).then((result) => {
									let userInfo = result[0];
									let loginRes = result[1];
									this.userInfo = userInfo;
									this.userInfo.needLogin = false;
									// console.log("userInfo:", userInfo);
									// console.log("loginRes:", loginRes);
									uni.setStorage({
										key: 'qr_user_info',
										data: this.userInfo,
										success: function() {
											console.log('缓存添加成功');
										}
									});
									this.isDefault = false;
									this.avatarUrl = userInfo.avatarUrl;
									this.mixAvatar();
									uni.hideLoading();
								}).catch(err => {
									console.log('错误:', err);
									uni.hideLoading();
									console.log("this.avatarUrl:", this.avatarUrl);
								})
							}
						},
						fail: (err) => {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: err
							})

						}
					})
				}

			},

		}
	}
</script>

<style lang="scss" scoped>
	$primary-color: #6a45ff; // 紫罗兰 → 更鲜艳的紫色
	$secondary-color: #00c2cb; // 深绿 → 蓝绿
	$accent-color: #ff6b8b; // 蓝绿 → 粉色
	$background-primary: #f7f8fc; // 浅灰背景
	$card-bg: #f7f8fc; // 卡片背景
	$border-radius-large: 40rpx; // 增大圆角
	$card-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.08); // 更立体的阴影

	.container {
		padding: 0 40rpx;
		background: linear-gradient(to right, #6e8eff, #a77aff);
		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		padding-bottom: 80rpx; // 增加底部空间
	}

	.header {
		text-align: center;
		padding: 80rpx 0 50rpx; // 增加内边距

		.title {
			font-size: 52rpx;
			color: #2c3e50;
			font-weight: 800; // 更粗的字体
			margin-bottom: 20rpx;
			letter-spacing: -0.5rpx; // 调整字间距
			position: relative;
			display: block;

			// 添加装饰横线
			&::after {
				content: '';
				position: absolute;
				bottom: -15rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 120rpx;
				height: 6rpx;
				background: linear-gradient(90deg, $primary-color, $secondary-color);
				border-radius: 3rpx;
			}
		}

		.subtitle {
			font-size: 32rpx; // 增大字号
			color: #5d6d7e;
			font-weight: 500;
			margin-top: 30rpx;
		}
	}

	.icon-carousel {
		white-space: nowrap;
		overflow-x: auto;
		margin: 40rpx 0;
		padding: 20rpx; // 增加内边距
		background: $card-bg;
		border-radius: $border-radius-large;
		box-shadow: $card-shadow;
		width: 95%;

		.carousel-item {
			display: inline-flex;
			width: 140rpx; // 增大尺寸
			height: 140rpx;
			margin-right: 30rpx;
			margin: 20rpx;
			position: relative;
			justify-content: center;
			align-items: center;
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); // 弹性动画
			border: 4rpx solid #fff;

			&:last-child {
				margin-right: 20rpx;
			}

			&.active {
				transform: scale(1.1);
				box-shadow: 0 20rpx 50rpx rgba($primary-color, 0.3);
				border-color: $primary-color;

				.carousel-image {
					opacity: 1;
					transform: scale(0.9);
				}

				.checkmark {
					opacity: 1;
					transform: scale(1);
				}
			}

			.carousel-image {
				width: 90%;
				height: 90%;
				// border-radius: 50%;
				// opacity: 0.85;
				transition: all 0.3s ease;
			}
		}
	}

	.checkmark {
		position: absolute;
		bottom: 5rpx;
		right: 5rpx;
		width: 50rpx; // 增大尺寸
		height: 50rpx;
		background: $primary-color;
		border-radius: 50%;
		box-shadow: 0 6rpx 16rpx rgba($primary-color, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		opacity: 0;
		transform: scale(0.8);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

		.checkmark-stem {
			width: 20rpx;
			height: 36rpx;
			border-right: 6rpx solid #fff;
			border-bottom: 6rpx solid #fff;
			transform: rotate(45deg) translate(-2rpx, -3rpx);
		}
	}

	.avatar-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 70rpx 0;
		perspective: 1000rpx; // 添加透视效果

		.avatar-canvas {
			width: 200px; // 增大尺寸
			height: 200px;
			box-shadow: 0 30rpx 70rpx rgba(0, 0, 0, 0.15);
			z-index: 1;
			transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
			border-radius: 50%;

			// 悬停效果
			&:active {
				transform: scale(0.98);
			}
		}

		.frame-decoration {
			position: absolute;
			width: 460rpx;
			height: 460rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;
			animation: rotate 15s linear infinite;

			.decoration-dot {
				font-size: 36rpx;
				color: rgba($primary-color, 0.9);
				text-shadow: 0 4rpx 12rpx rgba($primary-color, 0.3);
				transition: all 0.5s ease;

				&:nth-child(1) {
					animation: dotPulse 3s infinite ease-in-out;
				}

				&:nth-child(2) {
					animation: dotPulse 3s infinite ease-in-out 0.5s;
				}

				&:nth-child(3) {
					animation: dotPulse 3s infinite ease-in-out 1s;
				}

				&:nth-child(4) {
					animation: dotPulse 3s infinite ease-in-out 1.5s;
				}
			}
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dotPulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 0.9;
		}

		50% {
			transform: scale(1.3);
			opacity: 1;
		}
	}

	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 40rpx; // 增加间距
		margin-top: 60rpx;

		.action-btn {
			width: 100%;
			padding: 28rpx 0; // 增加内边距
			border-radius: $border-radius-large;
			font-size: 36rpx; // 增大字体
			font-weight: 600;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
			border: none;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
			position: relative;
			overflow: hidden;

			// 添加光泽效果
			&::after {
				content: '';
				position: absolute;
				top: -100%;
				left: -50%;
				width: 50rpx;
				height: 200%;
				background: rgba(255, 255, 255, 0.15);
				transform: rotate(25deg);
				transition: all 0.7s;
			}

			&:active {
				transform: translateY(6rpx);
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);

				&::after {
					left: 120%;
					transition-delay: 0.1s;
				}
			}

			&.upload {
				background: linear-gradient(45deg, $primary-color, #8a63ff);
			}

			&.save {
				background: linear-gradient(45deg, $accent-color, #ff8ba3);
			}

			.btn-icon {
				margin-left: 25rpx;
				font-size: 42rpx; // 增大图标
				transition: transform 0.3s ease;
			}

			// 按钮悬停效果
			&:hover:not(:active) {
				transform: translateY(-6rpx);
				box-shadow: 0 14rpx 30rpx rgba(0, 0, 0, 0.2);

				.btn-icon {
					transform: scale(1.1);
				}
			}
		}
	}

	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
</style>