<template>
  <view>
    <view v-if="isDevOrTrial">
      <cl-no-open-page></cl-no-open-page>
    </view>
    <view v-else class="container">
      <view class="header">
        <text class="title">Base64编码/解码工具</text>
        <text class="subtitle">实现文本与Base64格式的相互转换</text>
      </view>

      <view class="card info-card">
        <text class="card-title">Base64简介</text>
        <view class="description">
          Base64是网络上最常见的用于传输8Bit字节码的编码方式之一，使用64个可打印字符来表示二进制数据。
          常用于在HTTP环境下传递较长的标识信息，具有不可读性，需要解码后才能阅读。
        </view>
      </view>

      <view class="card input-card">
        <text class="card-title">输入内容</text>
        <textarea class="input-box" v-model="inputText" placeholder="请输入需要编码/解码的内容" auto-height />

        <view class="action-buttons">
          <button class="action-btn encode" @click="encodeContent">编码</button>
          <button class="action-btn decode" @click="decodeContent">解码</button>
        </view>
      </view>

      <view class="card result-card">
        <text class="card-title">处理结果</text>
        <textarea class="result-box" v-model="resultText" placeholder="编码/解码结果将显示在这里" auto-height readonly />

        <view v-if="inputText || resultText" class="result-actions">
          <button class="result-btn" @click="copyInput">复制输入内容</button>
          <button class="result-btn" @click="copyResult">复制结果</button>
          <button class="result-btn clear" @click="clearAll">清空全部</button>
        </view>
      </view>

      <view class="usage-tips">
        <text class="tips-title">使用提示</text>
        <view class="tips-content">
          <view class="tip-item">编码：将普通文本转换为Base64格式</view>
          <view class="tip-item">解码：将Base64格式还原为原始文本</view>
          <view class="tip-item">支持中英文、特殊字符的编码解码</view>
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
				inputText: '',
				resultText: ''
			};
		},
    onLoad() {
      this.isDevOrTrial = this.$version.isDevOrTrialVersion();
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
					"🔐 「聊天加密新姿势！用Base64发“摩斯密码”给TA！」",
					"🤯 「你以为这是乱码？其实我在表白！」#互联网暗号",
					"💼 「职场生存术：Base64藏文件神操作！」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/encrypt/base64/base64',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// Base64编码
			encodeContent() {
				if (!this.inputText) {
					uni.showToast({
						title: '输入内容不能为空',
						icon: 'none'
					});
					return;
				}

				try {
					this.resultText = CryptoJS.enc.Base64.stringify(
						CryptoJS.enc.Utf8.parse(this.inputText)
					);
				} catch (e) {
					console.error("编码失败:", e);
					uni.showToast({
						title: '编码失败',
						icon: 'none'
					});
				}
			},

			// Base64解码
			decodeContent() {
				if (!this.inputText) {
					uni.showToast({
						title: '输入内容不能为空',
						icon: 'none'
					});
					return;
				}

				try {
					const parsed = CryptoJS.enc.Base64.parse(this.inputText);
					this.resultText = parsed.toString(CryptoJS.enc.Utf8);
				} catch (e) {
					console.error("解码失败:", e);
					uni.showToast({
						title: '解码失败 - 请检查是否为有效Base64',
						icon: 'none'
					});
				}
			},

			// 复制输入内容
			copyInput() {
				if (!this.inputText) {
					uni.showToast({
						title: '输入内容为空',
						icon: 'none'
					});
					return;
				}

				uni.setClipboardData({
					data: this.inputText,
					success: () => {
						uni.showToast({
							title: '已复制输入内容',
							icon: 'success'
						});
					}
				});
			},

			// 复制结果
			copyResult() {
				if (!this.resultText) {
					uni.showToast({
						title: '结果内容为空',
						icon: 'none'
					});
					return;
				}

				uni.setClipboardData({
					data: this.resultText,
					success: () => {
						uni.showToast({
							title: '已复制结果内容',
							icon: 'success'
						});
					}
				});
			},

			// 清空所有内容
			clearAll() {
				this.inputText = '';
				this.resultText = '';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		max-width: 800rpx;
		margin: 0 auto;
		padding-bottom: 40rpx;
		padding: 20rpx;
		font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
		// background: linear-gradient(135deg, #f0f4ff, #e6e9ff);
		background: #f5f7fa;
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

		&.info-card {
			background: linear-gradient(135deg, #e3f2fd, #bbdefb);
		}

		&.input-card {
			border-top: 6rpx solid #3498db;
		}

		&.result-card {
			border-top: 6rpx solid #2ecc71;
		}

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
	}

	.description {
		font-size: 28rpx;
		color: #2c3e50;
		line-height: 1.7;
	}

	.input-box,
	.result-box {
		width: 100%;
		min-height: 240rpx;
		padding: 24rpx;
		font-size: 30rpx;
		border: 1px solid #e0e6ed;
		border-radius: 16rpx;
		background: #f8fafc;
		box-sizing: border-box;
		margin-bottom: 30rpx;
		box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	}

	.result-box {
		background: #f0f9ff;
	}

	.action-buttons {
		display: flex;
		gap: 24rpx;

		.action-btn {
			flex: 1;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 32rpx;
			font-weight: 500;
			border-radius: 12rpx;
			border: none;
			transition: all 0.3s;

			&::after {
				border: none;
			}

			&.encode {
				background: linear-gradient(135deg, #3498db, #1a5f9e);
				color: white;
			}

			&.decode {
				background: linear-gradient(135deg, #2ecc71, #1e8449);
				color: white;
			}

			&:active {
				transform: translateY(4rpx);
				opacity: 0.9;
			}
		}
	}

	.result-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 30rpx;

		.result-btn {
			flex: 1;
			min-width: 200rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
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