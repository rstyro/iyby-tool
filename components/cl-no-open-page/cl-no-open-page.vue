<template>
	<view class="simple-display">
		<!-- 金句类型 -->
		<view v-if="type === 'quote'" class="quote-container">
			<view class="quote-header">
				<view class="header-icon">
					<view class="icon-quote"></view>
				</view>
				<text class="header-title">每日金句</text>
			</view>
			<view class="quote-content">
				<view class="quote-text">
					<text>「 {{ currentQuote.content }} 」</text>
				</view>
				<view class="quote-info">
					<text class="quote-author">{{ currentQuote.author }}</text>
					<view class="quote-tag">
						<text>{{ currentQuote.tag }}</text>
					</view>
				</view>
			</view>
			<button class="refresh-btn" @click="refreshQuote" hover-class="btn-hover">
				换一句
			</button>
		</view>

		<!-- 休息倒计时 -->
		<view v-else-if="type === 'countdown'" class="countdown-container">
			<view class="countdown-header">
				<view class="header-icon">
					<view class="icon-countdown"></view>
				</view>
				<text class="header-title">休息倒计时</text>
			</view>
			<view class="countdown-content">
				<view class="time-display">
					<view class="time-unit">
						<text class="time-value">{{ formatTime(minutes) }}</text>
						<text class="time-label">分钟</text>
					</view>
					<text class="time-colon">:</text>
					<view class="time-unit">
						<text class="time-value">{{ formatTime(seconds) }}</text>
						<text class="time-label">秒</text>
					</view>
				</view>
				<view class="countdown-progress">
					<view class="progress-bar" :style="{ width: progressPercent + '%' }"></view>
				</view>
				<view class="time-presets">
					<view v-for="preset in timePresets" :key="preset.value"
						:class="['time-preset', { 'active': countdownTime === preset.value }]"
						@click="setCountdownTime(preset.value)">
						<text>{{ preset.label }}</text>
					</view>
				</view>
			</view>
			<button :class="['countdown-btn', isRunning ? 'pause-btn' : 'start-btn']" @click="toggleCountdown"
				hover-class="btn-hover">
				{{ isRunning ? '暂停' : '开始' }}
			</button>
		</view>

		<!-- 心情打卡 -->
		<view v-else-if="type === 'mood'" class="mood-container">
			<view class="mood-header">
				<view class="header-icon">
					<view class="icon-mood"></view>
				</view>
				<text class="header-title">心情打卡</text>
			</view>
			<view class="mood-content">
				<view class="today-mood" v-if="todayMood">
					<view class="mood-label">今日心情</view>
					<view :class="['mood-face', 'mood-' + todayMood]">
						<view class="face-eyes"></view>
						<view class="face-mouth"></view>
					</view>
					<text class="mood-text">{{ getMoodText(todayMood) }}</text>
				</view>
				<view class="mood-options">
					<view v-for="mood in moodOptions" :key="mood.id"
						:class="['mood-option', { 'selected': selectedMood === mood.id }]" @click="selectMood(mood.id)">
						<view :class="['option-icon', 'mood-' + mood.id]">
							<view class="option-face"></view>
						</view>
						<text>{{ mood.name }}</text>
					</view>
				</view>
			</view>
			<button class="mood-btn" @click="recordMood" hover-class="btn-hover" :disabled="!selectedMood">
				记录心情
			</button>
		</view>

		<!-- 幸运数生成器 -->
		<view v-else-if="type === 'lucky'" class="lucky-container">
			<view class="lucky-header">
				<view class="header-icon">
					<view class="icon-lucky"></view>
				</view>
				<text class="header-title">幸运数字</text>
			</view>
			<view class="lucky-content">
				<view class="number-display">
					<view class="number-circle">
						<text class="lucky-number">{{ luckyNumber }}</text>
					</view>
					<view class="number-glow"></view>
				</view>
				<view class="lucky-desc">
					<text>{{ luckyDesc }}</text>
				</view>
				<view class="history-numbers" v-if="historyNumbers.length > 0">
					<view class="history-label">历史记录</view>
					<view class="numbers-list">
						<view v-for="(num, index) in historyNumbers" :key="index" class="history-number">
							<text>{{ num }}</text>
						</view>
					</view>
				</view>
			</view>
			<button class="lucky-btn" @click="generateNumber" hover-class="btn-hover">
				生成数字
			</button>
		</view>

		<!-- 冷笑话 -->
		<view v-else-if="type === 'joke'" class="joke-container">
			<view class="joke-header">
				<view class="header-icon">
					<view class="icon-joke"></view>
				</view>
				<text class="header-title">冷笑话</text>
			</view>
			<view class="joke-content">
				<view class="joke-question">
					<text>{{ currentJoke.question }}</text>
				</view>
				<view class="joke-answer" v-if="showAnswer">
					<view class="answer-label">答案</view>
					<text>{{ currentJoke.answer }}</text>
				</view>
				<view class="joke-tag">
					<text>{{ currentJoke.tag }}</text>
				</view>
			</view>
			<view class="joke-actions">
				<button class="joke-btn" @click="toggleAnswer" hover-class="btn-hover">
					{{ showAnswer ? '下一个' : '看答案' }}
				</button>
			</view>
		</view>

		<!-- 默认状态 -->
		<view v-else class="default-container">
			<view class="default-icon">
				<view class="icon-default"></view>
			</view>
			<text class="default-text">请选择展示类型</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'SimpleMultiDisplay',
		props: {
			// 展示类型：quote, countdown, mood, lucky, joke
			type: {
				type: String,
				default: 'quote'
			}
		},
		data() {
			return {
				// 金句数据
				quotes: [{
						content: '今天也要闪闪发光',
						author: '佚名',
						tag: '励志'
					},
					{
						content: '生活原本沉闷，但跑起来就有风',
						author: '网络',
						tag: '生活'
					},
					{
						content: '努力只能及格，拼命才能优秀',
						author: '佚名',
						tag: '奋斗'
					},
					{
						content: '保持热爱，奔赴山海',
						author: '网络',
						tag: '梦想'
					},
					{
						content: '所有的逆袭，都是有备而来',
						author: '佚名',
						tag: '成长'
					},
					{
						content: '心若有所向往，何惧道阻且长',
						author: '网络',
						tag: '坚持'
					},
					{
						content: '与其抱怨，不如改变',
						author: '佚名',
						tag: '态度'
					},
					{
						content: '坚持很苦，但结果很酷',
						author: '网络',
						tag: '努力'
					}
				],
				currentQuote: {},

				// 倒计时数据
				countdownTime: 300, // 5分钟
				remainingTime: 300,
				isRunning: false,
				countdownTimer: null,
				minutes: 5,
				seconds: 0,
				progressPercent: 0,
				timePresets: [{
						label: '3分钟',
						value: 180
					},
					{
						label: '5分钟',
						value: 300
					},
					{
						label: '10分钟',
						value: 600
					}
				],

				// 心情数据
				moodOptions: [{
						id: 'happy',
						name: '开心',
						emoji: '😊'
					},
					{
						id: 'sad',
						name: '难过',
						emoji: '😢'
					},
					{
						id: 'angry',
						name: '生气',
						emoji: '😠'
					},
					{
						id: 'peaceful',
						name: '平静',
						emoji: '😌'
					},
					{
						id: 'tired',
						name: '疲惫',
						emoji: '😴'
					},
					{
						id: 'excited',
						name: '兴奋',
						emoji: '🎉'
					}
				],
				selectedMood: '',
				todayMood: '',

				// 幸运数数据
				luckyNumber: 7,
				luckyDesc: '',
				historyNumbers: [],
				numberDescriptions: [
					'充满能量的数字，今天会很顺利！',
					'幸运之神眷顾的数字，好事即将发生',
					'代表和谐与平衡，一切都会很好',
					'充满创造力的数字，灵感满满',
					'神秘而有魅力的数字，会有惊喜',
					'象征新的开始，机会正在靠近'
				],

				// 笑话数据
				jokes: [{
						question: '为什么企鹅的肚子是白色的？',
						answer: '因为如果它把肚子染黑了，就找不到自己了',
						tag: '动物'
					},
					{
						question: '什么水果最老实？',
						answer: '芭蕉，因为老实（芭蕉）巴交',
						tag: '水果'
					},
					{
						question: '为什么数学书总是很忧郁？',
						answer: '因为它有太多问题',
						tag: '学习'
					},
					{
						question: '什么鱼最聪明？',
						answer: '鲸（精）鱼',
						tag: '动物'
					},
					{
						question: '为什么程序员总是分不清万圣节和圣诞节？',
						answer: '因为 Oct 31 == Dec 25',
						tag: '程序员'
					}
				],
				currentJoke: {},
				showAnswer: false
			}
		},
		created() {
			// 初始化数据
			this.initData()
		},
		beforeDestroy() {
			// 清理定时器
			if (this.countdownTimer) {
				clearInterval(this.countdownTimer)
			}
		},
		methods: {
			// 初始化数据
			initData() {
				switch (this.type) {
					case 'quote':
						uni.setNavigationBarTitle({
							title: "每日金句"
						});
						this.refreshQuote()
						break
					case 'countdown':
						uni.setNavigationBarTitle({
							title: "休息倒计时"
						});
						this.updateTimeDisplay()
						break
					case 'mood':
						uni.setNavigationBarTitle({
							title: "心情打卡"
						});
						this.loadTodayMood()
						break
					case 'lucky':
						uni.setNavigationBarTitle({
							title: "幸运数生成器"
						});
						this.generateNumber()
						this.loadHistoryNumbers()
						break
					case 'joke':
						uni.setNavigationBarTitle({
							title: "冷笑话"
						});
						this.refreshJoke()
						break
				}
			},

			// 金句相关
			refreshQuote() {
				const index = Math.floor(Math.random() * this.quotes.length)
				this.currentQuote = this.quotes[index]
			},

			// 倒计时相关
			setCountdownTime(seconds) {
				if (this.isRunning) {
					uni.showToast({
						title: '请先暂停计时',
						icon: 'none'
					})
					return
				}
				this.countdownTime = seconds
				this.remainingTime = seconds
				this.updateTimeDisplay()
			},

			toggleCountdown() {
				if (this.isRunning) {
					this.stopCountdown()
				} else {
					this.startCountdown()
				}
			},

			startCountdown() {
				if (this.remainingTime <= 0) {
					this.remainingTime = this.countdownTime
				}

				this.isRunning = true
				this.countdownTimer = setInterval(() => {
					this.remainingTime--
					this.updateTimeDisplay()

					if (this.remainingTime <= 0) {
						this.stopCountdown()
						this.showTimeUp()
					}
				}, 1000)
			},

			stopCountdown() {
				if (this.countdownTimer) {
					clearInterval(this.countdownTimer)
					this.countdownTimer = null
				}
				this.isRunning = false
			},

			updateTimeDisplay() {
				this.minutes = Math.floor(this.remainingTime / 60)
				this.seconds = this.remainingTime % 60
				const progress = (this.countdownTime - this.remainingTime) / this.countdownTime
				this.progressPercent = progress * 100
			},

			formatTime(time) {
				return time < 10 ? '0' + time : time.toString()
			},

			showTimeUp() {
				uni.showToast({
					title: '时间到！休息一下吧',
					icon: 'none',
					duration: 2000
				})
			},

			// 心情相关
			selectMood(moodId) {
				this.selectedMood = moodId
			},

			recordMood() {
				if (!this.selectedMood) return

				this.todayMood = this.selectedMood

				// 保存到本地
				const today = new Date().toISOString().split('T')[0]
				uni.setStorageSync('todayMood', {
					date: today,
					mood: this.todayMood
				})

				uni.showToast({
					title: '心情已记录',
					icon: 'success',
					duration: 1500
				})

				this.selectedMood = ''
			},

			loadTodayMood() {
				const saved = uni.getStorageSync('todayMood')
				const today = new Date().toISOString().split('T')[0]

				if (saved && saved.date === today) {
					this.todayMood = saved.mood
				}
			},

			getMoodText(moodId) {
				const mood = this.moodOptions.find(m => m.id === moodId)
				return mood ? mood.name : '未知'
			},

			// 幸运数相关
			generateNumber() {
				const min = 1
				const max = 99
				const newNumber = Math.floor(Math.random() * (max - min + 1)) + min

				this.luckyNumber = newNumber
				const descIndex = newNumber % this.numberDescriptions.length
				this.luckyDesc = this.numberDescriptions[descIndex]

				// 添加到历史
				this.historyNumbers.unshift(newNumber)
				if (this.historyNumbers.length > 6) {
					this.historyNumbers = this.historyNumbers.slice(0, 6)
				}

				// 保存历史
				uni.setStorageSync('luckyHistory', this.historyNumbers)
			},

			loadHistoryNumbers() {
				const history = uni.getStorageSync('luckyHistory')
				if (history && Array.isArray(history)) {
					this.historyNumbers = history
				}
			},

			// 笑话相关
			refreshJoke() {
				const index = Math.floor(Math.random() * this.jokes.length)
				this.currentJoke = this.jokes[index]
				this.showAnswer = false
			},

			toggleAnswer() {
				if (!this.showAnswer) {
					this.showAnswer = true
				} else {
					this.refreshJoke()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.simple-display {
		width: 100%;
		padding: 40rpx 30rpx;
		box-sizing: border-box;

		/* 通用头部样式 */
		.header {
			display: flex;
			align-items: center;
			margin-bottom: 40rpx;

			.header-icon {
				width: 60rpx;
				height: 60rpx;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;

				.icon-quote {
					width: 40rpx;
					height: 40rpx;
					background: #1890ff;
					clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
				}

				.icon-countdown {
					width: 40rpx;
					height: 40rpx;
					background: #52c41a;
					border-radius: 50%;
					position: relative;

					&::before {
						content: '';
						position: absolute;
						top: 8rpx;
						left: 19rpx;
						width: 2rpx;
						height: 20rpx;
						background: #fff;
					}
				}

				.icon-mood {
					width: 40rpx;
					height: 40rpx;
					background: #fa8c16;
					border-radius: 50%;
				}

				.icon-lucky {
					width: 40rpx;
					height: 40rpx;
					background: #722ed1;
					border-radius: 8rpx;
				}

				.icon-joke {
					width: 40rpx;
					height: 40rpx;
					background: #13c2c2;
					clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
				}
			}

			.header-title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}

		/* 金句样式 */
		.quote-container {
			.quote-header {
				@extend .header;
			}

			.quote-content {
				background: linear-gradient(135deg, #fdfcfb 0%, #f5f7fa 100%);
				border-radius: 20rpx;
				padding: 50rpx 40rpx;
				margin-bottom: 40rpx;
				border-left: 8rpx solid #1890ff;

				.quote-text {
					font-size: 32rpx;
					line-height: 1.6;
					color: #333;
					margin-bottom: 30rpx;
					text-align: center;
				}

				.quote-info {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.quote-author {
						font-size: 28rpx;
						color: #666;
					}

					.quote-tag {
						padding: 6rpx 20rpx;
						background: #e6f7ff;
						border-radius: 20rpx;

						text {
							font-size: 24rpx;
							color: #1890ff;
						}
					}
				}
			}

			.refresh-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				background: #1890ff;
				color: #fff;
				font-size: 28rpx;
				border: none;

				&::after {
					border: none;
				}

				&.btn-hover {
					opacity: 0.9;
					transform: scale(0.98);
				}
			}
		}

		/* 倒计时样式 */
		.countdown-container {
			.countdown-header {
				@extend .header;
			}

			.countdown-content {
				margin-bottom: 40rpx;

				.time-display {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 40rpx;

					.time-unit {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin: 0 20rpx;

						.time-value {
							font-size: 80rpx;
							font-weight: bold;
							color: #333;
							line-height: 1;
						}

						.time-label {
							font-size: 24rpx;
							color: #666;
							margin-top: 10rpx;
						}
					}

					.time-colon {
						font-size: 60rpx;
						color: #333;
						margin: 0 10rpx;
					}
				}

				.countdown-progress {
					height: 8rpx;
					background: #f0f0f0;
					border-radius: 4rpx;
					margin-bottom: 40rpx;
					overflow: hidden;

					.progress-bar {
						height: 100%;
						background: #52c41a;
						border-radius: 4rpx;
						transition: width 1s linear;
					}
				}

				.time-presets {
					display: flex;
					justify-content: center;
					gap: 20rpx;

					.time-preset {
						padding: 20rpx 30rpx;
						background: #f5f5f5;
						border-radius: 40rpx;
						font-size: 28rpx;
						color: #666;

						&.active {
							background: #52c41a;
							color: #fff;
						}
					}
				}
			}

			.countdown-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				font-size: 28rpx;
				border: none;

				&::after {
					border: none;
				}

				&.start-btn {
					background: #52c41a;
					color: #fff;
				}

				&.pause-btn {
					background: #fa8c16;
					color: #fff;
				}

				&.btn-hover {
					opacity: 0.9;
					transform: scale(0.98);
				}
			}
		}

		/* 心情打卡样式 */
		.mood-container {
			.mood-header {
				@extend .header;
			}

			.mood-content {
				margin-bottom: 40rpx;

				.today-mood {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-bottom: 50rpx;

					.mood-label {
						font-size: 28rpx;
						color: #666;
						margin-bottom: 20rpx;
					}

					.mood-face {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						margin-bottom: 20rpx;
						position: relative;

						&.mood-happy {
							background: #fff566;
						}

						&.mood-sad {
							background: #adc6ff;
						}

						&.mood-angry {
							background: #ff7875;
						}

						&.mood-peaceful {
							background: #95de64;
						}

						&.mood-tired {
							background: #b37feb;
						}

						&.mood-excited {
							background: #ff9c6e;
						}

						.face-eyes {
							position: absolute;
							top: 40rpx;
							left: 30rpx;
							width: 20rpx;
							height: 8rpx;
							background: #333;
							border-radius: 4rpx;

							&::after {
								content: '';
								position: absolute;
								right: 20rpx;
								width: 20rpx;
								height: 8rpx;
								background: #333;
								border-radius: 4rpx;
							}
						}

						.face-mouth {
							position: absolute;
							bottom: 30rpx;
							left: 40rpx;
							width: 40rpx;
							height: 20rpx;
							border: 4rpx solid #333;
							border-bottom: none;
							border-radius: 50% 50% 0 0;
						}
					}

					.mood-text {
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
					}
				}

				.mood-options {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 20rpx;

					.mood-option {
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 20rpx;
						border-radius: 15rpx;
						background: #fafafa;

						&.selected {
							background: #e6f7ff;
							border: 2rpx solid #1890ff;
						}

						.option-icon {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							margin-bottom: 10rpx;

							&.mood-happy {
								background: #fff566;
							}

							&.mood-sad {
								background: #adc6ff;
							}

							&.mood-angry {
								background: #ff7875;
							}

							&.mood-peaceful {
								background: #95de64;
							}

							&.mood-tired {
								background: #b37feb;
							}

							&.mood-excited {
								background: #ff9c6e;
							}

							.option-face {
								width: 30rpx;
								height: 30rpx;
								margin: 15rpx auto;
								border: 4rpx solid #fff;
								border-bottom: none;
								border-radius: 50%;
							}
						}

						text {
							font-size: 24rpx;
							color: #333;
						}
					}
				}
			}

			.mood-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				background: #fa8c16;
				color: #fff;
				font-size: 28rpx;
				border: none;

				&::after {
					border: none;
				}

				&[disabled] {
					background: #f5f5f5;
					color: #bfbfbf;
				}

				&.btn-hover:not([disabled]) {
					opacity: 0.9;
					transform: scale(0.98);
				}
			}
		}

		/* 幸运数样式 */
		.lucky-container {
			.lucky-header {
				@extend .header;
			}

			.lucky-content {
				margin-bottom: 40rpx;

				.number-display {
					position: relative;
					width: 200rpx;
					height: 200rpx;
					margin: 0 auto 30rpx;

					.number-circle {
						width: 100%;
						height: 100%;
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;
						z-index: 2;

						.lucky-number {
							font-size: 60rpx;
							font-weight: bold;
							color: #fff;
						}
					}

					.number-glow {
						width: 120%;
						height: 120%;
						position: absolute;
						top: -10%;
						left: -10%;
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						border-radius: 50%;
						opacity: 0.3;
						z-index: 1;
						animation: pulse 2s ease-in-out infinite;
					}
				}

				.lucky-desc {
					font-size: 28rpx;
					color: #666;
					text-align: center;
					margin-bottom: 40rpx;
					padding: 0 20rpx;
				}

				.history-numbers {
					.history-label {
						font-size: 28rpx;
						color: #666;
						margin-bottom: 20rpx;
						text-align: center;
					}

					.numbers-list {
						display: flex;
						justify-content: center;
						flex-wrap: wrap;
						gap: 20rpx;

						.history-number {
							width: 80rpx;
							height: 80rpx;
							background: #f0f0f0;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;

							text {
								font-size: 32rpx;
								font-weight: bold;
								color: #666;
							}
						}
					}
				}
			}

			.lucky-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				background: #722ed1;
				color: #fff;
				font-size: 28rpx;
				border: none;

				&::after {
					border: none;
				}

				&.btn-hover {
					opacity: 0.9;
					transform: scale(0.98);
				}
			}
		}

		/* 冷笑话样式 */
		.joke-container {
			.joke-header {
				@extend .header;
			}

			.joke-content {
				background: #fff7e6;
				border-radius: 20rpx;
				padding: 50rpx 40rpx;
				margin-bottom: 40rpx;
				border-left: 8rpx solid #fa8c16;

				.joke-question {
					font-size: 32rpx;
					line-height: 1.6;
					color: #333;
					margin-bottom: 30rpx;
					text-align: center;
				}

				.joke-answer {
					padding: 20rpx;
					background: #f6ffed;
					border-radius: 10rpx;
					margin-bottom: 30rpx;

					.answer-label {
						font-size: 24rpx;
						color: #52c41a;
						margin-bottom: 10rpx;
						font-weight: bold;
					}

					text {
						font-size: 28rpx;
						color: #666;
					}
				}

				.joke-tag {
					display: inline-block;
					padding: 8rpx 20rpx;
					background: #fff2e8;
					border-radius: 20rpx;

					text {
						font-size: 24rpx;
						color: #fa8c16;
					}
				}
			}

			.joke-actions {
				.joke-btn {
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 40rpx;
					background: #13c2c2;
					color: #fff;
					font-size: 28rpx;
					border: none;

					&::after {
						border: none;
					}

					&.btn-hover {
						opacity: 0.9;
						transform: scale(0.98);
					}
				}
			}
		}

		/* 默认状态 */
		.default-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100rpx 0;

			.default-icon {
				width: 120rpx;
				height: 120rpx;
				border-radius: 20rpx;
				background: #f0f0f0;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 30rpx;

				.icon-default {
					width: 60rpx;
					height: 60rpx;
					background: #d9d9d9;
					border-radius: 8rpx;
				}
			}

			.default-text {
				font-size: 28rpx;
				color: #999;
			}
		}
	}

	/* 动画 */
	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 0.3;
		}

		50% {
			transform: scale(1.1);
			opacity: 0.2;
		}

		100% {
			transform: scale(1);
			opacity: 0.3;
		}
	}
</style>