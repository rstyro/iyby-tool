<template>
	<view class="container">
		<!-- 头部区域 -->
		<view class="header">
			<view class="header-content">
				<cl-icon type="icon-jisuanqi" color="#1890ff" size="48"></cl-icon>
				<text class="title">日期计算工具</text>
				<text class="subtitle">高效处理日期相关计算</text>
			</view>
		</view>

		<!-- 功能卡片区 -->
		<view class="main-content">
			<!-- 日期差计算 -->
			<view class="function-card">
				<view class="card-header">
					<text class="function-title">日期差计算</text>
					<view class="card-badge">精确计算</view>
				</view>
				<view class="card-body">
					<view class="date-inputs">
						<view class="input-group">
							<view class="input-item">
								<text class="input-label">开始日期</text>
								<picker mode="date" :value="startDate" @change="startDateChange">
									<view class="date-picker">
										<text class="date-value">{{ startDate || '请选择开始日期' }}</text>
										<cl-icon type="icon-riqi" color="#8c8c8c" size="20"></cl-icon>
									</view>
								</picker>
							</view>
							
							<view class="divider-line">
								<cl-icon type="icon-arrow-right" color="#bfbfbf" size="20"></cl-icon>
							</view>
							
							<view class="input-item">
								<text class="input-label">结束日期</text>
								<picker mode="date" :value="endDate" @change="endDateChange">
									<view class="date-picker">
										<text class="date-value">{{ endDate || '请选择结束日期' }}</text>
										<cl-icon type="icon-riqi" color="#8c8c8c" size="20"></cl-icon>
									</view>
								</picker>
							</view>
						</view>
					</view>
					
					<view class="results-section">
						<view class="result-row total-days">
							<view class="result-label">
								<cl-icon type="icon-shuliang" color="#1890ff" size="24"></cl-icon>
								<text>总天数</text>
							</view>
							<view class="result-value">{{ daysDiff.total || 0 }} 天</view>
						</view>
						
						<view class="result-grid">
							<view class="result-item workdays">
								<view class="result-icon">
									<cl-icon type="icon-shangban" color="#52c41a" size="20"></cl-icon>
								</view>
								<view class="result-content">
									<text class="result-title">工作日</text>
									<text class="result-number">{{ daysDiff.workdays || 0 }}</text>
									<text class="result-unit">天</text>
								</view>
							</view>
							
							<view class="result-item weekends">
								<view class="result-icon">
									<cl-icon type="icon-shouye" color="#fa8c16" size="20"></cl-icon>
								</view>
								<view class="result-content">
									<text class="result-title">周末</text>
									<text class="result-number">{{ daysDiff.weekends || 0 }}</text>
									<text class="result-unit">天</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 时间戳转换 -->
			<view class="function-card">
				<view class="card-header">
					<text class="function-title">时间戳转换</text>
					<view class="card-badge">精确到毫秒</view>
				</view>
				<view class="card-body">
					<view class="datetime-picker">
						<view class="datetime-row">
							<view class="datetime-item date-item">
								<text class="input-label">选择日期</text>
								<picker mode="date" :value="timestampDate" @change="timestampDateChange">
									<view class="datetime-input">
										<text>{{ timestampDate || '请选择日期' }}</text>
										<cl-icon type="icon-riqijisuan" color="#8c8c8c" size="20"></cl-icon>
									</view>
								</picker>
							</view>
							
							<view class="datetime-divider"></view>
							
							<view class="datetime-item time-item">
								<text class="input-label">选择时间</text>
								<picker mode="time" :value="timestampTime" @change="timestampTimeChange">
									<view class="datetime-input">
										<text>{{ timestampTime || '请选择时间' }}</text>
										<cl-icon type="icon-riqijisuan" color="#8c8c8c" size="20"></cl-icon>
									</view>
								</picker>
							</view>
						</view>
					</view>
					
					<view class="timestamp-section">
						<view class="timestamp-label">
							<text>时间戳（毫秒）</text>
						</view>
						<view class="timestamp-value" @click="copyTimestamp">
							<text class="timestamp-text">{{ timestampValue }}</text>
							<button class="copy-btn" @click.stop="copyTimestamp">
								<cl-icon type="icon-fuzhi" color="#722ed1" size="18"></cl-icon>
								<text>复制</text>
							</button>
						</view>
					</view>
				</view>
			</view>

			<!-- 日期加减 -->
			<view class="function-card">
				<view class="card-header">
					<text class="function-title">日期计算</text>
					<view class="card-badge">加减天数</view>
				</view>
				<view class="card-body">
					<view class="calc-section">
						<view class="base-date">
							<text class="input-label">起始日期</text>
							<picker mode="date" :value="addDate" @change="addDateChange">
								<view class="calc-input">
									<text>{{ addDate || '请选择日期' }}</text>
									<cl-icon type="icon-riqijisuan" color="#8c8c8c" size="20"></cl-icon>
								</view>
							</picker>
						</view>
						
						<view class="operation-section">
							<view class="operation-controls">
								<button class="op-btn minus" :class="{active: Number(addDays) < 0}" 
										@click="modifyAddDays(-1)">
									<cl-icon type="icon-jian" color="#fff" size="20"></cl-icon>
								</button>
								
								<input class="days-input" type="number" v-model="addDays" 
									   placeholder="0" @input="calculateAddDate" />
								
								<button class="op-btn plus" :class="{active: Number(addDays) > 0}"
										@click="modifyAddDays(1)">
									<cl-icon type="icon-jia" color="#fff" size="20"></cl-icon>
								</button>
							</view>
							<text class="days-label">天数</text>
						</view>
						
						<view class="result-display">
							<view class="result-header">
								<text>结果日期</text>
							</view>
							<view class="result-date" @click="copyAddResultDate">
								<text class="date-text">{{ addResultDate }}</text>
								<button class="copy-btn" @click.stop="copyAddResultDate">
									<cl-icon type="icon-fuzhi" color="#722ed1" size="18"></cl-icon>
									<text>复制</text>
								</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部说明 -->
		<view class="footer">
			<cl-icon type="icon-dengpao" color="#8c8c8c" size="16"></cl-icon>
			<text class="tip">点击复制按钮可快速复制结果</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			// 获取当前日期
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			const currentDate = `${year}-${month}-${day}`;

			// 设置10天前的日期
			const tenDaysAgo = new Date();
			tenDaysAgo.setDate(today.getDate() - 10);
			const tenDaysAgoYear = tenDaysAgo.getFullYear();
			const tenDaysAgoMonth = String(tenDaysAgo.getMonth() + 1).padStart(2, '0');
			const tenDaysAgoDay = String(tenDaysAgo.getDate()).padStart(2, '0');
			const tenDaysAgoDate = `${tenDaysAgoYear}-${tenDaysAgoMonth}-${tenDaysAgoDay}`;

			return {
				startDate: tenDaysAgoDate,
				endDate: currentDate,
				timestampDate: currentDate,
				timestampTime: '12:00',
				addDate: currentDate,
				addDays: 0,
				daysDiff: {
					total: 10,
					workdays: 0,
					weekends: 0
				},
				timestampValue: '',
				addResultDate: ''
			}
		},
		mounted() {
			this.calculateDayDiff();
			this.calculateTimestamp();
			this.calculateAddDate();
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
					"📅 开发/办公必备神器！【日期时间转换工具】上线啦！",
					"⚡️ 工时统计，快人一步！分享一个超好用的【日期时间转换工具】！",
					" 想知道 \"100天后是哪天\"？点一下就知道！"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/timeConversion/timeConversion',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			
			// 日期格式化函数
			formatDate(date) {
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			},
			
			// 计算工作日和周末天数
			isWeekend(date) {
				const day = date.getDay();
				return day === 0 || day === 6; // 0是周日，6是周六
			},
			
			// 计算日期差（包含工作日和周末）
			calculateDayDiff() {
				if (!this.startDate || !this.endDate) {
					this.daysDiff = { total: 0, workdays: 0, weekends: 0 };
					return;
				}
				
				const start = new Date(this.startDate);
				const end = new Date(this.endDate);
				
				// 确保开始日期小于等于结束日期
				if (start > end) {
					[this.startDate, this.endDate] = [this.endDate, this.startDate];
					this.calculateDayDiff();
					return;
				}
				
				// 计算总天数（包含开始和结束日期）
				const diffTime = end.getTime() - start.getTime();
				const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
				
				// 计算工作日和周末天数
				let workdays = 0;
				let weekends = 0;
				const current = new Date(start);
				
				for (let i = 0; i <= totalDays; i++) {
					if (this.isWeekend(current)) {
						weekends++;
					} else {
						workdays++;
					}
					current.setDate(current.getDate() + 1);
				}
				
				this.daysDiff = {
					total: totalDays + 1, // 包含开始和结束日
					workdays: workdays,
					weekends: weekends
				};
			},
			
			// 计算时间戳
			calculateTimestamp() {
				if (!this.timestampDate || !this.timestampTime) {
					this.timestampValue = '';
					return;
				}
				
				// 合并日期和时间
				const dateTime = new Date(`${this.timestampDate} ${this.timestampTime}`);
				this.timestampValue = dateTime.getTime();
			},
			
			// 计算日期加减
			calculateAddDate() {
				if (!this.addDate || this.addDays === null || this.addDays === '') {
					this.addResultDate = '';
					return;
				}
				
				const days = Number(this.addDays);
				if (isNaN(days)) {
					this.addResultDate = '';
					return;
				}
				
				const date = new Date(this.addDate);
				date.setDate(date.getDate() + days);
				this.addResultDate = this.formatDate(date);
			},
			
			// 修改加减天数
			modifyAddDays(step) {
				const current = Number(this.addDays) || 0;
				this.addDays = current + step;
				this.calculateAddDate();
			},
			
			// 复制时间戳
			copyTimestamp() {
				if (!this.timestampValue) {
					uni.showToast({
						title: '请先选择日期和时间',
						icon: 'none'
					});
					return;
				}
				
				uni.setClipboardData({
					data: this.timestampValue.toString(),
					success: () => {
						uni.showToast({
							title: '时间戳已复制',
							icon: 'success'
						});
					}
				});
			},
			
			// 复制结果日期
			copyAddResultDate() {
				if (!this.addResultDate) {
					uni.showToast({
						title: '请先选择日期和设置天数',
						icon: 'none'
					});
					return;
				}
				
				uni.setClipboardData({
					data: this.addResultDate,
					success: () => {
						uni.showToast({
							title: '结果日期已复制',
							icon: 'success'
						});
					}
				});
			},
			
			// 事件处理函数
			startDateChange(e) {
				this.startDate = e.detail.value;
				this.calculateDayDiff();
			},
			
			endDateChange(e) {
				this.endDate = e.detail.value;
				this.calculateDayDiff();
			},
			
			timestampDateChange(e) {
				this.timestampDate = e.detail.value;
				this.calculateTimestamp();
			},
			
			timestampTimeChange(e) {
				this.timestampTime = e.detail.value;
				this.calculateTimestamp();
			},
			
			addDateChange(e) {
				this.addDate = e.detail.value;
				this.calculateAddDate();
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background: #f5f7fa;
	font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
	position: relative;
	overflow-x: hidden;
}

.header {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	padding: 40rpx 0 60rpx;
	position: relative;
	overflow: hidden;
}

.header::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 200rpx;
	height: 200rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	transform: translate(30%, -30%);
}

