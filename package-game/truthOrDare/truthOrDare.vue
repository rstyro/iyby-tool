<template>
	<view class="container">
		<!-- Header -->
		<view class="header">
			<view class="title">真心话大冒险</view>
			<view class="sub-title">点击下方按钮，开启刺激挑战！</view>
			<view v-if="!isDevOrTrial" class="setting" @click="operateSetting">
				<cl-icon type="icon-setting" size="30" color="#ddd" />
			</view>
		</view>

		<!-- Stats -->
		<view class="game-stats">
			<view class="stat-item">
				<view class="stat-number">{{ truthCount }}</view>
				<view class="stat-label">真心话</view>
			</view>
			<view class="stat-item">
				<view class="stat-number">{{ dareCount }}</view>
				<view class="stat-label">大冒险</view>
			</view>
			<view class="stat-item">
				<view class="stat-number">{{ totalCount }}</view>
				<view class="stat-label">总挑战</view>
			</view>
		</view>

		<!-- Card -->
		<view class="card-container" @click="toggleCard">
			<view class="card" :class="{ 'flipped': cardFlipped }">
				<!-- Front -->
				<view class="card-face card-front">
					<view class="card-type">
						<text class="fas" :class="currentType === 'truth' ? 'fa-heart' : 'fa-fire'"></text>
						{{ currentType === 'truth' ? '真心话' : '大冒险' }}
					</view>
					<view class="card-content floating">
						<text class="fas fa-sync spin-icon"></text>
						<view>点击按钮开始挑战</view>
					</view>
					<view class="card-hint">点击卡片查看问题</view>
				</view>

				<!-- Back -->
				<view class="card-face card-back">
					<view class="card-type" :class="currentType === 'truth' ? 'type-truth' : 'type-dare'">
						<text class="fas" :class="currentType === 'truth' ? 'fa-heart' : 'fa-fire'"></text>
						{{ currentType === 'truth' ? '真心话' : '大冒险' }}
					</view>
					<view class="card-content pulse">
						{{ currentQuestion }}
					</view>
					<view class="card-hint">点击卡片返回</view>
				</view>
			</view>
		</view>

		<!-- Buttons -->
		<view class="buttons-container">
			<button class="game-btn truth-btn" @click="getTruth">
				<text class="fas fa-heart"></text> 真心话
			</button>
			<button class="game-btn dare-btn" @click="getDare">
				<text class="fas fa-fire"></text> 大冒险
			</button>
		</view>

		<button class="game-btn random-btn" @click="getRandom">
			<text class="fas fa-random"></text> 随机挑战
		</button>

		<!-- History -->
		<view class="history-section">
			<view class="history-header">
				<h3><text class="fas fa-history"></text> 历史记录</h3>
				<view class="history-tabs">
					<view class="history-tab" :class="{ 'active': historyFilter === 'all' }"
						@click="historyFilter = 'all'">全部</view>
					<view class="history-tab" :class="{ 'active': historyFilter === 'truth' }"
						@click="historyFilter = 'truth'">真心话</view>
					<view class="history-tab" :class="{ 'active': historyFilter === 'dare' }"
						@click="historyFilter = 'dare'">大冒险</view>
				</view>
			</view>

			<view class="history-list">
				<view v-for="(item, index) in filteredHistory" :key="index" class="history-item">
					<view class="history-type" :class="item.type === 'truth' ? 'type-truth' : 'type-dare'">
						<text class="fas" :class="item.type === 'truth' ? 'fa-heart' : 'fa-fire'"></text>
					</view>
					<view class="history-content">{{ item.question }}</view>
				</view>

				<view v-if="filteredHistory.length === 0" class="history-item">
					<view class="history-content" style="text-align: center; width: 100%;">暂无历史记录</view>
				</view>
			</view>
		</view>

		<!-- 设置 -->
		<cl-fly-settings :show="showSetting" :options="questionOptions" type="truthOrDare" @close="operateSetting"
			@apply="changeVersion" @edit="goEdit" />

		<!-- 编辑组件 -->
		<cl-edit-truth-dare :show="showEdit" :data="questionData" @save="saveEdit" @close="closeEdit" />

		<view class="footer">
			<p>温馨提示：游戏过程中请尊重他人，注意分寸</p>
		</view>
	</view>
</template>

