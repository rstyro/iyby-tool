<template>
	<view class="container">
		<view class="sound-toggle" @click="toggleSound">
			<cl-icon :type="soundIcon" color="#fff" />
		</view>

		<view class="header">
			<text class="title">禅心木鱼</text>
			<text class="subtitle">静心修身 • 功德无量</text>
		</view>

		<view class="fish-container">
			<view class="halo"></view>
			<!--   <view 
        class="fish" 
        @click="manualKnock"
        :class="{ 'knock-animation': knockAnimating }"
      >
        <view class="fish-inner">
          <view class="fish-core"></view>
        </view>
        <view class="fish-stick"></view>
      </view> -->

			<view class="fish" @click="manualKnock" :class="{ 'knock-animation': knockAnimating }">
				<cl-icon type="icon-muyu" size="150" color="#8B4513"></cl-icon>
			</view>


			<!-- 文字特效容器 -->
			<view class="text-effects">
				<view v-for="(effect, index) in textEffects" :key="index" class="text-effect" :style="{
            left: `${effect.left}px`,
            top: `${effect.top}px`,
            animationDelay: `${effect.delay}ms`,
          }">
					{{ effect.text }}
				</view>
			</view>
		</view>

		<view class="stats">
			<view class="stat-item">
				<text class="stat-value">{{ knockCount }}</text>
				<text class="stat-label">今日叩击</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ totalCount }}</text>
				<text class="stat-label">累计功德</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ autoCount }}</text>
				<text class="stat-label">自动叩击</text>
			</view>
		</view>

		<view class="controls">
			<button class="btn" :class="{ 'btn-auto-active': autoMode }" @click="toggleAutoKnock">
				<i :class="autoMode ? 'fas fa-pause' : 'fas fa-play'"></i>
				{{ autoMode ? '停止自动' : '自动敲击' }}
			</button>
			<button class="btn btn-alt" @click="resetCounter">
				<i class="fas fa-redo"></i> 重置
			</button>
		</view>

		<view class="lotus"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fishData: {
					count: 0, // 今日叩击次数
					auto: 0,
					total: 0, // 累计功德
				},
				autoMode: false, // 是否自动模式
				autoInterval: null, // 自动敲击计时器
				soundEnabled: true, // 音效开关状态
				knockAnimating: false, // 木鱼动画状态
				textEffects: [], // 文字特效列表
			};
		},
		computed: {
			// 计算属性
			knockCount() {
				return this.fishData.count;
			},
			totalCount() {
				return this.fishData.total;
			},
			autoCount() {
				return this.fishData.auto;
			},
			soundIcon() {
				return this.soundEnabled ? 'icon-diyinliang' : 'icon-jingyin';
			},
		},
		onLoad() {

		},
		mounted() {
			// 尝试恢复之前的数据
			this.tryRestoreData();
		},
		beforeDestroy() {
			// 清理资源
			if (this.autoInterval) clearInterval(this.autoInterval);
		},
		methods: {
			// 手动敲击木鱼
			manualKnock() {
				if (this.autoMode) return;
				this.knock();
			},

			// 敲击木鱼核心方法
			knock() {
				// 更新计数
				this.fishData.count++;
				if (this.autoMode) {
					this.fishData.auto++;
					if (this.fishData.auto % 3 == 0) {
						this.fishData.total++;
					}
				} else {
					this.fishData.total++;
				}

				// 触发动画
				this.knockAnimating = true;
				setTimeout(() => {
					this.knockAnimating = false;
				}, 300);

				// 播放音效
				if (this.soundEnabled) {
					// 初始化音效
					if (this.fishData.count < 3) {
						uni.$emit('global-user-interaction');
					}
					const sound3 = this.$soundManager.getSound("sound3"); // 获取音效实例
					if (sound3) {
						sound3.currentTime = 0; // 将播放位置重置到起点
					}
					this.$soundManager.play("sound3");
				}

				// 添加文字特效
				this.addTextEffect();

				// 保存数据
				this.saveData();
			},

			// 添加文字特效
			addTextEffect() {
				const textContent = this.soundEnabled ? '功德+1' : '功德默默+1';

				const effect = {
					id: Date.now() + Math.random(),
					text: textContent,
					left: Math.random() * 100 + 110, // 110-210px
					top: Math.random() * 80 + 150, // 150-230px
					delay: Math.random() * 100, // 随机延迟0-500ms
				};

				this.textEffects.push(effect);

				// 3秒后移除
				setTimeout(() => {
					this.textEffects = this.textEffects.filter(e => e.id !== effect.id);
				}, 3000);
			},

			// 切换自动敲击
			toggleAutoKnock() {
				this.autoMode = !this.autoMode;

				if (this.autoMode) {
					this.startAutoKnock();
				} else {
					this.stopAutoKnock();
				}
			},

			// 开始自动敲击
			startAutoKnock() {
				this.stopAutoKnock();

				this.autoInterval = setInterval(() => {
					this.knock();
				}, 800);
			},

			// 停止自动敲击
			stopAutoKnock() {
				if (this.autoInterval) {
					clearInterval(this.autoInterval);
					this.autoInterval = null;
				}
			},

			// 重置计数器
			resetCounter() {
				this.fishData.count = 0;
				this.fishData.auto = 0;
				this.saveData();
			},

			// 切换声音
			toggleSound() {
				this.soundEnabled = !this.soundEnabled;
				this.saveData();
			},

			// 保存数据到本地
			saveData() {
				try {
					uni.$u.vuex('store_fish', this.fishData);
					uni.$u.vuex('store_sound_enabled', this.soundEnabled);
				} catch (e) {
					console.error('保存数据失败', e);
				}
			},

			// 尝试恢复之前的数据
			tryRestoreData() {
				try {
					const { 
					  count = 0, 
					  total = 0, 
					  auto = 0 
					} = this.store_fish || {};
					// 一次性更新 fishData 的多个属性
					Object.assign(this.fishData, { count, total, auto });
					this.soundEnabled = this.store_sound_enabled || true;
				} catch (e) {
					console.error('读取数据失败', e);
				}
			}
		}
	};