.header::after {
	content: '';
	position: absolute;
	bottom: -100rpx;
	left: -50rpx;
	width: 300rpx;
	height: 300rpx;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 50%;
}

.header-content {
	position: relative;
	z-index: 1;
	text-align: center;
	color: white;
	padding: 0 40rpx;
}

.title {
	display: block;
	font-size: 40rpx;
	font-weight: 600;
	margin-top: 20rpx;
	letter-spacing: 1rpx;
}

.subtitle {
	display: block;
	font-size: 28rpx;
	opacity: 0.9;
	margin-top: 10rpx;
	font-weight: 400;
}

.main-content {
	padding: 0 30rpx 120rpx;
	position: relative;
	z-index: 2;
	margin-top: -40rpx;
}

.function-card {
	background: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(240, 240, 240, 0.8);
	overflow: hidden;
	transition: all 0.3s ease;
}

.function-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.card-header {
	padding: 30rpx 40rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.function-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #262626;
	flex: 1;
}

.card-badge {
	background: rgba(24, 144, 255, 0.1);
	color: #1890ff;
	padding: 6rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.card-body {
	padding: 40rpx;
}

.date-inputs {
	margin-bottom: 40rpx;
}

.input-group {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.input-item {
	flex: 1;
}

.input-label {
	font-size: 28rpx;
	color: #595959;
	font-weight: 500;
	margin-bottom: 16rpx;
	display: block;
}

.date-picker {
	height: 100rpx;
	background: #fafafa;
	border-radius: 12rpx;
	border: 2rpx solid #e8e8e8;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	color: #262626;
	font-weight: 500;
	transition: all 0.3s ease;
}

.date-picker:active {
	background: #f0f0f0;
	border-color: #1890ff;
}

.date-value {
	flex: 1;
}

.divider-line {
	padding: 0 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.results-section {
	background: #fafafa;
	border-radius: 12rpx;
	padding: 30rpx;
	border: 1rpx solid #f0f0f0;
}

.result-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.result-row.total-days {
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #e8e8e8;
}

.result-label {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 30rpx;
	color: #595959;
	font-weight: 500;
}

.result-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #1890ff;
}

.result-grid {
	display: flex;
	gap: 20rpx;
}

.result-item {
	flex: 1;
	background: white;
	border-radius: 12rpx;
	padding: 30rpx;
	border: 1rpx solid #f0f0f0;
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.result-item.workdays {
	border-top: 4rpx solid #52c41a;
}

.result-item.weekends {
	border-top: 4rpx solid #fa8c16;
}

.result-icon {
	width: 60rpx;
	height: 60rpx;
	background: rgba(82, 196, 26, 0.1);
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.result-item.weekends .result-icon {
	background: rgba(250, 140, 22, 0.1);
}

.result-content {
	flex: 1;
}

.result-title {
	display: block;
	font-size: 24rpx;
	color: #8c8c8c;
	margin-bottom: 8rpx;
}

.result-number {
	font-size: 40rpx;
	font-weight: 700;
	color: #262626;
	margin-right: 8rpx;
}

.result-unit {
	font-size: 24rpx;
	color: #8c8c8c;
}

.datetime-picker {
	margin-bottom: 40rpx;
}

.datetime-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.datetime-item {
	flex: 1;
}

.datetime-input {
	height: 100rpx;
	background: #fafafa;
	border-radius: 12rpx;
	border: 2rpx solid #e8e8e8;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	color: #262626;
	font-weight: 500;
	transition: all 0.3s ease;
}

.datetime-input:active {
	background: #f0f0f0;
	border-color: #722ed1;
}

.datetime-divider {
	width: 40rpx;
	text-align: center;
	font-size: 28rpx;
	color: #bfbfbf;
	margin-top: 40rpx;
}

.timestamp-section {
	background: #fafafa;
	border-radius: 12rpx;
	padding: 30rpx;
	border: 1rpx solid #f0f0f0;
}

.timestamp-label {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 28rpx;
	color: #595959;
	font-weight: 500;
	margin-bottom: 20rpx;
}

.timestamp-value {
	background: white;
	border-radius: 8rpx;
	padding: 24rpx;
	border: 1rpx solid #e8e8e8;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.timestamp-text {
	font-family: 'Courier New', 'Consolas', monospace;
	font-size: 28rpx;
	color: #262626;
	font-weight: 500;
	word-break: break-all;
	flex: 1;
	margin-right: 20rpx;
}

.copy-btn {
	background: rgba(114, 46, 209, 0.1);
	border-radius: 8rpx;
	padding: 12rpx 24rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #722ed1;
	font-weight: 500;
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.copy-btn:active {
	background: rgba(114, 46, 209, 0.2);
	transform: scale(0.95);
}

.calc-section {
	background: #fafafa;
	border-radius: 12rpx;
	padding: 30rpx;
	border: 1rpx solid #f0f0f0;
}

.base-date {
	margin-bottom: 30rpx;
}

.calc-input {
	height: 100rpx;
	background: white;
	border-radius: 12rpx;
	border: 2rpx solid #e8e8e8;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	color: #262626;
	font-weight: 500;
	transition: all 0.3s ease;
}

.calc-input:active {
	background: #f0f0f0;
	border-color: #13c2c2;
}

.operation-section {
	margin-bottom: 30rpx;
}

.operation-controls {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.op-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.op-btn.minus {
	background: #ff7875;
}

.op-btn.plus {
	background: #52c41a;
}

.op-btn.minus.active {
	background: #f5222d;
	transform: scale(1.1);
}

.op-btn.plus.active {
	background: #389e0d;
	transform: scale(1.1);
}

.days-input {
	flex: 1;
	height: 100rpx;
	background: white;
	border-radius: 12rpx;
	border: 2rpx solid #e8e8e8;
	text-align: center;
	font-size: 40rpx;
	color: #262626;
	font-weight: 700;
	font-family: 'Arial', sans-serif;
}

.days-label {
	font-size: 28rpx;
	color: #8c8c8c;
	text-align: center;
	display: block;
}

.result-display {
	background: white;
	border-radius: 12rpx;
	padding: 30rpx;
	border: 1rpx solid #e8e8e8;
}

.result-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 28rpx;
	color: #595959;
	font-weight: 500;
	margin-bottom: 20rpx;
}

.result-date {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.date-text {
	font-size: 36rpx;
	color: #262626;
	font-weight: 600;
	flex: 1;
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: white;
	padding: 20rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12rpx;
	border-top: 1rpx solid #f0f0f0;
	z-index: 10;
}

.tip {
	font-size: 24rpx;
	color: #8c8c8c;
	font-weight: 500;
}

/* 不同卡片颜色主题 */
//.function-card:nth-child(1) .card-badge {
//	background: rgba(24, 144, 255, 0.1);
//	color: #1890ff;
//}
//
//.function-card:nth-child(2) .card-badge {
//	background: rgba(114, 46, 209, 0.1);
//	color: #722ed1;
//}
//
//.function-card:nth-child(3) .card-badge {
//	background: rgba(19, 194, 194, 0.1);
//	color: #13c2c2;
//}
</style>
