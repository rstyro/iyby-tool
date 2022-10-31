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
				<view class="bottom" >
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
				<view class="item item-bottom-solid" @click="devNotice">
					<view class="left flex-center">
						<uni-icons class="icon" type="notification" size="25"></uni-icons>
					</view>
					<view class="center">
						<text>系统通知</text>
					</view>
					<view class="right flex-center">
						<uni-icons class="icon" type="right"></uni-icons>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="item" @click="devNotice">
					<view class="left flex-center">
						<uni-icons class="icon" type="compose" size="25"></uni-icons>
					</view>
					<view class="center">
						<text>问题反馈</text>
					</view>
					<view class="right flex-center">
						<uni-icons class="icon" type="right"></uni-icons>
					</view>
				</view>
			</view>
		</view>




		<view class="quit flex-center">
			<view class="btn flex-center" v-if="userInfo.needLogin" @click="weixinLogin">登录</view>
			<view class="btn flex-center" v-else @click="logout">退出登录</view>
		</view>

	</view>
</template>
<style lang="scss" scoped>
	.page{
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

<script>
	import { getLogin,getUserInfo,weixinLogin} from "@/utils/UserApi.js";
	export default {
		data() {
			return {
				userInfo: {
					avatarUrl: '../../static/avatar.jpg',
					nickName: '登录',
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
			console.log("onLoad");
			try {
				const info = uni.getStorageSync('qr_user_info');
				if (info) {
					this.userInfo = info;
				}
			} catch (e) {
				// error
				console.log("获取缓存错误err:", e);
			}
		},
		//分享
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			  console.log(res.target)
			}
			return {
			  title: '皮卡二扫描',
			  path: '/pages/tabbar/scan/index'
			}
		  },
		//监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		beforeDestroy() {
			console.log("beforeDestroy");
		},
		//页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。
		onReachBottom() {
			console.log("onReachBottom");
		},
		onShareAppMessage(res) {
			console.log("onShareAppMessage");
		},
		created() {
			console.log("created");
		},
		methods: {
			devNotice() {
				console.log("notice。。。");
				uni.showToast({
					title: '功能开发中...',
					icon: "success",
					duration: 1000
				});
			},
			logout() {
				this.userInfo.nickName = '皮卡二维码';
				this.userInfo.avatarUrl = '../../../static/user.png';
				this.userInfo.needLogin = true;
				this.saveInfo();
			},
			saveInfo() {
				let _that = this;
				uni.setStorage({
					key: 'qr_user_info',
					data: _that.userInfo,
					success: function() {
						console.log('缓存添加成功');
					}
				});
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
						success:(res) =>{
							console.log('res：', res);
							console.log('code：', res.code);
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
			weixinLogin() {
				uni.getProvider({
					service: 'oauth',
					success: (res)=> {
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							console.log('res：',res)
							let userInfo = this.getUserInfo();
							let loginRes = this.getLogin();
							Promise.all([userInfo, loginRes]).then((result) => {
								let userInfo = result[0];
								let loginRes = result[1];
								
								console.log("userInfo:",userInfo);
								console.log("loginRes:",loginRes);
								
								this.userInfo = userInfo;
								this.userInfo.needLogin = false;
								console.log("userInfo:",this.userInfo);
								this.saveInfo();

							})
						}else if(~res.provider.indexOf('qq')){
							//todo 
						}
					},
					fail: (err) =>{
						// uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err
						})
					}
				})
			},
		},
	};
</script>