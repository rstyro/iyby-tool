<template>
	<view class="container">
		<!-- 标题 -->
		<view class="header">
			<text class="title">图片拼接工具</text>
			<text class="subtitle">轻松将多图合并为惊艳长图</text>
		</view>

		<!-- 控制区域 -->
		<view class="control-section">
			<button class="control-btn" @click="selectImages">选择图片</button>
			<view class="direction-control">
				<text class="direction-label">拼接方向：</text>
				<view class="direction-buttons">
					<button class="direction-btn" :class="{ active: direction === 'horizontal' }"
						@click="setDirection('horizontal')">
						水平拼接
					</button>
					<button class="direction-btn" :class="{ active: direction === 'vertical' }"
						@click="setDirection('vertical')">
						垂直拼接
					</button>
				</view>
			</view>
			<button class="control-btn generate-btn" @click="startGenerate"
				:disabled="images.length === 0 || isGenerating">
				{{ isGenerating ? '生成中...' : '生成拼接图' }}
			</button>
		</view>

		<!-- 图片列表 -->
		<view class="images-section">
			<text class="section-title">图片列表 ({{ images.length }}张)</text>
			<scroll-view class="images-scroll" scroll-x v-if="images.length > 0">
				<view class="image-list">
					<view v-for="(img, index) in images" :key="index" class="image-item">
						<image :src="img.path" class="image-preview" mode="aspectFit" @click="previewImage(index)" />
						<view class="image-actions">
							<text class="image-index">{{ index + 1 }}</text>
							<text class="remove-btn" @click="removeImage(index)">×</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-else class="empty-tips">
				<text>请点击"选择图片"添加需要拼接的图片</text>
			</view>
		</view>

		<!-- 生成的图片 -->
		<view class="result-section" v-if="resultImage">
			<text class="section-title">拼接结果</text>
			<view class="result-preview">
				<image :src="resultImage" class="result-image" mode="widthFix" :show-menu-by-longpress="true" />
				<view class="result-info">
					<text>尺寸：{{ imageWidth }} × {{ imageHeight }} 像素</text>
					<text>格式：PNG</text>
					<text>方向：{{ direction === 'horizontal' ? '水平' : '垂直' }}拼接</text>
					<text class="save-tip">长按图片可保存</text>
				</view>
				<button class="download-btn" @click="saveImage">保存图片</button>
			</view>
		</view>

		<!-- 提示信息 -->
		<view v-if="showMessage" class="message-box">
			<text>{{ messageText }}</text>
		</view>

		<!-- 加载指示器 -->
		<view v-if="isGenerating" class="loading-overlay">
			<view class="loading-content">
				<view class="loading-spinner"></view>
				<text class="loading-text">正在生成...</text>
			</view>
		</view>

		<!-- 隐藏的Canvas -->
		<canvas canvas-id="myCanvas" id="myCanvas" :style="{
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        width: canvasWidth + 'px',
        height: canvasHeight + 'px'
      }"></canvas>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 图片列表
				images: [],

				// 拼接方向
				direction: 'vertical',

				// 生成的结果
				resultImage: null,
				imageWidth: 0,
				imageHeight: 0,

				// 状态
				isGenerating: false,

				// 消息提示
				showMessage: false,
				messageText: '',

				// Canvas尺寸
				canvasWidth: 100,
				canvasHeight: 100
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
					"轻松将多图合并为惊艳长图～",
					"自由拼图，创造你的视觉叙事"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/imageStitch/imageStitch',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 显示消息
			showMessageFunc(text) {
				this.messageText = text
				this.showMessage = true
				setTimeout(() => {
					this.showMessage = false
				}, 2000)
			},

			// 选择图片
			selectImages() {
				uni.chooseImage({
					count: 10,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 获取图片信息
						const promises = res.tempFilePaths.map((path, index) => {
							return new Promise((resolve) => {
								uni.getImageInfo({
									src: path,
									success: (info) => {
										resolve({
											path,
											width: info.width,
											height: info.height,
											index
										})
									},
									fail: () => {
										// 如果获取失败，使用默认尺寸
										resolve({
											path,
											width: 800,
											height: 600,
											index
										})
									}
								})
							})
						})

						Promise.all(promises).then(images => {
							this.images = images
							this.resultImage = null
							this.showMessageFunc(`已选择 ${images.length} 张图片`)
						})
					},
					fail: (err) => {
						console.error('选择图片失败:', err)
						this.showMessageFunc('选择图片失败')
					}
				})
			},

			// 预览图片
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.images.map(img => img.path)
				})
			},

			// 移除图片
			removeImage(index) {
				this.images.splice(index, 1)
				this.resultImage = null
				this.showMessageFunc(`已移除第 ${index + 1} 张图片`)
			},

			// 设置拼接方向
			setDirection(dir) {
				this.direction = dir
				this.resultImage = null
				this.showMessageFunc(`已切换为${dir === 'horizontal' ? '水平' : '垂直'}拼接`)
			},

			// 开始生成
			async startGenerate() {
				if (this.images.length === 0) {
					this.showMessageFunc('请先选择图片')
					return
				}

				if (this.images.length === 1) {
					// 单张图片直接使用
					this.resultImage = this.images[0].path
					this.imageWidth = this.images[0].width
					this.imageHeight = this.images[0].height
					this.showMessageFunc('单张图片无需拼接')
					return
				}

				this.isGenerating = true
				this.showMessageFunc('开始生成拼接图...')

				try {
					// 计算画布尺寸和图片绘制信息
					const {
						canvasSize,
						drawInfos
					} = this.calculateCanvasAndDrawInfo()

					console.log('画布尺寸:', canvasSize)
					console.log('绘制信息:', drawInfos)

					// 设置Canvas尺寸
					this.canvasWidth = canvasSize.width
					this.canvasHeight = canvasSize.height

					// 等待Canvas尺寸更新
					await new Promise(resolve => setTimeout(resolve, 100))

					// 创建Canvas上下文
					const ctx = uni.createCanvasContext('myCanvas', this)

					// 设置白色背景
					ctx.fillStyle = '#FFFFFF'
					ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

					// 绘制图片
					await this.drawImagesOnCanvas(ctx, drawInfos)

					// 等待绘制完成
					await new Promise((resolve) => {
						setTimeout(() => {
							ctx.draw(true, () => {
								// console.log('Canvas绘制完成')
								setTimeout(() => {
									resolve()
								}, 300)
							})
						}, 100)
					})

					// 转换为图片
					await this.convertCanvasToImage(canvasSize)

					this.showMessageFunc('拼接图生成成功！')
				} catch (error) {
					console.error('生成失败:', error)
					this.showMessageFunc('生成失败，请重试')
				} finally {
					this.isGenerating = false
				}
			},

			// 计算画布尺寸和绘制信息
			calculateCanvasAndDrawInfo() {
				let canvasWidth = 0
				let canvasHeight = 0
				const drawInfos = []

				if (this.direction === 'horizontal') {
					// 水平拼接：找到最合适的高度（所有图片最小高度），然后按比例计算宽度
					let minHeight = Infinity
					this.images.forEach(img => {
						if (img.height < minHeight) {
							minHeight = img.height
						}
					})

					// 如果最小高度太小，使用一个默认值
					if (minHeight < 100) minHeight = 100

					// 计算每张图片的绘制宽度和位置
					let currentX = 0
					this.images.forEach(img => {
						// 保持原图比例，计算宽度
						const scale = minHeight / img.height
						const drawWidth = Math.floor(img.width * scale)
						const drawHeight = minHeight

						drawInfos.push({
							src: img.path,
							x: currentX,
							y: 0,
							width: drawWidth,
							height: drawHeight
						})

						canvasWidth += drawWidth
						currentX += drawWidth
					})

					canvasHeight = minHeight
				} else {
					// 垂直拼接：找到最合适的宽度（所有图片最小宽度），然后按比例计算高度
					let minWidth = Infinity
					this.images.forEach(img => {
						if (img.width < minWidth) {
							minWidth = img.width
						}
					})

					// 如果最小宽度太小，使用一个默认值
					if (minWidth < 100) minWidth = 100

					// 计算每张图片的绘制高度和位置
					let currentY = 0
					this.images.forEach(img => {
						// 保持原图比例，计算高度
						const scale = minWidth / img.width
						const drawWidth = minWidth
						const drawHeight = Math.floor(img.height * scale)

						drawInfos.push({
							src: img.path,
							x: 0,
							y: currentY,
							width: drawWidth,
							height: drawHeight
						})

						canvasHeight += drawHeight
						currentY += drawHeight
					})

					canvasWidth = minWidth
				}

				// 限制最大尺寸
				const maxSize = 10000
				if (canvasWidth > maxSize || canvasHeight > maxSize) {
					const scale = Math.min(maxSize / canvasWidth, maxSize / canvasHeight)
					const scaledWidth = Math.floor(canvasWidth * scale)
					const scaledHeight = Math.floor(canvasHeight * scale)

					// 等比例缩放所有绘制信息
					const widthScale = scaledWidth / canvasWidth
					const heightScale = scaledHeight / canvasHeight

					drawInfos.forEach(info => {
						info.x = Math.floor(info.x * widthScale)
						info.y = Math.floor(info.y * heightScale)
						info.width = Math.floor(info.width * widthScale)
						info.height = Math.floor(info.height * heightScale)
					})

					canvasWidth = scaledWidth
					canvasHeight = scaledHeight
				}

				// 确保最小尺寸
				if (canvasWidth < 10) canvasWidth = 10
				if (canvasHeight < 10) canvasHeight = 10

				return {
					canvasSize: {
						width: canvasWidth,
						height: canvasHeight
					},
					drawInfos
				}
			},

			// 在Canvas上绘制图片
			drawImagesOnCanvas(ctx, drawInfos) {
				return new Promise((resolve) => {
					try {
						// 绘制所有图片
						drawInfos.forEach((info, index) => {
							// console.log(`绘制第${index + 1}张:`, info)
							ctx.drawImage(info.src, info.x, info.y, info.width, info.height)
						})
						resolve()
					} catch (error) {
						console.error('绘制图片失败:', error)
						resolve() // 继续执行，不中断
					}
				})
			},

			// 将Canvas转换为图片
			convertCanvasToImage(canvasSize) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						uni.canvasToTempFilePath({
							canvasId: 'myCanvas',
							x: 0,
							y: 0,
							width: canvasSize.width,
							height: canvasSize.height,
							destWidth: canvasSize.width,
							destHeight: canvasSize.height,
							fileType: 'png',
							quality: 1,
							success: (res) => {
								console.log('Canvas转换成功:', res.tempFilePath)
								this.resultImage = res.tempFilePath
								this.imageWidth = canvasSize.width
								this.imageHeight = canvasSize.height
								resolve()
							},
							fail: (err) => {
								console.error('Canvas转换失败:', err)
								reject(new Error('图片转换失败'))
							}
						}, this)
					}, 500)
				})
			},

			// 保存图片
			saveImage() {
				if (!this.resultImage) {
					this.showMessageFunc('请先生成拼接图')
					return
				}

				uni.showLoading({
					title: '保存中...',
					mask: true
				})

				try {
					// 检查当前环境
					// #ifdef H5
					this.saveInH5()
					// #endif

					// #ifdef MP-WEIXIN
					this.saveInWeChat()
					// #endif
				} catch (error) {
					console.error('保存失败:', error)
					uni.hideLoading()
					this.showMessageFunc('保存失败：' + (error.message || '未知错误'))
				}
			},

			// H5环境保存
			saveInH5() {
				try {
					// 创建一个临时的a标签进行下载
					const link = document.createElement('a')
					link.href = this.resultImage
					link.download = '拼接图片_' + new Date().getTime() + '.png'
					link.style.display = 'none'

					document.body.appendChild(link)
					link.click()

					setTimeout(() => {
						document.body.removeChild(link)
						uni.hideLoading()
						this.showMessageFunc('图片已开始下载')
					}, 100)
				} catch (error) {
					uni.hideLoading()
					this.showMessageFunc('下载失败，请右键图片选择"另存为"')
				}
			},

			// 微信小程序保存
			saveInWeChat() {
				// 直接保存，不检查授权（小程序会自动提示授权）
				uni.saveImageToPhotosAlbum({
					filePath: this.resultImage,
					success: () => {
						uni.hideLoading()
						this.showMessageFunc('图片已保存到相册')
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000
						})
					},
					fail: (err) => {
						uni.hideLoading()
						console.error('保存失败:', err)
						let errMsg = '保存失败'

						if (err.errMsg && err.errMsg.includes('auth deny')) {
							// 如果用户拒绝授权，提示手动保存
							uni.showModal({
								title: '提示',
								content: '需要您授权保存到相册，请点击确定前往设置',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							})
						} else {
							this.showMessageFunc(errMsg)
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		min-height: 100vh;
	}

	.header {
		text-align: center;
		padding: 40rpx 0;
	}

	.title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		display: block;
	}

	.subtitle {
		font-size: 28rpx;
		color: #666;
		display: block;
		margin-top: 10rpx;
	}

	.control-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.control-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: linear-gradient(90deg, #36d1dc, #5b86e5);
		color: white;
		font-size: 28rpx;
		margin-bottom: 20rpx;
		border: none;
	}

	.control-btn:active {
		opacity: 0.8;
	}

	.control-btn[disabled] {
		opacity: 0.6;
	}

	.generate-btn {
		background: linear-gradient(90deg, #ff9a9e, #fad0c4);
	}

	.direction-control {
		margin: 30rpx 0;
	}

	.direction-label {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 15rpx;
	}

	.direction-buttons {
		display: flex;
		gap: 20rpx;
	}

	.direction-btn {
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		background: #f5f5f5;
		color: #666;
		font-size: 26rpx;
		border: 2rpx solid #e0e0e0;
	}

	.direction-btn.active {
		background: linear-gradient(90deg, #667eea, #764ba2);
		color: white;
		border-color: #667eea;
	}

	.images-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.images-scroll {
		white-space: nowrap;
	}

	.image-list {
		display: inline-flex;
		gap: 20rpx;
	}

	.image-item {
		position: relative;
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
		overflow: hidden;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
		background: #f5f5f5;
	}

	.image-preview {
		width: 100%;
		height: 100%;
	}

	.image-actions {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		display: flex;
		gap: 10rpx;
	}

	.image-index {
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 5rpx 10rpx;
		border-radius: 20rpx;
		font-size: 20rpx;
	}

	.remove-btn {
		width: 40rpx;
		height: 40rpx;
		background: rgba(255, 0, 0, 0.8);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: bold;
	}

	.empty-tips {
		text-align: center;
		padding: 60rpx;
		color: #999;
		font-size: 28rpx;
		background: #f9f9f9;
		border-radius: 15rpx;
	}

	.result-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.result-preview {
		text-align: center;
	}

	.result-image {
		max-width: 100%;
		max-height: 600rpx;
		border-radius: 15rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);
		background: #f5f5f5;
	}

	.result-info {
		margin: 30rpx 0;
		padding: 20rpx;
		background: #f9f9f9;
		border-radius: 15rpx;
	}

	.result-info text {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin: 10rpx 0;
	}

	.save-tip {
		color: #ff6b6b;
		font-size: 24rpx;
		margin-top: 20rpx !important;
	}

	.download-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: linear-gradient(90deg, #4CAF50, #8BC34A);
		color: white;
		font-size: 28rpx;
		border: none;
	}

	.download-btn:active {
		opacity: 0.8;
	}

	.message-box {
		position: fixed;
		bottom: 50rpx;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 20rpx 40rpx;
		border-radius: 50rpx;
		font-size: 28rpx;
		z-index: 1000;
		animation: fadeInOut 2s ease-in-out;
	}

	@keyframes fadeInOut {

		0%,
		100% {
			opacity: 0;
			transform: translateX(-50%) translateY(20rpx);
		}

		20%,
		80% {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.loading-content {
		text-align: center;
		background: white;
		padding: 60rpx;
		border-radius: 20rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
	}

	.loading-spinner {
		width: 80rpx;
		height: 80rpx;
		border: 6rpx solid #f3f3f3;
		border-top: 6rpx solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 30rpx;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		font-size: 28rpx;
		color: #333;
	}
</style>