</script>

<style scoped>
	/* 全局样式 */
	.container {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background: linear-gradient(135deg, #fdf5e6 0%, #fffaf0 100%);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #5c3e1d;
		padding: 20px;
		overflow: hidden;
		position: relative;
	}

	/* 顶部装饰 */
	.header {
		text-align: center;
		margin-bottom: 40px;
		position: relative;
		z-index: 2;
	}

	.title {
		font-size: 36px;
		font-weight: bold;
		color: #8B4513;
		letter-spacing: 3px;
		margin-bottom: 10px;
		text-shadow: 0 2px 4px rgba(139, 69, 19, 0.1);
		position: relative;
		display: block;
	}

	.title::after {
		content: "";
		position: absolute;
		bottom: -5px;
		left: 10%;
		width: 80%;
		height: 3px;
		background: linear-gradient(90deg, transparent, #d4a76a, transparent);
		border-radius: 3px;
	}

	.subtitle {
		font-size: 16px;
		color: #a67c52;
		font-weight: 300;
	}

	/* 木鱼区域 */
	.fish-container {
		position: relative;
		width: 100%;
		height: 350px;
		margin: 0 auto 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fish {
		/*  width: 220px;
  height: 220px;
  background: linear-gradient(145deg, #8B4513 0%, #5c3011 100%);
  border-radius: 50% 50% 45% 45%;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 20px 40px rgba(92, 62, 29, 0.3), 
              inset 0 -10px 20px rgba(0, 0, 0, 0.3),
              inset 0 10px 20px rgba(255, 215, 0, 0.2); */
		z-index: 2;

		.img {
			width: 200px;
			color: #8B4513;
		}
	}

	.fish-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 180px;
		height: 180px;
		background: radial-gradient(circle at 30% 30%, #a67c52 0%, #5c3011 100%);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
	}

	.fish-core {
		width: 120px;
		height: 120px;
		background: radial-gradient(circle, #d4a76a 0%, #8B4513 100%);
		border-radius: 50%;
		box-shadow: 0 0 20px rgba(212, 167, 106, 0.5);
		position: relative;
	}

	.fish-core::before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80px;
		height: 80px;
		background: linear-gradient(145deg, #c19b60 0%, #7d4c15 100%);
		border-radius: 50%;
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
	}

	.fish-core::after {
		content: "卍";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 40px;
		color: rgba(255, 215, 0, 0.8);
		font-weight: bold;
	}

	.fish-stick {
		position: absolute;
		right: -60px;
		top: 50%;
		transform: translateY(-50%) rotate(-20deg);
		width: 100px;
		height: 20px;
		background: linear-gradient(to right, #d4a76a, #8B4513);
		border-radius: 10px;
		box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
		z-index: 1;
	}

	.fish-stick::after {
		content: "";
		position: absolute;
		right: -10px;
		top: 50%;
		transform: translateY(-50%);
		width: 30px;
		height: 30px;
		background: #d4a76a;
		border-radius: 50%;
		box-shadow: 0 0 10px rgba(212, 167, 106, 0.8);
	}

	/* 佛光效果 */
	.halo {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 280px;
		height: 280px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0) 70%);
		z-index: 1;
		animation: haloPulse 3s infinite ease-in-out;
	}

	@keyframes haloPulse {

		0%,
		100% {
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(1);
		}

		50% {
			opacity: 0.8;
			transform: translate(-50%, -50%) scale(1.1);
		}
	}

	/* 文字特效 */
	.text-effects {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
	}

	.text-effect {
		position: absolute;
		font-size: 28px;
		font-weight: bold;
		color: #8B4513;
		opacity: 0;
		animation: textRise 2s ease-out forwards;
		text-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
	}

	@keyframes textRise {
		0% {
			transform: translateY(0);
			opacity: 1;
			text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
		}

		100% {
			transform: translateY(-100px);
			opacity: 0;
			text-shadow: 0 0 20px rgba(255, 215, 0, 0);
		}
	}

	/* 统计区域 */
	.stats {
		display: flex;
		justify-content: space-around;
		margin-bottom: 30px;
		background: rgba(210, 180, 140, 0.1);
		border-radius: 20px;
		padding: 20px;
		border: 1px solid rgba(210, 180, 140, 0.3);
	}

	.stat-item {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.stat-value {
		font-size: 36px;
		font-weight: bold;
		color: #8B4513;
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 14px;
		color: #a67c52;
	}

	/* 控制区域 */
	.controls {
		display: flex;
		justify-content: space-between;
		gap: 15px;
	}

	.btn {
		flex: 1;
		height: 60px;
		border-radius: 15px;
		border: none;
		background: linear-gradient(to bottom, #d4a76a, #8B4513);
		color: white;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
		transition: all 0.3s;
	}

	.btn:active {
		transform: translateY(3px);
		box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
	}

	.btn-alt {
		background: linear-gradient(to bottom, #f0e6d2, #d4a76a);
		color: #8B4513;
	}

	.btn-auto-active {
		background: linear-gradient(to bottom, #c19b60, #7d4c15);
	}

	/* 底部装饰 */
	.lotus {
		position: absolute;
		bottom: -30px;
		left: 50%;
		transform: translateX(-50%);
		width: 200px;
		height: 60px;
		background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><path d="M20,60 Q40,20 60,40 Q80,10 100,30 Q120,10 140,40 Q160,20 180,60" fill="none" stroke="rgba(212,167,106,0.3)" stroke-width="8"/></svg>');
		opacity: 0.7;
		z-index: 0;
	}

	/* 音效控制 */
	.sound-toggle {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 40px;
		height: 40px;
		background: rgba(210, 180, 140, 0.3);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 10;
		color: #8B4513;
		font-size: 20px;
	}

	/* 敲击动画 */
	@keyframes knock {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(0.95);
		}

		100% {
			transform: scale(1);
		}
	}

	.knock-animation {
		animation: knock 0.3s ease;
	}
</style>