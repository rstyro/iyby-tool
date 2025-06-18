<template>
	<view class="container">
		<view class="header">
			<view class="title">激情骰子</view>
			<view class="subtitle">点击“开始”按钮，骰子即刻启动</view>
		</view>

		<view class="dice-container">
			<view class="dice1">
				<cl-dice ref="dice1" backgroundColor="#FF7F50 " :fontSize="dice1fontSize" :faces="diceData.arr1"
					:size="dice1Size" @result="handleResult('dice1', $event)"></cl-dice>
			</view>
			<view class="dice2">
				<cl-dice ref="dice2" backgroundColor="#ff9ebb" :fontSize="dice2fontSize" :faces="diceData.arr2"
					:size="dice2Size" @result="handleResult('dice2', $event)"></cl-dice>
			</view>

			<view class="dice3">
				<cl-dice ref="dice3" backgroundColor="#87CEEB " :fontSize="dice3fontSize" :faces="diceData.arr3"
					:size="dice3Size" @result="handleResult('dice3', $event)"></cl-dice>
			</view>

		</view>

		<!-- 结果弹窗 -->
		<view v-if="showResultPopup" class="result-popup" @click="showResultPopup = false">
			<view class="popup-content" @click.stop>
				<view class="result-title">掷骰结果</view>
				<view class="dice-icons">
					<view class="dice-icon">{{ result1 }}</view>
					<view class="dice-icon">{{ result2 }}</view>
					<view class="dice-icon">{{ result3 }}</view>
				</view>

				<view class="final-result">
					<view class="result-text">{{ result }}</view>
				</view>
				<view class="confetti"></view>

				<view class="popup-btns">
					<button class="btn close" @click="closePopup">关闭</button>
					<button class="btn restart" @click="rollDice">再来一局</button>
				</view>
			</view>
		</view>

		<!-- 设置 -->
		<cl-fly-settings :show="showSetting" :options="diceOptions" @close="operateSetting" @apply="changeVersion"
			@edit="goEdit" />

		<!-- 编辑组件 -->
		<cl-edit-fire-dice :show="showEdit" :data="diceData" @save="saveEdit" @close="closeEdit" />


		<view class="action-btn">
			<button v-if="!isDevOrTrial" class="btn chooseBtn" @click="chooseTopic">选择主题</button>
			<button class="btn goBtn" @click="rollDice">
				<view class="btn-content">
					<cl-icon type="icon-touzi" color="#fff" size="40"></cl-icon>
					<text>开始</text>
				</view>
			</button>
		</view>

	</view>
</template>

