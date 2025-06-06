<template>
	<view class="barrage-container" :style="{ backgroundColor: params.bgColor }" @click="handleScreenClick">
		<text class="barrage-text" :class="params.direction" :style="{
        fontSize: `${params.fontSize}px`,
        color: params.textColor,
        animation: params.mode === 'rolling' ?`scroll-${params.direction} ${scrollDuration}s linear infinite`: 'none',
		animationPlayState: isPaused ? 'paused' : 'running'
      }">
			{{ params.content }}
		</text>

		<view class="back-btn" @click="goBack">
			<cl-icon type="icon-back" color="#fff" size="30"></cl-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPaused: false,
				params: {
					content: '',
					fontSize: 48,
					speed: 10,
					bgColor: '#000000',
					textColor: '#FFD700',
					direction: 'horizontal',
					mode: ''
				},
				scrollDuration: 20
			}
		},
		onLoad(options) {
			// 从URL参数中获取设置
			let query = this.$Route.query;
			query.fontSize = Number(query.fontSize) || 48;
			query.speed = Number(query.speed) || 20;
			this.params = {
				...query
			};
			// 计算滚动速度
			this.scrollDuration = 21 - this.params.speed;
		},
		onUnload() {},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			handleScreenClick() {
				// 点击屏幕暂停/继续
				this.isPaused = !this.isPaused;
			}
		}
	}
</script>

<style lang="scss">
	.barrage-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.barrage-text {
		position: absolute;
		font-weight: bold;
		white-space: nowrap;
		display: inline-block;

		&.horizontal {
			top: 50%;
			transform: translateY(-50%);
		}

		&.vertical {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) rotate(-90deg);
			// writing-mode: vertical-rl;
		}
	}

	.back-btn {
		position: fixed;
		right: 20px;
		bottom: 20px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		// background: linear-gradient(135deg, #800080, #d83f87);
		box-shadow: 0 4px 12px rgba(128, 0, 128, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		transition: all 0.3s ease;

		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.3);

		&:active {
			transform: scale(0.95);
			background: linear-gradient(135deg, #6a006a, #c23373);
		}
	}

	@keyframes scroll-horizontal {
		0% {
			transform: translate(100%, -50%);
		}

		100% {
			transform: translate(-100%, -50%);
		}
	}

	@keyframes scroll-vertical {
		0% {
			transform: translate(-50%, -500%) rotate(-90deg);
		}

		100% {
			transform: translate(-50%, 500%) rotate(-90deg);
		}

	}
</style>