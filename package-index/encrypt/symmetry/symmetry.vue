<template>
  <view>
    <view v-if="isDevOrTrial">
      <cl-no-open-page type="countdown"></cl-no-open-page>
    </view>

    <view v-else class="container">
      <view class="header">
        <text class="title">对称加密算法工具</text>
        <text class="subtitle">使用单密钥进行加密和解密操作</text>
      </view>

      <view class="card">
        <text class="card-title">算法说明</text>
        <view class="description">
          对称加密算法使用相同的密钥进行加密和解密操作，常见的算法包括AES、DES等。密钥长度需满足特定要求：
          <text class="highlight">AES(16/24/32字符), DES(8字符), 3DES(24字符)</text>。
        </view>
      </view>

      <view class="card input-card">
        <text class="card-title">待处理内容</text>
        <textarea class="input-box" v-model="content" placeholder="请输入需要加密的内容" auto-height />
      </view>

      <view class="card key-card">
        <text class="card-title">选择算法</text>
        <view class="algorithm-buttons">
          <button v-for="(algo, index) in algorithms" :key="index"
                  :class="['algo-btn', currentAlgorithm === algo.value ? 'active' : '']"
                  @click="selectAlgorithm(algo.value)">
            {{ algo.name }}
          </button>
        </view>

        <view class="params-box">
          <view class="param-item">
            <text class="param-label">加密密钥:</text>
            <input class="param-input" v-model="params.key" :placeholder="keyPlaceholder" />
          </view>

          <view v-if="currentAlgorithm === 'RC4Drop'" class="param-item">
            <text class="param-label">丢弃字符数:</text>
            <input class="param-input" type="number" v-model="params.drop" placeholder="192" />
          </view>

          <view v-if="currentAlgorithm === 'AES'" class="aes-params">
            <view class="param-item">
              <text class="param-label">加密模式:</text>
              <picker class="param-picker" mode="selector"
                      :value="params.modeIndex"
                      :range="aes.modeList" range-key="text"
                      @change="changeMode">
                <view class="picker-text">{{ aes.modeList[params.modeIndex].text }}</view>
              </picker>
            </view>

            <view class="param-item">
              <text class="param-label">填充方式:</text>
              <picker class="param-picker" :value="params.paddingIndex" :range="aes.paddingList"
                      range-key="text" @change="changePadding($event)">
                <view class="picker-text">{{ aes.paddingList[params.paddingIndex].text }}</view>
              </picker>
            </view>

            <view v-if="params.modeIndex !== 0" class="param-item">
              <text class="param-label">偏移量(IV):</text>
              <input class="param-input" v-model="params.iv" placeholder="16个字符的偏移量" />
            </view>
          </view>
        </view>

        <view class="action-buttons">
          <button class="action-btn encrypt" @click="encodeContent">加密并转Base64</button>
          <button class="action-btn decrypt" @click="decodeContent">
            <cl-icon type="icon-up-arrow" size="15" color="#fff" />解密内容
          </button>
        </view>
      </view>

      <view class="card result-card">
        <text class="card-title">处理结果</text>
        <textarea class="result-box" v-model="result" placeholder="加密（需要解密的内容）结果将显示在这里" auto-height readonly />
        <view v-if="result" class="result-actions">
          <button class="result-btn" @click="copyResult">复制结果</button>
          <button class="result-btn clear" @click="clearAll">清空内容</button>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
	import CryptoJS from 'crypto-js';

	export default {
		data() {
			return {
        isDevOrTrial: true,
				content: '',
				result: '',
				currentAlgorithm: 'AES',
				params: {
					key: '1234567890123456',
					modeIndex: 1, // CBC
					paddingIndex: 0, // Pkcs7
					iv: '1234567890123456',
					drop: 192
				},
				algorithms: [{
						value: 'AES',
						name: 'AES'
					},
					{
						value: 'DES',
						name: 'DES'
					},
					{
						value: 'TripleDES',
						name: '3DES'
					},
					{
						value: 'Rabbit',
						name: 'Rabbit'
					},
					{
						value: 'RC4',
						name: 'RC4'
					},
					{
						value: 'RC4Drop',
						name: 'RC4Drop'
					}
				],
				aes: {
					modeList: [{
							value: "ECB",
							text: "ECB"
						},
						{
							value: "CBC",
							text: "CBC"
						},
						{
							value: "CFB",
							text: "CFB"
						},
						{
							value: "OFB",
							text: "OFB"
						},
						{
							value: "CTR",
							text: "CTR"
						}
					],
					paddingList: [{
							value: "Pkcs7",
							text: "Pkcs7"
						},
						{
							value: "Iso97971",
							text: "Iso97971"
						},
						{
							value: "AnsiX923",
							text: "AnsiX923"
						},
						{
							value: "Iso10126",
							text: "Iso10126"
						},
						{
							value: "ZeroPadding",
							text: "ZeroPadding"
						},
						{
							value: "NoPadding",
							text: "NoPadding"
						}
					]
				}
			};
		},
		computed: {
			keyPlaceholder() {
				switch (this.currentAlgorithm) {
					case 'AES':
						return '16/24/32个字符';
					case 'DES':
						return '8个字符';
					case 'TripleDES':
						return '24个字符';
					default:
						return '输入密钥';
				}
			}
		},
    onLoad() {
      this.isDevOrTrial = this.$version.isDevOrTrialVersion();
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
					path: 'package-index/encrypt/symmetry/symmetry',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			bindTextAreaBlur(e) {
				this.content = e.detail.value;
			},
			selectAlgorithm(algo) {
				this.currentAlgorithm = algo;
			},
			changeMode(e) {
				this.params.modeIndex = e.detail.value;
			},
			changePadding(e) {
				this.params.paddingIndex = e.detail.value;
			},
			// 加密
			encodeContent() {
				if (!this.content) {
					uni.showToast({
						title: '内容不能为空',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '加密中...'
				});

				try {
					let encrypted;
					const key = this.params.key;

					switch (this.currentAlgorithm) {
						case 'AES':
							const aesKey = CryptoJS.enc.Utf8.parse(key);
							const aesIv = CryptoJS.enc.Utf8.parse(this.params.iv);
							const mode = CryptoJS.mode[this.aes.modeList[this.params.modeIndex].value];
							const padding = CryptoJS.pad[this.aes.paddingList[this.params.paddingIndex].value];

							encrypted = CryptoJS.AES.encrypt(this.content, aesKey, {
								iv: aesIv,
								mode: mode,
								padding: padding
							});
							break;

						case 'DES':
							encrypted = CryptoJS.DES.encrypt(this.content, key);
							break;

						case 'TripleDES':
							encrypted = CryptoJS.TripleDES.encrypt(this.content, key);
							break;

						case 'Rabbit':
							encrypted = CryptoJS.Rabbit.encrypt(this.content, key);
							break;

						case 'RC4':
							encrypted = CryptoJS.RC4.encrypt(this.content, key);
							break;

						case 'RC4Drop':
							const dropBit = this.params.drop * 4;
							encrypted = CryptoJS.RC4Drop.encrypt(this.content, key, {
								drop: dropBit
							});
							break;
					}

					this.result = encrypted.toString();
				} catch (e) {
					console.error("加密失败:", e);
					uni.showToast({
						title: '加密失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			// 解密
			decodeContent() {
				if (!this.result) {
					uni.showToast({
						title: '加密内容为空',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '解密中...'
				});

				try {
					let decrypted;
					const key = this.params.key;

					switch (this.currentAlgorithm) {
						case 'AES':
							const aesKey = CryptoJS.enc.Utf8.parse(key);
							const aesIv = CryptoJS.enc.Utf8.parse(this.params.iv);
							const mode = CryptoJS.mode[this.aes.modeList[this.params.modeIndex].value];
							const padding = CryptoJS.pad[this.aes.paddingList[this.params.paddingIndex].value];

							decrypted = CryptoJS.AES.decrypt(this.result, aesKey, {
								iv: aesIv,
								mode: mode,
								padding: padding
							});
							break;

						case 'DES':
							decrypted = CryptoJS.DES.decrypt(this.result, key);
							break;

						case 'TripleDES':
							decrypted = CryptoJS.TripleDES.decrypt(this.result, key);
							break;

						case 'Rabbit':
							decrypted = CryptoJS.Rabbit.decrypt(this.result, key);
							break;

						case 'RC4':
							decrypted = CryptoJS.RC4.decrypt(this.result, key);
							break;

						case 'RC4Drop':
							const dropBit = this.params.drop * 4;
							decrypted = CryptoJS.RC4Drop.decrypt(this.result, key, {
								drop: dropBit
							});
							break;
					}

					this.content = decrypted.toString(CryptoJS.enc.Utf8);
					uni.showToast({
						title: !this.content?'解密失败，内容不合法':'解密成功',
						icon: 'none'
					});
					
				} catch (e) {
					console.error("解密失败:", e);
					uni.showToast({
						title: '解密失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			copyResult() {
				uni.setClipboardData({
					data: this.result,
					success: () => {
						uni.showToast({
							title: '已复制到剪贴板',
							icon: 'success'
						});
					}
				});
			},
			clearAll() {
				this.content = '';
				this.result = '';
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f7fa;
		font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
	}

	.container {
		max-width: 800rpx;
		margin: 0 auto;
		padding: 20rpx;
		// background: linear-gradient(135deg, #f0f4ff, #e6e9ff);
	}

	.header {
		text-align: center;
		padding: 40rpx 0 20rpx;

		.title {
			font-size: 44rpx;
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
		border-radius: 16rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		padding: 32rpx;
		margin-bottom: 30rpx;

		&.input-card {
			border-top: 6rpx solid #3498db;
		}

		&.key-card {
			border-top: 6rpx solid #3498db;
		}

		&.result-card {
			border-top: 6rpx solid #2ecc71;
		}


		.card-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #34495e;
			margin-bottom: 25rpx;
			display: block;
			position: relative;
			padding-left: 20rpx;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 8rpx;
				height: 34rpx;
				background: #3498db;
				border-radius: 4rpx;
			}
		}
	}

	.description {
		font-size: 28rpx;
		color: #555;
		line-height: 1.6;

		.highlight {
			color: #e74c3c;
			font-weight: 500;
		}
	}

	.input-box,
	.result-box {
		width: 100%;
		min-height: 200rpx;
		padding: 20rpx;
		font-size: 30rpx;
		border: 1px solid #e0e6ed;
		border-radius: 12rpx;
		background: #f8fafc;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.result-box {
		background: #f0f9ff;
	}

	.algorithm-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-bottom: 30rpx;

		.algo-btn {
			flex: 1;
			min-width: 180rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			background: #f1f5f9;
			color: #4b5563;
			border: none;
			border-radius: 10rpx;
			padding: 0;
			margin: 0;

			&::after {
				border: none;
			}

			&.active {
				background: #3498db;
				color: white;
				font-weight: 500;
			}
		}
	}

	.params-box {
		padding: 20rpx 0;

		.param-item {
			display: flex;
			align-items: center;
			margin-bottom: 25rpx;
		}

		.param-label {
			width: 200rpx;
			font-size: 28rpx;
			color: #4b5563;
			font-weight: 500;
		}

		.param-input {
			flex: 1;
			height: 80rpx;
			padding: 0 20rpx;
			border: 1px solid #e0e6ed;
			border-radius: 10rpx;
			font-size: 28rpx;
			background: #f8fafc;
		}

		.param-picker {
			flex: 1;
			height: 80rpx;
			width: 100%;
			border: 1px solid #e0e6ed;
			border-radius: 10rpx;
			background: #f8fafc;

			.picker-text {
				font-size: 28rpx;
				color: #333;
				padding: 20rpx
			}
		}
	}

	.aes-params {
		background: #f0f7ff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-top: 15rpx;
	}

	.action-buttons {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;

		.action-btn {
			flex: 1;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 32rpx;
			border-radius: 12rpx;
			border: none;

			&::after {
				border: none;
			}

			&.encrypt {
				background: linear-gradient(135deg, #3498db, #1a5f9e);
				color: white;
			}

			&.decrypt {
				background: linear-gradient(135deg, #2ecc71, #1e8449);
				color: white;
			}
		}
	}

	.result-actions {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;

		.result-btn {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			background: #3498db;
			color: white;
			border-radius: 12rpx;
			border: none;

			&::after {
				border: none;
			}

			&.clear {
				background: #e74c3c;
			}
		}
	}
</style>