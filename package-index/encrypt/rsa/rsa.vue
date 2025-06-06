<template>
	<view class="container">
		<!-- 顶部标题区域 -->
		<view class="header">
			<view class="title">非对称加密工具</view>
			<view class="subtitle">RSA算法 - 公钥加密，私钥解密</view>
		</view>

		<!-- 算法简介 -->
		<view class="card info-card">
			<view class="card-title">非对称加密算法</view>
			<view class="card-content">
				非对称加密算法需要两个密钥：公钥和私钥。用公钥加密的数据只有对应的私钥才能解密，反之亦然。这种算法提供了更高的安全性，广泛应用于数据传输和数字签名。
				下面是RSA算法示例
				<text class="tip">后期有机会再补充国密SM2等其他算法</text>
			</view>
		</view>

		<!-- 功能选项卡 -->
		<view class="tabs-container">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', activeTab === index ? 'active' : '']"
				@click="activeTab = index">
				{{ tab }}
			</view>
		</view>

		<!-- 密钥生成 -->
		<view v-show="activeTab === 0" class="card">
			<view class="card-title">密钥生成</view>

			<view class="form-group">
				<text class="label">密钥长度</text>
				<picker class="picker" :value="keySizeIndex" :range="keySizes" @change="changeKeySize">
					<view>{{ keySizes[keySizeIndex] }}</view>
				</picker>
			</view>

			<button class="primary-btn" @click="genKey">
				生成公私钥对
			</button>

			<view class="key-container">
				<view class="key-section">
					<text class="key-title">私钥内容</text>
					<textarea class="key-textarea" v-model="keys.pri" maxlength=-1 placeholder="私钥内容将显示在这里" disabled />
					<button class="copy-btn" @click="copyPri">复制私钥</button>
				</view>

				<view class="key-section">
					<text class="key-title">公钥内容</text>
					<textarea class="key-textarea" v-model="keys.pub" maxlength=-1 placeholder="公钥内容将显示在这里" disabled />
					<button class="copy-btn" @click="copyPub">复制公钥</button>
				</view>
			</view>
		</view>

		<!-- 公钥加密 -->
		<view v-show="activeTab === 1" class="card">
			<view class="card-title">公钥加密</view>

			<view class="form-group">
				<text class="label">公钥内容</text>
				<textarea class="input-textarea" v-model="keys.pub" maxlength=-1 placeholder="请输入公钥内容" />
			</view>

			<view class="form-group">
				<text class="label">待加密内容</text>
				<textarea class="input-textarea" v-model="content" maxlength=-1 placeholder="请输入需要加密的内容" />
			</view>

			<button class="primary-btn" @click="encodeByPub">加密内容</button>

			<view class="result-section">
				<text class="result-title">加密结果 (Base64)</text>
				<textarea class="result-textarea" v-model="encode" maxlength=-1 placeholder="加密结果将显示在这里" disabled />
				<button class="copy-btn" @click="copyEncode">复制结果</button>
			</view>
		</view>

		<!-- 私钥解密 -->
		<view v-show="activeTab === 2" class="card">
			<view class="card-title">私钥解密</view>

			<view class="form-group">
				<text class="label">私钥内容</text>
				<textarea class="input-textarea" v-model="keys.pri" maxlength=-1 placeholder="请输入私钥内容" />
			</view>

			<view class="form-group">
				<text class="label">加密内容 (Base64)</text>
				<textarea class="input-textarea" v-model="encode" maxlength=-1 placeholder="请输入需要解密的Base64内容" />
			</view>

			<button class="primary-btn" @click="decodeByPri">解密内容</button>

			<view class="result-section">
				<text class="result-title">解密结果</text>
				<textarea class="result-textarea" v-model="result" maxlength=-1 placeholder="解密结果将显示在这里" disabled />
				<button class="copy-btn" @click="copyResult">复制结果</button>
			</view>
		</view>
		
		<view class="usage-tips">
			<text class="tips-title">安全提示</text>
			<view class="tips-content">
				<view class="tip-item">私钥是您的数字身份凭证，请妥善保管</view>
				<view class="tip-item">确保使用正确的私钥（与加密公钥配对的私钥）</view>
				<view class="tip-item">在安全环境中进行解密操作</view>
				<view class="tip-item">解密后及时清除敏感信息</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import JSEncrypt from 'jsencrypt';

	export default {
		data() {
			return {
				activeTab: 0,
				tabs: ['密钥生成', '公钥加密', '私钥解密'],
				keySize: 1024,
				keySizeIndex: 1,
				keySizes: ['512位', '1024位（推荐）', '2048位（更安全）', '4096位（最安全）'],
				keys: {
					pub: '',
					pri: ''
				},
				content: '',
				encode: '',
				result: ''
			}
		},
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"🔐 「加密全家桶：从入门到“间谍级”操作指南」",
					"💘 「用密码学表白才是真极客！」",
					"🕵️♂️ 「摸鱼密码：老板破解不了的骚操作」",
					"🤖 「程序员の黑暗料理：加密串烤」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/encrypt/rsa/rsa',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			changeKeySize(e) {
				this.keySizeIndex = e.detail.value;
				this.keySize = [512, 1024, 2048, 4096][this.keySizeIndex];
				this.keys.pri='';
				this.keys.pub='';
			},

			genKey() {
				uni.showLoading({
					title: '生成中...',
					mask: true
				});

				try {
					this.keys.pri = '';
					this.keys.pub = '';

					const enc = new JSEncrypt({
						default_key_size: this.keySize
					});

					this.keys.pri = enc.getPrivateKeyB64();
					this.keys.pub = enc.getPublicKeyB64();

					uni.showToast({
						title: '密钥生成成功',
						icon: 'success'
					});
				} catch (e) {
					console.error("密钥生成失败:", e);
					uni.showToast({
						title: '生成失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},

			encodeByPub() {
				if (!this.keys.pub) {
					uni.showToast({
						title: '公钥不能为空',
						icon: 'none'
					});
					return;
				}

				if (!this.content) {
					uni.showToast({
						title: '加密内容不能为空',
						icon: 'none'
					});
					return;
				}

				try {
					let enc = new JSEncrypt();
					// enc.setPublicKey(this.keys.pub);
					enc.setPublicKey('-----BEGIN PUBLIC KEY-----' + this.keys.pub + '-----END PUBLIC KEY-----');
					this.encode = enc.encrypt(this.content);

					uni.showToast({
						title: '加密成功',
						icon: 'success'
					});
				} catch (e) {
					console.error("加密失败:", e);
					uni.showToast({
						title: '加密失败',
						icon: 'none'
					});
				}
			},

			decodeByPri() {
				if (!this.keys.pri) {
					uni.showToast({
						title: '私钥不能为空',
						icon: 'none'
					});
					return;
				}

				if (!this.encode) {
					uni.showToast({
						title: '加密内容不能为空',
						icon: 'none'
					});
					return;
				}

				try {
					let enc = new JSEncrypt();
					// enc.setPrivateKey(this.keys.pri);
					enc.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + this.keys.pri + '-----END RSA PRIVATE KEY-----');
					this.result = enc.decrypt(this.encode);

					uni.showToast({
						title: '解密成功',
						icon: 'success'
					});
				} catch (e) {
					console.error("解密失败:", e);
					uni.showToast({
						title: '解密失败',
						icon: 'none'
					});
				}
			},

			copyPri() {
				this.copyData(this.keys.pri, '私钥');
			},

			copyPub() {
				this.copyData(this.keys.pub, '公钥');
			},

			copyEncode() {
				this.copyData(this.encode, '加密结果');
			},

			copyResult() {
				this.copyData(this.result, '解密结果');
			},

			copyData(data, type) {
				if (!data) {
					uni.showToast({
						title: `${type}为空`,
						icon: 'none'
					});
					return;
				}

				uni.setClipboardData({
					data: data,
					success: () => {
						uni.showToast({
							title: `已复制${type}`,
							icon: 'success'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
		max-width: 800rpx;
		margin: 0 auto;
		padding-bottom: 40rpx;
		background: linear-gradient(135deg, #f0f5ff, #e6eeff);
		padding: 20rpx;
	}

	.header {
		text-align: center;
		padding: 40rpx 0 30rpx;

		.title {
			font-size: 44rpx;
			font-weight: bold;
			color: #2c3e50;
			margin-bottom: 15rpx;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		}

		.subtitle {
			font-size: 28rpx;
			color: #5a7dff;
			font-weight: 500;
		}
	}

	.card {
		background: #ffffff;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
		padding: 36rpx;
		margin-bottom: 30rpx;

		&.info-card {
			// background: linear-gradient(135deg, #e3f2fd, #bbdefb);
		}

		.card-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #4361ee;
			margin-bottom: 30rpx;
			display: flex;
			align-items: center;

			&::before {
				content: '';
				display: inline-block;
				width: 8rpx;
				height: 36rpx;
				background: #4361ee;
				border-radius: 4rpx;
				margin-right: 15rpx;
			}
		}

		.card-content {
			font-size: 28rpx;
			color: #2c3e50;
			line-height: 1.6;
			
			.tip{
				color: #ccc;
				margin-top: 20rpx;
				display: inline-block;
			}
		}
	}

	.tabs-container {
		display: flex;
		background: #f5f7ff;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 30rpx;

		.tab-item {
			flex: 1;
			text-align: center;
			padding: 24rpx 0;
			font-size: 30rpx;
			color: #666;
			transition: all 0.3s;

			&.active {
				background: #5a7dff;
				color: white;
				font-weight: 500;
			}
		}
	}

	.form-group {
		margin-bottom: 30rpx;

		.label {
			font-size: 30rpx;
			color: #555;
			font-weight: 500;
			margin-bottom: 15rpx;
			display: block;
		}
	}

	.picker {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 24rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 16rpx;
		background: white;
		font-size: 28rpx;
	}

	.input-textarea {
		width: 100%;
		min-height: 180rpx;
		padding: 24rpx;
		font-size: 28rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 16rpx;
		background: #f8fafc;
		box-sizing: border-box;
	}

	.key-container {
		margin-top: 40rpx;
	}

	.key-section {
		margin-bottom: 40rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.key-title {
			font-size: 30rpx;
			color: #555;
			font-weight: 500;
			margin-bottom: 15rpx;
			display: block;
		}
	}

	.key-textarea {
		width: 100%;
		min-height: 220rpx;
		padding: 24rpx;
		font-size: 26rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 16rpx;
		background: #f8fafc;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		font-family: monospace;
	}

	.result-section {
		margin-top: 40rpx;

		.result-title {
			font-size: 30rpx;
			color: #555;
			font-weight: 500;
			margin-bottom: 15rpx;
			display: block;
		}
	}

	.result-textarea {
		width: 100%;
		min-height: 220rpx;
		padding: 24rpx;
		font-size: 26rpx;
		border: 2rpx solid #e0e7ff;
		border-radius: 16rpx;
		background: #f0f9ff;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		font-family: monospace;
	}

	.primary-btn {
		background: linear-gradient(135deg, #5a7dff, #4361ee);
		color: white;
		border-radius: 16rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 32rpx;
		font-weight: 500;
		border: none;
		transition: all 0.3s;

		&::after {
			border: none;
		}

		&:active {
			transform: translateY(4rpx);
			opacity: 0.9;
		}
	}

	.copy-btn {
		background: #34c759;
		color: white;
		border-radius: 12rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		border: none;

		&::after {
			border: none;
		}
	}

	.usage-tips {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.06);

		.tips-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #34495e;
			margin-bottom: 20rpx;
			display: block;
		}

		.tips-content {
			background: #f9fbe7;
			border-radius: 12rpx;
			padding: 24rpx;
		}

		.tip-item {
			font-size: 28rpx;
			color: #555;
			line-height: 1.8;
			padding-left: 20rpx;
			position: relative;

			&::before {
				content: '•';
				position: absolute;
				left: 0;
				color: #3498db;
				font-weight: bold;
			}
		}
	}
</style>