<template>
	<view class="settings-container">
		<view class="header">
			<text class="title">手持弹幕设置</text>
		</view>

		<view class="setting-card">
			<view class="setting-item">
				<text class="label">弹幕内容</text>
				<input class="input" v-model="barrageContent" placeholder="输入弹幕内容" />
			</view>

			<view class="setting-item">
				<text class="label">文字大小</text>
				<slider class="slider" :value="fontSize" min="20" max="200" @change="onFontSizeChange" show-value />
			</view>

			<view class="setting-item">
				<text class="label">滚动速度</text>
				<slider class="slider" :value="speed" min="1" max="20" @change="onSpeedChange" show-value />
			</view>

			<view class="setting-item">
				<text class="label">背景颜色</text>
				<view class="color-picker">
					<view v-for="(color,index) in bgColors" :key="index"
						:class="['color-option', { 'selected': bgColor === color }]" :style="{ backgroundColor: color }"
						@click="bgColor = color" />
				</view>
			</view>

			<view class="setting-item">
				<text class="label">文字颜色</text>
				<view class="color-picker">
					<view v-for="(color,index) in textColors" :key="index"
						:class="['color-option', { 'selected': textColor === color }]"
						:style="{ backgroundColor: color }" @click="textColor = color" />
				</view>
			</view>

			<view class="setting-item">
				<text class="label">展示方向</text>
				<view class="direction-options">
					<view :class="['option', { 'selected': direction === 'horizontal' }]"
						@click="direction = 'horizontal'">
						<text>横屏滚动</text>
					</view>
					<view :class="['option', { 'selected': direction === 'vertical' }]" @click="direction = 'vertical'">
						<text>竖排滚动</text>
					</view>
				</view>
			</view>

			<view class="setting-item">
				<text class="label">弹幕模式</text>
				<view class="mode-options">
					<view :class="['option', { 'selected': barrageMode === 'static' }]" @click="barrageMode = 'static'">
						<text>静止</text>
					</view>
					<view :class="['option', { 'selected': barrageMode === 'rolling' }]"
						@click="barrageMode = 'rolling'">
						<text>滚动</text>
					</view>
				</view>
			</view>

		</view>

		<button class="show-btn" @click="showBarrage">展示弹幕</button>

		<!-- 预览区域 -->
		<view class="preview-container">
			<text class="preview-title">预览效果</text>
			<view class="preview" :style="{ backgroundColor: bgColor }">
				<text class="preview-text" :style="{
            fontSize: `${fontSize}px`,
            color: textColor,
            animation: barrageMode=== 'rolling'?`scroll-${direction} ${scrollDuration}s linear infinite`:'none'
          }">
					{{ barrageContent || '弹幕预览' }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				barrageContent: '欢迎使用手持弹幕！',
				fontSize: 88,
				speed: 14,
				bgColor: '#000000',
				textColor: '#FFD700',
				direction: 'horizontal',
				bgColors: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#D83F87'],
				textColors: [
					'#FFD700', '#FFFFFF', '#000000', '#800080',
					'#FF0000', '#00FF00', '#0000FF', '#D83F87',
					'#FFA500', '#00BFFF', '#FF69B4', '#7CFC00'
				],
				barrageMode: 'rolling'
			}
		},
		computed: {
			scrollDuration() {
				// 速度值越大，动画时间越短（滚动越快）
				return 22 - this.speed;
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
					"🎤 追星女孩的隐形翅膀！手机秒变LED灯牌！",
					"🚀 接机/表白/吐槽/生日…一屏搞定所有戏精时刻！",
					"🔧 抛弃物理灯牌！用代码级自定义玩转手持LED",
					"💘 手机里的情话轰炸机！原地求婚仪式感拉满！",
					"🤪 在演唱会高举“歌手跑调了！”是什么体验？",
					"🌐 iOS/安卓通吃！真正零门槛的LED弹幕工厂"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/barrage/barrage',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			onFontSizeChange(e) {
				this.fontSize = e.detail.value;
			},
			onSpeedChange(e) {
				this.speed = e.detail.value;
			},
			showBarrage() {
				// 跳转到弹幕展示页面并传递参数
				// 跳转到弹幕展示页面并传递参数
				// uni.navigateTo({
				//   url: `/pages/barrage/index?content=${encodeURIComponent(this.barrageContent)}&fontSize=${this.fontSize}&speed=${this.speed}&bgColor=${this.bgColor}&textColor=${this.textColor}&direction=${this.direction}`
				// });
				this.$Router.push({
					name: "horseRaceLamp",
					params: {
						content: this.barrageContent,
						fontSize: this.fontSize,
						speed: this.speed,
						bgColor: this.bgColor,
						textColor: this.textColor,
						direction: this.direction,
						mode: this.barrageMode
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.settings-container {
		padding: 20px;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		margin-bottom: 20px;

		.title {
			font-size: 24px;
			font-weight: bold;
			color: #333;
		}
	}

	.setting-card {
		background: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.setting-item {
		margin-bottom: 25px;

		.label {
			display: block;
			font-size: 16px;
			font-weight: 500;
			margin-bottom: 10px;
			color: #333;
		}

		.input {
			border: 1px solid #ddd;
			border-radius: 8px;
			padding: 12px;
			font-size: 16px;
		}

		.slider {
			margin-top: 10px;
		}
	}

	.color-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;

		.color-option {
			width: 36px;
			height: 36px;
			border-radius: 50%;
			border: 2px solid transparent;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

			&.selected {
				border: 2px solid #007AFF;
				transform: scale(1.1);
			}
		}
	}

	.direction-options {
		display: flex;
		gap: 20px;
		margin-top: 10px;

		.option {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 12px;
			border: 1px solid #ddd;
			border-radius: 8px;
			font-size: 14px;
			color: #666;

			&.selected {
				border-color: #007AFF;
				background-color: rgba(0, 122, 255, 0.1);
				color: #007AFF;
			}
		}
	}

	.show-btn {
		background: linear-gradient(135deg, #007AFF, #00C6FF);
		color: white;
		border-radius: 50px;
		margin: 30px 0;
		font-size: 18px;
		font-weight: bold;
		height: 50px;
		line-height: 50px;
		box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
	}

	.preview-container {
		background: white;
		border-radius: 12px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

		.preview-title {
			display: block;
			font-size: 16px;
			font-weight: 500;
			margin-bottom: 12px;
			color: #333;
		}

		.preview {
			height: 120px;
			border-radius: 8px;
			overflow: hidden;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.preview-text {
			font-weight: bold;
			white-space: nowrap;
			position: absolute;
		}
	}

	.mode-options {
		display: flex;
		gap: 20px;
		margin-top: 10px;

		.option {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 12px;
			border: 1px solid #ddd;
			border-radius: 8px;
			font-size: 14px;
			color: #666;

			&.selected {
				border-color: #007AFF;
				background-color: rgba(0, 122, 255, 0.1);
				color: #007AFF;
			}
		}
	}

	@keyframes scroll-horizontal {
		0% {
			transform: translateX(100%);
			-webkit-transform: translateX(100%);
		}

		100% {
			transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
		}
	}


	@keyframes scroll-vertical {
		0% {
			transform: translateY(-400%) rotate(-90deg);
			-webkit-transform: translateY(-400%) rotate(-90deg);
		}

		100% {
			transform: translateY(400%) rotate(-90deg);
			-webkit-transform: translateY(400%) rotate(-90deg);
		}
	}
</style>