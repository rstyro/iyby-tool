<template>
	<view class="container">
		<!-- 标题 -->
		<view class="header">
			<text class="title">图片切割工具</text>
			<text class="subtitle">自定义花式切图</text>
		</view>

		<!-- 控制区域 -->
		<view class="control-section">
			<button class="control-btn" @click="selectImage">选择图片</button>

			<!-- 切割模式选择 -->
			<view class="cut-mode-control">
				<text class="cut-mode-label">切割模式：</text>
				<view class="cut-mode-buttons">
					<button class="cut-mode-btn" :class="{ active: cutMode === '3x3' }" @click="setCutMode('3x3')">
						3×3
					</button>
					<button class="cut-mode-btn" :class="{ active: cutMode === '2x3' }" @click="setCutMode('2x3')">
						2×3
					</button>
					<button class="cut-mode-btn" :class="{ active: cutMode === '1x3' }" @click="setCutMode('1x3')">
						1×3
					</button>
					<button class="cut-mode-btn" :class="{ active: cutMode === '3x2' }" @click="setCutMode('3x2')">
						3×2
					</button>
					<button class="cut-mode-btn" :class="{ active: cutMode === '2x2' }" @click="setCutMode('2x2')">
						2×2
					</button>
				</view>
			</view>

			<!-- 自定义切割 -->
			<view class="custom-cut-control">
				<text class="custom-cut-label">自定义切割：</text>
				<view class="custom-cut-inputs">
					<view class="custom-cut-input">
						<text class="input-label">行数：</text>
						<input type="number" class="input-number" v-model="customRows" min="1" max="10"
							@input="updateCustomCut" />
					</view>
					<view class="custom-cut-input">
						<text class="input-label">列数：</text>
						<input type="number" class="input-number" v-model="customCols" min="1" max="10"
							@input="updateCustomCut" />
					</view>
				</view>
				<button class="custom-cut-btn" :class="{ active: cutMode === 'custom' }" @click="setCutMode('custom')">
					应用自定义
				</button>
			</view>

			<button class="control-btn generate-btn" @click="startCut" :disabled="!originalImage || isCutting">
				{{ isCutting ? '切割中...' : '开始切割图片' }}
			</button>
		</view>

		<!-- 原图预览 -->
		<view class="original-section" v-if="originalImage">
			<text class="section-title">原图预览</text>
			<view class="original-preview">
				<image :src="originalImage" class="original-image" mode="widthFix" />
				<view class="original-info">
					<text>尺寸：{{ originalWidth }} × {{ originalHeight }} 像素</text>
					<text>切割模式：{{ cutModeText }}</text>
					<text>将切割成 {{ totalPieces }} 张小图片</text>
				</view>
			</view>
		</view>

		<!-- 切割结果 -->
		<view class="result-section" v-if="cutPieces.length > 0">
			<text class="section-title">切割结果 ({{ cutPieces.length }}张)</text>
			<view class="cut-mode-info">
				<text>模式：{{ cutModeText }} ({{ rows }}行 × {{ cols }}列)</text>
				<text>每张小图：{{ Math.floor(pieceWidth) }} × {{ Math.floor(pieceHeight) }} 像素</text>
			</view>

			<!-- 切割预览网格 -->
			<view class="cut-preview">
				<view class="preview-grid" :style="{ gridTemplateColumns: gridTemplateColumns }">
					<view v-for="(piece, index) in cutPieces" :key="index" class="preview-cell">
						<view class="piece-index">{{ index + 1 }}</view>
						<image :src="piece.path" class="piece-image" mode="aspectFit" @click="previewPiece(index)" />
						<button class="save-piece-btn" @click="savePiece(piece.path, index)">保存</button>
					</view>
				</view>
			</view>

			<!-- 批量保存 -->
			<view class="batch-actions">
				<button class="batch-btn" @click="saveAllPieces">保存所有图片</button>
				<button class="batch-btn" @click="previewAllPieces">预览所有图片</button>
			</view>
		</view>

		<!-- 提示信息 -->
		<view v-if="showMessage" class="message-box">
			<text>{{ messageText }}</text>
		</view>

		<!-- 加载指示器 -->
		<view v-if="isCutting" class="loading-overlay">
			<view class="loading-content">
				<view class="loading-spinner"></view>
				<text class="loading-text">正在切割图片...</text>
				<text class="loading-subtext">请稍候，正在处理第{{ currentPiece + 1 }}/{{ totalPieces }}张</text>
			</view>
		</view>

		<!-- 隐藏的Canvas -->
		<canvas canvas-id="cutCanvas" id="cutCanvas" :style="{
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
				// 原始图片
				originalImage: null,
				originalWidth: 0,
				originalHeight: 0,

				// 切割模式
				cutMode: '3x3', // 3x3, 2x3, 1x3, 3x2, 2x2, custom
				rows: 3,
				cols: 3,

				// 自定义切割
				customRows: 3,
				customCols: 3,

				// 切割结果
				cutPieces: [],
				pieceWidth: 0,
				pieceHeight: 0,
				totalPieces: 9,

				// 状态
				isCutting: false,
				currentPiece: 0,

				// 消息提示
				showMessage: false,
				messageText: '',

				// Canvas尺寸
				canvasWidth: 100,
				canvasHeight: 100
			}
		},

		computed: {
			cutModeText() {
				const map = {
					'3x3': '3行×3列',
					'2x3': '2行×3列',
					'1x3': '1行×3列',
					'3x2': '3行×2列',
					'2x2': '2行×2列',
					'custom': `${this.customRows}行×${this.customCols}列`
				}
				return map[this.cutMode] || '3行×3列'
			},

			// 修复：使用计算属性生成网格模板
			gridTemplateColumns() {
				return `repeat(${this.cols}, 1fr)`
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
					"解锁九宫格，让单图变创意拼图～",
					"制作专属拼图封面，引爆朋友圈"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/imageCut/imageCut',
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
			selectImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 获取图片信息
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (info) => {
								this.originalImage = res.tempFilePaths[0]
								this.originalWidth = info.width
								this.originalHeight = info.height
								this.cutPieces = [] // 清除之前的切割结果
								this.showMessageFunc('图片选择成功')
							},
							fail: () => {
								this.originalImage = res.tempFilePaths[0]
								this.originalWidth = 800
								this.originalHeight = 600
								this.cutPieces = []
								this.showMessageFunc('图片选择成功')
							}
						})
					},
					fail: (err) => {
						console.error('选择图片失败:', err)
						this.showMessageFunc('选择图片失败')
					}
				})
			},

			// 设置切割模式
			setCutMode(mode) {
				this.cutMode = mode

				// 根据模式设置行列数
				switch (mode) {
					case '3x3':
						this.rows = 3
						this.cols = 3
						break
					case '2x3':
						this.rows = 2
						this.cols = 3
						break
					case '1x3':
						this.rows = 1
						this.cols = 3
						break
					case '3x2':
						this.rows = 3
						this.cols = 2
						break
					case '2x2':
						this.rows = 2
						this.cols = 2
						break
					case 'custom':
						this.rows = parseInt(this.customRows) || 3
						this.cols = parseInt(this.customCols) || 3
						break
				}

				// 计算总张数
				this.totalPieces = this.rows * this.cols
				this.showMessageFunc(`已切换到${this.cutModeText}模式`)
			},

			// 更新自定义切割
			updateCustomCut() {
				this.rows = parseInt(this.customRows) || 3
				this.cols = parseInt(this.customCols) || 3
				this.totalPieces = this.rows * this.cols
				this.cutMode = 'custom'
			},

			// 开始切割
			async startCut() {
				if (!this.originalImage) {
					this.showMessageFunc('请先选择图片')
					return
				}

				this.isCutting = true
				this.currentPiece = 0
				this.cutPieces = []
				this.showMessageFunc('开始切割图片...')

				try {
					// 计算每张小图的尺寸
					this.pieceWidth = this.originalWidth / this.cols
					this.pieceHeight = this.originalHeight / this.rows

					// 设置Canvas尺寸为单张小图的尺寸
					this.canvasWidth = Math.floor(this.pieceWidth)
					this.canvasHeight = Math.floor(this.pieceHeight)

					// 等待Canvas尺寸更新
					await new Promise(resolve => setTimeout(resolve, 100))

					// 创建Canvas上下文
					const ctx = uni.createCanvasContext('cutCanvas', this)

					// 清空切割结果
					const pieces = []

					// 循环切割每一张小图
					for (let row = 0; row < this.rows; row++) {
						for (let col = 0; col < this.cols; col++) {
							this.currentPiece = row * this.cols + col

							// 计算当前小图的裁剪区域
							const sx = col * this.pieceWidth
							const sy = row * this.pieceHeight
							const sw = this.pieceWidth
							const sh = this.pieceHeight

							// 清除画布
							ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

							// 绘制当前小图（从原图中裁剪一部分）
							ctx.drawImage(
								this.originalImage,
								sx, sy, sw, sh, // 源图片裁剪区域
								0, 0, this.canvasWidth, this.canvasHeight // 画布绘制区域
							)

							// 等待绘制完成并转换
							const piecePath = await new Promise((resolve, reject) => {
								setTimeout(() => {
									ctx.draw(true, () => {
										setTimeout(() => {
											uni.canvasToTempFilePath({
												canvasId: 'cutCanvas',
												x: 0,
												y: 0,
												width: this.canvasWidth,
												height: this.canvasHeight,
												destWidth: this.canvasWidth,
												destHeight: this.canvasHeight,
												fileType: 'png',
												quality: 1,
												success: (res) => {
													resolve(res
														.tempFilePath)
												},
												fail: (err) => {
													reject(err)
												}
											}, this)
										}, 300)
									})
								}, 100)
							})

							// 保存小图信息
							pieces.push({
								path: piecePath,
								row: row,
								col: col,
								index: this.currentPiece
							})
						}
					}

					// 按顺序排列小图
					this.cutPieces = pieces.sort((a, b) => {
						if (a.row === b.row) {
							return a.col - b.col
						}
						return a.row - b.row
					})

					this.showMessageFunc(`图片切割完成，共${this.cutPieces.length}张小图`)
				} catch (error) {
					console.error('切割失败:', error)
					this.showMessageFunc('切割失败，请重试')
				} finally {
					this.isCutting = false
				}
			},

			// 预览单张小图
			previewPiece(index) {
				if (!this.cutPieces[index]) return

				uni.previewImage({
					current: index,
					urls: this.cutPieces.map(piece => piece.path)
				})
			},

			// 预览所有小图
			previewAllPieces() {
				if (this.cutPieces.length === 0) {
					this.showMessageFunc('请先切割图片')
					return
				}

				uni.previewImage({
					urls: this.cutPieces.map(piece => piece.path)
				})
			},

			// 保存单张小图
			savePiece(imagePath, index) {
				if (!imagePath) {
					this.showMessageFunc('图片不存在')
					return
				}

				uni.showLoading({
					title: '保存中...',
					mask: true
				})

				try {
					// #ifdef H5
					this.saveInH5(imagePath, index + 1)
					// #endif

					// #ifdef MP-WEIXIN
					this.saveInWeChat(imagePath, index + 1)
					// #endif
				} catch (error) {
					console.error('保存失败:', error)
					uni.hideLoading()
					this.showMessageFunc('保存失败：' + (error.message || '未知错误'))
				}
			},

			// 保存所有小图
			async saveAllPieces() {
				if (this.cutPieces.length === 0) {
					this.showMessageFunc('请先切割图片')
					return
				}

				// 显示批量保存提示
				uni.showModal({
					title: '批量保存',
					content: `确定要保存全部${this.cutPieces.length}张小图片吗？`,
					success: (res) => {
						if (res.confirm) {
							this.saveAllPiecesOneByOne()
						}
					}
				})
			},

			// 逐张保存所有小图
			async saveAllPiecesOneByOne1() {
				uni.showLoading({
					title: `保存中 (0/${this.cutPieces.length})`,
					mask: true
				})

				let successCount = 0
				let failCount = 0

				for (let i = 0; i < this.cutPieces.length; i++) {
					const piece = this.cutPieces[i]

					// 更新加载提示
					uni.showLoading({
						title: `保存中 (${i + 1}/${this.cutPieces.length})`,
						mask: true
					})

					try {
						// 模拟保存过程（实际保存需要用户交互）
						await new Promise(resolve => setTimeout(resolve, 300))

						// 在实际应用中，这里应该调用保存函数
						// 但由于批量保存需要多次用户确认，这里只是模拟
						successCount++
					} catch (error) {
						failCount++
					}
				}

				uni.hideLoading()

				if (failCount === 0) {
					this.showMessageFunc(`已成功保存${successCount}张图片`)
				} else {
					this.showMessageFunc(`保存完成，成功${successCount}张，失败${failCount}张`)
				}
			},

			// 逐张保存所有小图 - 修复版
			async saveAllPiecesOneByOne() {
				if (this.cutPieces.length === 0) return

				// 显示批量保存确认弹窗
				uni.showModal({
					title: '批量保存提示',
					content: `确定要保存全部${this.cutPieces.length}张小图片吗？保存过程需要多次确认`,
					confirmText: '开始保存',
					cancelText: '取消',
					success: async (res) => {
						if (res.confirm) {
							// 开始批量保存
							await this.executeBatchSave()
						}
					}
				})
			},

			// 执行批量保存
			async executeBatchSave() {
				let successCount = 0
				let failCount = 0

				// 显示总进度
				uni.showLoading({
					title: `准备保存 (0/${this.cutPieces.length})`,
					mask: true
				})

				// 使用for循环逐张保存，避免并行问题
				for (let i = 0; i < this.cutPieces.length; i++) {
					const piece = this.cutPieces[i]
					const currentIndex = i + 1

					// 更新加载提示
					uni.showLoading({
						title: `保存中 (${currentIndex}/${this.cutPieces.length})`,
						mask: true
					})

					try {
						// 这里不能直接调用保存方法，因为需要等待用户交互
						// 使用Promise包装保存操作
						const saved = await this.saveSinglePieceWithConfirm(piece.path, currentIndex)

						if (saved) {
							successCount++
						} else {
							failCount++
						}

						// 每张图片保存后稍作延迟，避免UI卡顿
						await new Promise(resolve => setTimeout(resolve, 300))

					} catch (error) {
						console.error(`第${currentIndex}张图片保存失败:`, error)
						failCount++
					}
				}

				uni.hideLoading()

				// 显示最终结果
				this.showBatchSaveResult(successCount, failCount)
			},

			// 单张图片保存（带确认）
			saveSinglePieceWithConfirm(imagePath, index) {
				return new Promise((resolve) => {
					// #ifdef H5
					// H5环境直接下载，无需确认
					try {
						this.saveInH5(imagePath, index)
						resolve(true)
					} catch (error) {
						console.error('H5下载失败:', error)
						resolve(false)
					}
					// #endif

					// #ifdef MP-WEIXIN
					// 微信小程序：先显示确认提示
					uni.showModal({
						title: `保存第${index}张图片`,
						content: '确认保存到手机相册吗？',
						confirmText: '保存',
						cancelText: '跳过',
						success: (modalRes) => {
							if (modalRes.confirm) {
								// 用户确认保存
								uni.saveImageToPhotosAlbum({
									filePath: imagePath,
									success: () => {
										// 保存成功提示
										uni.showToast({
											title: `第${index}张保存成功`,
											icon: 'success',
											duration: 1500
										})
										resolve(true)
									},
									fail: (err) => {
										console.error(`第${index}张保存失败:`, err)

										// 如果是权限问题，提示用户
										if (err.errMsg && err.errMsg.includes(
											'auth deny')) {
											uni.showModal({
												title: '权限不足',
												content: '需要您授权保存到相册，请点击确定前往设置',
												showCancel: false,
												success: (settingRes) => {
													if (settingRes.confirm) {
														uni.openSetting()
													}
													resolve(false)
												}
											})
										} else {
											uni.showToast({
												title: '保存失败',
												icon: 'none',
												duration: 1500
											})
											resolve(false)
										}
									}
								})
							} else {
								// 用户选择跳过
								resolve(false)
							}
						},
						fail: () => {
							resolve(false)
						}
					})
					// #endif
				})
			},

			// 显示批量保存结果
			showBatchSaveResult(successCount, failCount) {
				let resultMessage = ''

				if (failCount === 0) {
					resultMessage = `✅ 已成功保存所有${successCount}张图片`
				} else if (successCount === 0) {
					resultMessage = `❌ 所有图片保存失败，共${failCount}张`
				} else {
					resultMessage = `📊 保存完成：成功${successCount}张，失败${failCount}张`
				}

				// 显示结果弹窗
				uni.showModal({
					title: '批量保存完成',
					content: resultMessage,
					showCancel: false,
					confirmText: '知道了',
					success: () => {
						this.showMessageFunc(resultMessage)
					}
				})
			},


			// H5环境保存
			saveInH5(imagePath, index) {
				try {
					// 创建一个临时的a标签进行下载
					const link = document.createElement('a')
					link.href = imagePath
					link.download = `切割图片_${this.cutModeText}_${index}.png`
					link.style.display = 'none'

					document.body.appendChild(link)
					link.click()

					setTimeout(() => {
						document.body.removeChild(link)
						uni.hideLoading()
						this.showMessageFunc(`第${index}张图片已开始下载`)
					}, 100)
				} catch (error) {
					uni.hideLoading()
					this.showMessageFunc('下载失败，请右键图片选择"另存为"')
				}
			},

			// 微信小程序保存
			saveInWeChat(imagePath, index) {
				// 直接保存，不检查授权（小程序会自动提示授权）
				uni.saveImageToPhotosAlbum({
					filePath: imagePath,
					success: () => {
						uni.hideLoading()
						this.showMessageFunc(`第${index}张图片已保存到相册`)
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000
						})
					},
					fail: (err) => {
						uni.hideLoading()
						console.error('保存失败:', err)

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
							this.showMessageFunc('保存失败')
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

	.cut-mode-control {
		margin: 30rpx 0;
	}

	.cut-mode-label,
	.custom-cut-label {
		font-size: 28rpx;
		color: #333;
		display: block;
		margin-bottom: 15rpx;
	}

	.cut-mode-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}

	.cut-mode-btn {
		flex: 1;
		min-width: 120rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		background: #f5f5f5;
		color: #666;
		font-size: 26rpx;
		border: 2rpx solid #e0e0e0;
	}

	.cut-mode-btn.active {
		background: linear-gradient(90deg, #667eea, #764ba2);
		color: white;
		border-color: #667eea;
		transform: translateY(-2rpx);
		box-shadow: 0 5rpx 15rpx rgba(102, 126, 234, 0.3);
	}

	.custom-cut-control {
		margin: 30rpx 0;
		padding: 20rpx;
		background: #f9f9f9;
		border-radius: 15rpx;
	}

	.custom-cut-inputs {
		display: flex;
		gap: 20rpx;
		margin: 20rpx 0;
	}

	.custom-cut-input {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.input-label {
		font-size: 26rpx;
		color: #666;
		white-space: nowrap;
	}

	.input-number {
		flex: 1;
		height: 70rpx;
		padding: 0 20rpx;
		background: white;
		border: 2rpx solid #e0e0e0;
		border-radius: 10rpx;
		font-size: 26rpx;
		text-align: center;
	}

	.custom-cut-btn {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		background: #f5f5f5;
		color: #666;
		font-size: 26rpx;
		border: 2rpx solid #e0e0e0;
	}

	.custom-cut-btn.active {
		background: linear-gradient(90deg, #4CAF50, #8BC34A);
		color: white;
		border-color: #4CAF50;
	}

	.original-section,
	.result-section {
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

	.original-preview {
		text-align: center;
	}

	.original-image {
		max-width: 100%;
		max-height: 400rpx;
		border-radius: 15rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);
		background: #f5f5f5;
	}

	.original-info {
		margin-top: 30rpx;
		padding: 20rpx;
		background: #f9f9f9;
		border-radius: 15rpx;
	}

	.original-info text {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin: 10rpx 0;
	}

	.cut-mode-info {
		margin-bottom: 30rpx;
		padding: 20rpx;
		background: #f0f8ff;
		border-radius: 15rpx;
	}

	.cut-mode-info text {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin: 5rpx 0;
	}

	.cut-preview {
		margin-bottom: 30rpx;
	}

	.preview-grid {
		display: grid;
		gap: 15rpx;
	}

	.preview-cell {
		position: relative;
		border-radius: 15rpx;
		overflow: hidden;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
		background: #f5f5f5;
	}

	.piece-index {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		z-index: 2;
	}

	.piece-image {
		width: 100%;
		height: 200rpx;
	}

	.save-piece-btn {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		background: linear-gradient(90deg, #4CAF50, #8BC34A);
		color: white;
		font-size: 24rpx;
		border: none;
		border-radius: 0;
	}

	.save-piece-btn:active {
		opacity: 0.8;
	}

	.batch-actions {
		display: flex;
		gap: 20rpx;
	}

	.batch-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: linear-gradient(90deg, #36d1dc, #5b86e5);
		color: white;
		font-size: 28rpx;
		border: none;
	}

	.batch-btn:last-child {
		background: linear-gradient(90deg, #ff9a9e, #fad0c4);
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
		background: rgba(255, 255, 255, 0.95);
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
		max-width: 500rpx;
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
		display: block;
		margin-bottom: 10rpx;
	}

	.loading-subtext {
		font-size: 24rpx;
		color: #999;
		display: block;
	}
</style>