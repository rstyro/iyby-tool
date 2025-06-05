<template>
  <view class="container">
    <view class="header">
      <text class="title">日期计算工具</text>
      <text class="subtitle">高效处理日期相关计算</text>
    </view>

    <!-- 计算日期差 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">计算日期差</text>
      </view>
      <view class="card-body">
        <view class="form-item">
          <text class="label">开始日期:</text>
          <picker mode="date" :value="startDate" @change="startDateChange">
            <view class="picker-input">
              <text>{{ startDate || '请选择开始日期' }}</text>
              <image src="/static/calendar.png" class="calendar-icon"></image>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="label">结束日期:</text>
          <picker mode="date" :value="endDate" @change="endDateChange">
            <view class="picker-input">
              <text>{{ endDate || '请选择结束日期' }}</text>
              <image src="/static/calendar.png" class="calendar-icon"></image>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="label">相差天数:</text>
          <view class="result-box">
            <text class="result-value">{{ daysDiff }}</text>
            <text class="result-unit">天</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 时间戳转换 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">时间戳转换</text>
      </view>
      <view class="card-body">
        <view class="form-item">
          <text class="label">选择日期:</text>
          <picker mode="date" :value="timestampDate" @change="timestampDateChange">
            <view class="picker-input">
              <text>{{ timestampDate || '请选择日期' }}</text>
              <image src="/static/calendar.png" class="calendar-icon"></image>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="label">选择时间:</text>
          <picker mode="time" :value="timestampTime" @change="timestampTimeChange">
            <view class="picker-input">
              <text>{{ timestampTime || '请选择时间' }}</text>
              <image src="/static/clock.png" class="calendar-icon"></image>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="label">时间戳(毫秒):</text>
          <view class="result-box">
            <text class="result-value">{{ timestampValue }}</text>
          </view>
        </view>
        
        <button class="action-button" @click="copyTimestamp">
          <image src="/static/copy.png" class="button-icon"></image>
          <text>复制时间戳</text>
        </button>
      </view>
    </view>

    <!-- 日期加减天数 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">日期加减天数</text>
      </view>
      <view class="card-body">
        <view class="form-item">
          <text class="label">选择日期:</text>
          <picker mode="date" :value="addDate" @change="addDateChange">
            <view class="picker-input">
              <text>{{ addDate || '请选择日期' }}</text>
              <image src="/static/calendar.png" class="calendar-icon"></image>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="label">加/减天数:</text>
          <input class="input" 
            type="number" 
            v-model="addDays" 
            placeholder="负数是减,正数是加"
            @input="calculateAddDate"
          />
        </view>
        
        <view class="form-item">
          <text class="label">结果日期:</text>
          <view class="result-box">
            <text class="result-value">{{ addResultDate }}</text>
          </view>
        </view>
        
        <button class="action-button success" @click="copyAddResultDate">
          <image src="/static/copy.png" class="button-icon"></image>
          <text>复制结果日期</text>
        </button>
      </view>
    </view>
    
    <view class="footer">
      <text class="tip">提示：长按结果可以复制到剪贴板</text>
    </view>
    
    <view class="watermark">日期计算工具</view>
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
        addDays: -1,
        daysDiff: 10,
        timestampValue: '',
        addResultDate: ''
      }
    },
    mounted() {
      this.calculateDayDiff();
      this.calculateTimestamp();
      this.calculateAddDate();
    },
    methods: {
      // 日期格式化函数
      formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      },
      
      // 计算日期差
      calculateDayDiff() {
        if (!this.startDate || !this.endDate) return;
        
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        
        // 计算天数差（绝对值）
        const diffTime = Math.abs(end - start);
        this.daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      },
      
      // 计算时间戳
      calculateTimestamp() {
        if (!this.timestampDate || !this.timestampTime) return;
        
        // 合并日期和时间
        const dateTime = new Date(`${this.timestampDate} ${this.timestampTime}`);
        this.timestampValue = dateTime.getTime();
      },
      
      // 计算日期加减
      calculateAddDate() {
        if (!this.addDate || this.addDays === null) return;
        
        const date = new Date(this.addDate);
        date.setDate(date.getDate() + Number(this.addDays));
        this.addResultDate = this.formatDate(date);
      },
      
      // 复制时间戳
      copyTimestamp() {
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
  /* 基础样式 */
  
  .container {
    max-width: 800rpx;
    margin: 0 auto;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4edfe 100%);
	min-height: 100vh;
	font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
	padding: 20rpx 30rpx 60rpx;
  }
  
  .header {
  	text-align: center;
  	padding: 40rpx 0 20rpx;
  
  	.title {
  		font-size: 42rpx;
  		font-weight: bold;
  		color: #2c3e50;
  		display: block;
  	}
  
  	.subtitle {
  		font-size: 28rpx;
  		color: #7f8c8d;
  		margin-top: 10rpx;
  		display: block;
  	}
  }
  
  .card {
    background: #ffffff;
    border-radius: 24rpx;
    box-shadow: 0 10rpx 30rpx rgba(41, 121, 255, 0.1);
    margin-bottom: 40rpx;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .card-header {
    padding: 28rpx 32rpx;
  }
  
  .card-title {
    font-size: 34rpx;
    font-weight: bold;
	color: #2c3e50;
    position: relative;
    padding-left: 20rpx;
  }
  
  .card-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 34rpx;
    background: #2979ff;
    border-radius: 4rpx;
  }
  
  .card-body {
    padding: 36rpx 32rpx;
  }
  
  .form-item {
    margin-bottom: 40rpx;
  }
  
  .label {
    font-size: 30rpx;
    color: #606266;
    display: block;
    margin-bottom: 20rpx;
    font-weight: 500;
  }
  
  .picker-input {
    height: 88rpx;
    padding: 0 28rpx;
    background: #f8f9fc;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
    border: 1rpx solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .calendar-icon {
    width: 40rpx;
    height: 40rpx;
  }
  
  .input {
    height: 88rpx;
    padding: 0 28rpx;
    background: #f8f9fc;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
    border: 1rpx solid #dcdfe6;
  }
  
  .result-box {
    height: 88rpx;
    padding: 0 28rpx;
    background: #f0f7ff;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #2979ff;
    border: 1rpx solid #c2d9ff;
    display: flex;
    align-items: center;
  }
  
  .result-value {
    font-weight: bold;
    font-size: 32rpx;
  }
  
  .result-unit {
    margin-left: 15rpx;
    color: #909399;
    font-size: 28rpx;
  }
  
  .action-button {
    height: 88rpx;
    border-radius: 16rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2979ff;
    color: #fff;
    border: none;
    margin-top: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.3);
  }
  
  .action-button.success {
    background: #19be6b;
    box-shadow: 0 4rpx 12rpx rgba(25, 190, 107, 0.3);
  }
  
  .button-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 12rpx;
  }
  
  .footer {
    text-align: center;
    margin-top: 30rpx;
  }
  
  .tip {
    font-size: 26rpx;
    color: #909399;
  }
  
  .watermark {
    position: fixed;
    bottom: 40rpx;
    right: 40rpx;
    font-size: 24rpx;
    color: rgba(41, 121, 255, 0.1);
    transform: rotate(-15deg);
    z-index: -1;
    font-weight: bold;
  }
</style>