<script>
	// 导入数据文件
	import {
		fireMap
	} from '@/data/fireDice.js';
	export default {
		data() {
			return {
				isDevOrTrial: true,
				diceData: {
					version: 'normal',
					arr1: ['1', '2', '3', '4', '5', '6'],
					arr2: ['1', '2', '3', '4', '5', '6'],
					arr3: ['1', '2', '3', '4', '5', '6'],
				},
				diceMap: {},
				curKey: 'normal',
				showEdit: false,
				showSetting: false,
				dice1Size: 150,
				dice2Size: 150,
				dice3Size: 150,
				dice1fontSize: 60,
				dice2fontSize: 60,
				dice3fontSize: 60,
				showResultPopup: false,
				result1: '',
				result2: '',
				result3: '',
				resultReceived: { // 记录结果接收状态
					dice1: false,
					dice2: false,
					dice3: false
				},
				isRolling: false
			}
		},
		onLoad() {
			// todo
			this.isDevOrTrial = this.$version.isDevOrTrialVersion();
			this.onloadData();
		},
		//下拉刷新
		onPullDownRefresh: function() {
			// todo
			setTimeout(function() {
				// 可以停止当前页面的下拉刷新
				uni.stopPullDownRefresh();
			}, 1000);

		},
		computed: {
			result() {
				if (this.result1 != '' && this.result2 != '') {
					return `${this.result1}${this.result2}${this.result3}`;
				}
				return '';
			},
			diceOptions() {
				// 示例：遍历所有键，组装选项
				let options = [];
				Object.keys(this.diceMap).forEach(key => {
					let item = {
						label: this.diceMap[key].version,
						value: key
					};
					if (key === 'cp') {
						item.hot = true;
						item.hotText = 'HOT';
					} else if (key === 'shame') {
						item.hot = true;
						item.hotText = '火爆';
					} else if (key === 'pri') {
						item.hot = true;
						item.hotText = '18禁';
					}
					options.push(item)
				});
				return options;
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
					path: 'package-fun/pages/fireDice/fireDice',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					}) // 朋友圈强制要求 imageUrl [[7]]
				};
			},
			onloadData() {
				var stopMap = this.store_fire_dice_map;
				if (stopMap && Object.keys(stopMap).length > 0) {
					this.diceMap = JSON.parse(stopMap);
				} else {
					this.diceMap = fireMap;
				}
				uni.$u.vuex('store_fire_dice_map', JSON.stringify(this.diceMap));
				this.diceData = this.diceMap[this.curKey];
			},
			closeEdit() {
				this.showEdit = false;
			},
			saveEdit(resData) {
				console.log("resData=", resData);
				this.diceMap[this.curKey] = resData;
				this.diceData = resData;
				// 保存缓存
				uni.$u.vuex('store_fire_dice_map', JSON.stringify(this.diceMap));
			},
			goEdit(newVersion) {
				this.curKey = newVersion;
				this.diceData = this.diceMap[newVersion];
				this.showEdit = true;
			},
			// 切换版本
			changeVersion(newVersion) {
				this.curKey = newVersion;
				this.diceData = this.diceMap[newVersion] || {
					version: newVersion,
					arr1: [],
					arr2: [],
					arr3: [],
				};
			},
			operateSetting() {
				this.showSetting = !this.showSetting;
			},
			chooseTopic() {
				this.showSetting = true;
			},
			// 摇骰子
			rollDice() {
				if (this.isRolling) return;
				this.isRolling = true;
				this.showResultPopup = false;
				this.result1 = '';
				this.result2 = '';
				this.result3 = '';
				// 重置结果接收状态
				this.resultReceived = {
					dice1: false,
					dice2: false,
					dice3: false,
				};
				setTimeout(() => {
					uni.$emit('global-user-interaction');
					this.$soundManager.play("touzi");
					
					this.$refs.dice1.startRolling();
					this.$refs.dice2.startRolling();
					this.$refs.dice3.startRolling();
				}, 100);
			},
			handleResult(dice, res) {
				if (dice === "dice1") {
					this.result1 = res;
				} else if (dice === "dice2") {
					this.result2 = res;
				} else {
					this.result3 = res;
				}
				// 标记当前骰子结果已接收
				this.resultReceived[dice] = true;
				// 检查是否两个结果都已接收
				if (this.resultReceived.dice1 && this.resultReceived.dice2 &&
					this.resultReceived.dice3) {
					this.isRolling = false;
					this.showResultPopup = true;
				}
			},
			closePopup() {
				this.showResultPopup = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 基础样式 */
	.container {
		position: relative;
		background: linear-gradient(135deg, #ffd6e7, #c2e9fb);
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
		display: flex;
		// flex-direction: column;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
	}



	/* 结果弹窗 */
	.result-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s;
	}

	.popup-content {
		width: 80%;
		max-width: 650rpx;
		background: linear-gradient(145deg, #fff1f8, #e0f7ff);
		border-radius: 30rpx;
		padding: 50rpx 40rpx;
		text-align: center;
		box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.5);
		animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		position: relative;
		overflow: hidden;
		border: 6rpx solid #ff9ebb;
	}

	.result-title {
		font-size: 42rpx;
		font-weight: 800;
		color: #e74c3c;
		margin-bottom: 40rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
	}

	.dice-icons {
		display: flex;
		justify-content: center;
		gap: 40rpx;
		margin-bottom: 50rpx;
	}

	.dice-icon {
		width: 120rpx;
		height: 120rpx;
		background: linear-gradient(135deg, #ff758c, #ff7eb3);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: bold;
		color: white;
		box-shadow: 0 10rpx 20rpx rgba(255, 117, 140, 0.4);
		transform: rotate(15deg);
		animation: diceFloat 2s infinite ease-in-out;
	}

	.dice-icon:nth-child(2) {
		transform: rotate(-15deg);
		background: linear-gradient(135deg, #3498db, #2980b9);
		animation-delay: 0.5s;
	}

	@keyframes diceFloat {

		0%,
		100% {
			transform: rotate(15deg) translateY(0);
		}

		50% {
			transform: rotate(15deg) translateY(-20rpx);
		}
	}

	.final-result {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 30rpx 0;
		box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
		border: 2rpx dashed #ff9ebb;
	}

	.result-text {
		font-size: 64rpx;
		font-weight: 900;
		color: #e74c3c;
		margin-bottom: 20rpx;
		letter-spacing: 2rpx;
		background: linear-gradient(45deg, #ff758c, #ff416c);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.result-desc {
		font-size: 32rpx;
		color: #7f8c8d;
		font-style: italic;
	}

	.popup-btns {
		display: flex;
		justify-content: space-around;
		gap: 20rpx;
		margin-top: 40rpx;
	}

	.btn {
		flex: 1;
		border-radius: 50rpx;
		font-size: 32rpx;
		font-weight: 600;
		padding: 20rpx 0;
		transition: all 0.3s;
		border: none;
		position: relative;
		overflow: hidden;
	}

	.btn:active {
		transform: scale(0.95);
	}

	.close {
		background: linear-gradient(135deg, #95a5a6, #7f8c8d);
		color: white;
		box-shadow: 0 5rpx 15rpx rgba(149, 165, 166, 0.4);
	}

	.restart {
		background: linear-gradient(135deg, #3498db, #2980b9);
		color: white;
		box-shadow: 0 5rpx 15rpx rgba(52, 152, 219, 0.4);
	}

	.confetti {
		position: absolute;
		top: -20rpx;
		left: 0;
		right: 0;
		height: 40rpx;
		background: linear-gradient(90deg,
				#ff9ebb, #ff758c, #ff7eb3,
				#3498db, #2980b9, #ff9ebb);
		background-size: 200% 100%;
		animation: confettiSlide 2s linear infinite;
		z-index: -1;
	}

	@keyframes confettiSlide {
		0% {
			background-position: 200% 0;
		}

		100% {
			background-position: -200% 0;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.action-btn {
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40rpx;
		padding: 0 30rpx;

		.btn {
			height: 110rpx;
			border-radius: 60rpx;
			box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;
			position: relative;
			overflow: hidden;
			border: none;
			font-weight: bold;
			letter-spacing: 2rpx;
			transform: translateY(0);
			padding: 0;

			.btn-content {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 15rpx;
				font-size: 36rpx;
				z-index: 2;
			}

			.btn-icon {
				width: 50rpx;
				height: 50rpx;
				filter: drop-shadow(0 2rpx 2rpx rgba(0, 0, 0, 0.2));
			}
		}

		.chooseBtn {
			flex: 1;
			max-width: 300rpx;
			// background: linear-gradient(145deg, #3498db, #2980b9);
			background: linear-gradient(145deg, #ff758c, #ff416c);
			color: white;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: -100%;
				width: 100%;
				height: 100%;
				background: linear-gradient(90deg,
						transparent,
						rgba(255, 255, 255, 0.3),
						transparent);
				transition: all 0.8s;
			}

			&:active::after {
				left: 100%;
			}
		}

		.goBtn {
			flex: 1.5;
			max-width: 400rpx;
			background: linear-gradient(145deg, #ff416c, #ff4b2b);
			color: white;
			font-size: 42rpx;
			animation: pulse 1.5s infinite;

			&:active {
				animation: none;
				transform: translateY(10rpx) scale(0.98);
			}

			.btn-content {
				font-size: 42rpx;
			}
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			box-shadow: 0 10rpx 25rpx rgba(255, 75, 43, 0.5);
		}

		50% {
			transform: scale(1.05);
			box-shadow: 0 15rpx 35rpx rgba(255, 75, 43, 0.7);
		}

		100% {
			transform: scale(1);
			box-shadow: 0 10rpx 25rpx rgba(255, 75, 43, 0.5);
		}
	}
</style>