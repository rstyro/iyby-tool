<template>
	<view class="barrage-container" :style="{ backgroundColor: params.bgColor }" @click="handleScreenClick">
		<text class="barrage-text" :class="params.direction" :style="{
        fontSize: `${params.fontSize}px`,
        color: params.textColor,
        animation: `scroll-${params.direction} ${scrollDuration}s linear infinite`
      }">
			{{ params.content }}
		</text>

		<view class="back-btn" @click="goBack">
			<uni-icons type="back" size="30" color="#FFFFFF" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params:{
					content: '',
					fontSize: 48,
					speed: 10,
					bgColor: '#000000',
					textColor: '#FFD700',
					direction: 'horizontal'
				},
				scrollDuration: 20
			}
		},
		onLoad(options) {
			console.log("this.$Route.query：：",this.$Route.query);
			console.log("options：：",options);
			// 从URL参数中获取设置
			let query = this.$Route.query;
			query.fontSize=Number(query.fontSize) || 48;
			query.speed=Number(query.speed) || 20;
			this.params={...query};
			console.log("params：：",this.params);
			// this.barrageContent = decodeURIComponent(options.content || '手持弹幕');
			// this.fontSize = Number(options.fontSize) || 48;
			// this.speed = Number(options.speed) || 10;
			// this.bgColor = options.bgColor || '#000000';
			// this.textColor = options.textColor || '#FFD700';
			// this.direction = options.direction || 'horizontal';
			// 计算滚动速度
			this.scrollDuration = 21 - this.params.speed;
			// 设置屏幕方向（仅支持部分平台）
			try {
				if (this.direction === 'horizontal') {
					uni.setScreenOrientation({
						orientation: 'landscape'
					});
				} else {
					uni.setScreenOrientation({
						orientation: 'portrait'
					});
				}
			} catch (e) {
				console.log("e:", e);
			}

		},
		onUnload() {
			try {
				// 恢复默认屏幕方向
				uni.setScreenOrientation({
					orientation: 'portrait'
				});
			} catch (e) {
				console.log("e:", e);
			}

		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			handleScreenClick() {
				// 点击屏幕暂停/继续
				const barrageText = uni.createSelectorQuery().select('.barrage-text');
				barrageText.fields({
					computedStyle: ['animationPlayState']
				}, (res) => {
					if (res && res.animationPlayState === 'paused') {
						barrageText.style({
							animationPlayState: 'running'
						});
					} else {
						barrageText.style({
							animationPlayState: 'paused'
						});
					}
				}).exec();
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

		&.horizontal {
			top: 50%;
			transform: translateY(-50%);
		}

		&.vertical {
			left: 50%;
			transform: translateX(-50%);
			writing-mode: vertical-rl;
		}
	}

	.back-btn {
		position: fixed;
		right: 20px;
		bottom: 20px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
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
			transform: translate(-50%, 100%);
		}

		100% {
			transform: translate(-50%, -100%);
		}
	}
</style>