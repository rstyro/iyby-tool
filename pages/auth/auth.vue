<template>
	<view class="content">

		<image mode="aspectFit" :src="logoUrl"></image>
		<view class="title">欢迎使用</view>

		<!-- H5登录表单 -->
		<view v-if="isH5" class="h5-login">
			<input class="input" v-model="dto.email" placeholder="请输入账号" />
			<input class="input" v-model="dto.password" placeholder="请输入密码" type="password" />

			<!-- 验证码输入区域 -->
			<view class="captcha-container">
				<input class="captcha-input" v-model="dto.code" placeholder="请输入验证码" />
				<button class="captcha-btn" :disabled="!canSend" @click="getCaptcha">
					{{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
				</button>
			</view>

			<button type="primary" class="login-btn" @click="h5Login">登录</button>

			<!-- 新增注册按钮 -->
			<view class="register-container">
				<text class="register-text">还没有账号？</text>
				<text class="register-btn" @click="h5Register">立即注册</text>
			</view>
		</view>

		<!-- 小程序微信登录 -->
		<button v-else type="primary" class="wechat-login-btn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">微信授权登录</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoUrl: '/static/logo.png',
				isH5: false,
				dto: {
					email: '',
					password: '',
					code: '',
					actionType:'login'
				},
				countdown: 0, // 倒计时
				canSend: true // 是否可以获取验证码
			}
		},
		onLoad() {
			// 判断运行平台
			// #ifdef H5
			this.isH5 = true
			// #endif
			// #ifndef H5
			this.isH5 = false
			// #endif
		},
		methods: {
			// 获取验证码
			async getCaptcha() {
				if (!this.dto.email) {
					uni.showToast({
						title: '请输入邮箱',
						icon: 'none'
					});
					return;
				}

				try {
					 const res =  await this.$huser.sendEmailCode(this.dto);
					if(res.msg){
						uni.$u.toast(res.msg);
						return;
					}
					uni.$u.toast("发送验证码成功");
					this.startCountdown();
				} catch (e) {
					uni.$u.toast(e.message || '发送失败');
				}
			},
			// 倒计时处理
			startCountdown() {
				this.countdown = 60;
				this.canSend = false;
				const timer = setInterval(() => {
					this.countdown--;
					if (this.countdown <= 0) {
						clearInterval(timer);
						this.canSend = true;
					}
				}, 1000);
			},
			// H5登录方法
			async h5Login() {
				if (!this.dto.email || !this.dto.password) {
					uni.$u.toast("请输入账号密码");
					return
				}

				try {
					const res = await this.$huser.login(this.dto);
					if(res.msg){
						uni.$u.toast(res.msg);
						return;
					}
					this.reloadUserInfo(res)
				} catch (e) {
					uni.$u.toast(e.message || '登录失败');
				}
			},
			// 新增注册方法
			h5Register() {
				uni.navigateTo({
					url: '/pages/register/register' // 根据实际注册页面路径修改
				});
			},
			wxGetUserInfo(res) {
				var tagUserInfo = res.detail.userInfo;
				// 微信登陆，获取一个Code，发送到后台获取openId
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// console.log("login-loginRes:", JSON.stringify(loginRes));
						const {
							code
						} = loginRes;
						const {
							nickName,
							avatarUrl,
							gender,
							country,
							province,
							city
						} = tagUserInfo;
						const params = {
							code,
							nickName,
							avatarUrl,
							sex: gender,
							country,
							province,
							city,
						};
						// console.log("params:", params);
						this.$huser.appletLogin(params).then(res => {
							// console.log('登录成功:', res);
							this.reloadUserInfo(res);
						});
					}
				});
			},
			reloadUserInfo(res) {
				const data = res.data;
				// 设置缓存
				uni.$u.vuex('store_token', data.token);
				uni.$u.vuex('store_uid', data.userId);
				uni.$u.vuex('store_login', 1);
				// 返回上一页
				const pages = getCurrentPages();
				if (pages.length > 1 && !this.isH5) {
					uni.navigateBack();
				} else {
					// 如果没有上一页就跳转我的页面
					console.log("没有上一页，跳转我的页面")
					uni.switchTab({
						url: '/pages/tabbarMe/tabbarMe'
					});
				}

			}
		}
	}
</script>

<style lang="scss">
	.content {
		text-align: center;

		image {
			margin-top: 18%;
			width: 50%;
		}

		.title {
			font-size: 30px;
			font-size: bold;
			margin-bottom: 30px;
		}

		.h5-login {
			width: 80%;
			margin: 0 auto;

			.input {
				height: 45px;
				padding: 0 15px;
				margin-bottom: 15px;
				border: 1px solid #e5e5e5;
				border-radius: 5px;
				font-size: 16px;
			}

			.login-btn {
				margin-top: 20px;
				width: 100%;
			}

			.captcha-container {
				display: flex;
				gap: 10px;
				margin-bottom: 15px;

				.captcha-input {
					flex: 1;
					height: 45px;
					padding: 0 15px;
					border: 1px solid #e5e5e5;
					border-radius: 5px;
					font-size: 16px;
				}

				.captcha-btn {
					width: 120px;
					height: 45px;
					line-height: 45px;
					padding: 0;
					font-size: 14px;
					background-color: #f0f0f0;
					color: #666;

					&[disabled] {
						background-color: #f8f8f8;
						color: #ccc;
					}
				}
			}


			.register-container {
				margin-top: 20px;
				text-align: center;
				font-size: 14px;
				color: #666;

				.register-btn {
					color: #007AFF;
					margin-left: 10px;
					text-decoration: underline;
				}
			}
		}

		.wechat-login-btn {
			margin-top: 20px;
			width: 80%;
		}
	}
</style>