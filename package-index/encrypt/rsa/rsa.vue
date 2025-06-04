<template>
	<view class="container">
		<!-- 头部 -->
		<view class="header">
			<view class="title-box">
				<text class="title">RSA非对称加密工具</text>
				<text class="subtitle">安全可靠的公钥加密/私钥解密解决方案</text>
			</view>
		</view>

		<!-- 介绍卡片 -->
		<view class="card intro-card">
			<view class="card-header">
				<text class="icon-info">ℹ️</text>
				<text class="card-title">非对称加密算法是什么</text>
			</view>
			<view class="card-content">
				非对称加密算法需要两个密钥：公开密钥（公钥）和私有密钥（私钥）。公钥与私钥是一对，
				如果用公钥对数据进行加密，只有用对应的私钥才能解密。因为加密和解密使用的是两个不同的密钥，
				所以这种算法叫作非对称加密算法。
			</view>
		</view>

		<!-- 导航标签 -->
		<view class="tabs-container">
			<view class="custom-tabs">
				<block v-for="(item, index) in items" :key="index">
					<text :class="['tab-item', { active: current === index }]"
						@tap="onClickItem(index)">{{ item }}</text>
				</block>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="card content-card">
			<!-- 密钥生成 -->
			<view v-if="current === 0">
				<view class="form-group">
					<text class="form-label">密码长度:</text>
					<picker mode="selector" :range="keySizeTexts" @change="changeKeySize" class="key-select">
						<view class="picker-trigger">
							{{ selectedKeySizeText }}
							<text class="arrow">▼</text>
						</view>
					</picker>
				</view>

				<button type="primary" class="primary-btn gen-key-btn" @tap="genKey">
					<text class="btn-icon">+</text>
					生成公私钥对
				</button>

				<!-- 密钥显示 -->
				<view class="key-container">
					<view class="key-card">
						<view class="key-header">
							<text class="icon-lock">🔒</text>
							<text class="key-title">私钥内容</text>
						</view>
						<textarea class="key-textarea" :value="keys.pri" placeholder="点击上方按钮生成私钥" readonly />
						<button type="default" class="copy-btn" @tap="copyPri" :disabled="!keys.pri">
							<text class="btn-icon">📎</text>
							复制私钥
						</button>
					</view>

					<view class="key-card">
						<view class="key-header">
							<text class="icon-unlock">🔓</text>
							<text class="key-title">公钥内容</text>
						</view>
						<textarea class="key-textarea" :value="keys.pub" placeholder="点击上方按钮生成公钥" readonly />
						<button type="default" class="copy-btn" @tap="copyPub" :disabled="!keys.pub">
							<text class="btn-icon">📎</text>
							复制公钥
						</button>
					</view>
				</view>
			</view>

			<!-- 公钥加密 -->
			<view v-if="current === 1">
				<!-- 公钥输入 -->
				<view class="key-card">
					<view class="key-header">
						<text class="icon-unlock">🔓</text>
						<text class="key-title">公钥内容</text>
					</view>
					<textarea class="key-textarea" maxlength=-1 :value="keys.pub" @input="bindTextPub" placeholder="请输入公钥内容" />
				</view>

				<!-- 加密内容输入 -->
				<view class="key-card">
					<view class="key-header">
						<text class="icon-compose">📝</text>
						<text class="key-title">需要加密的内容</text>
					</view>
					<textarea class="key-textarea" maxlength=-1 :value="content" @input="bindTextContent" placeholder="请输入需要加密的文本" />
					<button type="primary" class="primary-btn encrypt-btn" @tap="encodeByPub"
						:disabled="!keys.pub || !content">
						<text class="btn-icon">➡️</text>
						公钥加密
					</button>
				</view>

				<!-- 加密结果 -->
				<view class="key-card">
					<view class="key-header">
						<text class="icon-lock">🔒</text>
						<text class="key-title">加密结果 (Base64)</text>
					</view>
					<textarea class="key-textarea" maxlength=-1 :value="encode" placeholder="加密结果将显示在这里" readonly />
					<button type="default" class="copy-btn" @tap="copyEncode" :disabled="!encode">
						<text class="btn-icon">📎</text>
						复制加密结果
					</button>
				</view>
			</view>

			<!-- 私钥解密 -->
			<view v-if="current === 2">
				<!-- 私钥输入 -->
				<view class="key-card">
					<view class="key-header">
						<text class="icon-lock">🔒</text>
						<text class="key-title">私钥内容</text>
					</view>
					<textarea class="key-textarea" maxlength=-1 :value="keys.pri" @input="bindTextPri" placeholder="请输入私钥内容" />
				</view>

				<!-- 解密内容输入 -->
				<view class="key-card">
					<view class="key-header">
						<text class="icon-forward">⬅️</text>
						<text class="key-title">需要解密的Base64内容</text>
					</view>
					<textarea class="key-textarea" maxlength=-1 :value="encode" @input="bindTextEncode"
						placeholder="请输入加密后的Base64内容" />
					<button type="primary" class="primary-btn decrypt-btn" @tap="decodeByPri"
						:disabled="!keys.pri || !encode">
						<text class="btn-icon">🔄</text>
						私钥解密
					</button>
				</view>

				<!-- 解密结果 -->
				<view class="key-card">
					<view class="key-header">
						<text class="icon-check">✅</text>
						<text class="key-title">解密后的内容</text>
					</view>
					<textarea class="key-textarea" maxlength=-1 :value="result" placeholder="解密结果将显示在这里" readonly />
					<button type="default" class="copy-btn" @tap="copyContent" :disabled="!result">
						<text class="btn-icon">📎</text>
						复制解密结果
					</button>
				</view>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<text class="footer-text">© 2023 RSA加密工具 | 安全可靠的非对称加密</text>
		</view>
	</view>
