<template>
	<view class="container">
		<view class="header">
			<view class="title">骰子对决</view>
			<view class="subtitle">点击骰子区域，开始你的挑战！</view>
		</view>
		
		<view class="dice-container">
			<!-- 蓝方骰子 -->
			<view class="dice-area blue" :class="{active: blueActive}" @click="rollDice('blue')">
				<view class="label">玩家1</view>
				<cl-dice ref="blue" :fontSize="160" :size="250" @result="handleResult('blue', $event)" />
				<view v-if="blueNum > 0" class="point">{{ blueNum }}</view>
			</view>
			
			<!-- VS区域 -->
			<view class="vs-area">
				<view class="vs">VS</view>
				<view v-if="showResult" class="result-text">{{ resultText }}</view>
				<button v-if="showResult" class="restart-btn" @click="resetGame">再来一局</button>
			</view>
			
			<!-- 红方骰子 -->
			<view class="dice-area red" :class="{active: redActive}" @click="rollDice('red')">
				<view class="label">玩家2</view>
				<cl-dice ref="red" :fontSize="160" :size="250" @result="handleResult('red', $event)" />
				<view v-if="redNum > 0" class="point">{{ redNum }}</view>
			</view>
		</view>
		
		<!-- 结果弹窗 -->
		<view v-if="showResultPopup" class="result-popup" @click="showResultPopup = false">
			<view class="popup-content" @click.stop>
				<view class="winner">{{ winContent }}</view>
				<view class="score">蓝方: {{ blueNum }} 点 | 红方: {{ redNum }} 点</view>
				<view class="action-btns">
					<button class="btn close" @click="showResultPopup = false">关闭</button>
					<button class="btn restart" @click="resetGame">再来一局</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				blueActive: false,
				redActive: false,
				blueNum: 0,
				redNum: 0,
				showResult: false,
				showResultPopup: false,
				resultText: "",
				gameState: "ready" // ready, rolling, finished
			}
		},
		computed: {
			winContent() {
				if (this.blueNum === this.redNum) {
					return "平局！";
				}
				return this.blueNum > this.redNum ? 
					"🎉 蓝方获胜！" : 
					"🎉 红方获胜！";
			}
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
					path: 'package-fun/pages/dicePk/dicePk',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					}) // 朋友圈强制要求 imageUrl [[7]]
				};
			},
			// 摇骰子
			rollDice(player) {
				if (this.gameState === "finished") return;
				if (player === "blue" && this.blueNum > 0) {
					uni.$u.toast('蓝方已摇过骰子');
					return;
				}
				if (player === "red" && this.redNum > 0) {
					uni.$u.toast('红方已摇过骰子');
					return;
				}
				
				this.gameState = "rolling";
				player === "blue" ? 
					(this.blueActive = true) : 
					(this.redActive = true);
				
				this.$refs[player].startRolling();
			},
			
			// 处理结果
			handleResult(player, num) {
				if (player === "blue") {
					this.blueNum = num;
					this.blueActive = false;
				} else {
					this.redNum = num;
					this.redActive = false;
				}
				
				// 双方都完成时显示结果
				if (this.blueNum > 0 && this.redNum > 0) {
					this.showResult = true;
					this.gameState = "finished";
					uni.$emit('global-user-interaction');
					this.$soundManager.play("sound4");
					
					setTimeout(() => {
						this.showResultPopup = true;
						this.resultText = this.blueNum === this.redNum ? 
							"平局！" : 
							`${this.blueNum > this.redNum ? "蓝方" : "红方"}获胜！`;
					}, 200);
				}
			},
			
			// 重置游戏
			resetGame() {
				this.blueNum = 0;
				this.redNum = 0;
				this.showResult = false;
				this.showResultPopup = false;
				this.gameState = "ready";
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 基础样式 */
	.container {
		background: linear-gradient(135deg, #1a2a6c, #2a5298);
		min-height: 100vh;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
	}
	
	/* 头部样式 */
	.header {
		text-align: center;
		margin-bottom: 40rpx;
		padding: 20rpx 0;
		
		.title {
			font-size: 56rpx;
			font-weight: 800;
			color: #fff;
			text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
			margin-bottom: 16rpx;
			letter-spacing: 2rpx;
		}
		
		.subtitle {
			font-size: 32rpx;
			color: rgba(255, 255, 255, 0.85);
			font-weight: 500;
		}
	}
	
	/* 骰子容器 */
	.dice-container {
		// flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}
	
	/* 骰子区域 */
	.dice-area {
		width: 90%;
		height: 400rpx;
		padding: 40rpx;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		
		&.blue {
			background: linear-gradient(135deg, #3498db, #1a5276);
		}
		
		&.red {
			background: linear-gradient(135deg, #e74c3c, #922b21);
		}
		
		&.active {
			transform: scale(0.98);
			box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.3);
		}
		
		.label {
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			color: rgba(255, 255, 255, 0.9);
			font-size: 32rpx;
			font-weight: 600;
		}
		
		.point {
			position: absolute;
			bottom: 20rpx;
			right: 20rpx;
			width: 80rpx;
			height: 80rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 44rpx;
			font-weight: 700;
		}
	}
	
	/* VS区域 */
	.vs-area {
		// margin: 40rpx 0;
		text-align: center;
		height: 420rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		
		.vs {
			font-size: 80rpx;
			font-weight: 900;
			color: #fff;
			text-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.4);
			margin-bottom: 20rpx;
			animation: pulse 1.5s infinite;
		}
		
		.result-text {
			font-size: 44rpx;
			font-weight: 700;
			color: #f1c40f;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
			margin: 20rpx 0;
			animation: fadeIn 0.5s;
		}
		
		.restart-btn {
			background: linear-gradient(135deg, #2ecc71, #27ae60);
			color: white;
			border: none;
			border-radius: 50rpx;
			padding: 16rpx 40rpx;
			font-size: 32rpx;
			font-weight: 600;
			box-shadow: 0 6rpx 15rpx rgba(39, 174, 96, 0.4);
			margin-top: 20rpx;
			
			&:active {
				transform: scale(0.96);
			}
		}
	}
	
	/* 结果弹窗 */
	.result-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s;
		
		.popup-content {
			width: 80%;
			background: white;
			border-radius: 30rpx;
			padding: 50rpx 40rpx;
			text-align: center;
			box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.4);
			animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			
			.winner {
				font-size: 52rpx;
				font-weight: 800;
				color: #e74c3c;
				margin-bottom: 30rpx;
			}
			
			.score {
				font-size: 36rpx;
				color: #2c3e50;
				margin-bottom: 40rpx;
				font-weight: 500;
				
				span {
					font-weight: 700;
				}
			}
			
			.action-btns {
				display: flex;
				justify-content: space-around;
				
				.btn {
					flex: 1;
					margin: 0 15rpx;
					border-radius: 50rpx;
					font-size: 32rpx;
					font-weight: 600;
					padding: 20rpx 0;
					
					&.close {
						background: #95a5a6;
						color: white;
					}
					
					&.restart {
						background: linear-gradient(135deg, #3498db, #2980b9);
						color: white;
					}
				}
			}
		}
	}
	
	/* 动画定义 */
	@keyframes pulse {
		0% { transform: scale(1); opacity: 0.8; }
		50% { transform: scale(1.1); opacity: 1; }
		100% { transform: scale(1); opacity: 0.8; }
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes scaleIn {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}
</style>