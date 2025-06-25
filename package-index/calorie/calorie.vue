<template>
	<view class="container">
		<view class="header">
			<text class="title">饮食热量计算器</text>
			<text class="subtitle">记录你的每一餐，掌握热量摄入，健康饮食每一天</text>
		</view>

		<!-- 添加食物卡片 -->
		<view class="card animation-fade">
			<text class="card-title">添加食物</text>

			<!-- 食物类别标签 -->
			<view class="input-group">
				<text class="input-label">食物类别</text>
				<view class="food-category">
					<view v-for="(category, index) in categories" :key="index" class="category-tag"
						:class="{active: currentCategory === category}" @click="selectCategory(category)">
						{{ category }}
					</view>
				</view>
			</view>

			<!-- 食物选择器 -->
			<view class="input-group">
				<text class="input-label">选择食物</text>
				<picker class="custom-select" :range="filteredFoods" range-key="name" @change="onFoodChange">
					<view class="picker-view">
						{{ selectedFood ? `${selectedFood.name} (${selectedFood.calories}千卡/100g)` : '请选择食物' }}
						<cl-icon type="icon-xiangxia" size="18" color="#999"></cl-icon>
					</view>
				</picker>
			</view>

			<!-- 食物份量输入 -->
			<view class="input-row">
				<!--  <view class="input-item" style="position: relative;">
          <text class="input-label">食物份量 (克)</text>
          <input 
            type="number" 
            class="custom-input" 
            v-model="foodAmount" 
            min="1" 
            placeholder="输入食物重量" 
            placeholder-style="color: #aaa;"
          />
          <text class="unit">克</text>
        </view> -->

				<view class="input-item" style="position: relative;">
					<text class="input-label">份数</text>
					<input type="number" class="custom-input" v-model="foodPortions" min="1" placeholder="输入份数"
						placeholder-style="color: #aaa;" />
				</view>
			</view>

			<button class="btn" @click="addFood">添加食物</button>
		</view>

		<!-- 已添加食物列表 -->
		<view class="card animation-fade" v-if="foodsAdded.length > 0">
			<text class="card-title">已添加食物</text>

			<view class="food-list">
				<view class="food-item" v-for="(food, index) in foodsAdded" :key="index">
					<view class="food-info">
						<text class="food-name">{{ food.name }}</text>
						<view class="food-detail">
							<!-- <text>{{ food.amount }}克 × {{ food.portions }}份</text> -->
							<text>× {{ food.portions }}份</text>
						</view>
					</view>
					<text class="food-calories">{{ food.totalCalories }}千卡</text>
					<view class="delete-btn" @click="removeFood(index)">
						<cl-icon type="icon-guanbi" size="20" color="#e74c3c" />
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态提示 -->
		<view class="card animation-fade" v-if="foodsAdded.length === 0">
			<view class="empty-tip">
				<text class="empty-icon">🍽️</text>
				<text class="empty-title">暂未添加食物</text>
				<text class="empty-desc">请在上方添加您摄入的食物</text>
			</view>
		</view>

		<!-- 结果卡片 -->
		<view class="card result-card animation-fade" :style="[resultCardStyle]" v-if="foodsAdded.length > 0">
			<text>总计摄入热量</text>
			<view class="total-calories">
				{{ totalCalories }}<text class="calories-unit">千卡</text>
			</view>
			<text class="result-text">
				<text v-if="totalCalories < 1500">热量摄入较低，建议适当增加营养摄入</text>
				<text v-else-if="totalCalories < 2000">热量摄入合理，继续保持</text>
				<text v-else>热量摄入较高，注意控制饮食</text>
			</text>
		</view>
	</view>
</template>

