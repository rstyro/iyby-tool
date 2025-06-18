<template>
	<view class="container">
		<!-- 骰子显示区域（优化布局） -->
		<view class="dice-group">
			<!-- 骰子盅 -->
			<view class="dice-cone" :class="{ 'shake-animation': showDiceCone&&!showOpenDeal }"></view>
			<view v-if="showDiceCone&&!showOpenDeal" class="showText">{{isRolling?'滚动中...':'等待开盅'}}</view>

			<view v-for="(item, index) in diceResults" :key="index" class="dice-wrapper" :style="{ order: index }">
				<!-- 添加ref属性，使用数组存储 -->
				<cl-dice ref="diceItem" backgroundColor="#5a8fe4" :size="50" @result="(res) => onDiceResult(index, res)" />
			</view>
		</view>

		<!-- 操作区域 -->
		<view class="control-panel">
			<view class="size-control">
				<button class="size-btn" :class="{ disabled: size <= 1 }"  :disabled="size <= 1" @click="changeSize(-1)">−</button>
				<text class="size-text">{{ size }}个骰子</text>
				<button class="size-btn" :class="{ disabled: size >= max }"  :disabled="size >= max" @click="changeSize(1)">+</button>
			</view>

			<view class="dice-buttons">
				<button class="dice-btn roll-btn" :loading="isRolling" @click="rollDice"
					:disabled="isRolling">摇骰子</button>
				<button class="dice-btn operateBtn" @click="operateDiceCone">🎲 {{showDiceCone&&!showOpenDeal?'开':'关'}}盅</button>
				<button class="dice-btn openDealBtn" :class="{close:!showOpenDeal}" @click="openDeal">明牌</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				max: 8,
				size: 3,
				diceResults: [0, 0, 0],
				isRolling: false,
				// 是否显示骰子盅
				showDiceCone: false,
				// 是否明牌
				showOpenDeal: false,
				rollingCount: 0
			}
		},
		onLoad() {
			this.initDiceResults();
		},
		//分享
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			generateShareConfig(forTimeline = false) {
				const defaultTemplates = [
					"💰 骰子一掷，黄金万两？掷骰赢现金/积分！**最高888元**，试试你的财运！点我开掷➡️",
					"🎲 来单挑！我在【奇点趣造】等你掷骰子比大小！**输了请喝奶茶/赢积分**，敢不敢接？👉 [点击挑战]"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-fun/pages/dice/dice',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					}) // 朋友圈强制要求 imageUrl [[7]]
				};
			},
			// 初始化骰子结果数组
			initDiceResults() {
				this.diceResults = Array(this.size).fill(0);
			},

			// 改变骰子数量
			changeSize(delta) {
				const newSize = this.size + delta;
				if (newSize < 1 || newSize > this.max) {
					uni.$u.toast('超过限制了');
				};

				this.size = newSize;
				this.initDiceResults();

				// 如果正在摇骰子则重新开始
				if (this.isRolling) {
					this.rollDice();
				}
			},

			operateDiceCone() {
				if(this.showOpenDeal){
					// 如果当前是明牌，则取消明牌，并关盅
					this.showOpenDeal=false;
					this.showDiceCone=true;
				}else{
					this.showDiceCone = !this.showDiceCone;
				}
				if(!this.showDiceCone){
					uni.$emit('global-user-interaction');
					this.$soundManager.play("sound4");
				}
			},
			openDeal() {
				this.showOpenDeal = !this.showOpenDeal;
			},
			// 开始摇骰子
			rollDice() {
				if (this.isRolling) return;
				this.isRolling = true;
				
				uni.$emit('global-user-interaction');
				this.$soundManager.play("touzi");
				
				this.rollingCount = this.size;
				this.showDiceCone = !this.showOpenDeal;
				// 使用ref数组调用每个骰子组件的方法
				this.$refs.diceItem.forEach(diceComponent => {
					// 滚动之后会自己停止，然后回调 result()方法
					diceComponent.startRolling();
				});
			},
			onDiceResult(index, result) {
				this.rollingCount--;
				if (this.rollingCount === 0) {
					this.isRolling = false;
				}
			}
		},
		onUnload() {}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 40rpx;
		min-height: 100vh;
		background: linear-gradient(145deg, #1a1a2e, #16213e);
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 优化骰子布局 */
	.dice-group {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 30rpx;
		margin: 60rpx 0;
		width: 400rpx;
		height: 400rpx;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.1);
		padding: 75rpx;
		background: rgba(255, 255, 255, 0.05);
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
	}

	.dice-cone {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, #666 0%, #222 70%);
		border-radius: 50%;
		z-index: 2;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.5);
	}

	.showText {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
		z-index: 3;
	}

	.shake-animation {
		opacity: 1;
	}

	.dice-wrapper {
		flex: 0 0 60rpx;
		height: 60rpx;
	}

	.control-panel {
		margin: 80rpx auto;
		width: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40rpx;
	}

	.size-control {
		display: flex;
		align-items: center;
		gap: 30rpx;
		margin-bottom: 30rpx;

		.size-btn {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background: linear-gradient(145deg, #3a3a5e, #2a2a4e);
			color: #fff;
			font-size: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow:
				0 4rpx 10rpx rgba(0, 0, 0, 0.3),
				inset 0 2rpx 4rpx rgba(255, 255, 255, 0.1);
			transition: all 0.2s;

			&:active {
				transform: scale(0.95);
				box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
			}
			
			&.disabled {
			      opacity: 0.5;
			      background: linear-gradient(145deg, #2a2a3e, #1a1a2e);
			      color: rgba(255, 255, 255, 0.4);
			      box-shadow: 
			        inset 0 0 8rpx rgba(0, 0, 0, 0.5),
			        inset 0 0 4rpx rgba(255, 255, 255, 0.05);
			      transform: none !important;
			    }
		}

		

		.size-text {
			font-size: 32rpx;
			color: #e0e0e0;
		}
	}

	.dice-buttons {
		display: flex;
		justify-content: space-between;
		width: 100%;
		gap: 10rpx;
	}

	.dice-btn {
		flex: 1;
		height: 90rpx;
		border-radius: 45rpx;
		font-size: 32rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.roll-btn {
		background: linear-gradient(45deg, #4ecdc4, #5cc7d6);
		color: #0f0f2d;

		&:active {
			transform: scale(0.95);
		}
	}

	.operateBtn {
		background: linear-gradient(45deg, #ff7e5f, #feb47b);
		color: #2a0a00;

		&:active {
			transform: translateY(6rpx);
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
		}
	}

	.openDealBtn {
		background: linear-gradient(45deg, #9c27b0, #673ab7);
		  color: #fff;
		  text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.3);

		&:active {
			transform: translateY(6rpx);
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
		}
		
		&.close {
		    background: linear-gradient(45deg, #5a5a7a, #3a3a5a);
		    color: rgba(255,255,255,0.7);
		  }
	}

	.dice-btn:disabled {
		opacity: 0.5;
		transform: scale(1);
	}
</style>