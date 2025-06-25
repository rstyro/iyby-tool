<template>
	<view class="container">
		<!-- 头部区域 -->
		<view class="header">
			<view class="heart-icon">❤️</view>
			<text class="title">啪啪啪关系预测计算器</text>
			<text class="subtitle">基于科学公式预测情侣关系发展时间</text>
		</view>

		<!-- 表单区域 - 使用scroll-view包裹内容 -->
		<scroll-view class="content" scroll-y="true" :style="{'height': scrollHeight + 'px'}">
			<!-- 整个内容容器 -->
			<view class="inner-content">
				<!-- 女方年龄 -->
				<view class="form-group">
					<view class="form-label">
						<text class="emoji">👩</text>
						<text>女方年龄 (Af)</text>
					</view>
					<view class="input-container">
						<text class="input-icon">🔢</text>
						<input type="number" v-model="af" placeholder="输入女方年龄 (18-39岁)" min="18" max="39"
							class="uni-input" />
					</view>
					<view class="warning" :class="{visible: ageWarning}">注意：女方年龄必须小于40岁</view>
				</view>

				<!-- 女方外貌 -->
				<view class="form-group">
					<view class="form-label">
						<text class="emoji">💅</text>
						<text>女方外貌 (Lf)</text>
					</view>
					<view class="input-container">
						<text class="input-icon">🌟</text>
						<input type="number" v-model="lf" placeholder="输入女方外貌评分 (1-10分)" min="1" max="10"
							class="uni-input" />
					</view>
					<view class="slider-label">
						<text>1分 (普通)</text>
						<text>10分 (女神)</text>
					</view>
					<slider min="1" max="10" step="1" :show-value="true" :value="lf" activeColor="#ec4899" backgroundColor="#e9ecef"
						block-color="#ec4899" block-size="20" @change="sliderChange('lf', $event)" />
				</view>

				<!-- 男方外貌 -->
				<view class="form-group">
					<view class="form-label">
						<text class="emoji">👨</text>
						<text>男方外貌 (Lm)</text>
					</view>
					<view class="input-container">
						<text class="input-icon">🌟</text>
						<input type="number" v-model="lm" placeholder="输入男方外貌评分 (1-10分)" min="1" max="10"
							class="uni-input" />
					</view>
					<view class="slider-label">
						<text>1分 (普通)</text>
						<text>10分 (男神)</text>
					</view>
					<slider min="1" max="10" step="1" :show-value="true" :value="lm" activeColor="#ec4899" backgroundColor="#e9ecef"
						block-color="#ec4899" block-size="20" @change="sliderChange('lm', $event)" />
				</view>

				<!-- 男方资产 -->
				<view class="form-group">
					<view class="form-label">
						<text class="emoji">💰</text>
						<text>男方资产 (单位：10万元)</text>
					</view>
					<view class="input-container">
						<text class="input-icon">🏦</text>
						<input type="number" v-model="wm" placeholder="输入男方资产 (单位: 10万港元)" class="uni-input" />
					</view>
					<view class="slider-label">
						<text>0 (0资产)</text>
						<text>100 (千万资产)</text>
					</view>
					<slider min="0" max="100" step="1" :show-value="true" :value="wm" activeColor="#ec4899" backgroundColor="#e9ecef"
						block-color="#ec4899" block-size="20" @change="sliderChange('wm', $event)" />
				</view>

				<!-- 女方性伴侣数 -->
				<view class="form-group">
					<view class="form-label">
						<text class="emoji">🔢</text>
						<text>女方性伴侣数 (Sf)</text>
					</view>
					<view class="input-container">
						<text class="input-icon">👥</text>
						<input type="number" v-model="sf" placeholder="输入女方曾有性行为的男性数目" min="0" class="uni-input" />
					</view>
					<view class="slider-label">
						<text>0 (处女)</text>
						<text>10+ (经验丰富)</text>
					</view>
					<slider min="0" max="20" step="1" :show-value="true" :value="sf" activeColor="#ec4899" backgroundColor="#e9ecef"
						block-color="#ec4899" block-size="20" @change="sliderChange('sf', $event)" />
				</view>

				<!-- 计算按钮 -->
				<button class="calculate-btn" @click="calculate">预测啪啪啪时间</button>

				<!-- 结果展示 -->
				<view class="result-container" :class="{show: showResult}">
					<text class="result-title">预测发生亲密关系的时间</text>
					<text class="result-value">{{ resultDays }} 天</text>
					<view class="result-desc">
						<text>根据输入数据计算：</text>
						<view class="result-list">
							<view class="text">预计在交往后 <text class="highlight">{{ resultDays }}</text> 天可以发生亲密关系</view>
							<view class="text">相当于大约 <text class="highlight">{{ Math.floor(resultDays / 30) }}</text> 个月后</view>
							<view class="text">公式计算结果仅供参考，实际关系发展因人而异</view>
						</view>
						
					</view>
				</view>

				<!-- 公式说明部分 -->
				<view class="formula-container">
					<text class="formula-title">啪啪啪预测公式</text>
					<view class="formula-box">
						[ (40 - Af)^2 + Lf^3 ] × 10 ÷ [ (Lm^2 + Wm) × (Sf + 1)^2 ]
					</view>

					<view class="example">
						<text class="example-title">示例1: 中女与帅哥（有房）</text>
						<text>女30岁外貌7分曾与2男有性行为，男外貌8分资产300万</text>
						<text>计算: [(40-30)^2 + 7^3] × 10 ÷ [(8^2 + 30) × (2+1)^2] = 5.24天</text>
					</view>

					<view class="example">
						<text class="example-title">示例2: 屌丝与女神</text>
						<text>女22岁外貌9分处女，男外貌3分资产0</text>
						<text>计算: [(40-22)^2 + 9^3] × 10 ÷ [(3^2 + 0) × (0+1)^2] = 1170天</text>
					</view>
				</view>

				<!-- 免责声明 -->
				<text class="disclaimer">注意：本计算器仅用于娱乐目的，根据特定公式计算得出结果。实际关系发展受多种因素影响，请勿将此结果作为真实关系发展的依据。</text>
				<view class="disclaimer">健康的关系应基于双方的意愿和舒适度。</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				af: 23, // 女方年龄
				lf: 8, // 女方外貌
				lm: 8, // 男方外貌
				wm: 100, // 男方资产
				sf: 1, // 女方性伴侣数
				resultDays: 0,
				showResult: false,
				ageWarning: false,
				scrollHeight: 500 // 动态滚动高度
			};
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
					"测完惊了！原来我们只需要XX天就能为爱鼓掌？这个计算器太刺激了！",
					"朋友说我是'快枪手'？啪啪计算器还我清白！科学证明我们属于'正常速度'😂",
					"OMG！原来资产+颜值真的影响恋爱进度？！我的计算结果太颠覆三观了！"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/papaCalc/papaCalc',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 处理滑块变化
			sliderChange(field, e) {
				this[field] = e.detail.value;
			},

			// 计算预测结果
			calculate() {
				// 验证女方年龄
				if (this.af >= 40) {
					this.ageWarning = true;
					this.showResult = false;
					return;
				}

				this.ageWarning = false;

				// 计算公式
				const numerator = (Math.pow((40 - this.af), 2) + Math.pow(this.lf, 3)) * 10;
				const denominator = (Math.pow(this.lm, 2) + parseFloat(this.wm)) * Math.pow((parseFloat(this.sf) + 1), 2);

				// 结果保留2位小数
				this.resultDays = (numerator / denominator).toFixed(2);
				this.showResult = true;
			},

			// 设置滚动高度
			setScrollHeight() {
				const systemInfo = uni.getSystemInfoSync();
				const screenHeight = systemInfo.windowHeight || systemInfo.screenHeight;
				const headerHeight = 200; // 头部高度估计值
				this.scrollHeight = screenHeight - headerHeight;
			}
		},
		watch: {
			// 监听女性年龄变化
			af(newVal) {
				if (newVal >= 40) {
					this.ageWarning = true;
				} else {
					this.ageWarning = false;
				}
			}
		},
		onReady() {
			this.setScrollHeight();
		}
	};
