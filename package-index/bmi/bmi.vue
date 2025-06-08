<template>
	<view class="container">
		<!-- 顶部标题区域 -->
		<view class="header">
			<text class="title">BMI健康计算器</text>
			<text class="subtitle">身体质量指数 (Body Mass Index)</text>
		</view>

		<!-- 输入卡片区域 -->
		<view class="card input-card">

			<!-- 身高滑块 -->
			<view class="input-group">
				<view class="slider-header">
					<text>身高</text>
					<text class="slider-value">{{height}} cm</text>
				</view>
				<slider :value="height" min="40" max="250" activeColor="#3498db" block-size="24" :show-value="true"
					@change="e => height = e.detail.value" />
				<view class="scale-indicators">
					<text>40cm</text>
					<text>250cm</text>
				</view>
			</view>

			<!-- 体重滑块 -->
			<view class="input-group">
				<view class="slider-header">
					<text>体重</text>
					<text class="slider-value">{{weight}} kg</text>
				</view>
				<slider :value="weight" min="20" max="200" activeColor="#3498db" block-size="24" :show-value="true"
					@change="e => weight = e.detail.value" />
				<view class="scale-indicators">
					<text>20kg</text>
					<text>200kg</text>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button class="btn calculate-btn" @click="calculateBMI">
					计算BMI
				</button>
				<button class="btn reset-btn" @click="reset">
					重置
				</button>
			</view>
		</view>

		<!-- BMI结果区域 -->
		<transition name="fade">
			<view v-if="showResult" class="card result-card">
				<view class="result-header">
					<text class="result-title">您的BMI结果</text>
					<view class="bmi-value" :class="bmiCategory.class">
						{{ bmi.toFixed(1) }}
					</view>
				</view>

				<view class="result-details">
					<view class="detail-item">
						<text class="detail-label">健康范围</text>
						<text :class="bmiCategory.class" class="detail-value">{{ bmiCategory.text }}</text>
					</view>
					<view class="tag">{{ bmiCategory.tag }}</view>
				</view>

				<text class="result-advice" :class="bmiCategory.class">{{bmiCategory.advice}}</text>

				<!-- BMI健康指示图 -->
				<view class="bmi-scale">
					<view class="scale-item underweight" :class="{'active': bmiCategory.status === 'underweight'}">
						<text>偏瘦</text>
						<text class="scale-range">小于18.5</text>
					</view>
					<view class="scale-item normal" :class="{'active': bmiCategory.status === 'normal'}">
						<text>健康</text>
						<text class="scale-range">18.5-23.9</text>
					</view>
					<view class="scale-item overweight" :class="{'active': bmiCategory.status === 'overweight'}">
						<text>超重</text>
						<text class="scale-range">24-27.9</text>
					</view>
					<view class="scale-item obese" :class="{'active': bmiCategory.status === 'obese'}">
						<text>肥胖</text>
						<text class="scale-range">≥28</text>
					</view>
				</view>
			</view>
		</transition>

		<!-- BMI表格区域 -->
		<view class="card bmi-table-card">
			<view class="table-header">
				<text class="table-title">BMI标准速查表</text>
			</view>

			<view class="table-container">
				<view class="table-row header-row">
					<text class="table-cell">年龄段</text>
					<text class="table-cell">男性标准</text>
					<text class="table-cell">女性标准</text>
					<text class="table-cell">建议</text>
				</view>
				<view class="table-row" v-for="(item, index) in filteredTableData" :key="index">
					<text class="table-cell">{{ item.ageRange }}</text>
					<text class="table-cell">{{ item.male }}</text>
					<text class="table-cell">{{ item.female }}</text>
					<text class="table-cell">{{ item.advice }}</text>
				</view>
			</view>
		</view>

		<!-- 健康知识卡片 -->
		<view class="info-card card">
			<text class="info-title">BMI健康知识</text>
			<view class="info-items">
				<text class="info-item">BMI是国际上常用的衡量人体胖瘦程度以及是否健康的一个标准</text>
				<text class="info-item">BMI = 体重(kg) / 身高(m)²</text>
				<text class="info-item">理想BMI指数范围在18.5～23.9之间</text>
				<text class="info-item">BMI指数不能完全反映体脂分布，需结合腰围、体脂率等指标综合评估</text>
				<text class="info-item">儿童和青少年的BMI标准需参考专门的年龄性别曲线图</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gender: 'male',
				height: 170,
				weight: 65,
				age: 30,
				bmi: 0,
				showResult: false,
				tableFilter: 'all',
				bmiTableData: [{
						ageRange: "18-24岁",
						male: "19-24",
						female: "18-23",
						advice: "保持健康饮食和运动习惯"
					},
					{
						ageRange: "25-34岁",
						male: "20-25",
						female: "19-24",
						advice: "注意工作压力下的饮食习惯"
					},
					{
						ageRange: "35-44岁",
						male: "21-26",
						female: "20-25",
						advice: "增加肌肉训练，预防代谢下降"
					},
					{
						ageRange: "45-54岁",
						male: "22-27",
						female: "21-26",
						advice: "关注心血管健康，控制糖分摄入"
					},
					{
						ageRange: "55-64岁",
						male: "23-28",
						female: "22-27",
						advice: "增加钙质摄入，保持适度运动"
					},
					{
						ageRange: "65岁以上",
						male: "24-29",
						female: "23-28",
						advice: "保持适度活动，注意营养均衡"
					}
				]
			}
		},
		computed: {
			bmiCategory() {
				if (!this.showResult) return {
					text: '',
					class: '',
					status: '',
					advice: '',
					tag: ''
				};

				if (this.bmi < 18.5) {
					return {
						text: '偏瘦',
						class: 'underweight-value',
						status: 'underweight',
						tag: '✨ 仙气飘飘 ✨',
						advice: '建议增加营养摄入，进行适度力量训练'
					};
				} else if (this.bmi >= 18.5 && this.bmi < 24) {
					return {
						text: '健康',
						class: 'normal-value',
						status: 'normal',
						tag: '💪 天生衣架 💪',
						advice: '继续保持良好的饮食和运动习惯'
					};
				} else if (this.bmi >= 24 && this.bmi < 28) {
					return {
						text: '超重',
						class: 'overweight-value',
						status: 'overweight',
						tag: '😎 潜力无限 😎',
						advice: '建议调整饮食结构，增加有氧运动'
					};
				} else {
					return {
						text: '肥胖',
						class: 'obese-value',
						status: 'obese',
						tag: '🐼 国宝级可爱 🐼',
						advice: '建议咨询专业医生，制定科学减重计划'
					};
				}
			},
			filteredTableData() {
				if (this.tableFilter === 'all') return this.bmiTableData;

				return this.bmiTableData.map(item => {
					if (this.tableFilter === 'male') {
						return {
							ageRange: item.ageRange,
							male: item.male,
							female: '-',
							advice: item.advice
						};
					} else {
						return {
							ageRange: item.ageRange,
							male: '-',
							female: item.female,
							advice: item.advice
						};
					}
				});
			}
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
					"测出我的体质人设是：✨ 仙气飘飘 ✨！",
					"凡尔赛时间到！测出我的体质人设是：💪 天生衣架 💪！",
					"震惊！我的体质人设居然是：🐼 国宝级可爱 🐼！",
					"「破防了…我的体质人设：『人间棉花糖』🍬」",
					"哈哈哈哈！这个体质人设测试绝了！一秒笑喷！"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/bmi/bmi',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			calculateBMI() {
				const heightInMeters = this.height / 100;
				this.bmi = this.weight / (heightInMeters * heightInMeters);
				this.showResult = true;

				// 滚动到结果区域
				setTimeout(() => {
					uni.pageScrollTo({
						selector: '.result-card',
						duration: 300
					});
				}, 100);
			},
			reset() {
				this.height = 170;
				this.weight = 65;
				this.age = 30;
				this.bmi = 0;
				this.showResult = false;
				this.tableFilter = 'all';
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f0f8ff;
		color: #2c3e50;
	}

	.container {
		padding: 24rpx;
		padding-bottom: 60rpx;
	}

	.header {
		text-align: center;
		margin-bottom: 40rpx;
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
			background: linear-gradient(to right, #3498db, #2ecc71);
			border-radius: 2px;
		}
	}

	.header .title {
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
		color: #1a6aa9;
		background: linear-gradient(135deg, #1a6aa9, #2ecc71);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.header .subtitle {
		font-size: 28rpx;
		color: #5a7a9c;
		display: block;
	}

	.card {
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 150, 0.05);
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.input-label {
		margin-bottom: 15rpx;
		color: #3498db;
		font-weight: 600;
		font-size: 32rpx;
	}

	.gender-selector {
		display: flex;
		gap: 20rpx;
		margin-top: 15rpx;
	}

	.gender-btn {
		flex: 1;
		padding: 20rpx;
		border: 2rpx solid #e0f0ff;
		border-radius: 12rpx;
		background: #f8fcff;
		font-size: 32rpx;
		font-weight: 600;
		color: #5a7a9c;
		transition: all 0.3s ease;
	}

	.gender-btn.active {
		background: linear-gradient(135deg, #3498db, #2ecc71);
		color: white;
		border-color: #3498db;
		box-shadow: 0 5rpx 20rpx rgba(52, 152, 219, 0.2);
	}

	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.slider-value {
		font-weight: bold;
		color: #3498db;
		font-size: 36rpx;
	}

	.scale-indicators {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;
		font-size: 28rpx;
		color: #95a5a6;
	}

	.action-buttons {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.btn {
		flex: 1;
		padding: 20rpx;
		border-radius: 15rpx;
		font-size: 36rpx;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.calculate-btn {
		background: linear-gradient(135deg, #3498db, #1a6aa9);
		color: white;
		box-shadow: 0 5rpx 15rpx rgba(52, 152, 219, 0.2);
	}

	.reset-btn {
		background: #f5f7fa;
		color: #7f8c8d;
		border: 2rpx solid #e0e7ff;
	}

	/* 结果区域样式 */
	.result-card {
		background: linear-gradient(135deg, #f8fdff, #ffffff);
		border: 2rpx solid #e1f7ff;
	}

	.result-header {
		text-align: center;
		margin-bottom: 30rpx;
	}

	.result-title {
		font-size: 40rpx;
		color: #2c3e50;
		font-weight: bold;
		display: block;
		margin-bottom: 20rpx;
	}

	.bmi-value {
		width: 200rpx;
		height: 200rpx;
		margin: 0 auto;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 60rpx;
		font-weight: 800;
		color: white;
		box-shadow: 0 6rpx 20rpx rgba(46, 204, 113, 0.15);
		margin-bottom: 40rpx;
		animation: pulse 2s infinite;
	}

	.underweight-value {
		background: linear-gradient(135deg, #3498db, #2ecc71);
	}

	.normal-value {
		background: linear-gradient(135deg, #2ecc71, #27ae60);
	}

	.overweight-value {
		background: linear-gradient(135deg, #f1c40f, #f39c12);
	}

	.obese-value {
		background: linear-gradient(135deg, #e67e22, #e74c3c);
	}

	.result-details {
		background: #f8fdff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;

		.tag {
			font-size: 28px;
			color: #ff6b6b;
			margin: 10px auto;
			display: flex;
			justify-content: center;
			justify-items: center;
		}
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 25rpx;
		font-size: 32rpx;
	}

	.detail-label {
		color: #7f8c8d;
	}

	.detail-value {
		font-weight: 500;
		padding: 0px 20rpx;
		color: #fff;
	}

	.result-advice {
		display: block;
		background: #f9f9f9;
		padding: 30rpx;
		border-radius: 16rpx;
		font-size: 34rpx;
		line-height: 1.6;
		margin-bottom: 40rpx;
		border-left: 8rpx solid #3498db;
	}

	.underweight-value+.result-advice {
		border-left-color: #3498db;
	}

	.normal-value+.result-advice {
		border-left-color: #2ecc71;
	}

	.overweight-value+.result-advice {
		border-left-color: #f39c12;
	}

	.obese-value+.result-advice {
		border-left-color: #e74c3c;
	}

	/* BMI健康指示图 */
	.bmi-scale {
		display: flex;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.scale-item {
		flex: 1;
		text-align: center;
		padding: 25rpx 0;
		font-size: 28rpx;
		position: relative;
	}

	.scale-item::after {
		content: '';
		position: absolute;
		right: 0;
		top: 10rpx;
		bottom: 10rpx;
		width: 2rpx;
		background: rgba(255, 255, 255, 0.5);
	}

	.scale-item:last-child::after {
		display: none;
	}

	.scale-range {
		font-size: 26rpx;
		display: block;
		margin-top: 8rpx;
	}

	.active.scale-item {
		transform: scale(1.05);
		z-index: 2;
		font-weight: bold;
		border-radius: 14rpx;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
	}

	.underweight {
		background: #e1f4ff;
	}

	.normal {
		background: #e5f9ee;
	}

	.overweight {
		background: #fef7e3;
	}

	.obese {
		background: #ffebeb;
	}

	.active.underweight {
		background: linear-gradient(135deg, #a5d8ff, #6ac8ff);
		color: #1a6aa9;
	}

	.active.normal {
		background: linear-gradient(135deg, #a0e7c1, #5ad3a1);
		color: #117a3e;
	}

	.active.overweight {
		background: linear-gradient(135deg, #ffdf6f, #ffc244);
		color: #9d6e10;
	}

	.active.obese {
		background: linear-gradient(135deg, #ff9e80, #ff7043);
		color: #b53e1b;
	}

	/* BMI表格样式 */
	.bmi-table-card {
		background: linear-gradient(to bottom, #ffffff, #f8fcff);
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		flex-wrap: wrap;
	}

	.table-title {
		color: #1a6aa9;
		font-size: 36rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
	}

	.table-filter {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-top: 15rpx;
	}

	.filter-btn {
		padding: 16rpx 25rpx;
		border-radius: 25rpx;
		background: #eef7ff;
		border: 2rpx solid #cce4ff;
		color: #5a7a9c;
		font-size: 28rpx;
		font-weight: 500;
	}

	.filter-btn.active {
		background: linear-gradient(135deg, #3498db, #2ecc71);
		color: white;
		border-color: #3498db;
	}

	.table-container {
		background: #f8fdff;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.table-row {
		display: flex;
		border-bottom: 2rpx solid #e0f2ff;
		padding: 22rpx 15rpx;
	}

	.header-row {
		background: #e6f4ff;
		font-weight: bold;
		color: #1a6aa9;
		border-bottom: 2rpx solid #c5e3ff;
	}

	.table-cell {
		flex: 1;
		text-align: center;
		font-size: 30rpx;
		padding: 12rpx 5rpx;
	}

	/* 健康知识卡片 */
	.info-card {
		background: linear-gradient(135deg, #f0faff, #ffffff);
		border: 2rpx solid #e1f7ff;
	}

	.info-title {
		display: block;
		color: #1a6aa9;
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.info-items {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}

	.info-item {
		padding-left: 40rpx;
		position: relative;
		font-size: 30rpx;
		line-height: 1.6;
		color: #34495e;
	}

	.info-item::before {
		content: '•';
		position: absolute;
		left: 15rpx;
		top: 0;
		color: #3498db;
		font-size: 36rpx;
	}

	/* 动画 */
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
		}

		70% {
			box-shadow: 0 0 0 20rpx rgba(52, 152, 219, 0);
		}

		100% {
			box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
		}
	}

	/* 修复方案滑块 */
	.input-group ::v-deep .uni-slider-track {
		touch-action: none;
	}
</style>