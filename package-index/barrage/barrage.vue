<template>
  <view class="settings-container">
    <view class="header">
      <text class="title">手持弹幕设置</text>
    </view>
    
    <view class="setting-card">
      <view class="setting-item">
        <text class="label">弹幕内容</text>
        <input class="input" v-model="barrageContent" placeholder="输入弹幕内容" />
      </view>
      
      <view class="setting-item">
        <text class="label">文字大小</text>
        <slider class="slider" :value="fontSize" min="20" max="100" @change="onFontSizeChange" show-value />
      </view>
      
      <view class="setting-item">
        <text class="label">滚动速度</text>
        <slider class="slider" :value="speed" min="1" max="20" @change="onSpeedChange" show-value />
      </view>
      
      <view class="setting-item">
        <text class="label">背景颜色</text>
        <view class="color-picker">
          <view 
            v-for="(color,index) in bgColors" 
            :key="index" 
            :class="['color-option', { 'selected': bgColor === color }]"
            :style="{ backgroundColor: color }"
            @click="bgColor = color"
          />
        </view>
      </view>
      
      <view class="setting-item">
        <text class="label">文字颜色</text>
        <view class="color-picker">
          <view 
            v-for="(color,index) in textColors" 
            :key="index" 
            :class="['color-option', { 'selected': textColor === color }]"
            :style="{ backgroundColor: color }"
            @click="textColor = color"
          />
        </view>
      </view>
      
      <view class="setting-item">
        <text class="label">展示方向</text>
        <view class="direction-options">
          <view 
            :class="['option', { 'selected': direction === 'horizontal' }]"
            @click="direction = 'horizontal'"
          >
            <uni-icons type="reload" size="20" color="#333" />
            <text>横屏滚动</text>
          </view>
          <view 
            :class="['option', { 'selected': direction === 'vertical' }]"
            @click="direction = 'vertical'"
          >
            <uni-icons type="reload" size="20" color="#333" />
            <text>竖排滚动</text>
          </view>
        </view>
      </view>
    </view>
    
    <button class="show-btn" @click="showBarrage">展示弹幕</button>
    
    <!-- 预览区域 -->
    <view class="preview-container">
      <text class="preview-title">预览效果</text>
      <view class="preview" :style="{ backgroundColor: bgColor }">
        <text 
          class="preview-text" 
          :style="{
            fontSize: `${fontSize}px`,
            color: textColor,
            animation: `scroll-${direction} ${scrollDuration}s linear infinite`
          }"
        >
          {{ barrageContent || '弹幕预览' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      barrageContent: '欢迎使用手持弹幕！',
      fontSize: 48,
      speed: 10,
      bgColor: '#000000',
      textColor: '#FFD700',
      direction: 'horizontal',
      bgColors: ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFFFF'],
      textColors: ['#FFD700', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF']
    }
  },
  computed: {
    scrollDuration() {
      // 速度值越大，动画时间越短（滚动越快）
      return 30 - this.speed;
    }
  },
  methods: {
    onFontSizeChange(e) {
      this.fontSize = e.detail.value;
    },
    onSpeedChange(e) {
      this.speed = e.detail.value;
    },
    showBarrage() {
      // 跳转到弹幕展示页面并传递参数
	   // 跳转到弹幕展示页面并传递参数
		// uni.navigateTo({
		//   url: `/pages/barrage/index?content=${encodeURIComponent(this.barrageContent)}&fontSize=${this.fontSize}&speed=${this.speed}&bgColor=${this.bgColor}&textColor=${this.textColor}&direction=${this.direction}`
		// });
      this.$Router.push({
      	name: "horseRaceLamp",
		params:{
			content: this.barrageContent,
			fontSize:this.fontSize,
			speed: this.speed,
			bgColor: this.bgColor,
			textColor: this.textColor,
			direction: this.direction
			
		}
      });
    }
  }
}
</script>

<style lang="scss">
.settings-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
}

.setting-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.setting-item {
  margin-bottom: 25px;
  .label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    color: #333;
  }
  
  .input {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
  }
  
  .slider {
    margin-top: 10px;
  }
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  
  .color-option {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid transparent;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    &.selected {
      border: 2px solid #007AFF;
      transform: scale(1.1);
    }
  }
}

.direction-options {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  
  .option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    
    &.selected {
      border-color: #007AFF;
      background-color: rgba(0, 122, 255, 0.1);
      color: #007AFF;
    }
  }
}

.show-btn {
  background: linear-gradient(135deg, #007AFF, #00C6FF);
  color: white;
  border-radius: 50px;
  margin: 30px 0;
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 4px 12px rgba(0,122,255,0.3);
}

.preview-container {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  .preview-title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #333;
  }
  
  .preview {
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .preview-text {
    font-weight: bold;
    white-space: nowrap;
    position: absolute;
  }
}

@keyframes scroll-horizontal {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

@keyframes scroll-vertical {
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}
</style>