<template>
	<view class="container">
		<!-- Header -->
		<view class="header">
			<view class="title">消息摘要算法工具</view>
			<view class="subtitle">支持MD5、SHA系列、HMAC、PBKDF2等</view>
		</view>

		<!-- Algorithm Info -->
		<view class="card">
			<view class="card-title"> 消息摘要算法是什么</view>
			<view class="description">
				消息摘要算法是一种单向加密技术，不依赖密钥，广泛应用于密码存储、数字签名、文件完整性验证等场景。
			</view>
		</view>

		<!-- Encryption Form -->
		<view class="card">
			<text class="card-title"> 加密计算工具</text>
			<textarea class="text-box" maxlength=-1 v-model="content" placeholder="请输入需要加密的内容..." />

			<!-- 算法选择 -->
			<view class="form-group">
				<text class="label">选择算法</text>
				<picker mode="selector" :range="algorithmList" @change="onAlgorithmChange">
					<view class="picker">
						{{algorithmList[currentAlgorithmIndex]}}
					</view>
				</picker>
			</view>

			<!-- HMAC 密钥 -->
			<view v-if="showKey" class="form-group">
				<text class="label">HMAC密钥</text>
				<input class="input" v-model="key" placeholder="请输入HMAC密钥" />
			</view>

			<!-- PBKDF2 配置 -->
			<view v-if="pbkdf2.show" class="form-group">
				<text class="label">盐(salt)</text>
				<input class="input" v-model="pbkdf2.salt" placeholder="请输入PBKDF2盐值" />
				<text class="label">Key长度</text>
				<picker mode="selector" :range="keyLengths" @change="onKeyLengthChange">
					<view class="picker">
						{{keyLengths[pbkdf2.keySizeIndex]}}
					</view>
				</picker>
				<text class="label">迭代次数</text>
				<input class="input" type="number" v-model.number="pbkdf2.count" placeholder="请输入迭代次数" />
			</view>

			<button class="primary-btn" @click="encryptContent">
				计算加密结果
			</button>
		</view>

		<!-- Result -->
		<view class="card">
			<text class="card-title">计算结果</text>
			<textarea class="text-box" :value="encode" disabled placeholder="加密结果..." />
			<view v-if="encode" class="action-buttons">
				<button class="btn-secondary" @click="copyContent">复制</button>
				<button class="btn-info" @click="toUp">转大写</button>
				<button class="btn-warning" @click="clearContent">清空</button>
			</view>
		</view>
	</view>
</template>