</template>

<script>
	import JSEncrypt from 'encryptlong'; // 确保已安装依赖

	export default {
		data() {
			return {
				items: ['密钥生成', '公钥加密', '私钥解密'],
				current: 0,
				keySize: 1024,
				keySizeList: [{
						value: 512,
						text: "512位"
					},
					{
						value: 1024,
						text: "1024位（推荐）"
					},
					{
						value: 2048,
						text: "2048位（更安全）"
					},
					{
						value: 4096,
						text: "4096位（最安全）"
					}
				],
				keys: {
					pub: '',
					pri: ''
				},
				content: '',
				encode: '',
				result: ''
			}
		},
		computed: {
			keySizeTexts() {
				return this.keySizeList.map(item => item.text)
			},
			selectedKeySizeText() {
				return this.keySizeList.find(item => item.value === this.keySize)?.text || '请选择'
			}
		},
		methods: {
			onClickItem(index) {
				this.current = index
			},
			changeKeySize(e) {
				const index = e.detail.value
				this.keySize = this.keySizeList[index].value
			},
			bindTextContent(e) {
				this.content = e.detail.value
			},
			bindTextEncode(e) {
				this.encode = e.detail.value
			},
			bindTextResult(e) {
				this.result = e.detail.value
			},
			bindTextPri(e) {
				this.keys.pri = e.detail.value
			},
			bindTextPub(e) {
				this.keys.pub = e.detail.value
			},

			// 核心功能方法
			genKey() {
				uni.showLoading({
					title: '生成中...'
				});
				setTimeout(() => {
					try {
						console.log("this.keySize:::",this.keySize);
						const enc = new JSEncrypt({
							default_key_size: this.keySize
						});
						this.keys.pri = enc.getPrivateKeyB64();
						this.keys.pub = enc.getPublicKeyB64();
						uni.showToast({
							title: '成功'
						});
					} catch (e) {
						uni.showToast({
							title: '失败',
							icon: 'none'
						});
					} finally {
						uni.hideLoading();
					}
				}, 800);
			},
			encodeByPub() {
				uni.showLoading({
					title: '加密中...'
				});
				setTimeout(() => {
					try {
						console.log("this.keySize:::",this.keySize);
						const enc = new JSEncrypt();
						// enc.setPublicKey(this.keys.pub);
						enc.setPublicKey('-----BEGIN PUBLIC KEY-----' + this.keys.pub + '-----END PUBLIC KEY-----');
						this.encode = enc.encryptLong(this.content);
						uni.showToast({
							title: '加密成功'
						});
					} catch (e) {
						uni.showToast({
							title: '加密失败',
							icon: 'none'
						});
					} finally {
						uni.hideLoading();
					}
				}, 600);
			},
			decodeByPri() {
				uni.showLoading({
					title: '解密中...'
				});
				setTimeout(() => {
					try {
						console.log("this.keySize:::",this.keySize);
						const enc = new JSEncrypt();
						// enc.setPrivateKey(this.keys.pri);
						enc.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + this.keys.pri + '-----END RSA PRIVATE KEY-----');
						
						this.result = enc.decryptLong(this.encode);
						console.log("result:",this.result);
						console.log("result11:",enc.decryptLong(this.encode));
						uni.showToast({
							title: '解密成功'
						});
					} catch (e) {
						console.log("e:",e)
						uni.showToast({
							title: '解密失败',
							icon: 'none'
						});
					} finally {
						uni.hideLoading();
					}
				}, 600);
			},
			copyData(data, type) {
				if (!data) {
					uni.showToast({
						title: `无${type}`,
						icon: 'none'
					});
					return;
				}
				uni.setClipboardData({
					data,
					success: () => uni.showToast({
						title: '已复制'
					})
				});
			},
			copyPri() {
				this.copyData(this.keys.pri, '私钥')
			},
			copyPub() {
				this.copyData(this.keys.pub, '公钥')
			},
			copyEncode() {
				this.copyData(this.encode, '加密结果')
			},
			copyContent() {
				this.copyData(this.result, '解密结果')
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 15px;
		background: linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 100%);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	// 头部样式
	.header {
		margin-bottom: 20px;
		text-align: center;
		padding: 10px 0;

		.title-box {
			padding: 15px;
			background: rgba(255, 255, 255, 0.8);
			border-radius: 16px;
			backdrop-filter: blur(4px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

			.title {
				font-size: 26px;
				font-weight: 700;
				color: #1a3a7f;
				display: block;
				margin-bottom: 5px;
				letter-spacing: -0.5px;
			}

			.subtitle {
				font-size: 14px;
				color: #4a5568;
				letter-spacing: 0.3px;
				font-weight: 500;
			}
		}
	}

	// 卡片通用样式
	.card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
		margin-bottom: 20px;
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		}

		.card-header {
			display: flex;
			align-items: center;
			padding: 18px 20px;
			background: linear-gradient(90deg, #f0f7ff 0%, #e6f0ff 100%);
			border-bottom: 1px solid #e8f2ff;

			.icon-info {
				margin-right: 12px;
				font-size: 20px;
				color: #1890ff;
			}

			.card-title {
				font-size: 18px;
				font-weight: 600;
				color: #1a3a7f;
				letter-spacing: -0.3px;
			}
		}

		.card-content {
			padding: 20px;
			font-size: 15px;
			line-height: 1.7;
			color: #4a5568;
		}
	}

	// 导航标签样式
	.tabs-container {
		margin-bottom: 20px;

		.custom-tabs {
			display: flex;
			border-radius: 12px;
			overflow: hidden;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
			background: #fff;

			.tab-item {
				flex: 1;
				padding: 14px 0;
				text-align: center;
				font-size: 16px;
				font-weight: 500;
				color: #666;
				background: #fff;
				position: relative;
				transition: all 0.3s ease;

				&:after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 0;
					height: 3px;
					background: #1890ff;
					border-radius: 2px;
					transition: width 0.3s ease;
				}

				&.active {
					color: #1890ff;
					font-weight: 600;

					&:after {
						width: 70%;
					}
				}

				&:active {
					background-color: #f5f9ff;
				}
			}
		}
	}

	// 表单元素
	.form-group {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		padding: 15px 20px;
		background: #f9fbff;
		border-radius: 12px;

		.form-label {
			font-size: 16px;
			color: #1a3a7f;
			margin-right: 15px;
			width: 100px;
			flex-shrink: 0;
			font-weight: 500;
		}

		.picker-trigger {
			flex: 1;
			padding: 14px 16px;
			border: 1px solid #d9e2ff;
			border-radius: 10px;
			background: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 16px;
			color: #1a3a7f;
			box-shadow: 0 2px 6px rgba(24, 144, 255, 0.1);

			.arrow {
				font-size: 12px;
				color: #a0b4e8;
				transition: transform 0.3s ease;
			}

			&:active {
				border-color: #1890ff;
				box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);

				.arrow {
					transform: rotate(180deg);
				}
			}
		}
	}

	// 按钮样式
	.primary-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		background: linear-gradient(90deg, #2d5bff 0%, #1890ff 100%);
		color: white;
		margin: 20px 0;
		border: none;
		box-shadow: 0 4px 12px rgba(45, 91, 255, 0.25);
		transition: all 0.3s ease;

		.btn-icon {
			margin-right: 10px;
			font-size: 18px;
		}

		&:active {
			transform: translateY(3px);
			box-shadow: 0 2px 6px rgba(45, 91, 255, 0.3);
		}

		&:disabled {
			background: linear-gradient(90deg, #a0b4e8 0%, #b8d4ff 100%);
			opacity: 0.8;
			box-shadow: none;
		}
	}

	.copy-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		border-radius: 10px;
		background: #f0f7ff;
		color: #2d5bff;
		font-size: 15px;
		font-weight: 500;
		margin-top: 15px;
		border: 1px solid #d9e2ff;
		transition: all 0.3s ease;

		.btn-icon {
			margin-right: 8px;
			font-size: 16px;
		}

		&:active {
			background-color: #e6f0ff;
			transform: translateY(2px);
		}

		&:disabled {
			opacity: 0.5;
		}
	}

	// 密钥卡片样式
	.key-container {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.key-card {
		background: #fff;
		border-radius: 16px;
		padding: 20px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
		border: 1px solid #f0f4ff;
		transition: transform 0.3s ease;

		&:active {
			transform: translateY(-3px);
		}

		.key-header {
			display: flex;
			align-items: center;
			margin-bottom: 15px;

			.icon-lock,
			.icon-unlock,
			.icon-compose,
			.icon-forward,
			.icon-check {
				font-size: 20px;
				margin-right: 12px;
				width: 32px;
				height: 32px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 8px;
				background: #f0f7ff;
				color: #2d5bff;
			}

			.key-title {
				font-size: 17px;
				font-weight: 600;
				color: #1a3a7f;
				letter-spacing: -0.3px;
			}
		}

		.key-textarea {
			width: 100%;
			min-height: 140px;
			padding: 15px;
			border: 1px solid #e8f2ff;
			border-radius: 12px;
			font-size: 15px;
			color: #333;
			background-color: #f9fbff;
			box-sizing: border-box;
			margin-bottom: 15px;
			line-height: 1.5;
			resize: none;

			&:focus {
				border-color: #2d5bff;
				box-shadow: 0 0 0 3px rgba(45, 91, 255, 0.1);
			}

			&::placeholder {
				color: #a0b4e8;
			}
		}
	}

	// 操作按钮组
	.btn-group {
		display: flex;
		gap: 15px;
		margin-top: 15px;

		button {
			flex: 1;
		}
	}

	// 底部样式
	.footer {
		margin-top: 30px;
		padding: 20px 0;
		text-align: center;

		.footer-text {
			font-size: 12px;
			color: #7b8ab8;
			font-weight: 500;
			letter-spacing: 0.3px;
		}
	}

	// 响应式调整
	@media (min-width: 768px) {
		.container {
			max-width: 750px;
			margin: 0 auto;
			padding: 25px 20px;
		}

		.key-container {
			flex-direction: row;
			flex-wrap: wrap;

			.key-card {
				flex: 1;
				min-width: calc(50% - 10px);
			}
		}
	}

	// 动画效果
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.card {
		animation: fadeIn 0.4s ease-out;
	}

	.key-card {
		animation: fadeIn 0.5s ease-out;
	}

	// 加载状态
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16px;
		z-index: 10;

		.loading-spinner {
			width: 40px;
			height: 40px;
			border: 3px solid #e6f0ff;
			border-top: 3px solid #2d5bff;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>