</script>

<style lang="scss" scoped>

	page {
		background: linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%);
		color: #333;
	}

	/* 页面容器 */
	.container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 20rpx;
	}

	/* 头部区域 */
	.header {
		background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
		color: white;
		text-align: center;
		padding: 30rpx;
		position: relative;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
		border-radius: 40rpx;

		.title {
			display: block;
			font-size: 36rpx;
			font-weight: 700;
			letter-spacing: 1rpx;
			margin-bottom: 15rpx;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
		}

		.subtitle {
			display: block;
			font-size: 26rpx;
			opacity: 0.9;
			margin: 0 auto;
			line-height: 1.6;
		}
	}

	.heart-icon {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		font-size: 36rpx;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.2);
		}

		100% {
			transform: scale(1);
		}
	}

	/* 内容区域 */
	.content {
		flex: 1;
		padding: 20rpx 0rpx;
		box-sizing: border-box;
	}

	/* 内部内容容器 */
	.inner-content {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	/* 表单组样式 */
	.form-group {
		background: white;
		border-radius: 24rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.form-label {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		font-weight: 500;
		color: #555;
		font-size: 32rpx;

		.emoji {
			margin-right: 15rpx;
			font-size: 36rpx;
		}
	}

	/* 输入框样式 */
	.input-container {
		display: flex;
		align-items: center;
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 20rpx 25rpx;
		border: 1rpx solid #e9ecef;
		transition: all 0.3s;

		&:focus-within {
			border-color: #ec4899;
			box-shadow: 0 0 0 3rpx rgba(236, 72, 153, 0.1);
		}
	}

	.input-icon {
		margin-right: 15rpx;
		color: #ec4899;
		font-size: 36rpx;
	}

	.uni-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 32rpx;
		color: #333;
		outline: none;
		height: 45rpx;
		min-height: 60rpx;

		&::placeholder {
			color: #aaa;
			font-size: 28rpx;
		}
	}

	/* 滑块标签 */
	.slider-label {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		margin-bottom: 15rpx;
		font-size: 26rpx;
		color: #666;
	}

	/* 警告样式 */
	.warning {
		color: #e11d48;
		font-size: 26rpx;
		margin-top: 15rpx;
		padding-left: 15rpx;
		display: none;

		&.visible {
			display: block;
		}
	}

	/* 计算按钮 */
	.calculate-btn {
		background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
		color: white;
		border: none;
		padding: 32rpx;
		border-radius: 24rpx;
		font-size: 34rpx;
		font-weight: 500;
		box-shadow: 0 6rpx 15rpx rgba(236, 72, 153, 0.4);
		transition: all 0.3s;
		margin: 0;
		letter-spacing: 1rpx;
		line-height: 1.2;

		&:active {
			transform: translateY(-3rpx);
			box-shadow: 0 8rpx 20rpx rgba(236, 72, 153, 0.5);
		}
	}

	/* 结果容器 */
	.result-container {
		background: #fdf2f8;
		border-radius: 24rpx;
		padding: 30rpx;
		text-align: center;
		border: 1rpx solid #fbcfe8;
		display: none;

		&.show {
			display: block;
			animation: fadeIn 0.5s;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result-title {
		font-size: 32rpx;
		color: #555;
		margin-bottom: 30rpx;
		display: block;
	}

	.result-value {
		font-size: 64rpx;
		font-weight: 700;
		color: #ec4899;
		margin: 20rpx 0;
		display: block;
	}

	.result-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.7;
		margin-top: 30rpx;
		padding: 25rpx;
		background: white;
		border-radius: 16rpx;
		text-align: left;

		.result-list {
			margin-top: 25rpx;
			display: flex;
			flex-direction: column;
			gap: 15rpx;
			
			.text{
				margin-left: 20rpx;
				position: relative;
				
				&::before {
				    content: "";
				    display: inline-block;
				    width: 6rpx;
				    height: 6rpx;
				    background-color: #222;
				    border-radius: 50%;
				    margin-right: 10rpx;
				    vertical-align: middle;
				}
			}

			.highlight {
				color: #ec4899;
				font-weight: 700;
			}
		}

	}

	/* 公式容器 */
	.formula-container {
		padding: 30rpx;
		background: #f0f9ff;
		border-radius: 24rpx;
		border: 1rpx solid #e0f2fe;

		.formula-title {
			font-size: 32rpx;
			color: #0c4a6e;
			margin-bottom: 25rpx;
			text-align: center;
			font-weight: 500;
			display: block;
		}

		.formula-box {
			font-family: monospace;
			background: white;
			padding: 25rpx;
			border-radius: 16rpx;
			margin: 20rpx 0;
			font-size: 30rpx;
			text-align: center;
			color: #333;
			line-height: 1.5;
		}

		.example {
			padding: 25rpx;
			background: white;
			border-radius: 16rpx;
			font-size: 26rpx;
			color: #444;
			line-height: 1.6;
			margin-bottom: 25rpx;

			text {
				display: block;
				margin-bottom: 8rpx;
			}

			.example-title {
				font-weight: 500;
				color: #0c4a6e;
				margin-bottom: 12rpx;
				font-size: 28rpx;
			}
		}
	}

	/* 免责声明 */
	.disclaimer {
		display: block;
		font-size: 24rpx;
		color: #999;
		text-align: center;
		line-height: 1.7;
		padding: 10rpx 0;
	}
</style>