<script>
	import CryptoJS from 'crypto-js';

	export default {
		data() {
			return {
				content: '',
				encode: '',
				key: 'secureKey',
				showKey: false,
				pbkdf2: {
					count: 1000,
					salt: 'randomSalt',
					keySize: 4,
					keySizeIndex: 0,
					show: false
				},
				algorithmList: [
					'MD5', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512',
					'SHA3-224', 'SHA3-256', 'SHA3-384', 'SHA3-512',
					'HmacSHA1', 'HmacSHA224', 'HmacSHA256', 'HmacSHA384',
					'HmacSHA512', 'HmacMD5', 'PBKDF2'
				],
				keyLengths: ['128位', '256位', '512位'],
				currentAlgorithmIndex: 0
			};
		},
		methods: {
			onAlgorithmChange(e) {
				this.currentAlgorithmIndex = e.detail.value;
				const selected = this.algorithmList[e.detail.value];
				this.showKey = selected.includes("Hmac");
				this.pbkdf2.show = selected.includes("PBKDF2");
			},
			onKeyLengthChange(e) {
				this.pbkdf2.keySizeIndex = e.detail.value;
				this.pbkdf2.keySize = [4, 8, 16][e.detail.value];
			},
			encryptContent() {
				if (!this.content) {
					uni.showToast({
						title: '内容不能为空',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '计算中...'
				});
				setTimeout(() => {
					try {
						const selected = this.algorithmList[this.currentAlgorithmIndex];
						switch (selected) {
							case "MD5":
								this.encode = CryptoJS.MD5(this.content).toString();
								break;
							case "SHA1":
								this.encode = CryptoJS.SHA1(this.content).toString();
								break;
							case "SHA224":
								this.encode = CryptoJS.SHA224(this.content).toString();
								break;
							case "SHA256":
								this.encode = CryptoJS.SHA256(this.content).toString();
								break;
							case "SHA384":
								this.encode = CryptoJS.SHA384(this.content).toString();
								break;
							case "SHA512":
								this.encode = CryptoJS.SHA512(this.content).toString();
								break;
							case "SHA3-224":
								this.encode = CryptoJS.SHA3(this.content, {
									outputLength: 224
								}).toString();
								break;
							case "SHA3-256":
								this.encode = CryptoJS.SHA3(this.content, {
									outputLength: 256
								}).toString();
								break;
							case "SHA3-384":
								this.encode = CryptoJS.SHA3(this.content, {
									outputLength: 384
								}).toString();
								break;
							case "SHA3-512":
								this.encode = CryptoJS.SHA3(this.content, {
									outputLength: 512
								}).toString();
								break;
							case "HmacSHA1":
								if (this.checkHmacKey())
									this.encode = CryptoJS.HmacSHA1(this.content, this.key).toString();
								break;
							case "HmacSHA224":
								if (this.checkHmacKey())
									this.encode = CryptoJS.HmacSHA224(this.content, this.key).toString();
								break;
							case "HmacSHA256":
								if (this.checkHmacKey())
									this.encode = CryptoJS.HmacSHA256(this.content, this.key).toString();
								break;
							case "HmacSHA384":
								if (this.checkHmacKey())
									this.encode = CryptoJS.HmacSHA384(this.content, this.key).toString();
								break;
							case "HmacSHA512":
								if (this.checkHmacKey())
									this.encode = CryptoJS.HmacSHA512(this.content, this.key).toString();
								break;
							case "HmacMD5":
								if (this.checkHmacKey())
									this.encode = CryptoJS.HmacMD5(this.content, this.key).toString();
								break;
							case "PBKDF2":
								const pbkdf = CryptoJS.PBKDF2(this.content, this.pbkdf2.salt, {
									keySize: this.pbkdf2.keySize,
									iterations: this.pbkdf2.count
								});
								this.encode = pbkdf.toString();
								break;
						}
					} catch (e) {
						uni.showToast({
							title: '加密失败',
							icon: 'none'
						});
					}
					uni.hideLoading();
				}, 300);
			},
			checkHmacKey() {
				if (!this.key) {
					uni.showToast({
						title: 'HMAC密钥不能为空',
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			copyContent() {
				uni.setClipboardData({
					data: this.encode
				});
			},
			toUp() {
				this.encode = this.encode.toUpperCase();
			},
			clearContent() {
				this.content = '';
				this.encode = '';
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		background: linear-gradient(135deg, #f0f4ff, #e6e9ff);
		min-height: 100vh;
		color: #333;
	}
	
	.header {
		text-align: center;
		padding: 40rpx 0 20rpx;
	
		.title {
			font-size: 42rpx;
			font-weight: bold;
			color: #2c3e50;
			display: block;
		}
	
		.subtitle {
			font-size: 28rpx;
			color: #7f8c8d;
			margin-top: 10rpx;
			display: block;
		}
	}

	.card {
		background: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.06);
		padding: 36rpx;
		margin-bottom: 30rpx;
		
		.card-title {
			font-size: 36rpx;
			font-weight: 600;
			color: #34495e;
			margin-bottom: 30rpx;
			display: block;
			position: relative;
			padding-left: 24rpx;
		
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 8rpx;
				height: 36rpx;
				background: #3498db;
				border-radius: 4rpx;
			}
		}
		
		.icon {
			margin-right: 10rpx;
			font-size: 32rpx;
		}
		
		.description {
			font-size: 28rpx;
			color: #2c3e50;
			line-height: 1.7;
		}
	}


	.text-box {
		width: 95%;
		min-height: 150rpx;
		padding: 20rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 12rpx;
		font-size: 28rpx;
		margin-bottom: 30rpx;
		background: #fff;
	}

	.form-group {
		margin-bottom: 25rpx;
	}

	.label {
		font-size: 26rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.input {
		padding: 20rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 10rpx;
		font-size: 28rpx;
		background: #fff;
	}

	.picker {
		padding: 20rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.features {
		display: flex;
		justify-content: space-around;
		margin-bottom: 40rpx;
	}

	.feature-card {
		flex: 1;
		text-align: center;
		margin: 0 10rpx;
	}

	.icon {
		font-family: 'iconfont';
		font-size: 48rpx;
		color: #3498db;
		margin-bottom: 10rpx;
	}

	.feature-title {
		font-size: 26rpx;
		color: #333;
	}

	.action-buttons {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
	}

	.primary-btn,
	.btn-secondary,
	.btn-info,
	.btn-warning {
		flex: 1;
		background: linear-gradient(to right, #3498db, #2980b9);
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 0;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-secondary {
		background: linear-gradient(to right, #2ecc71, #27ae60);
	}

	.btn-info {
		background: linear-gradient(to right, #9b59b6, #8e44ad);
	}

	.btn-warning {
		background: linear-gradient(to right, #e74c3c, #c0392b);
	}
</style>