<script>
	// 导入数据文件
	import {
		calorieData
	} from '@/data/calorieData.js';

	export default {
		data() {
			return {
				currentCategory: '五谷类',
				categories: [
					"五谷类"
				],
				foods: [
					// 主食谷物类
					{
						name: "白米饭",
						calories: 116,
						category: "五谷类"
					},
				],
				selectedFood: null,
				foodAmount: 100,
				foodPortions: 1,
				foodsAdded: []
			}
		},
		computed: {
			filteredFoods() {
				return this.foods.filter(food => food.category === this.currentCategory);
			},
			totalCalories() {
				return this.foodsAdded.reduce((sum, food) => sum + food.totalCalories, 0);
			},
			resultCardStyle() {
				let bgStyle = '';
				if (this.totalCalories < 1500) {
					bgStyle = 'linear-gradient(135deg, #3498db, #2980b9)';
				} else if (this.totalCalories < 2000) {
					bgStyle = 'linear-gradient(135deg, #2ecc71, #27ae60)';
				} else {
					bgStyle = 'linear-gradient(135deg, #e74c3c, #c0392b)';
				}
				return {
					background:bgStyle
				}
			}
		},
		mounted() {
			// 默认选择当前类别的第一个食物
			this.selectedFood = this.filteredFoods[0];
		},
		onLoad() {
			this.categories = calorieData.categories;
			this.foods = calorieData.foods;
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
					"「减肥不用饿肚子！原来吃对就能瘦~」",
					"「本月目标：甩肉5kg！DAY7✅ 全靠这个热量计算器监督」"
				];
				const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
				return {
					title: shareContent,
					path: 'package-index/calorie/calorie',
					...(forTimeline && {
						imageUrl: this.$const.IMAGES.SHARE_URL
					})
				};
			},
			selectCategory(category) {
				this.currentCategory = category;
				this.selectedFood = this.filteredFoods[0];
			},
			onFoodChange(e) {
				const index = e.detail.value;
				this.selectedFood = this.filteredFoods[index];
			},
			addFood() {
				// if (!this.selectedFood || !this.foodAmount || this.foodAmount <= 0) {
				if (!this.selectedFood) {
					uni.showToast({
						title: '请填写有效数据',
						icon: 'none'
					});
					return;
				}

				// const totalCalories = Math.round((this.selectedFood.calories * this.foodAmount * this.foodPortions) / 100);
				const totalCalories = Math.round(this.selectedFood.calories * this.foodPortions);

				this.foodsAdded.push({
					name: this.selectedFood.name,
					amount: this.foodAmount || 1,
					portions: this.foodPortions,
					calories: this.selectedFood.calories,
					totalCalories: totalCalories
				});

				// 重置表单
				this.foodAmount = 100;
				this.foodPortions = 1;

				uni.showToast({
					title: '添加成功',
					icon: 'success'
				});
			},
			removeFood(index) {
				this.foodsAdded.splice(index, 1);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
		min-height: 100vh;
		padding: 20rpx;
		color: #333;
	}

	.header {
		text-align: center;
		padding: 60rpx 0;
		margin-bottom: 40rpx;
	}

	.title {
		font-size: 72rpx;
		color: #2c3e50;
		margin-bottom: 20rpx;
		font-weight: 600;
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.subtitle {
		font-size: 32rpx;
		color: #7f8c8d;
		margin-top: 20rpx;
		display: block;
	}

	.card {
		background: white;
		border-radius: 32rpx;
		box-shadow: 0 16rpx 60rpx rgba(0, 0, 0, 0.08);
		padding: 50rpx;
		margin-bottom: 50rpx;
		transition: all 0.3s ease;
	}

	.card:hover {
		transform: translateY(-10rpx);
		box-shadow: 0 24rpx 70rpx rgba(0, 0, 0, 0.12);
	}

	.card-title {
		font-size: 40rpx;
		color: #3498db;
		margin-bottom: 40rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.input-label {
		display: block;
		margin-bottom: 16rpx;
		font-size: 32rpx;
		color: #555;
		font-weight: 500;
	}

	.custom-select {
		width: 100%;
	}

	.picker-view {
		width: 100%;
		padding: 28rpx 30rpx;
		border-radius: 24rpx;
		border: 1px solid #e0e0e0;
		background-color: #fafafa;
		font-size: 32rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
	}

	.input-row {
		display: flex;
		gap: 30rpx;
		margin-bottom: 40rpx;
	}

	.input-item {
		flex: 1;
		position: relative;
	}

	.custom-input {
		width: 90%;
		padding: 28rpx 30rpx;
		border-radius: 24rpx;
		border: 1px solid #e0e0e0;
		background-color: #fafafa;
		font-size: 32rpx;
	}

	.unit {
		position: absolute;
		right: 30rpx;
		top: 90rpx;
		transform: translateY(-50%);
		color: #7f8c8d;
	}

	.btn {
		display: block;
		width: 100%;
		padding: 32rpx;
		background: linear-gradient(135deg, #3498db, #2980b9);
		color: white;
		border: none;
		border-radius: 24rpx;
		font-size: 36rpx;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 8rpx 30rpx rgba(52, 152, 219, 0.4);
		line-height: normal;
	}

	.btn-hover {
		transform: translateY(-4rpx);
		box-shadow: 0 12rpx 40rpx rgba(52, 152, 219, 0.5);
	}

	.btn[disabled] {
		opacity: 0.7;
	}

	.food-list {
		margin-top: 40rpx;
	}

	.food-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 36rpx 0;
		border-bottom: 1px solid #eee;
		gap: 20rpx;
	}

	.food-item:last-child {
		border-bottom: none;
	}

	.food-info {
		flex: 1;
	}

	.food-name {
		font-size: 36rpx;
		font-weight: 500;
		margin-bottom: 10rpx;
	}

	.food-detail {
		display: flex;
		color: #7f8c8d;
		font-size: 28rpx;
	}

	.food-calories {
		font-weight: 600;
		color: #e74c3c;
		font-size: 36rpx;
		margin: 0 20rpx;
	}

	.delete-btn {
		background: #f8f9fa;
		border: 1px solid #eee;
		color: #e74c3c;
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.food-category {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 30rpx;
	}

	.category-tag {
		background: #e1f0fa;
		color: #3498db;
		padding: 16rpx 30rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.category-tag.active {
		background: #3498db;
		color: white;
	}

	.result-card {
		// background: linear-gradient(135deg, #2ecc71, #27ae60);
		color: white;
		text-align: center;
		padding: 50rpx;
	}

	.total-calories {
		font-size: 96rpx;
		font-weight: 700;
		margin: 30rpx 0;
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
	}

	.calories-unit {
		font-size: 36rpx;
		opacity: 0.9;
	}

	.result-text {
		font-size: 36rpx;
		margin-top: 20rpx;
		display: block;
	}

	.empty-tip {
		text-align: center;
		padding: 80rpx 0;
		color: #95a5a6;
	}

	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
		display: block;
	}

	.empty-title {
		font-size: 36rpx;
		display: block;
		font-weight: 500;
	}

	.empty-desc {
		font-size: 32rpx;
		margin-top: 20rpx;
		display: block;
		color: #bdc3c7;
	}

	.animation-fade {
		animation: fadeIn 0.5s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.container {
			padding: 20rpx;
		}

		.card {
			padding: 40rpx 30rpx;
		}

		.title {
			font-size: 56rpx;
		}

		.input-row {
			flex-direction: column;
			gap: 30rpx;
		}

		.total-calories {
			font-size: 80rpx;
		}
	}
</style>