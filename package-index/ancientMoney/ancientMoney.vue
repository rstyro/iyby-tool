<template>
  <view class="container">
    <!-- 历史介绍模块 -->
    <view class="section">
      <view class="section-header">大写数字</view>
      <view class="section-content history-text">
        大写数字是中国特有的数字书写方式，利用与数字同音的汉字取代数字以防止涂改。
        据考证始于武则天时期，经朱元璋完善并沿用至今。
      </view>
    </view>

    <!-- 数字对照表 -->
    <view class="section">
      <view class="section-header">标准对照表</view>
      <view class="section-content">
        <view class="table-container">
          <view v-for="(item, index) in numList" :key="index" class="table-cell">
            <text class="digit-digit">{{ item.digit }}</text>
            <text class="digit-cn">{{ item.cn }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 转换器界面 -->
    <view class="section">
      <view class="section-header">金额转换器</view>
      <view class="section-content">
        <textarea 
          class="input-area" 
          :value="content" 
          @input="handleInput"
          placeholder="请输入阿拉伯数字（如：1234.56）"
          auto-height
        />
        <view class="action-group">
          <button type="primary" @click="convert">立即转换</button>
          <button type="default" @click="clear">清空输入</button>
        </view>
      </view>
    </view>

    <!-- 结果展示 -->
    <view class="section">
      <view class="section-header">转换结果</view>
      <view class="section-content">
        <textarea 
          class="output-area" 
          :value="result" 
          readonly
          placeholder="大写金额将显示在此处"
        />
        <view class="action-bar">
          <button type="primary" size="mini" @click="copy">复制结果</button>
          <button type="default" size="mini" @click="share">分享结果</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { convertToCnMoney, copyData } from '@/utils/Tools.js';

export default {
  data() {
    return {
      content: '',
      result: '',
      // 标准数字对照表
      numList: [
        { digit: '0', cn: '零' }, { digit: '1', cn: '壹' }, { digit: '2', cn: '贰' },
        { digit: '3', cn: '叁' }, { digit: '4', cn: '肆' }, { digit: '5', cn: '伍' },
        { digit: '6', cn: '陆' }, { digit: '7', cn: '柒' }, { digit: '8', cn: '捌' },
        { digit: '9', cn: '玖' }, { digit: '10', cn: '拾' }, { digit: '100', cn: '佰' },
        { digit: '1000', cn: '仟' }, { digit: '万', cn: '万' }, { digit: '亿', cn: '亿' }
      ]
    };
  },
  methods: {
    // 输入处理（带防抖）
    handleInput(e) {
      const value = e.detail.value;
      this.content = value;
      if (/^[\d\.]*$/.test(value)) { // 基础数字验证
        this.result = this.$t.convertToCnMoney(value);
      } else {
        uni.showToast({ title: '仅允许输入数字和小数点', icon: 'none' });
      }
    },

    // 执行转换
    convert() {
      if (!this.content) {
        uni.showToast({ title: '请输入数字内容', icon: 'none' });
        return;
      }
      this.result = this.$t.convertToCnMoney(this.content);
      uni.showToast({ title: '转换成功', icon: 'success' });
    },

    // 复制结果
    copy() {
      if (!this.result) return;
      this.$t.copyData(this.result);
      uni.showToast({ title: '已复制到剪贴板', icon: 'success' });
    },

    // 分享功能
    share() {
      uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        title: "金额大写转换器",
        summary: `转换结果：${this.result}`,
        success: () => uni.showToast({ title: "分享成功" })
      });
    },

    // 清空内容
    clear() {
      this.content = '';
      this.result = '';
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

.section-header {
  padding: 20rpx 30rpx;
  background: #f5f5f5;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
}

.section-content {
  padding: 30rpx;
}

.history-text {
  font-size: 28rpx;
  line-height: 48rpx;
  color: #555;
}

.table-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.table-cell {
  border: 1px solid #eee;
  border-radius: $border-radius;
  padding: 20rpx;
  text-align: center;
  background: #f9f9f9;
}

.digit-digit {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.digit-cn {
  display: block;
  margin-top: 10rpx;
  font-size: 28rpx;
  color: $primary-color;
}

.input-area {
  min-height: 150rpx;
  padding: 20rpx;
  border: 1px solid #eee;
  border-radius: $border-radius;
  margin-bottom: 30rpx;
  font-size: 28rpx;
}

.action-group {
  display: flex;
  justify-content: space-between;
  
  button {
    flex: 1;
    margin-right: 15rpx;
    
    &:last-child {
      margin-right: 0;
    }
  }
}

.output-area {
  min-height: 150rpx;
  padding: 20rpx;
  border: 1px solid #eee;
  border-radius: $border-radius;
  margin-bottom: 20rpx;
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}
</style>