<template>
	<view class="container">
		<!-- 标题区域 -->
		<view class="header">
			<view class="header-bg"></view>
			<text class="header-title">手写签名生成器</text>
			<text class="header-subtitle">轻松手写，秒存高清透明签名</text>
		</view>

		<!-- 签名区域 -->
		<view class="signature-container">
			<view class="canvas-wrapper">
				<canvas canvas-id="signatureCanvas" class="signature-canvas" :disable-scroll="true"
					@touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"></canvas>
				<view v-if="!hasSignature" class="placeholder">
					<text class="placeholder-text">请在此处签名</text>
				</view>
			</view>

			<!-- 画笔设置 -->
			<view class="brush-controls">
				<view class="brush-option" @tap="setBrushSize(2)">
					<view class="brush-preview" :class="{ active: brushSize === 2 }">
						<view class="brush-dot small"></view>
					</view>
					<text class="brush-label">细</text>
				</view>
				<view class="brush-option" @tap="setBrushSize(5)">
					<view class="brush-preview" :class="{ active: brushSize === 5 }">
						<view class="brush-dot medium"></view>
					</view>
					<text class="brush-label">中</text>
				</view>
				<view class="brush-option" @tap="setBrushSize(10)">
					<view class="brush-preview" :class="{ active: brushSize === 10 }">
						<view class="brush-dot large"></view>
					</view>
					<text class="brush-label">粗</text>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-buttons">
			<view class="btn-group">
				<button class="btn btn-secondary" @tap="clearSignature">
					<text class="btn-text">清除重写</text>
				</button>
				<button class="btn btn-primary" @tap="saveSignature">
					<text class="btn-text">保存签名</text>
				</button>
				<button class="btn btn-success" @tap="downloadImage">
					<text class="btn-text">下载图片</text>
				</button>
			</view>
		</view>

		<!-- 预览区域 -->
		<view v-if="previewImage" class="preview-section">
			<view class="preview-header">
				<text class="preview-title">签名预览</text>
				<text class="preview-subtitle">透明背景 PNG 格式</text>
			</view>
			<view class="preview-container">
				<image :src="previewImage" class="preview-image" mode="aspectFit"></image>
				<view class="checkboard-bg">
					<view class="checkboard-row" v-for="i in 4" :key="i">
						<view class="checkboard-cell" v-for="j in 4" :key="j"
							:class="{ 'cell-dark': (i + j) % 2 === 0 }"></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 下载提示 -->
		<view v-if="showDownloadTip" class="download-tip" @tap="hideDownloadTip">
			<view class="tip-content">
				<text class="tip-title">下载提示</text>
				<text class="tip-text">{{ downloadTip }}</text>
				<button class="tip-btn" @tap.stop="hideDownloadTip">
					<text class="tip-btn-text">知道了</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canvasContext: null,
				hasSignature: false,
				brushSize: 5,
				isDrawing: false,
				lastX: 0,
				lastY: 0,
				previewImage: '',
				canvasWidth: 0,
				canvasHeight: 0,
				showDownloadTip: false,
				downloadTip: '',
				points: [] // 存储绘制的点，用于彻底清空
			};
		},

		onReady() {
			this.initCanvas();
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
					"手写签名秒变电子版，太方便了！ 🖋️",
					"指尖手写，秒得透明电子签！"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/signature/signature',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			initCanvas() {
				const systemInfo = uni.getSystemInfoSync();
				const screenWidth = systemInfo.windowWidth;
				this.canvasWidth = screenWidth - 40;
				this.canvasHeight = this.canvasWidth;
				// console.log("canvasWidth=",this.canvasWidth);
				this.canvasContext = uni.createCanvasContext('signatureCanvas', this);

				// 初始化透明背景
				this.clearCanvas();
			},

			setBrushStyle() {
				this.canvasContext.setStrokeStyle('#000000');
				this.canvasContext.setLineWidth(this.brushSize);
				this.canvasContext.setLineCap('round');
				this.canvasContext.setLineJoin('round');
			},

			setBrushSize(size) {
				this.brushSize = size;
				this.canvasContext.setLineWidth(size);
			},

			handleTouchStart(e) {
				const touch = e.touches[0];
				this.isDrawing = true;
				this.lastX = touch.x;
				this.lastY = touch.y;

				// 开始新路径
				this.canvasContext.beginPath();
				this.canvasContext.moveTo(this.lastX, this.lastY);

				// 记录起始点
				this.points.push({
					x: this.lastX,
					y: this.lastY
				});
			},

			handleTouchMove(e) {
				if (!this.isDrawing) return;

				const touch = e.touches[0];
				const currentX = touch.x;
				const currentY = touch.y;

				// 绘制直线（更简单，但可以优化）
				this.canvasContext.moveTo(this.lastX, this.lastY);
				this.canvasContext.lineTo(currentX, currentY);
				this.canvasContext.stroke();
				this.canvasContext.draw(true);

				// 记录点
				this.points.push({
					x: currentX,
					y: currentY
				});

				this.lastX = currentX;
				this.lastY = currentY;
				this.hasSignature = true;
			},

			handleTouchEnd() {
				if (this.isDrawing) {
					this.isDrawing = false;
					// 关闭当前路径并开始新路径
					this.canvasContext.closePath();
					this.canvasContext.beginPath();
				}
			},

			clearSignature() {
				this.points = [];
				this.clearCanvas();
				this.hasSignature = false;
				this.previewImage = '';
			},

			clearCanvas() {
				// 彻底清空画布
				this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

				// 重新设置画笔样式
				this.setBrushStyle();

				// 重绘（确保清空）
				this.canvasContext.draw(true);

				// 延迟后再绘制一次，确保清空
				setTimeout(() => {
					this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
					this.canvasContext.draw(true);
				}, 50);
			},

			saveSignature() {
				if (!this.hasSignature) {
					uni.showToast({
						title: '请先签名',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '生成中...',
					mask: true
				});

				// 使用延时确保canvas完全绘制
				setTimeout(() => {
					uni.canvasToTempFilePath({
						canvasId: 'signatureCanvas',
						fileType: 'png',
						quality: 1,
						success: (res) => {
							uni.hideLoading();
							this.previewImage = res.tempFilePath;
							uni.showToast({
								title: '签名已保存',
								icon: 'success'
							});
						},
						fail: (err) => {
							uni.hideLoading();
							console.error('Canvas to image failed:', err);

							// 如果canvasToTempFilePath失败，尝试使用H5的canvas API
							// #ifdef H5
							this.saveCanvasImageH5();
							// #endif

							// #ifndef H5
							uni.showToast({
								title: '生成失败，请重试',
								icon: 'none'
							});
							// #endif
						}
					}, this);
				}, 100);
			},

			// H5环境下的保存方法
			saveCanvasImageH5() {
				const canvas = document.querySelector('canvas[canvas-id="signatureCanvas"]');
				if (canvas) {
					const dataURL = canvas.toDataURL('image/png');
					this.previewImage = dataURL;
					uni.hideLoading();
					uni.showToast({
						title: '签名已保存',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: '生成失败',
						icon: 'none'
					});
				}
			},

			downloadImage() {
				if (!this.previewImage) {
					uni.showToast({
						title: '请先保存签名',
						icon: 'none'
					});
					return;
				}

				// 判断平台
				// #ifdef H5
				this.downloadImageH5();
				// #endif

				// #ifdef MP-WEIXIN
				this.downloadImageWeixin();
				// #endif

				// #ifndef H5
				// #ifndef MP-WEIXIN
				uni.showToast({
					title: '当前平台暂不支持下载',
					icon: 'none'
				});
				// #endif
				// #endif
			},

			// H5环境下载
			downloadImageH5() {
				// 从base64或URL获取数据
				let imageUrl = this.previewImage;

				// 如果是base64，直接创建下载链接
				if (imageUrl.startsWith('data:image')) {
					const link = document.createElement('a');
					link.href = imageUrl;
					link.download = '签名_' + new Date().getTime() + '.png';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					this.showDownloadTip = true;
					this.downloadTip = '图片已开始下载，如果没有自动下载，请检查浏览器下载设置。';
				} else {
					// 如果是临时路径，先转换为blob再下载
					fetch(imageUrl)
						.then(res => res.blob())
						.then(blob => {
							const url = window.URL.createObjectURL(blob);
							const link = document.createElement('a');
							link.href = url;
							link.download = '签名_' + new Date().getTime() + '.png';
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
							window.URL.revokeObjectURL(url);

							this.showDownloadTip = true;
							this.downloadTip = '图片已开始下载，如果没有自动下载，请检查浏览器下载设置。';
						})
						.catch(err => {
							console.error('下载失败:', err);
							uni.showToast({
								title: '下载失败',
								icon: 'none'
							});
						});
				}
			},

			// 微信小程序环境下载
			downloadImageWeixin() {
				uni.saveImageToPhotosAlbum({
					filePath: this.previewImage,
					success: () => {
						uni.showToast({
							title: '已保存到相册',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('保存失败:', err);
						// 判断是否因权限被拒导致
						if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
							// 权限被拒，引导用户去设置
							uni.showModal({
								title: '提示',
								content: '需要您授权保存图片到相册',
								confirmText: '去设置',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting(); // 打开小程序设置页
									}
								}
							});
						} else {
							// 其他错误（如文件损坏、存储空间不足等）
							uni.showToast({
								title: '保存失败，请重试',
								icon: 'none'
							});
						}
					}
				});
			},
			hideDownloadTip() {
				this.showDownloadTip = false;
			}
		}
	};
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		padding: 30rpx 24rpx;
		box-sizing: border-box;
	}

	// 顶部标题区
	.header {
		position: relative;
		padding: 60rpx 32rpx 40rpx;
		text-align: center;
		overflow: hidden;
		margin: -30rpx -24rpx 40rpx -24rpx;

		.header-bg {
			position: absolute;
			top: -175rpx;
			left: -50rpx;
			right: -50rpx;
			height: 400rpx;
			background: linear-gradient(135deg, #2C3E50 0%, #4A6491 100%);
			border-radius: 0 0 50% 50%;
			box-shadow: 0 10rpx 30rpx rgba(44, 62, 80, 0.2);
		}

		.header-title {
			position: relative;
			font-size: 52rpx;
			font-weight: 700;
			color: #fff;
			text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
			letter-spacing: 2rpx;
			display: block;
			margin-bottom: 16rpx;
		}

		.header-subtitle {
			position: relative;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.85);
			letter-spacing: 1rpx;
			font-weight: 300;
		}
	}

	/* 签名区域 */
	.signature-container {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
		margin-bottom: 40rpx;
		border: 1rpx solid #eaeaea;
	}

	.canvas-wrapper {
		position: relative;
		width: 100%;
		height: 400rpx;
		background: #ffffff;
		border: 2rpx dashed #d1d9e6;
		border-radius: 16rpx;
		box-sizing: border-box;
		overflow: hidden;
		transition: all 0.3s ease;

		&:active {
			border-color: #4A6491;
		}
	}

	.signature-canvas {
		width: 100%;
		height: 100%;
		background-color: transparent;
		z-index: 2;
		box-sizing: border-box;
	}

	.placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(45deg, #f8f9fa 25%, #ffffff 25%, #ffffff 50%, #f8f9fa 50%, #f8f9fa 75%, #ffffff 75%);
		background-size: 40rpx 40rpx;
	}

	.placeholder-text {
		color: #6c757d;
		font-size: 32rpx;
		font-weight: 300;
		background: rgba(255, 255, 255, 0.9);
		padding: 20rpx 40rpx;
		border-radius: 12rpx;
		backdrop-filter: blur(10rpx);
	}

	/* 画笔控制 */
	.brush-controls {
		display: flex;
		justify-content: center;
		gap: 60rpx;
		margin-top: 40rpx;
	}

	.brush-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		transition: transform 0.2s ease;

		&:active {
			transform: scale(0.95);
		}
	}

	.brush-preview {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 2rpx solid transparent;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.brush-preview.active {
		background: linear-gradient(135deg, #4A6491 0%, #2C3E50 100%);
		border-color: #4A6491;
		transform: scale(1.1);
		box-shadow: 0 8rpx 20rpx rgba(74, 100, 145, 0.3);
	}

	.brush-dot {
		background: #495057;
		border-radius: 50%;
		transition: all 0.3s ease;
	}

	.brush-preview.active .brush-dot {
		background: #ffffff;
	}

	.brush-dot.small {
		width: 8rpx;
		height: 8rpx;
	}

	.brush-dot.medium {
		width: 16rpx;
		height: 16rpx;
	}

	.brush-dot.large {
		width: 24rpx;
		height: 24rpx;
	}

	.brush-label {
		font-size: 28rpx;
		color: #495057;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.brush-preview.active+.brush-label {
		color: #4A6491;
		font-weight: 600;
	}

	/* 操作按钮 */
	.action-buttons {
		margin-top: 50rpx;
	}

	.btn-group {
		display: flex;
		gap: 30rpx;
		justify-content: center;
	}

	.btn {
		flex: 1;
		height: 90rpx;
		border-radius: 16rpx;
		border: none;
		font-size: 32rpx;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
			transition: 0.5s;
		}

		&:active::before {
			left: 100%;
		}

		&:active {
			transform: translateY(2rpx);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		}
	}

	.btn::after {
		border: none;
	}

	.btn-text {
		color: #ffffff;
		font-weight: 600;
		letter-spacing: 1rpx;
	}

	.btn-secondary {
		background: linear-gradient(135deg, #6c757d 0%, #495057 100%);

		&:active {
			background: linear-gradient(135deg, #5a6268 0%, #3d4348 100%);
		}
	}

	.btn-primary {
		background: linear-gradient(135deg, #4A6491 0%, #2C3E50 100%);

		&:active {
			background: linear-gradient(135deg, #3d5679 0%, #253544 100%);
		}
	}

	.btn-success {
		background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);

		&:active {
			background: linear-gradient(135deg, #218838 0%, #155724 100%);
		}
	}

	.btn:disabled {
		opacity: 0.5;
		transform: none !important;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05) !important;
	}

	/* 预览区域 */
	.preview-section {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		padding: 40rpx;
		margin-top: 40rpx;
		box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
		border: 1rpx solid #eaeaea;
		backdrop-filter: blur(10rpx);
	}

	.preview-header {
		text-align: center;
		margin-bottom: 30rpx;
	}

	.preview-title {
		display: block;
		font-size: 36rpx;
		font-weight: 700;
		color: #2C3E50;
		margin-bottom: 10rpx;
		letter-spacing: 1rpx;
	}

	.preview-subtitle {
		display: block;
		font-size: 24rpx;
		color: #6c757d;
		font-weight: 300;
	}

	.preview-container {
		position: relative;
		width: 100%;
		height: 400rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background: #ffffff;
		border: 1rpx solid #eaeaea;
	}

	.preview-image {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 2;
	}

	/* 棋盘格背景 */
	.checkboard-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		z-index: 1;
	}

	.checkboard-row {
		display: contents;
	}

	.checkboard-cell {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
	}

	.cell-dark {
		background-color: #f8f9fa;
	}

	/* 下载提示 */
	.download-tip {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 40rpx;
		box-sizing: border-box;
		backdrop-filter: blur(5rpx);
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.tip-content {
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border-radius: 24rpx;
		padding: 50rpx 40rpx;
		width: 100%;
		max-width: 600rpx;
		text-align: center;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
		border: 1rpx solid #eaeaea;
		animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes slideUp {
		from {
			transform: translateY(100rpx);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.tip-title {
		display: block;
		font-size: 40rpx;
		font-weight: 700;
		color: #2C3E50;
		margin-bottom: 30rpx;
	}

	.tip-text {
		display: block;
		font-size: 32rpx;
		color: #495057;
		line-height: 1.6;
		margin-bottom: 40rpx;
	}

	.tip-btn {
		background: linear-gradient(135deg, #4A6491 0%, #2C3E50 100%);
		color: #ffffff;
		border: none;
		border-radius: 12rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		font-weight: 600;
		width: 100%;
		transition: all 0.3s ease;
		box-shadow: 0 6rpx 20rpx rgba(74, 100, 145, 0.3);

		&:active {
			transform: translateY(2rpx);
			box-shadow: 0 4rpx 12rpx rgba(74, 100, 145, 0.4);
		}
	}

	.tip-btn-text {
		color: #ffffff;
	}
</style>