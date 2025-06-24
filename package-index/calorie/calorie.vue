<template>
  <view class="wrapper">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="logo">
        <view class="icon icon-food"></view>
        <text class="title">饮食热量计算器</text>
      </view>
      <view class="summary">
        <view class="calories-total">
          <text>今日总热量</text>
          <text class="total">{{ totalCalories }} <text class="unit">kcal</text></text>
        </view>
      </view>
    </view>
    
    <scroll-view class="container" scroll-y="true" :style="{height: containerHeight + 'px'}">
      <!-- 食物选择区域 -->
      <view class="food-selection">
        <view class="section-title">
          <text class="section-title-text">添加食物</text>
          <view class="divider"></view>
        </view>
        
        <!-- 食物分类 -->
        <scroll-view class="category-tabs" scroll-x="true" scroll-with-animation>
          <view 
            v-for="(category, index) in categories" 
            :key="index"
            :class="['tab-item', { active: currentCategory === category.name }]"
            @click="currentCategory = category.name"
          >
            <view :class="category.icon"></view>
            <text>{{ category.name }}</text>
          </view>
        </scroll-view>
        
        <!-- 食物搜索 -->
        <view class="search-box">
          <view class="icon icon-search"></view>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索食物..."
            placeholder-style="color: #999;"
          >
        </view>
        
        <!-- 食物列表 -->
        <view class="food-list">
          <view 
            v-for="(food, index) in filteredFoods" 
            :key="index"
            class="food-item"
            @click="selectFood(food)"
          >
            <view class="food-info">
              <view class="food-icon">
                <view :class="food.icon"></view>
              </view>
              <view class="food-details">
                <text class="food-name">{{ food.name }}</text>
                <text class="food-calories">{{ food.calories }} kcal/100g</text>
              </view>
            </view>
            <view class="icon icon-add"></view>
          </view>
        </view>
      </view>
      
      <!-- 食物详情和添加 -->
      <view class="food-detail" v-if="selectedFood">
        <view class="section-title">
          <text class="section-title-text">{{ selectedFood.name }}</text>
          <view class="divider"></view>
        </view>
        
        <view class="detail-content">
          <view class="food-image">
            <view :class="selectedFood.icon"></view>
          </view>
          
          <view class="calorie-info">
            <view class="info-item">
              <text>热量</text>
              <text class="info-value">{{ selectedFood.calories }} kcal/100g</text>
            </view>
            <view class="info-item">
              <text>蛋白质</text>
              <text class="info-value">{{ selectedFood.protein }}g</text>
            </view>
            <view class="info-item">
              <text>脂肪</text>
              <text class="info-value">{{ selectedFood.fat }}g</text>
            </view>
            <view class="info-item">
              <text>碳水化合物</text>
              <text class="info-value">{{ selectedFood.carbs }}g</text>
            </view>
          </view>
          
          <view class="weight-input">
            <text class="input-label">食用重量 (克)</text>
            <view class="input-group">
              <view class="btn-minus" @click="decreaseWeight">-</view>
              <input type="number" v-model.number="foodWeight" min="0" class="weight-input-field">
              <view class="btn-plus" @click="increaseWeight">+</view>
            </view>
          </view>
          
          <view class="calorie-result">
            <text>热量: </text>
            <text class="result-value">{{ calculatedCalories }} kcal</text>
          </view>
          
          <button class="btn-add" @click="addToMeal">添加到今日饮食</button>
        </view>
      </view>
      
      <!-- 已添加的食物列表 -->
      <view class="meal-list">
        <view class="section-title">
          <text class="section-title-text">今日饮食</text>
          <view class="divider"></view>
        </view>
        
        <view v-if="mealItems.length === 0" class="empty-list">
          <view class="icon icon-bowl"></view>
          <text class="empty-text">尚未添加任何食物</text>
          <text class="empty-text">请从上方添加您的饮食</text>
        </view>
        
        <view v-else>
          <view class="meal-item" v-for="(item, index) in mealItems" :key="index">
            <view class="meal-info">
              <view class="meal-icon">
                <view :class="item.icon"></view>
              </view>
              <view class="meal-details">
                <text class="meal-name">{{ item.name }}</text>
                <text class="meal-weight">{{ item.weight }}g × {{ item.caloriesPer100g }}kcal</text>
              </view>
            </view>
            <view class="meal-calories">
              <text class="calorie-count">{{ item.calories }} kcal</text>
              <view class="btn-remove" @click="removeMealItem(index)">
                <view class="icon icon-delete"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
	
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentCategory: '水果',
      searchQuery: '',
      selectedFood: null,
      foodWeight: 100,
      mealItems: [],
      containerHeight: 0,
      categories: [
        { name: '水果', icon: 'icon icon-fruit' },
        { name: '蔬菜', icon: 'icon icon-vegetable' },
        { name: '肉类', icon: 'icon icon-meat' },
        { name: '谷物', icon: 'icon icon-grain' },
        { name: '乳制品', icon: 'icon icon-dairy' },
        { name: '饮品', icon: 'icon icon-drink' }
      ],
      foods: [
        { name: '苹果', category: '水果', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, icon: 'icon icon-fruit' },
        { name: '香蕉', category: '水果', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, icon: 'icon icon-fruit' },
        { name: '橙子', category: '水果', calories: 47, protein: 0.9, fat: 0.1, carbs: 12, icon: 'icon icon-fruit' },
        { name: '番茄', category: '蔬菜', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, icon: 'icon icon-vegetable' },
        { name: '黄瓜', category: '蔬菜', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, icon: 'icon icon-vegetable' },
        { name: '西兰花', category: '蔬菜', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, icon: 'icon icon-vegetable' },
        { name: '鸡胸肉', category: '肉类', calories: 165, protein: 31, fat: 3.6, carbs: 0, icon: 'icon icon-meat' },
        { name: '牛肉', category: '肉类', calories: 250, protein: 26, fat: 17, carbs: 0, icon: 'icon icon-meat' },
        { name: '猪肉', category: '肉类', calories: 242, protein: 25, fat: 16, carbs: 0, icon: 'icon icon-meat' },
        { name: '米饭', category: '谷物', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, icon: 'icon icon-grain' },
        { name: '面包', category: '谷物', calories: 265, protein: 9, fat: 3.2, carbs: 49, icon: 'icon icon-grain' },
        { name: '牛奶', category: '乳制品', calories: 61, protein: 3.3, fat: 3.3, carbs: 4.8, icon: 'icon icon-dairy' },
        { name: '酸奶', category: '乳制品', calories: 59, protein: 3.5, fat: 1.5, carbs: 5, icon: 'icon icon-dairy' },
        { name: '橙汁', category: '饮品', calories: 45, protein: 0.7, fat: 0.2, carbs: 10, icon: 'icon icon-drink' },
        { name: '可乐', category: '饮品', calories: 42, protein: 0, fat: 0, carbs: 10.6, icon: 'icon icon-drink' }
      ]
    };
  },
  computed: {
    filteredFoods() {
      return this.foods.filter(food => {
        const categoryMatch = food.category === this.currentCategory;
        const searchMatch = food.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
      });
    },
    calculatedCalories() {
      if (!this.selectedFood) return 0;
      return Math.round(this.selectedFood.calories * this.foodWeight / 100);
    },
    totalCalories() {
      return this.mealItems.reduce((total, item) => total + item.calories, 0);
    }
  },
  mounted() {
    // 计算容器高度以适应不同屏幕
    this.calculateContainerHeight();
    
    // 添加窗口大小改变监听
    uni.onWindowResize && uni.onWindowResize(() => {
      this.calculateContainerHeight();
    });
  },
  methods: {
    calculateContainerHeight() {
      // 获取系统信息
      const info = uni.getSystemInfoSync();
      // 计算容器高度（屏幕高度 - 顶部导航高度 - 底部导航高度）
      const windowHeight = info.windowHeight;
      const query = uni.createSelectorQuery().in(this);
      
      query.select('.header').boundingClientRect(data => {
        const headerHeight = data ? data.height : 60;
        query.select('.footer').boundingClientRect(data => {
          const footerHeight = data ? data.height : 60;
          this.containerHeight = windowHeight - headerHeight - footerHeight;
        }).exec();
      }).exec();
    },
    selectFood(food) {
      this.selectedFood = food;
      this.foodWeight = 100;
      
      // 滚动到详情区域（使用uni.scrollTo）
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.food-detail').boundingClientRect(data => {
          if (data) {
            const scrollTop = data.top + 10;
            uni.pageScrollTo({
              scrollTop,
              duration: 300
            });
          }
        }).exec();
      }, 100);
    },
    increaseWeight() {
      this.foodWeight += 10;
    },
    decreaseWeight() {
      if (this.foodWeight > 10) {
        this.foodWeight -= 10;
      }
    },
    addToMeal() {
      if (!this.selectedFood || this.foodWeight <= 0) return;
      
      this.mealItems.push({
        ...this.selectedFood,
        weight: this.foodWeight,
        calories: this.calculatedCalories,
        caloriesPer100g: this.selectedFood.calories
      });
      
      // 重置选择
      this.selectedFood = null;
      this.foodWeight = 100;
      
      // 显示添加成功提示（使用uni.showToast）
      uni.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
    },
    removeMealItem(index) {
      this.mealItems.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>

.wrapper {
  min-height: 100vh;
  /* max-width: 500px; */
  margin: 0 auto;
   color: #333;
  position: relative;
  background: linear-gradient(to bottom, #fff8f0, #fff);
}

/* 图标样式 */
.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-food {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF6B35"><path d="M18.06 22.99h1.65c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.03v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/></svg>');
}

.icon-search {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
}

.icon-add {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF6B35"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>');
}

.icon-delete {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>');
}

.icon-bowl {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><path d="M21.9 5H18V2c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v3H2.1c-.6 0-1.1.5-1.1 1.1v.8c0 4.4 3.2 8.1 7.4 8.7 1.1.2 2.3.3 3.6.3s2.5-.1 3.6-.3c4.2-.6 7.4-4.3 7.4-8.7v-.8c0-.6-.5-1.1-1.1-1.1zM8 3h8v2H8V3zm8 14c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-4h10v4z"/></svg>');
}

/* 食物分类图标 */
.icon-fruit { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF9F1C"><path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/></svg>'); }
.icon-vegetable { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2371B340"><path d="M7.05 4.26l-1.61 1.61L7.05 7.5l-1.06 1.06-2.12-2.12-1.06 1.06L4.93 9.5 3.87 10.56l2.12 2.12 1.06-1.06L7.05 11.5l1.41 1.41 1.06-1.06-1.41-1.41 1.41-1.41-1.41-1.41-1.42 1.42-1.06-1.06zM18.5 3c-1.93 0-3.5 1.57-3.5 3.5 0 .61.16 1.18.43 1.68l-4.86 4.86c-.5-.27-1.07-.43-1.68-.43-1.93 0-3.5 1.57-3.5 3.5S7.57 21 9.5 21s3.5-1.57 3.5-3.5c0-.61-.16-1.18-.43-1.68l4.86-4.86c.5.27 1.07.43 1.68.43 1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zm-14 8c-.83 0-1.5.67-1.5 1.5S3.67 14 4.5 14 6 13.33 6 12.5 5.33 11 4.5 11zm14-5c.83 0 1.5.67 1.5 1.5S19.33 9 18.5 9 17 8.33 17 7.5s.67-1.5 1.5-1.5zm-14 10c-.83 0-1.5.67-1.5 1.5S3.67 19 4.5 19s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>'); }
.icon-meat { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23EF476F"><path d="M17.22 2c.55 0 1 .45 1 1v1.5c0 .55-.45 1-1 1-.32 0-.6-.15-.78-.38-.18-.23-.28-.52-.22-.82V3c0-.55.45-1 1-1zm2.78 4.5V3c0-1.1-.9-2-2-2s-2 .9-2 2v2.5c0 .56.18 1.08.5 1.5L12 12.5V22h8v-8.5l-4.5-5.5c.32-.42.5-.94.5-1.5zm-9.5 5c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1s1 .45 1 1v1.5c0 .55-.45 1-1 1zm-4.5 0c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1s1 .45 1 1v1.5c0 .55-.45 1-1 1zm-4.5 0c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1s1 .45 1 1v1.5c0 .55-.45 1-1 1z"/></svg>'); }
.icon-grain { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F8961E"><path d="M3 3v8a9 9 0 0 0 18 0V3H3zm9 12c-2.21 0-4-1.79-4-4v-1h8v1c0 2.21-1.79 4-4 4z"/></svg>'); }
.icon-dairy { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFD166"><path d="M6 2h10l4 4v14H2V6l4-4zm10 4v4h2V6h-2zm-4 0v4h2V6h-2zm-4 0v4h2V6H8zm8 6H8v8h8v-8z"/></svg>'); }
.icon-drink { background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2306AED5"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>'); }

/* 顶部导航 */
.header {
  background: linear-gradient(to right, #FF6B35, #FF9E58);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo .title {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.summary {
  display: flex;
  gap: 15px;
}

.calories-total {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
  text-align: center;
  min-width: 110px;
}

.calories-total text {
  font-size: 0.75rem;
  display: block;
  color: white;
}

.calories-total .total {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.calories-total .unit {
  font-size: 0.8rem;
}

/* 主容器 */
.container {
  padding: 20px;
}

.section-title {
  margin: 20px 0 15px;
  position: relative;
}

.section-title-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: inline-block;
  padding-right: 15px;
  background: #f8f9fa;
  position: relative;
  z-index: 2;
}

.divider {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
  z-index: 1;
}

/* 食物分类标签 */
.category-tabs {
  white-space: nowrap;
  padding: 5px 0 15px;
  margin-bottom: 10px;
}

.tab-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 70px;
  padding: 10px 5px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 10px;
}

.tab-item:last-child {
  margin-right: 0;
}

.tab-item.active {
  background: #FF6B35;
  color: white;
  box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3);
}

.tab-item text {
  font-size: 0.75rem;
  white-space: nowrap;
}

/* 搜索框 */
.search-box {
  position: relative;
  margin-bottom: 15px;
}

.search-box .icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
}

.search-box input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border-radius: 30px;
  border: 1px solid #e0e0e0;
  background: white;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #FF9E58;
  box-shadow: 0 0 0 3px rgba(255, 158, 88, 0.2);
}

/* 食物列表 */
.food-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.food-item {
  background: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.food-item:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.food-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.food-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.food-icon .icon {
  width: 24px;
  height: 24px;
}

.food-details {
  display: flex;
  flex-direction: column;
}

.food-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.food-calories {
  font-size: 0.75rem;
  color: #666;
}

.food-item .icon-add {
  opacity: 0.6;
  transition: opacity 0.3s;
}

.food-item:active .icon-add {
  opacity: 1;
}

/* 食物详情 */
.food-detail {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin: 20px 0;
}

.food-image {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.food-image .icon {
  width: 50px;
  height: 50px;
}

.calorie-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.info-item text {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.info-item .info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.weight-input {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}

.input-group {
  display: flex;
  height: 50px;
}

.weight-input-field {
  flex: 1;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-right: none;
  font-size: 1.2rem;
  outline: none;
  background: white;
}

.btn-minus, .btn-plus {
  width: 50px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-minus {
  border-radius: 8px 0 0 8px;
}

.btn-plus {
  border-radius: 0 8px 8px 0;
}

.btn-minus:active, .btn-plus:active {
  background: #e0e0e0;
}

.calorie-result {
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
}

.calorie-result text {
  color: #666;
}

.calorie-result .result-value {
  color: #FF6B35;
  font-weight: 700;
  font-size: 1.5rem;
}

.btn-add {
  display: block;
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #FF6B35, #FF9E58);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3);
  margin-top: 10px;
}

.btn-add:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 107, 53, 0.4);
}

/* 已添加的食物列表 */
.meal-list {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin: 20px 0;
}

.empty-list {
  text-align: center;
  padding: 30px 0;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-list .icon {
  width: 60px;
  height: 60px;
  opacity: 0.3;
  margin-bottom: 15px;
}

.empty-text {
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.meal-item:last-child {
  border-bottom: none;
}

.meal-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meal-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-icon .icon {
  width: 20px;
  height: 20px;
}

.meal-details {
  display: flex;
  flex-direction: column;
}

.meal-name {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 3px;
}

.meal-weight {
  font-size: 0.8rem;
  color: #888;
}

.meal-calories {
  display: flex;
  align-items: center;
  gap: 15px;
}

.calorie-count {
  font-weight: 600;
  color: #FF6B35;
}

.btn-remove {
  opacity: 0.5;
  transition: opacity 0.3s;
  padding: 5px;
}

.btn-remove:active {
  opacity: 1;
}

</style>