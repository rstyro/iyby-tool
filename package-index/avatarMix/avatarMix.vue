<template>
	<view class="container">
		<view class="title">迎国庆,换新颜</view>
		<view class="icons-box">
			<view class="icons">
				<view class="img-box" v-for="(icon,index) of list" :key="index">
					<image class="img" mode="aspectFill" :src="icon" @click="selectIcon(index)"></image>
				</view>

			</view>
		</view>
		<view class="main-body">
			<view class="left">
				<canvas canvas-id="avatarCanvas" id="avatarCanvas" style="width: 200px; height: 200px;" width="300"
					height="300"></canvas>
			</view>

			<view class="right">
				<!-- <button type="primary" @click="getAvatarInfo">获取头像</button> -->
				<button type="primary" @click="uploadImage">上传头像</button>
				<button type="primary" @click="saveAvatar">保存头像</button>
			</view>
		</view>

	</view>


</template>

<script>
	export default {
		data() {
			return {
				list: [
					"/static/images/avatar-meta/h001.png",
					"/static/images/avatar-meta/hat0.png",
					"/static/images/avatar-meta/hat1.png",
					"/static/images/avatar-meta/hat2.png",
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
				avatarUrl: '/static/user.png',
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
				// let avatarUrl = "/static/user.png";
				// this.drawAvatar(avatarUrl,true).then(()=>{
				// 	this.drawAvatar("http://localhost:3000/static/images/avatar-meta/head0.png",false);
				// });
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
						console.log(JSON.stringify(res.tempFilePaths));
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

<style lang="scss">
	.container {
		padding: 20rpx 40rpx;
		height: 100vh;
		background-image: linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);

		.title {
			text-align: center;
			height: 120rpx;
			line-height: 120rpx;
			color: #fff;
			font-size: 60rpx;
			margin-bottom: 20rpx;
			font-weight: bold;
		}

		.icons-box {
			padding: 20rpx;
			border-radius: 5px;
			margin-bottom: 30rpx;
			background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);

			.icons {
				width: 100%;
				height: 110rpx;
				overflow-y: hidden;
				overflow-x: auto;
				display: flex;
				padding: 10px 0px;
				margin-top: 10px;


				.img-box {
					width: 100rpx;
					height: 100rpx;
					border: 1px solid #ffe;

					&:nth-child(n+2) {
						margin-left: 20rpx;
					}

					.img {
						width: 100rpx;
						height: 100rpx;
						display: block;
					}
				}

			}
		}





		.main-body {
			display: flex;
			// padding: 40rpx;

			.left {
				flex-grow: 1;

				#avatarCanvas {
					background-color: #ccc;
				}
			}

			.right {
				width: 200rpx;

				button {
					font-size: 36rpx;
					height: 80rpx;
					line-height: 80rpx;
				}

				button:nth-child(n+2) {
					margin-top: 50rpx;
				}
			}
		}
	}
</style>
