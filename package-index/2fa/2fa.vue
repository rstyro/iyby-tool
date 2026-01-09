<template>
	<view class="totp-container">
		<!-- 顶部标题栏 -->
		<view class="header">
			<text class="header-title">2FA离线动态验证码</text>
			<text class="header-subtitle">基于时间动态生成安全的动态验证码</text>
			<button class="add-button" @click="showAddModal = true">
				<cl-icon type="icon-jia" size="20" color="#FFFFFF"></cl-icon>
				<text>添加账户</text>
			</button>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 空状态 -->
			<view v-if="accountList.length === 0" class="empty-state">
				<view class="empty-icon">
					<cl-icon type="icon-mima" size="96" color="#E5E6EB"></cl-icon>
				</view>
				<text class="empty-title">暂无验证账户</text>
				<text class="empty-desc">点击添加账户开始使用两步验证</text>
			</view>

			<!-- 账户列表 -->
			<view v-else class="accounts-wrapper">
				<view class="accounts-count">
					<text>{{ accountList.length }} 个账户</text>
					<text class="refresh-time">自动刷新中</text>
				</view>

				<view class="accounts-grid">
					<view v-for="(item, index) in accountList" :key="item.id" class="account-card"
						@click="copyCode(item.code)">
						<!-- 删除按钮 -->
						<button class="delete-btn" @click.stop="delAccount(index)">
							<cl-icon type="icon-del" size="16" color="#F53F3F"></cl-icon>
						</button>

						<!-- 账户信息 -->
						<view class="account-header">
							<view class="account-icon" :style="{ backgroundColor: getAccountColor(index) }">
								<text class="icon-text">{{ item.issuer.charAt(0) }}</text>
							</view>
							<view class="account-info">
								<text class="account-issuer">{{ item.issuer }}</text>
								<text class="account-name">{{ item.accountName }}</text>
							</view>
						</view>

						<!-- 验证码 -->
						<view class="code-section">
							<text class="code-text">{{ formatCode(item.code) }}</text>
							<view class="code-meta">
								<text class="code-details">{{ item.algorithm }} · {{ item.digits }}位</text>
							</view>
						</view>

						<!-- 倒计时 -->
						<view class="countdown-section">
							<view class="countdown-bar">
								<view class="countdown-progress" :style="{ width: `${(item.expiresIn / 30) * 100}%` }"
									:class="{ warning: item.expiresIn <= 5 }"></view>
							</view>
							<view class="countdown-time">
								<text class="time-text">{{ item.expiresIn }}s</text>
								<cl-icon type="time" size="14" color="#86909C"></cl-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加账户模态框 -->
		<view v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
			<view class="modal-container" @click.stop>
				<!-- 模态框头部 -->
				<view class="modal-header">
					<text class="modal-title">添加验证账户</text>
					<button class="modal-close" @click="showAddModal = false">
						<cl-icon type="icon-guanbi" size="20" color="#86909C"></cl-icon>
					</button>
				</view>

				<!-- 模态框内容 -->
				<scroll-view class="modal-content" scroll-y :show-scrollbar="false">
					<!-- 快速添加区域 -->
					<view class="quick-add-section">
						<text class="section-title">快速添加</text>
						<view class="quick-methods">
							<button class="method-card" @click="scanOtpQr">
								<view class="method-icon scan">
									<cl-icon type="icon-erweima" size="22" color="#36CFC9"></cl-icon>
								</view>
								<text class="method-label">扫码添加</text>
								<text class="method-desc">扫描二维码自动填充</text>
							</button>

							<button class="method-card" @click="showManualForm = !showManualForm">
								<view class="method-icon manual">
									<cl-icon type="icon-qianming" size="22" color="#00B42A "></cl-icon>
								</view>
								<text class="method-label">手动输入</text>
								<text class="method-desc">手动填写账户信息</text>
							</button>
						</view>
					</view>

					<!-- 链接输入区域 -->
					<view class="url-section">
						<text class="section-title">或使用链接添加</text>
						<view class="url-input-group">
							<input v-model="form.otpUrl" :maxlength="-1" type="text" placeholder="粘贴 otpauth:// 链接"
								class="url-input" />
							<button class="parse-btn" @click="parseOtpUrl" :disabled="!form.otpUrl">
								解析
							</button>
						</view>
					</view>

					<!-- 手动输入表单 -->
					<view v-if="showManualForm" class="form-section">
						<text class="section-title">账户信息</text>

						<view class="form-fields">
							<view class="form-field">
								<text class="form-label">签发方</text>
								<input v-model="form.issuer" type="text" placeholder="如：GitHub" class="form-input" />
							</view>

							<view class="form-field">
								<text class="form-label">账户名称</text>
								<input v-model="form.accountName" type="text" placeholder="如：user@gmail.com"
									class="form-input" />
							</view>

							<view class="form-field">
								<text class="form-label">密钥 (Secret)</text>
								<input v-model="form.secret" type="text" placeholder="输入 BASE32 格式密钥"
									class="form-input secret-input" />
							</view>

							<view class="form-row">
								<view class="form-field half">
									<text class="form-label">算法</text>
									<picker @change="changeAlgorithm" :value="form.algorithmIndex"
										:range="algorithmNameList" class="custom-picker">
										<view class="form-picker">
											{{ form.algorithm }}
											<cl-icon type="arrow-down" size="14" color="#86909C"></cl-icon>
										</view>
									</picker>
								</view>

								<view class="form-field half">
									<text class="form-label">位数</text>
									<picker @change="changeDigits" :value="form.digitsIndex" :range="digitsList"
										class="custom-picker">
										<view class="form-picker">
											{{ form.digits }} 位
											<cl-icon type="arrow-down" size="14" color="#86909C"></cl-icon>
										</view>
									</picker>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- 模态框底部 -->
				<view class="modal-footer">
					<button class="footer-btn secondary" @click="showAddModal = false">
						取消
					</button>
					<button class="footer-btn primary" @click="addNewAccount">
						添加账户
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		TOTP,
		SUPPORTED_ALGORITHMS,
		OTPURI
	} from '@/common/totp.js'

	export default {
		name: 'TOTPApp',
		data() {
			return {
				accountList: [],
				showAddModal: false,
				showManualForm: false,
				form: {
					otpUrl: '',
					issuer: '',
					accountName: '',
					secret: '',
					algorithm: 'SHA1',
					algorithmIndex: 0,
					digits: 6,
					digitsIndex: 0
				},
				algorithmNameList: SUPPORTED_ALGORITHMS.map(item => item.label),
				digitsList: ['6位', '8位'],
				timers: {},
				accountColors: [
					'#36CFC9', '#FF7D00', '#722ED1', '#F53F3F',
					'#00B42A', '#FF5C93', '#14C9C9', '#FFB400'
				],
				systemInfo: null
			}
		},
		onLoad() {
			this.loadAccountList()
			this.getSystemInfo()
		},
		onUnload() {
			this.clearAllTimers()
		},
		onShow() {
			if (this.accountList.length > 0) {
				this.accountList.forEach((item, index) => {
					this.generateAccountCode(index)
				})
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
					"🛡️ 动态密码，给你的账号上把锁",
					"👍两步验证动态密码，有这个就够了",
					"🎯 让黑客头疼的“时间锁”"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/2fa/2fa',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			getSystemInfo() {
				this.systemInfo = uni.getSystemInfoSync()
			},
			getAccountColor(index) {
				return this.accountColors[index % this.accountColors.length]
			},
			formatCode(code) {
				if (!code) return '------'
				const mid = Math.floor(code.length / 2)
				return `${code.slice(0, mid)} ${code.slice(mid)}`
			},
			loadAccountList() {
				const list = uni.getStorageSync('totp_account_list') || []
				this.accountList = list
				this.accountList.forEach((item, index) => {
					this.generateAccountCode(index)
				})
			},
			saveAccountList() {
				uni.setStorageSync('totp_account_list', this.accountList)
			},
			changeAlgorithm(e) {
				const idx = e.detail.value
				this.form.algorithm = SUPPORTED_ALGORITHMS[idx].value
				this.form.algorithmIndex = idx
			},
			changeDigits(e) {
				const idx = e.detail.value
				this.form.digits = idx === 0 ? 6 : 8
				this.form.digitsIndex = idx
			},
			parseOtpUrl() {
				const otpUrl = this.form.otpUrl.trim();
				if (!otpUrl) {
					uni.showToast({
						title: '请输入OTP链接',
						icon: 'none'
					})
					return
				}
				try {
					const parseResult = OTPURI.parse(otpUrl);
					console.log("parseResult=", parseResult);
					this.form.issuer = parseResult.issuer || ''
					this.form.accountName = parseResult.account || ''
					this.form.secret = parseResult.secret || ''
					this.form.algorithm = parseResult.algorithm || 'SHA1'
					this.form.digits = parseResult.digits || 6

					const algIndex = SUPPORTED_ALGORITHMS.findIndex(item => item.value === this.form.algorithm)
					this.form.algorithmIndex = algIndex >= 0 ? algIndex : 0
					this.form.digitsIndex = this.form.digits === 6 ? 0 : 1

					this.showManualForm = true
					uni.showToast({
						title: '解析成功',
						icon: 'success',
						duration: 1500
					})
				} catch (err) {
					uni.showToast({
						title: '链接格式错误',
						icon: 'none',
						duration: 2000
					})
					console.error('OTP解析失败：', err)
				}
			},
			scanOtpQr() {
				
				// #ifdef H5
				return uni.showToast({
					title: '当前环境不支持扫码',
					icon: 'none',
					duration: 2000
				})
				// #endif
				
				// #ifdef MP-WEIXIN
				// 仅微信小程序支持扫码
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['qrCode'],
					success: (res) => {
						this.form.otpUrl = res.result
						this.parseOtpUrl()
					},
					fail: (err) => {
						if (err.errMsg !== 'scanCode:fail cancel') {
							uni.showToast({
								title: '扫码失败，请重试',
								icon: 'none'
							})
						}
					}
				})
				// #endif
				
				
			},
			generateAccountCode(index) {
				const account = this.accountList[index]
				if (!account || !account.secret) return
				try {
					const {
						code,
						expiresIn
					} = TOTP.generate(account.secret, {
						algorithm: account.algorithm,
						digits: account.digits,
						period: 30
					})
					this.$set(this.accountList[index], 'code', code)
					this.$set(this.accountList[index], 'expiresIn', expiresIn)
					this.startCountdown(index)
				} catch (err) {
					console.error('生成验证码失败:', err)
				}
			},
			startCountdown(index) {
				clearInterval(this.timers[index])
				this.timers[index] = setInterval(() => {
					if (!this.accountList[index]) {
						clearInterval(this.timers[index])
						delete this.timers[index]
						return
					}

					if (this.accountList[index].expiresIn <= 1) {
						clearInterval(this.timers[index])
						this.generateAccountCode(index)
					} else {
						if (this.accountList[index] && this.accountList[index].expiresIn !== undefined) {
							this.$set(this.accountList[index], 'expiresIn', this.accountList[index].expiresIn - 1)
						}
					}
				}, 1000)
			},
			addNewAccount() {
				const {
					issuer,
					accountName,
					secret
				} = this.form
				if (!issuer.trim() || !accountName.trim() || !secret.trim()) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}
				if (secret.trim().length<16) {
					uni.showToast({
						title: '密钥长度至少16位',
						icon: 'none'
					})
					return
				}

				const cleanSecret = secret.replace(/\s+/g, '').toUpperCase()
				const newAccount = {
					id: Date.now(),
					issuer: issuer.trim(),
					accountName: accountName.trim(),
					secret: cleanSecret,
					algorithm: this.form.algorithm,
					digits: this.form.digits,
					code: '',
					expiresIn: 30
				}

				this.accountList.unshift(newAccount)
				this.saveAccountList()
				this.generateAccountCode(0)

				this.showAddModal = false
				this.showManualForm = false
				this.resetForm()

				uni.showToast({
					title: '账户添加成功',
					icon: 'success',
					duration: 1500
				})
			},
			resetForm() {
				this.form = {
					otpUrl: '',
					issuer: '',
					accountName: '',
					secret: '',
					algorithm: 'SHA1',
					algorithmIndex: 0,
					digits: 6,
					digitsIndex: 0
				}
			},
			delAccount(index) {
				uni.showModal({
					title: '确认删除',
					content: '删除后数据将无法恢复',
					confirmColor: '#F53F3F',
					success: (res) => {
						if (res.confirm) {
							if (this.timers[index]) {
								clearInterval(this.timers[index])
								delete this.timers[index]
							}

							this.accountList.splice(index, 1)
							this.saveAccountList()

							this.reindexTimers(index)

							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						}
					}
				})
			},
			reindexTimers(deletedIndex) {
				const newTimers = {}

				this.accountList.forEach((item, newIndex) => {
					const oldIndex = newIndex >= deletedIndex ? newIndex + 1 : newIndex
					if (this.timers[oldIndex]) {
						newTimers[newIndex] = this.timers[oldIndex]
					}
				})

				this.timers = newTimers
			},
			copyCode(code) {
				if (!code) return
				uni.setClipboardData({
					data: code.replace(/\s/g, ''),
					success: () => {
						uni.showToast({
							title: '验证码已复制',
							icon: 'success',
							duration: 1000
						})
					}
				})
			},
			clearAllTimers() {
				Object.keys(this.timers).forEach(key => {
					clearInterval(this.timers[key])
				})
				this.timers = {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.totp-container {
		min-height: 100vh;
		background: linear-gradient(180deg, #E8F8F7 0%, #FFFFFF 100%);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		box-sizing: border-box;
	}

	/* 顶部标题栏 */
	.header {
		padding: 60rpx 32rpx 40rpx;
		background: #FFFFFF;
		border-bottom-left-radius: 32rpx;
		border-bottom-right-radius: 32rpx;
		box-shadow: 0 4rpx 24rpx rgba(54, 207, 201, 0.12);
		position: relative;
		box-sizing: border-box;
	}

	.header-title {
		font-size: 48rpx;
		font-weight: 700;
		color: #0E2B29;
		display: block;
		margin-bottom: 12rpx;
	}

	.header-subtitle {
		font-size: 28rpx;
		color: #557574;
		display: block;
		margin-bottom: 32rpx;
	}

	.add-button {
		background: linear-gradient(135deg, #36CFC9 0%, #0FC6BE 100%);
		border-radius: 24rpx;
		height: 80rpx;
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		border: none;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
		box-shadow: 0 8rpx 24rpx rgba(54, 207, 201, 0.25);

		&::after {
			border: none;
		}

		&:active {
			opacity: 0.9;
			box-shadow: 0 6rpx 18rpx rgba(54, 207, 201, 0.3);
		}
	}

	/* 主体内容 */
	.content {
		padding: 32rpx;
		box-sizing: border-box;
	}

	/* 空状态 */
	.empty-state {
		height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		box-sizing: border-box;
	}

	.empty-icon {
		width: 160rpx;
		height: 160rpx;
		background: #F0F9F8;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
		box-sizing: border-box;
	}

	.empty-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #0E2B29;
		margin-bottom: 16rpx;
		display: block;
	}

	.empty-desc {
		font-size: 28rpx;
		color: #557574;
		display: block;
	}

	/* 账户列表 */
	.accounts-wrapper {
		padding-top: 8rpx;
		box-sizing: border-box;
	}

	.accounts-count {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
		padding: 0 8rpx;
		box-sizing: border-box;
	}

	.accounts-count text:first-child {
		font-size: 28rpx;
		font-weight: 600;
		color: #0E2B29;
	}

	.refresh-time {
		font-size: 24rpx;
		color: #36CFC9;
		background: rgba(54, 207, 201, 0.15);
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}

	.accounts-grid {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		box-sizing: border-box;
	}

	/* 账户卡片 */
	.account-card {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 32rpx;
		position: relative;
		box-shadow: 0 6rpx 28rpx rgba(54, 207, 201, 0.08);
		transition: all 0.3s ease;
		border: 1rpx solid #E0F2F1;
		box-sizing: border-box;

		&:active {
			transform: translateY(-2rpx);
			box-shadow: 0 10rpx 36rpx rgba(54, 207, 201, 0.15);
		}
	}

	.delete-btn {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		background: rgba(245, 63, 63, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		z-index: 10;

		&::after {
			border: none;
		}
	}

	.account-header {
		display: flex;
		align-items: center;
		margin-bottom: 32rpx;
		box-sizing: border-box;
	}

	.account-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.icon-text {
		font-size: 32rpx;
		font-weight: 700;
		color: #FFFFFF;
	}

	.account-info {
		flex: 1;
		min-width: 0;
	}

	.account-issuer {
		font-size: 24rpx;
		color: #557574;
		display: block;
		margin-bottom: 6rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.account-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #0E2B29;
		display: block;
		line-height: 1.4;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.code-section {
		margin-bottom: 32rpx;
		box-sizing: border-box;
	}

	.code-text {
		font-size: 72rpx;
		font-weight: 700;
		color: #0E2B29;
		letter-spacing: 8rpx;
		line-height: 1.2;
		text-align: center;
		display: block;
		margin-bottom: 12rpx;
		font-family: 'Courier New', monospace;
		box-sizing: border-box;
	}

	.code-meta {
		text-align: center;
	}

	.code-details {
		font-size: 24rpx;
		color: #557574;
		background: #F0F9F8;
		padding: 6rpx 16rpx;
		border-radius: 16rpx;
		display: inline-block;
	}

	/* 倒计时 */
	.countdown-section {
		display: flex;
		align-items: center;
		gap: 24rpx;
		box-sizing: border-box;
	}

	.countdown-bar {
		flex: 1;
		height: 8rpx;
		background: #E0F2F1;
		border-radius: 4rpx;
		overflow: hidden;
	}

	.countdown-progress {
		height: 100%;
		background: linear-gradient(90deg, #36CFC9, #0FC6BE);
		border-radius: 4rpx;
		transition: width 1s linear;

		&.warning {
			background: linear-gradient(90deg, #F53F3F, #F7685B);
		}
	}

	.countdown-time {
		display: flex;
		align-items: center;
		gap: 8rpx;
		min-width: 80rpx;
	}

	.time-text {
		font-size: 26rpx;
		font-weight: 500;
		color: #557574;
	}

	/* 模态框 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 999;
		box-sizing: border-box;
	}

	.modal-container {
		width: 100%;
		max-height: 90vh;
		background: #FFFFFF;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		overflow: visible !important;
		animation: slideUp 0.3s ease;
		box-sizing: border-box;
		position: relative;
		padding-bottom: 130rpx;
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
		}
	}

	.modal-header {
		padding: 40rpx 32rpx 24rpx;
		border-bottom: 1rpx solid #E0F2F1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #0E2B29;
		display: block;
	}

	.modal-close {
		width: 48rpx;
		height: 48rpx;
		border-radius: 12rpx;
		background: #F0F9F8;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;

		&::after {
			border: none;
		}
	}

	.modal-content {
		width: 100%;
		box-sizing: border-box;
		padding: 32rpx;
		max-height: calc(90vh - 250rpx);
		overflow-y: auto;
	}

	.section-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #0E2B29;
		display: block;
		margin-bottom: 24rpx;
	}

	/* 快速添加区域 */
	.quick-add-section {
		margin-bottom: 40rpx;
		box-sizing: border-box;
	}

	.quick-methods {
		display: flex;
		gap: 24rpx;
		box-sizing: border-box;
	}

	.method-card {
		flex: 1;
		background: #F0F9F8;
		border-radius: 20rpx;
		padding: 32rpx 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 2rpx solid transparent;
		box-sizing: border-box;

		&::after {
			border: none;
		}

		&:active {
			background: #E8F8F7;
		}
	}

	.method-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		box-sizing: border-box;

		&.scan {
			background: rgba(54, 207, 201, 0.15);
			color: #36CFC9; // 主青蓝
		}

		&.manual {
			background: rgba(0, 180, 42, 0.08);
			color: #00B42A; // 柔和绿
		}
	}

	.method-label {
		font-size: 28rpx;
		font-weight: 600;
		color: #0E2B29;
		display: block;
		margin-bottom: 8rpx;
	}

	.method-desc {
		font-size: 24rpx;
		color: #557574;
		display: block;
	}

	/* 链接输入区域 */
	.url-section {
		margin-bottom: 40rpx;
		box-sizing: border-box;
	}

	.url-input-group {
		display: flex;
		gap: 16rpx;
		box-sizing: border-box;
	}

	.url-input {
		flex: 1;
		height: 88rpx;
		background: #F0F9F8;
		border-radius: 20rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #0E2B29;
		border: 2rpx solid transparent;
		box-sizing: border-box;

		&:focus {
			border-color: #36CFC9;
			background: #FFFFFF;
		}
	}

	.parse-btn {
		width: 120rpx;
		height: 88rpx;
		background: #36CFC9;
		border-radius: 20rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		&::after {
			border: none;
		}

		&:disabled {
			background: #A8E9E6;
			opacity: 0.5;
		}
	}

	/* 表单区域 */
	.form-section {
		margin-bottom: 32rpx;
		box-sizing: border-box;
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: 28rpx;
	}

	.form-field {
		&.half {
			flex: 1;
			overflow: visible !important;
		}
	}

	.form-label {
		font-size: 26rpx;
		color: #557574;
		display: block;
		margin-bottom: 12rpx;
	}

	.form-input {
		width: 100%;
		height: 88rpx;
		background: #F0F9F8;
		border-radius: 20rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #0E2B29;
		border: 2rpx solid transparent;
		box-sizing: border-box;

		&.secret-input {
			font-family: 'Courier New', monospace;
		}

		&:focus {
			border-color: #36CFC9;
			background: #FFFFFF;
		}
	}

	.form-row {
		display: flex;
		gap: 24rpx;
		box-sizing: border-box;
		overflow: visible !important;
	}

	.custom-picker {
		position: relative;
		z-index: 9999 !important;
		overflow: visible !important;
	}

	.form-picker {
		width: 100%;
		height: 88rpx;
		background: #F0F9F8;
		border-radius: 20rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #0E2B29;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 2rpx solid transparent;
		box-sizing: border-box;

		&:active {
			border-color: #36CFC9;
			background: #FFFFFF;
		}
	}

	/* 底部按钮 */
	.modal-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 24rpx 32rpx;
		border-top: 1rpx solid #E0F2F1;
		display: flex;
		gap: 20rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		z-index: 99;
	}

	.footer-btn {
		flex: 1;
		height: 88rpx;
		border-radius: 20rpx;
		font-size: 28rpx;
		font-weight: 500;
		border: none;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;

		&.secondary {
			background: #F0F9F8;
			color: #557574;
		}

		&.primary {
			background: #36CFC9;
			color: #FFFFFF;
		}

		&::after {
			border: none;
		}
	}
</style>