<template>
	<view class="container">
		<view class="header">
			<text class="title">安全密码生成器</text>
			<text class="subtitle">创建高强度、安全的密码</text>
		</view>

		<!-- 字符类型 -->
		<view class="card">
			<view class="card-title">
				<cl-icon type="icon-mima" size="20" color="#fff"></cl-icon>
				<view class="text">字符类型</view>
			</view>
			<view class="options-grid">
				<view class="option-item" :class="{active: options.uppercase}" @tap="toggleOption('uppercase')">
					<cl-icon type="icon-daxiezimuteshuzifushiyong" size="20" color="#fff"></cl-icon>
					<view class="text">大写字母</view>
				</view>
				<view class="option-item" :class="{active: options.lowercase}" @tap="toggleOption('lowercase')">
					<cl-icon type="icon-xiaoxiezimu" size="20" color="#fff"></cl-icon>
					<view class="text">小写字母</view>
				</view>
				<view class="option-item" :class="{active: options.numbers}" @tap="toggleOption('numbers')">
					<cl-icon type="icon-shuzi" size="20" color="#fff"></cl-icon>
					<view class="text">数字</view>
				</view>
				<view class="option-item" :class="{active: options.symbols}" @tap="toggleOption('symbols')">
					<cl-icon type="icon-symbol" size="15" color="#fff"></cl-icon>
					<view class="text">特殊符号</view>
				</view>
			</view>
		</view>

		<!-- 密码长度 -->
		<view class="card">
			<view class="card-title">
				<cl-icon type="icon-changdu" size="20" color="#fff"></cl-icon>
				<view class="text">密码长度</view>
			</view>
			<view class="slider-container">
				<view class="slider-header">
					<text>长度</text>
					<text class="length-value">{{ length }}</text>
				</view>
				<slider min="6" max="128" :show-value="true" :value="length" @change="e => length = e.detail.value"
					block-size="20" activeColor="#3498db" />
			</view>
		</view>

		<!-- 密码数量 -->
		<view class="card">
			<view class="card-title">
				<cl-icon type="icon-shuliang" size="20" color="#fff"></cl-icon>
				<view class="text">密码数量</view>
			</view>
			<view class="count-selector">
				<view class="count-btn" @tap="decrementCount">
					<cl-icon type="icon-jian" size="20" color="#fff"></cl-icon>
				</view>
				<text class="count-value">{{ count }}</text>
				<view class="count-btn" @tap="incrementCount">
					<cl-icon type="icon-jia" size="20" color="#fff"></cl-icon>
				</view>
			</view>
		</view>

		<!-- 字符过滤 -->
		<view class="card">
			<view class="card-title">
				<cl-icon type="icon-shaixuan-L" size="20" color="#fff"></cl-icon>
				<view class="text">字符过滤</view>
			</view>
			<view class="input-group">
				<text class="label">包含这些字符（可选）</text>
				<input class="input" placeholder="例如：abc123" v-model="includeChars" />
			</view>
			<view class="input-group">
				<text class="label">排除这些字符（优先级更高）</text>
				<input class="input" placeholder="例如：!@#" v-model="excludeChars" />
			</view>
		</view>

		<button class="generate-btn" @tap="generatePasswords">
			<text class="iconfont icon-bolt"></text> 生成密码
		</button>

		<!-- 密码展示 -->
		<view class="card">
			<view class="card-title">
				<text class="iconfont icon-lock"></text>
				<text>生成的密码</text>
			</view>
			<view class="passwords-container">
				<view v-if="passwords.length === 0" class="empty-state">
					<text class="iconfont icon-key"></text>
					<text>点击上方按钮生成密码</text>
				</view>
				<view class="password-item" v-for="(password, index) in passwords" :key="index">
					<text class="password-text">{{ password }}</text>
					<view class="copy-btn" @tap="copyPassword(password)">
						<cl-icon type="icon-fuzhi" size="20" color="#fff"></cl-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 通知 -->
		<view class="notification" :class="{show: showNotification}">
			密码已复制到剪贴板！
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {
					uppercase: true,
					lowercase: true,
					numbers: true,
					symbols: false
				},
				length: 12,
				count: 3,
				includeChars: '',
				excludeChars: '',
				passwords: [],
				showNotification: false
			}
		},
		methods: {
			toggleOption(option) {
				this.options[option] = !this.options[option]
			},
			decrementCount() {
				if (this.count > 1) this.count--
			},
			incrementCount() {
				if (this.count < 10) this.count++
			},
			generatePasswords() {
				this.passwords = []

				// 验证至少选择了一种字符类型
				const selectedOptions = Object.values(this.options).filter(opt => opt)
				if (selectedOptions.length === 0) {
					uni.showToast({
						title: '请至少选择一种字符类型！',
						icon: 'none'
					})
					return
				}

				// 定义字符集
				const charSets = {
					uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
					lowercase: 'abcdefghijklmnopqrstuvwxyz',
					numbers: '0123456789',
					symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/'
				}

				// 构建可用字符集
				let allChars = ''
				for (const [key, value] of Object.entries(this.options)) {
					if (value) {
						allChars += charSets[key]
					}
				}

				// 处理排除字符（优先级更高）
				if (this.excludeChars) {
					const excludeSet = new Set(this.excludeChars.split(''))
					allChars = allChars.split('').filter(char => !excludeSet.has(char)).join('')
				}

				// 处理包含字符
				let includeSet = new Set()
				if (this.includeChars) {
					includeSet = new Set(this.includeChars.split(''))
				}

				// 验证字符集是否为空
				if (allChars.length === 0) {
					uni.showToast({
						title: '排除所有字符后没有可用字符！',
						icon: 'none'
					})
					return
				}

				// 生成密码
				for (let i = 0; i < this.count; i++) {
					let password = ''
					// 确保包含所需字符
					if (includeSet.size > 0) {
						// 添加包含的字符
						const includeCharsArray = Array.from(includeSet)
						for (let j = 0; j < Math.min(includeCharsArray.length, this.length); j++) {
							password += includeCharsArray[Math.floor(Math.random() * includeCharsArray.length)]
						}
					}

					// 填充剩余字符
					while (password.length < this.length) {
						const randomChar = allChars[Math.floor(Math.random() * allChars.length)]
						password += randomChar
					}

					// 随机化密码顺序
					password = password.split('').sort(() => 0.5 - Math.random()).join('')
					this.passwords.push(password)
				}
			},
			async copyPassword(password) {
				try {
					await uni.setClipboardData({
						data: password
					})
					this.showNotification = true
					setTimeout(() => {
						this.showNotification = false
					}, 2000)
				} catch (err) {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 基础样式 */
	.container {
		padding: 20px 15px;
		background: linear-gradient(135deg, #1a2a6c, #2c3e50);
		color: #ecf0f1;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		padding: 40rpx 0 20rpx;

		.title {
			font-size: 60rpx;
			font-weight: 700;
			background: linear-gradient(to right, #3498db, #2ecc71);
			-webkit-background-clip: text;
			background-clip: text;
			-webkit-text-fill-color: transparent;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			margin-bottom: 8px;
			letter-spacing: 1px;
		}

		.subtitle {
			font-size: 28rpx;
			color: #7f8c8d;
			margin-top: 10rpx;
			display: block;
		}
	}

	.card {
		background: rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 22px;
		margin-bottom: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.card-title {
		display: flex;
		align-items: center;
		font-size: 18px;
		margin-bottom: 18px;
		color: #3498db;


	}

	.text {
		margin-left: 10rpx;
	}

	.iconfont {
		margin-right: 10px;
		font-size: 20px;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15rpx;
	}

	.option-item {
		display: flex;
		align-items: center;
		padding: 12px 15px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		cursor: pointer;
		border: 1px solid transparent;
	}

	.option-item.active {
		background: rgba(52, 152, 219, 0.2);
		border-color: #3498db;
	}

	.slider-container {
		padding: 10px 0;
	}

	.slider-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.length-value {
		font-weight: bold;
		font-size: 18px;
		color: #3498db;
	}

	.count-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 0;
	}

	.count-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(52, 152, 219, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		cursor: pointer;
	}

	.count-value {
		font-size: 22px;
		font-weight: bold;
		min-width: 30px;
		text-align: center;
		color: #3498db;
	}

	.input-group {
		margin-bottom: 15px;
	}

	.label {
		display: block;
		margin-bottom: 8px;
		font-size: 15px;
		opacity: 0.9;
	}

	.input {
		width: 90%;
		padding: 14px 15px;
		border-radius: 12px;
		border: none;
		background: rgba(255, 255, 255, 0.05);
		color: #fff;
		font-size: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.generate-btn {
		width: 100%;
		padding: 18px;
		background: linear-gradient(135deg, #3498db, #2980b9);
		border: none;
		border-radius: 14px;
		color: white;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		margin: 10px 0 20px;
	}

	.passwords-container {
		margin-top: 10px;
	}

	.password-item {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 14px;
		padding: 16px;
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.password-text {
		font-family: monospace;
		font-size: 16px;
		letter-spacing: 1px;
		word-break: break-all;
		padding-right: 15px;
		flex: 1;
	}

	.copy-btn {
		min-width: 40px;
		height: 40px;
		border-radius: 12px;
		background: rgba(52, 152, 219, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.empty-state {
		text-align: center;
		padding: 40px 20px;
		opacity: 0.6;
	}

	.notification {
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(46, 204, 113, 0.9);
		color: white;
		padding: 12px 25px;
		border-radius: 50px;
		font-weight: 500;
		z-index: 1000;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.notification.show {
		opacity: 1;
	}
</style>