<script>
	// 导入数据文件
	import {
		questionMap
	} from '@/data/truthOrDare.js';

	export default {
		data() {
			return {
				isDevOrTrial: true,
				questionData: {
					version: 'normal',
					truthQuestions: [],
					dareQuestions: []
				},
				truthDareMap: {},
				curKey: 'normal',
				showEdit: false,
				currentType: 'truth',
				currentQuestion: '你曾经暗恋过谁？',
				cardFlipped: false,
				truthCount: 0,
				dareCount: 0,
				history: [],
				historyFilter: 'all',
				showSetting: false,
			}
		},
		computed: {
			totalCount() {
				return this.truthCount + this.dareCount
			},
			filteredHistory() {
				if (this.historyFilter === 'all') return this.history
				return this.history.filter(item => item.type === this.historyFilter)
			},
			questionOptions() {
				// 示例：遍历所有键，组装选项
				let options = [];
				Object.keys(this.truthDareMap).forEach(key => {
					let item = {
						label: this.truthDareMap[key].version,
						value: key
					};
					if (key === 'cp') {
						item.hot = true;
						item.hotText = 'HOT';
					} else if (key === 'pri') {
						item.hot = true;
						item.hotText = '火爆';
					}
					options.push(item)
				});
				return options;
			}
		},
		mounted() {
			// this.changeVersion('normal');
		},
		onLoad() {
			this.onloadData();
			this.isDevOrTrial = this.$version.isDevOrTrialVersion();
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
					"🔥线上真心话大冒险开房啦！**敢来挑战吗？** 刺激提问&社死大冒险等你！速速上车👉️",
					"🎉 线上聚会玩什么？真心话大冒险安排上！**爆笑不断，秒回学生时代**~ 好友就差你，快进房！",
					"🔥【密友轰趴】线上真心话大冒险发车！**敢来接受灵魂拷问&社死挑战吗？** 好友房就差你，速戳加入👉"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-fun/pages/truthOrDare/truthOrDare',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					}) // 朋友圈强制要求 imageUrl [[7]]
				};
			},
			onloadData() {
				var stopMap = this.store_truth_dare_map;
				if (stopMap && Object.keys(stopMap).length > 0) {
					this.truthDareMap = JSON.parse(stopMap);
				} else {
					this.truthDareMap = questionMap;
				}
				uni.$u.vuex('store_truth_dare_map', JSON.stringify(this.truthDareMap));
				this.questionData = this.truthDareMap[this.curKey];
			},
			closeEdit() {
				this.showEdit = false;
			},
			saveEdit(resData) {
				console.log("resData=", resData);
				this.truthDareMap[this.curKey] = resData;
				this.questionData = resData;
				// 保存缓存
				uni.$u.vuex('store_truth_dare_map', JSON.stringify(this.truthDareMap));
			},
			goEdit(newVersion) {
				this.curKey = newVersion;
				this.questionData = this.truthDareMap[newVersion];
				this.showEdit = true;
			},
			// 切换版本
			changeVersion(newVersion) {
				this.curKey = newVersion;
				this.questionData = this.truthDareMap[newVersion] || {
					version: newVersion,
					truthQuestions: [],
					dareQuestions: []
				};
			},
			getRandomQuestion(type) {
				const questions = type === 'truth' ? this.questionData.truthQuestions :
					this.questionData.dareQuestions
				const randomIndex = Math.floor(Math.random() * questions.length)
				return questions[randomIndex]
			},
			getTruth() {
				this.currentType = 'truth'
				this.currentQuestion = this.getRandomQuestion('truth')
				this.truthCount++
				this.addToHistory('truth', this.currentQuestion)
				this.flipCard()
			},
			getDare() {
				this.currentType = 'dare'
				this.currentQuestion = this.getRandomQuestion('dare')
				this.dareCount++
				this.addToHistory('dare', this.currentQuestion)
				this.flipCard()
			},
			getRandom() {
				const types = ['truth', 'dare']
				const randomType = types[Math.floor(Math.random() * types.length)]
				if (randomType === 'truth') {
					this.getTruth()
				} else {
					this.getDare()
				}
			},
			addToHistory(type, question) {
				this.history.unshift({
					type: type,
					question: question,
					timestamp: new Date()
				})
				if (this.history.length > 10) {
					this.history.pop()
				}
			},
			flipCard() {
				this.cardFlipped = true;
				uni.$emit('global-user-interaction');
				this.$soundManager.play("sound5");
			},
			toggleCard() {
				this.cardFlipped = !this.cardFlipped
			},
			operateSetting() {
				this.showSetting = !this.showSetting;
			},
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background: linear-gradient(135deg, #6e8efb, #a777e3);
		min-height: 100vh;
		padding: 30px;
		position: relative;
		overflow: hidden;
	}

	.header {
		text-align: center;
		margin-bottom: 25px;
		position: relative;
		padding-bottom: 20px;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 120px;
			height: 4px;
			background: linear-gradient(to right, #ff7eb3, #ff758c);
			border-radius: 2px;
		}

		.title {
			font-size: 2.8rem;
			color: #4a4a8c;
			margin-bottom: 8px;
			font-weight: 700;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			position: relative;
			display: inline-block;
		}

		.sub-title {
			color: #666;
			font-size: 1.1rem;
			margin-top: 8px;
			opacity: 0.9;
		}

		.setting {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			top: 0rpx;
			right: 0rpx;
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			padding: 10rpx;
			box-shadow: 0 15px 35px rgba(50, 50, 93, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1);

		}
	}


	.game-stats {
		display: flex;
		justify-content: space-around;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 18px;
		padding: 15px;
		margin: 20px 0;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	}

	.stat-item {
		text-align: center;
		flex: 1;
	}

	.stat-number {
		font-size: 2.2rem;
		font-weight: 700;
		color: #6e8efb;
		line-height: 1;
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 0.9rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.card-container {
		perspective: 1000px;
		height: 500rpx;
		margin: 25rpx 0;
	}

	.card {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		border-radius: 20px;
		box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
	}

	.card.flipped {
		transform: rotateY(180deg);
	}

	.card.flipped .card-front .card-content {
		animation: none !important;
	}

	.card-face {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden; // 关键兼容属性

		border-radius: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30rpx;
		text-align: center;
	}

	.card-front {
		background: linear-gradient(135deg, #6e8efb, #a777e3);
		color: white;
	}

	.card-back {
		background: white;
		transform: rotateY(180deg);
		color: #333;
	}

	.card-type {
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		margin-bottom: 15px;
		background: rgba(255, 255, 255, 0.2);
		padding: 8px 20px;
		border-radius: 50px;
		font-weight: 600;
	}

	.card-content {
		font-size: 1.6rem;
		line-height: 1.5;
		font-weight: 500;
		margin: 15px 0;
		padding: 0 15px;
	}

	.card-front .card-content {
		font-size: 2.2rem;
		margin-top: 20px;
	}

	.card-hint {
		position: absolute;
		bottom: 20px;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.buttons-container {
		display: flex;
		gap: 15px;
		margin: 25px 0;
	}

	.game-btn {
		flex: 1;
		padding: 18px 10px;
		border: none;
		border-radius: 15px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
	}

	.truth-btn {
		background: linear-gradient(to right, #43cea2, #185a9d);
		color: white;
	}

	.dare-btn {
		background: linear-gradient(to right, #ff7eb3, #ff758c);
		color: white;
	}

	.random-btn {
		background: linear-gradient(to right, #ffb347, #ffcc33);
		color: white;
		width: 100%;
	}

	.game-btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 20px rgba(50, 50, 93, 0.15), 0 6px 6px rgba(0, 0, 0, 0.1);
	}

	.game-btn:active {
		transform: translateY(1px);
	}

	.history-section {
		margin-top: 30px;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 18px;
		padding: 20px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 2px solid rgba(0, 0, 0, 0.05);
	}

	.history-header h3 {
		color: #4a4a8c;
		font-size: 1.3rem;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.history-tabs {
		display: flex;
		gap: 10rpx;
	}

	.history-tab {
		padding: 10rpx 20rpx;
		border-radius: 15px;
		font-size: 24rpx;
		background: rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.history-tab.active {
		background: #6e8efb;
		color: white;
	}

	.history-list {
		list-style: none;
		max-height: 200px;
		overflow-y: auto;
		padding-right: 10px;
	}

	.history-list::-webkit-scrollbar {
		width: 6px;
	}

	.history-list::-webkit-scrollbar-thumb {
		background: rgba(110, 142, 251, 0.5);
		border-radius: 3px;
	}

	.history-item {
		padding: 12px 15px;
		background: white;
		border-radius: 12px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 12px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s ease;
	}

	.history-item:hover {
		transform: translateX(5px);
	}

	.history-type {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: white;
		font-size: 0.8rem;
	}

	.type-truth {
		background: linear-gradient(to right, #43cea2, #185a9d);
	}

	.type-dare {
		background: linear-gradient(to right, #ff7eb3, #ff758c);
	}

	.history-content {
		flex: 1;
		font-size: 0.95rem;
	}

	.floating {
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0% {
			transform: translateY(0px);
		}

		50% {
			transform: translateY(-15px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.pulse {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.05);
		}

		100% {
			transform: scale(1);
		}
	}

	@media (max-width: 500px) {
		.container {
			padding: 20px;
		}

		.header h1 {
			font-size: 2.2rem;
		}

		.card-content {
			font-size: 1.4rem;
		}

		.card-front .card-content {
			font-size: 1.8rem;
		}

		.game-btn {
			padding: 15px 10px;
			font-size: 1rem;
		}
	}

	.footer {
		text-align: center;
		margin-top: 25px;
		color: #777;
		font-size: 14px;
		padding-top: 15px;
		border-top: 1px solid #ccc;
	}
</style>