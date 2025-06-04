<template>
  <view class="container">
    <!-- 日期差计算 -->
    <view class="section">
      <view class="header">日期差计算</view>
      <view class="content">
        <view class="form-group">
          <view class="label">起始日期</view>
          <picker 
            mode="date" 
            :value="startDate" 
            @change="changeStartDate"
            class="date-picker">
            <view class="date-display">{{ range[0] }}</view>
          </picker>
        </view>

        <view class="form-group">
          <view class="label">结束日期</view>
          <picker 
            mode="date" 
            :value="endDate" 
            @change="changeEndDate"
            class="date-picker">
            <view class="date-display">{{ range[1] }}</view>
          </picker>
        </view>

        <view class="result-group">
          <text class="result-label">相差天数：</text>
          <text class="result-value">{{ params.days }}</text>
        </view>
      </view>
    </view>

    <!-- 时间戳转换 -->
    <view class="section">
      <view class="header">时间戳转换</view>
      <view class="content">
        <view class="form-group">
          <view class="label">选择日期</view>
          <picker 
            mode="date" 
            :value="timestampDate" 
            @change="changeTimestampDate"
            class="date-picker">
            <view class="date-display">{{ dateTime }}</view>
          </picker>
        </view>

        <view class="result-group">
          <text class="result-label">时间戳：</text>
          <text class="result-value">{{ params.timestampValue }}</text>
          <button type="primary" size="mini" class="copy-btn" @click="copyTimestamp">复制</button>
        </view>
      </view>
    </view>

    <!-- 日期加减 -->
    <view class="section">
      <view class="header">日期加减计算器</view>
      <view class="content">
        <view class="form-group">
          <view class="label">基准日期</view>
          <picker 
            mode="date" 
            :value="addBaseDate" 
            @change="changeAddBaseDate"
            class="date-picker">
            <view class="date-display">{{ params.addDatetime }}</view>
          </picker>
        </view>

        <view class="form-group">
          <view class="label">加减天数</view>
          <input 
            class="number-input" 
            type="number" 
            v-model="params.addDay"
            @input="updateAddResult"
            placeholder="负数为减" />
        </view>

        <view class="result-group">
          <text class="result-label">结果日期：</text>
          <text class="result-value">{{ params.addResultDatetime }}</text>
          <button type="primary" size="mini" class="copy-btn" @click="copyResultDate">复制</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { copyData, dateFormat, getDiffDay, getTimestampByDate, getDateAddOrSubDay } from '@/utils/Tools.js';

export default {
  data() {
    return {
      // 日期差计算
      range: ["2022-11-01", "2022-11-11"],
      startDate: 0,
      endDate: 10,
      
      // 时间戳转换
      timestampDate: 0,
      dateTime: '',
      
      // 日期加减
      addBaseDate: 0,
      
      // 公共参数
      params: {
        days: '10',
        timestampValue: '',
        addDatetime: '',
        addDay: '-1',
        addResultDatetime: ''
      }
    };
  },
  onLoad() {
    const now = new Date();
    this.dateTime = this.$t.dateFormat(now);
    this.params.addDatetime = this.$t.dateFormat(now);
    
    // 初始化时间戳
    this.params.timestampValue = this.$t.getTimestampByDate(this.dateTime);
    
    // 初始化日期加减
    this.params.addResultDatetime = this.$t.getDateAddOrSubDay(
      Number(this.params.addDay), 
      this.params.addDatetime
    );
    
    // 初始化日期差
    this.startDate = this.getDateIndex(this.range[0]);
    this.endDate = this.getDateIndex(this.range[1]);
  },
  methods: {
    // === 日期差相关 ===
    changeStartDate(e) {
      this.startDate = e.detail.value;
      this.range[0] = this.getDateString(e.detail.value);
      this.params.days = this.$t.getDiffDay(this.range[0], this.range[1]);
    },
    
    changeEndDate(e) {
      this.endDate = e.detail.value;
      this.range[1] = this.getDateString(e.detail.value);
      this.params.days = this.$t.getDiffDay(this.range[0], this.range[1]);
    },

    // === 时间戳相关 ===
    changeTimestampDate(e) {
      const date = this.getDateString(e.detail.value);
      this.dateTime = date;
      this.params.timestampValue = this.$t.getTimestampByDate(date);
    },

    // === 日期加减 ===
    changeAddBaseDate(e) {
      const date = this.getDateString(e.detail.value);
      this.params.addDatetime = date;
      this.updateAddResult();
    },

    updateAddResult() {
      this.params.addResultDatetime = this.$t.getDateAddOrSubDay(
        Number(this.params.addDay),
        this.params.addDatetime
      );
    },

    // === 工具方法 ===
    getDateString(index) {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return this.$t.dateFormat(date);
    },
    
    getDateIndex(dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      return Math.floor((date - today) / (1000 * 60 * 60 * 24));
    },

    // === 复制功能 ===
    copyTimestamp() {
      this.$t.copyData(this.params.timestampValue);
      uni.showToast({ title: '已复制' });
    },
    
    copyResultDate() {
      this.$t.copyData(this.params.addResultDatetime);
      uni.showToast({ title: '已复制' });
    }
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #007AFF;
$border-radius: 8rpx;

.container {
  padding: 20rpx;
  font-family: 'Microsoft Yahei';
}

.section {
  margin-bottom: 40rpx;
  background: #fff;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx 0 rgba(0,0,0,0.05);
}

.header {
  padding: 20rpx 30rpx;
  background: #f5f5f5;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
}

.content {
  padding: 30rpx;
}

.form-group {
  margin-bottom: 25rpx;
}

.label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  color: #666;
}

.date-picker {
  width: 100%;
}

.date-display {
  padding: 20rpx;
  border: 1px solid #eee;
  border-radius: $border-radius;
  color: #333;
}

.number-input {
  padding: 20rpx;
  border: 1px solid #eee;
  border-radius: $border-radius;
  font-size: 28rpx;
}

.result-group {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1px dashed #eee;
}

.result-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 15rpx;
}

.result-value {
  flex: 1;
  color: $primary-color;
  font-weight: bold;
  font-size: 30rpx;
}

.copy-btn {
  margin-left: 20rpx;
  padding: 0 25rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
}
</style>