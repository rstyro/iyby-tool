<template>
	<view class="container">
		<view class="header">
			<view class="logo">♀</view>
			<text class="title">生理周期追踪查询器</text>
			<text class="subtitle">记录、预测、管理您的生理健康</text>
		</view>

		<view class="main">
			<view class="card">
				<view class="card-title">
					<text class="card-title-text">记录生理周期</text>
				</view>

				<view class="form-group">
					<text class="form-label">上次月经开始日期</text>
					<picker mode="date" :value="lastPeriod" @change="onDateChange">
						<view class="date-picker">{{ lastPeriod || '请选择日期' }}</view>
					</picker>
				</view>

				<view class="form-group">
					<text class="form-label">月经周期长度（天）</text>
					<input type="number" v-model.number="cycleLength" placeholder="通常为28天" class="input-field" />
				</view>

				<view class="form-group">
					<text class="form-label">月经持续时间（天）</text>
					<input type="number" v-model.number="periodLength" placeholder="通常为3-7天" class="input-field" />
				</view>

				<button class="btn" @click="calculateCycle">计算生理周期</button>

				<view class="tip">
					<text>💡 小贴士：通常月经周期为28天，但正常范围在21-35天之间。准确记录有助于更精准的预测。</text>
				</view>
			</view>

			<view class="card" v-if="resultsCalculated">
				<view class="card-title">
					<text class="card-title-text">生理周期预测</text>
				</view>

				<view class="results">
					<view class="result-card ">
						<text class="result-title">当前状态</text>
						<text class="result-value">{{ currentStatus }}</text>
					</view>
					<view class="result-card">
						<text class="result-title">下次月经开始</text>
						<text class="result-value">{{ nextPeriod }}</text>
					</view>
					<view class="result-card">
						<text class="result-title">排卵日</text>
						<text class="result-value">{{ ovulationDate }}</text>
					</view>
					<view class="result-card">
						<text class="result-title">排卵期</text>
						<text class="result-value">{{ fertileWindow }}</text>
					</view>
					
				</view>

				<view class="current-stage" v-if="currentStatus">
					{{ currentStatusDesc }}
				</view>

				<view class="cycle-info">
					<text class="cycle-info-title">生理周期阶段</text>

					<view class="cycle-stage">
						<view class="stage-icon" style="background-color: #ff8a9b;">♀</view>
						<view class="stage-details">
							<text class="stage-title">月经期</text>
							<text class="stage-desc">{{ periodDates }}</text>
						</view>
					</view>

					<view class="cycle-stage">
						<view class="stage-icon" style="background-color: #5aa9e6;">⭕</view>
						<view class="stage-details">
							<text class="stage-title">排卵期</text>
							<text class="stage-desc">{{ fertileDates }}</text>
						</view>
					</view>

					<view class="cycle-stage">
						<view class="stage-icon" style="background-color: #7da07d;">✓</view>
						<view class="stage-details">
							<text class="stage-title">安全期</text>
							<text class="stage-desc">{{ safeDates }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="card" v-if="resultsCalculated">
				<view class="card-title">
					<text class="card-title-text">生理周期日历</text>
				</view>

				<view class="calendar">
					<view class="calendar-header" v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">
						{{ day }}
					</view>
					<view v-for="(day, index) in calendar" :key="index" :class="['calendar-day', 
                      {today: day.isToday},
                      {period: day.isPeriod},
                      {ovulation: day.isOvulationDay},
                      {fertile: day.isFertile},
                      {safe: day.isSafe}]">
						{{ day.date }}
						<view class="day-marker">
							<text v-if="day.isPeriod">经</text>
							<text v-else-if="day.isOvulationDay">排</text>
							<text v-else-if="day.isFertile">易</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">温馨提示：本工具预测结果仅供参考，不作为医学诊断依据</view>
			<view class="text">生理周期追踪查询器 © {{ new Date().getFullYear() }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lastPeriod: '',
				cycleLength: 28,
				periodLength: 7,
				resultsCalculated: false,
				nextPeriod: '',
				ovulationDate: '',
				fertileWindow: '',
				currentStatus: '',
				currentStatusDesc: '',
				periodDates: '',
				fertileDates: '',
				safeDates: '',
				calendar: []
			}
		},
		mounted() {
			// 设置默认日期为今天
			const today = new Date()
			this.lastPeriod = this.formatDate(today)
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
					"「身体会说话，只是我们常常忽略她的声音🌸」",
					"「闺蜜私藏的生理期神器被我挖到了！」",
					"「把身体的潮汐装进口袋🌊,月光般温柔的生理期追踪器」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/cycle/cycle',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			// 日期格式化
			formatDate(date, format = 'YYYY-MM-DD') {
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')

				if (format === 'YYYY-MM-DD') {
					return `${year}-${month}-${day}`
				} else if (format === 'MM-DD') {
					return `${month}-${day}`
				}
				return `${year}-${month}-${day}`
			},

			// 日期选择事件
			onDateChange(e) {
				this.lastPeriod = e.detail.value
			},

			// 添加天数
			addDays(date, days) {
				const result = new Date(date)
				result.setDate(result.getDate() + days)
				return result
			},

			// 是否为同一天
			isSameDay(date1, date2) {
				return date1.getFullYear() === date2.getFullYear() &&
					date1.getMonth() === date2.getMonth() &&
					date1.getDate() === date2.getDate()
			},

			// 日期是否在范围内
			isInRange(date, start, end) {
				const time = date.getTime()
				return time >= start.getTime() && time <= end.getTime()
			},

			// 获取星期名称
			getWeekdayName(date) {
				const weekdays = ['日', '一', '二', '三', '四', '五', '六']
				return weekdays[date.getDay()]
			},

			// 计算生理周期
			calculateCycle() {
				if (!this.lastPeriod) {
					uni.showToast({
						title: '请选择上次月经开始日期',
						icon: 'none'
					})
					return
				}

				const lastPeriodDate = new Date(this.lastPeriod)
				const today = new Date()

				// 计算下次月经开始日期
				const nextPeriodDate = this.addDays(lastPeriodDate, this.cycleLength)
				this.nextPeriod = `${this.formatDate(nextPeriodDate)} (周${this.getWeekdayName(nextPeriodDate)})`

				// 计算排卵日（下次月经前14天）
				const ovulationDate = this.addDays(nextPeriodDate, -14)
				this.ovulationDate = `${this.formatDate(ovulationDate)} (周${this.getWeekdayName(ovulationDate)})`

				// 计算排卵期（排卵日前5天到后4天）
				const fertileStart = this.addDays(ovulationDate, -5)
				const fertileEnd = this.addDays(ovulationDate, 4)
				this.fertileWindow = `${this.formatDate(fertileStart, 'MM-DD')} 至 ${this.formatDate(fertileEnd, 'MM-DD')}`

				// 计算当前状态
				this.calculateCurrentStatus(lastPeriodDate, nextPeriodDate, ovulationDate, today)

				// 计算月经期
				const periodStart = lastPeriodDate
				const periodEnd = this.addDays(lastPeriodDate, this.periodLength - 1)
				this.periodDates = `${this.formatDate(periodStart, 'MM-DD')} 至 ${this.formatDate(periodEnd, 'MM-DD')}`

				// 计算安全期
				const safe1Start = this.addDays(periodEnd, 1)
				const safe1End = this.addDays(fertileStart, -1)
				const safe2Start = this.addDays(fertileEnd, 1)
				const safe2End = this.addDays(nextPeriodDate, -1)

				this.safeDates =
					`${this.formatDate(safe1Start, 'MM-DD')} 至 ${this.formatDate(safe1End, 'MM-DD')}, ${this.formatDate(safe2Start, 'MM-DD')} 至 ${this.formatDate(safe2End, 'MM-DD')}`

				// 计算排卵期
				this.fertileDates = `${this.formatDate(fertileStart, 'MM-DD')} 至 ${this.formatDate(fertileEnd, 'MM-DD')}`

				// 生成日历
				this.generateCalendar(lastPeriodDate, nextPeriodDate, ovulationDate)

				this.resultsCalculated = true
			},

			// 计算当前状态
			calculateCurrentStatus(lastPeriodDate, nextPeriodDate, ovulationDate, today) {
				const periodEnd = this.addDays(lastPeriodDate, this.periodLength - 1)
				const fertileStart = this.addDays(ovulationDate, -5)
				const fertileEnd = this.addDays(ovulationDate, 4)

				if (this.isInRange(today, lastPeriodDate, periodEnd)) {
					this.currentStatus = '月经期'
					this.currentStatusDesc = '您当前处于月经期，请注意休息和保暖'
				} else if (this.isSameDay(today, ovulationDate)) {
					this.currentStatus = '排卵日'
					this.currentStatusDesc = '今天是排卵日，受孕几率最高'
				} else if (this.isInRange(today, fertileStart, fertileEnd)) {
					this.currentStatus = '易孕期'
					this.currentStatusDesc = '您当前处于易孕期，请注意避孕或备孕计划'
				} else {
					this.currentStatus = '安全期'
					this.currentStatusDesc = '您当前处于安全期，怀孕概率较低'
				}
			},

			// 生成日历
			generateCalendar(lastPeriodDate, nextPeriodDate, ovulationDate) {
				this.calendar = []

				// 日历开始日期（当前月经周期的开始）
				const startDate = new Date(lastPeriodDate)

				// 日历结束日期（下次月经开始）
				const endDate = new Date(nextPeriodDate)

				// 向前显示7天
				startDate.setDate(startDate.getDate() - 7)

				// 向后显示14天
				endDate.setDate(endDate.getDate() + 14)

				const today = new Date()
				const fertileStart = this.addDays(ovulationDate, -5)
				const fertileEnd = this.addDays(ovulationDate, 4)

				// 生成日历的每一天
				let currentDate = new Date(startDate)
				while (currentDate <= endDate) {
					// 检查是否是月经期
					const isPeriod = this.isPeriodDay(currentDate, lastPeriodDate, nextPeriodDate)

					// 检查是否是排卵日
					const isOvulationDay = this.isSameDay(currentDate, ovulationDate)

					// 检查是否是易孕期
					const isFertile = this.isInRange(currentDate, fertileStart, fertileEnd) && !isOvulationDay

					// 检查是否是安全期
					const isSafe = !isPeriod && !isFertile && !isOvulationDay

					// 检查是否是今天
					const isToday = this.isSameDay(currentDate, today)

					this.calendar.push({
						date: currentDate.getDate(),
						isToday: isToday,
						isPeriod: isPeriod,
						isOvulationDay: isOvulationDay,
						isFertile: isFertile,
						isSafe: isSafe
					})

					// 移动到下一天
					currentDate = this.addDays(currentDate, 1)
				}
			},

			// 检查某天是否是月经期
			isPeriodDay(date, lastPeriodDate, nextPeriodDate) {
				// 当前月经周期
				const periodStart = new Date(lastPeriodDate)
				const periodEnd = this.addDays(periodStart, this.periodLength - 1)

				if (this.isInRange(date, periodStart, periodEnd)) {
					return true
				}

				// 上一个月经周期
				const prevPeriodStart = this.addDays(lastPeriodDate, -this.cycleLength)
				const prevPeriodEnd = this.addDays(prevPeriodStart, this.periodLength - 1)

				if (this.isInRange(date, prevPeriodStart, prevPeriodEnd)) {
					return true
				}

				// 下一个月经周期
				const nextPeriodStart = new Date(nextPeriodDate)
				const nextPeriodEnd = this.addDays(nextPeriodStart, this.periodLength - 1)

				if (this.isInRange(date, nextPeriodStart, nextPeriodEnd)) {
					return true
				}

				return false
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 整体样式 */
	.container {
		background: linear-gradient(135deg, #fdf2ff 0%, #e9e6ff 100%);
		min-height: 100vh;
		padding: 20rpx;
		color: #5a4a6e;
	}

	/* 头部样式 */
	.header {
		text-align: center;
		margin-bottom: 30px;
	}

	.logo {
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, #b06ab3 0%, #4568dc 100%);
		border-radius: 50%;
		margin: 0 auto 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 40px;
	}

	.title {
		font-size: 60rpx;
		color: #5a4a6e;
		margin-bottom: 10px;
		display: block;
		font-weight: bold;
	}

	.subtitle {
		color: #9a86b6;
		font-size: 32rpx;
		display: block;
	}

	/* 卡片样式 */
	.card {
		background: white;
		border-radius: 20px;
		box-shadow: 0 6px 16px rgba(139, 116, 181, 0.15);
		padding: 20rpx;
		margin-bottom: 20px;

	}

	.card-title {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		color: #7c6aa7;
	}

	.card-title-text {
		font-size: 18px;
		font-weight: bold;
	}

	/* 表单样式 */
	.form-group {
		margin-bottom: 15px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
		color: #5a4a6e;
		font-size: 14px;
	}

	.date-picker {
		padding: 20rpx;
		border: 1px solid #e0d6f0;
		border-radius: 10px;
		font-size: 30rpx;
		background-color: #faf9ff;
		color: #5a4a6e;
	}

	.input-field {
		padding: 20rpx;
		border: 1px solid #e0d6f0;
		border-radius: 10px;
		font-size: 15px;
		background-color: #faf9ff;
		color: #5a4a6e;
		width: 93%;
	}

	.btn {
		background: linear-gradient(135deg, #b06ab3 0%, #4568dc 100%);
		color: white;
		border: none;
		padding: 14px;
		border-radius: 10px;
		font-size: 16px;
		font-weight: 500;
		width: 100%;
		box-shadow: 0 4px 12px rgba(139, 116, 181, 0.3);
		margin-top: 10px;
	}

	/* 结果样式 */
	.results {
		// display: flex;
		// flex-direction: column;
		// gap: 20rpx;
		// flex-wrap: wrap;
		margin-top: 15px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10rpx;
	}

	.result-card {
		flex: 1;
		background: #faf9ff;
		border-radius: 12px;
		padding: 20rpx 10rpx;
		text-align: center;
		border: 1px solid #e0d6f0;
	}

	.result-title {
		font-size: 32rpx;
		color: #9a86b6;
		margin-bottom: 8px;
		display: block;
	}

	.result-value {
		font-size: 36rpx;
		font-weight: 700;
		color: #7c6aa7;
		display: block;
	}

	.cycle-info {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #f0ebfa;
	}

	.cycle-info-title {
		font-size: 16px;
		font-weight: bold;
		color: #7c6aa7;
		margin-bottom: 15px;
		display: block;
	}

	.cycle-stage {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}

	.stage-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		font-size: 18px;
		color: white;
		flex-shrink: 0;
	}

	.stage-title {
		font-weight: 500;
		color: #5a4a6e;
		display: block;
		font-size: 15px;
	}

	.stage-desc {
		font-size: 13px;
		color: #9a86b6;
		display: block;
	}

	.current-stage {
		background: linear-gradient(135deg, #ff8a9b 0%, #ff5e7d 100%);
		padding: 12px;
		border-radius: 12px;
		margin-top: 15px;
		color: white;
		text-align: center;
		font-weight: 500;
		font-size: 14px;
		animation: pulse 2s infinite;
	}

	/* 日历样式 */
	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		margin-top: 15px;
	}

	.calendar-header {
		text-align: center;
		font-weight: 500;
		color: #7c6aa7;
		padding: 8px 0;
		font-size: 14px;
	}

	.calendar-day {
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		background-color: #faf9ff;
		font-weight: 500;
		position: relative;
		overflow: hidden;
		font-size: 14px;
	}

	.today {
		background: linear-gradient(135deg, #4568dc 0%, #b06ab3 100%);
		color: white;
		font-weight: 700;
	}

	.period {
		background-color: #ffebf0;
		color: #ff5e7d;
	}

	.ovulation {
		background-color: #e6f7ff;
		color: #5aa9e6;
	}

	.fertile {
		background-color: #f0f9ff;
		color: #7c6aa7;
	}

	.safe {
		background-color: #f0f9f0;
		color: #7da07d;
	}

	.day-marker {
		position: absolute;
		bottom: 3px;
		font-size: 9px;
		width: 100%;
		text-align: center;
		color: inherit;
	}

	/* 底部样式 */
	.footer {
		text-align: center;
		color: #9a86b6;
		font-size: 13px;
		margin-top: 25px;
		padding-top: 20px;
		border-top: 1px solid #f0ebfa;
		line-height: 1.6;
	}

	/* 动画 */
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 94, 125, 0.4);
		}

		70% {
			box-shadow: 0 0 0 8px rgba(255, 94, 125, 0);
		}

		100% {
			box-shadow: 0 0 0 0 rgba(255, 94, 125, 0);
		}
	}

	/* 小贴士 */
	.tip {
		background: #fff8e6;
		border-left: 4px solid #ffc107;
		padding: 12px;
		border-radius: 0 10px 10px 0;
		margin: 15px 0;
		color: #5a4a6e;
		font-size: 14px;
	}
</style>