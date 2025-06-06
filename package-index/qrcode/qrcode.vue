<template>
	<view class="container">
		<!-- 渐变色Tab导航 -->
		<view class="tab-container">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', { active: currentTab === index }]"
				@click="switchTab(index)">
				<text class="tab-text">{{ tab }}</text>
				<view class="tab-underline" v-if="currentTab === index"></view>
			</view>
		</view>

		<!-- 生成二维码页面 -->
		<view v-if="currentTab === 0" class="generate-page">
			<view class="card">
				<view class="form-group">
					<view class="input-label">二维码内容</view>
					<textarea maxlength="1000" v-model="inputValue" placeholder="请输入二维码内容（支持文字、链接等）" class="text-box" />
				</view>

				<view class="color-picker">
					<view class="color-row">
						<text class="color-label">背景色</text>
						<view class="color-wrapper">
							<input v-model="bgColor" type="text" placeholder="#FFFFFF" class="color-input" />
							<view class="color-preview" :style="{ backgroundColor: bgColor }"></view>
						</view>
					</view>

					<view class="color-row">
						<text class="color-label">前景色</text>
						<view class="color-wrapper">
							<input v-model="fgColor" type="text" placeholder="#000000" class="color-input" />
							<view class="color-preview" :style="{ backgroundColor: fgColor }"></view>
						</view>
					</view>
				</view>

				<view class="logo-section">
					<view class="logo-header">
						<text class="logo-title">Logo设置</text>
						<text class="logo-tip">(可选)</text>
					</view>
					<view class="logo-content">
						<view class="logo-upload-btn" @click="chooseLogo">
							<image v-if="logoUrl" :src="logoUrl" mode="aspectFill" class="logo-preview" />
							<view v-else class="upload-placeholder">
								<cl-icon type="icon-tupian" size="30" color="#999"></cl-icon>
								<text class="upload-text">选择Logo</text>
							</view>
						</view>
					</view>
				</view>

				<view class="setting-row">
					<view class="setting-item">
						<text class="setting-label">二维码大小</text>
						<input v-model.number="qrSize" type="digit" class="size-input" placeholder="二维码的大小,单位px" />
					</view>
					<view class="setting-item">
						<text class="setting-label">Logo圆角</text>
						<input v-model.number="logoBordRadius" type="digit" class="radius-input" placeholder="Logo是否需要圆角,0=不需要处理"/>
					</view>
				</view>

				<view class="action-buttons">
					<button @click="generateQRCode" class="generate-btn">生成二维码</button>
					<button @click="downloadQRCode" class="download-btn">保存到相册</button>
				</view>
			</view>

			<view class="qrcode-card">
				<view class="qrcode-header">预览</view>
				<view class="qrcode-wrapper">
					<uqrcode ref="uqrcode" :size="qrSize" canvas-id="qrcode" :value="inputValue" :auto="auto" :options="{
                            margin: 10,
                            backgroundColor: bgColor,
                            foregroundColor: fgColor,
                            foregroundImageSrc: logoUrl,
                            foregroundImageBorderRadius: logoBordRadius
                        }" />
				</view>
			</view>
		</view>

		<!-- 二维码解析页面 -->
		<view v-if="currentTab === 1" class="scan-page">
			<view class="scan-card">
				<button @click="scanCode" class="scan-button">
					<cl-icon class="cl-icon" type="icon-erweima" size="20" color="#fff"></cl-icon>
					<text class="scan-text">扫描二维码</text>
				</button>

				<view class="result-box" :class="{ 'has-result': scanResult }">
					<view v-if="scanResult" class="result-header">
						<cl-icon class="cl-icon" type="icon-chenggong" size="24" color="#4CAF50"></cl-icon>
						<text class="result-title">解析成功</text>
					</view>
					<textarea :value="scanResult" class="text-box" readonly
						:placeholder="scanResult ? '' : '扫描结果将显示在此处'" />
					<button v-if="scanResult" @click="copyResult" class="copy-button">
						<cl-icon class="cl-icon" type="icon-fuzhi" size="20" color="#fff"></cl-icon>
						<text class="copy-text">复制内容</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['生成二维码', '解析二维码'],
				currentTab: 0,
				qrSize: 200,
				inputValue: '万象工具箱Plus:六六大顺',
				bgColor: '#FFFFFF',
				fgColor: '#000000',
				logoUrl: '',
				logoBordRadius: 0,
				scanResult: '',
				auto: false
			};
		},
		methods: {
			// 切换标签页
			switchTab(index) {
				this.currentTab = index;
			},

			// 选择Logo
			chooseLogo() {
				uni.chooseImage({
					count: 1,
					type: 'any',
					success: (res) => {
						this.logoUrl = res.tempFilePaths[0];
					}
				});
			},

			// 生成二维码
			generateQRCode() {
				if (!this.inputValue.trim()) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					});
					return;
				}

				// 触发组件重新生成二维码（如果需要手动触发）
				this.$refs.uqrcode.make();
			},

			// 下载二维码
			downloadQRCode() {
				// 保存二维码到本地相册。,qrcode为组件的ref名称
				this.$refs.uqrcode.save({
				  success: () => {
				    uni.showToast({
				      icon: 'success',
				      title: '保存成功'
				    });
				  }
				});
			},

			// 扫描二维码
			scanCode() {
				uni.scanCode({
					success: (res) => {
						this.scanResult = res.result;
					},
					fail: () => {
						uni.showToast({
							title: '扫描失败',
							icon: 'none'
						});
					}
				});
			},

			// 复制内容
			copyResult() {
				if (!this.scanResult) return;

				uni.setClipboardData({
					data: this.scanResult,
					success: () => {
						uni.showToast({
							title: '复制成功'
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
/* 基础样式 */
.container {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 渐变标签页样式 */
.tab-container {
  display: flex;
  height: 90rpx;
  background: linear-gradient(to right, #6e8eff, #a77aff);
  border-radius: 50rpx;
  margin: 20rpx 0 30rpx;
  box-shadow: 0 6rpx 16rpx rgba(110, 142, 255, 0.2);
  overflow: hidden;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;
  
  &.active {
    .tab-text {
      font-weight: 600;
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
    }
  }
}

.tab-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 30rpx;
  transition: all 0.3s;
}

.tab-underline {
  position: absolute;
  bottom: 10rpx;
  width: 70rpx;
  height: 6rpx;
  background-color: #fff;
  border-radius: 3rpx;
  box-shadow: 0 2rpx 4rpx rgba(255, 255, 255, 0.4);
}

/* 卡片通用样式 */
.card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.qrcode-card, .scan-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
}

/* 表单元素样式 */
.form-group {
  margin-bottom: 30rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.text-box {
  width: 100%;
  height: 180rpx;
  background-color: #f8f9fc;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  border: 2rpx solid #eaeefb;
  transition: all 0.2s;
  
  &:focus {
    border-color: #6e8eff;
    background-color: #fff;
  }
}

/* 颜色选择器 */
.color-picker {
  background-color: #f8f9fc;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.color-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.color-label {
  width: 120rpx;
  font-size: 28rpx;
  color: #555;
}

.color-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.color-input {
  flex: 1;
  height: 70rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 0 20rpx;
  border: 2rpx solid #eaeefb;
  font-size: 26rpx;
}

.color-preview {
  width: 60rpx;
  height: 60rpx;
  border-radius: 10rpx;
  margin-left: 20rpx;
  border: 2rpx solid #f0f0f0;
}

/* Logo设置 */
.logo-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.logo-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.logo-tip {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.logo-content {
  display: flex;
  justify-content: center;
}

.logo-upload-btn {
  width: 140rpx;
  height: 140rpx;
  border-radius: 24rpx;
  background-color: #f8f9fc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2rpx dashed #d1d9f0;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.logo-preview {
  width: 100%;
  height: 100%;
}

/* 设置行 */
.setting-row {
  display: flex;
  margin: 30rpx 0;
}

.setting-item {
  flex: 1;
  padding: 0 10rpx;
}

.setting-label {
  display: block;
  font-size: 26rpx;
  color: #555;
  margin-bottom: 12rpx;
}

.size-input, .radius-input {
  width: 80%;
  height: 80rpx;
  background-color: #f8f9fc;
  border-radius: 16rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  border: 2rpx solid #eaeefb;
}

/* 按钮样式 */
.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.generate-btn, .download-btn, .scan-button, .copy-button {
  flex: 1;
  height: 90rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.generate-btn {
  background: linear-gradient(to right, #6e8eff, #a77aff);
  color: white;
}

.download-btn {
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  color: white;
}

.scan-button {
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  color: white;
  margin: 40rpx auto;
  width: 90%;
}

.copy-button {
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
  margin-top: 20rpx;
}

/* 二维码预览 */
.qrcode-header {
  padding: 24rpx 30rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  background-color: #f8f9fc;
  border-bottom: 2rpx solid #eaeefb;
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
  overflow: hidden;
}

/* 扫描结果 */
.scan-page {
  padding-top: 20rpx;
}

.result-box {
  background-color: #f8f9fc;
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 30rpx;
  
  &.has-result {
    border: 2rpx solid #e1f5e4;
    background-color: #f0faf1;
  }
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 30rpx;
  color: #4CAF50;
  margin-left: 10rpx;
}

/* 图标间距调整 */
.cl-icon {
  margin-right: 10rpx;
}
</style>