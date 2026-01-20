<template>
  <view class="page-container">
    <!-- 简洁顶部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="main-title">关系预测计算器</text>
        <text class="sub-title">基于科学公式预测情侣关系发展时间</text>
      </view>
    </view>

    <!-- 主内容区 - 自动高度 -->
    <scroll-view class="main-content" scroll-y="true" :style="{ height: contentHeight + 'px' }">
      <view class="content-wrapper">
        <!-- 输入卡片区 -->
        <view class="input-card">
          <view class="card-title">👩 女方信息</view>

          <view class="input-item">
            <view class="label-area">
              <text class="label-text">年龄 (Af)</text>
              <text class="label-value">{{ af }} 岁</text>
            </view>
            <view class="slider-area">
              <slider
                  min="18"
                  max="39"
                  step="1"
                  :value="af"
                  activeColor="#FF6B9D"
                  backgroundColor="#E9E9E9"
                  block-color="#FF6B9D"
                  block-size="20"
                  @change="(e) => updateValue('af', e.detail.value)"
              />
              <view class="slider-range">
                <text>18岁</text>
                <text>39岁</text>
              </view>
            </view>
          </view>

          <view class="input-item">
            <view class="label-area">
              <text class="label-text">外貌评分 (Lf)</text>
              <text class="label-value">{{ lf }}/10分</text>
            </view>
            <view class="slider-area">
              <slider
                  min="1"
                  max="10"
                  step="1"
                  :value="lf"
                  activeColor="#FF6B9D"
                  backgroundColor="#E9E9E9"
                  block-color="#FF6B9D"
                  block-size="20"
                  @change="(e) => updateValue('lf', e.detail.value)"
              />
              <view class="slider-range">
                <text>1分</text>
                <text>10分</text>
              </view>
            </view>
          </view>

          <view class="input-item">
            <view class="label-area">
              <text class="label-text">性伴侣数 (Sf)</text>
              <view class="counter-control">
                <button
                    class="counter-btn minus"
                    @click="adjustSf(-1)"
                    :disabled="sf <= 0"
                >-</button>
                <view class="counter-value">{{ sf }} 人</view>
                <button
                    class="counter-btn plus"
                    @click="adjustSf(1)"
                >+</button>
              </view>
            </view>
          </view>
        </view>

        <view class="input-card">
          <view class="card-title">👨 男方信息</view>

          <view class="input-item">
            <view class="label-area">
              <text class="label-text">外貌评分 (Lm)</text>
              <text class="label-value">{{ lm }}/10分</text>
            </view>
            <view class="slider-area">
              <slider
                  min="1"
                  max="10"
                  step="1"
                  :value="lm"
                  activeColor="#4A90E2"
                  backgroundColor="#E9E9E9"
                  block-color="#4A90E2"
                  block-size="20"
                  @change="(e) => updateValue('lm', e.detail.value)"
              />
              <view class="slider-range">
                <text>1分</text>
                <text>10分</text>
              </view>
            </view>
          </view>

          <view class="input-item">
            <view class="label-area">
              <text class="label-text">资产 (Wm)</text>
              <text class="label-value">{{ formatAsset(wm) }}</text>
            </view>
            <view class="slider-area">
              <slider
                  min="0"
                  max="100"
                  step="1"
                  :value="wm"
                  activeColor="#4A90E2"
                  backgroundColor="#E9E9E9"
                  block-color="#4A90E2"
                  block-size="20"
                  @change="(e) => updateValue('wm', e.detail.value)"
              />
              <view class="slider-range">
                <text>0元</text>
                <text>1000万+</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 计算按钮 -->
        <button class="calculate-button" @click="calculate">
          <text>开始计算</text>
        </button>

        <!-- 结果展示 -->
        <view class="result-card" v-if="showResult">
          <view class="result-header">
            <text>预测结果</text>
          </view>
          <view class="result-content">
            <view class="result-main">
              <text class="days">{{ resultDays }}</text>
              <text class="unit">天</text>
            </view>
            <view class="result-conversion">
              <view class="conversion-item">
                <text>约 {{ Math.floor(resultDays / 30) }} 个月</text>
              </view>
              <view class="conversion-item">
                <text>约 {{ (resultDays / 365).toFixed(1) }} 年</text>
              </view>
            </view>
            <view class="result-desc">
              <text>预计在交往后 {{ resultDays }} 天可以发生亲密关系</text>
            </view>
          </view>
        </view>

        <!-- 公式说明 -->
        <view class="formula-card">
          <view class="formula-header">
            <text>计算公式</text>
          </view>
          <view class="formula-content">
            <text class="formula-text">[(40 - Af)² + Lf³] × 10 ÷ [(Lm² + Wm) × (Sf + 1)²]</text>
            <view class="formula-vars">
              <view class="var-item">
                <text class="var-name">Af</text>
                <text class="var-desc">女方年龄</text>
              </view>
              <view class="var-item">
                <text class="var-name">Lf</text>
                <text class="var-desc">女方外貌评分</text>
              </view>
              <view class="var-item">
                <text class="var-name">Lm</text>
                <text class="var-desc">男方外貌评分</text>
              </view>
              <view class="var-item">
                <text class="var-name">Wm</text>
                <text class="var-desc">男方资产(10万港元)</text>
              </view>
              <view class="var-item">
                <text class="var-name">Sf</text>
                <text class="var-desc">女方性伴侣数</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 示例 -->
        <view class="example-card">
          <view class="example-header">
            <text>计算示例</text>
          </view>
          <view class="example-list">
            <view class="example-item">
              <view class="example-title">案例1: 中女与帅哥（有房）</view>
              <view class="example-desc">女30岁外貌7分曾有2个伴侣，男外貌8分资产300万</view>
              <view class="example-result">计算结果: 约5.24天</view>
            </view>
            <view class="example-item">
              <view class="example-title">案例2: 女神与普通男生</view>
              <view class="example-desc">女22岁外貌9分处女，男外貌3分无资产</view>
              <view class="example-result">计算结果: 约1170天</view>
            </view>
          </view>
        </view>

        <!-- 免责声明 -->
        <view class="disclaimer">
          <text>⚠️ 免责声明：本计算器仅用于娱乐目的，根据特定公式计算得出结果。实际关系发展受多种因素影响，请勿将此结果作为真实关系发展的依据。健康的关系应基于双方的意愿和舒适度。</text>
        </view>

        <view class="bottom-space"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      af: 25, // 女方年龄
      lf: 7,  // 女方外貌评分
      lm: 7,  // 男方外貌评分
      wm: 50, // 男方资产（单位：10万港元）
      sf: 2,  // 女方性伴侣数
      resultDays: 0,
      showResult: false,
      contentHeight: 600
    };
  },
  methods: {
    updateValue(field, value) {
      this[field] = parseInt(value);
    },

    adjustSf(amount) {
      const newValue = this.sf + amount;
      if (newValue >= 0) {
        this.sf = newValue;
      }
    },

    formatAsset(value) {
      const asset = value * 10; // 转为万港元
      if (asset >= 1000) {
        return `${(asset / 1000).toFixed(1)}千万港元`;
      }
      return `${asset}万港元`;
    },

    calculate() {
      // 验证年龄
      const age = parseInt(this.af);
      if (age < 18 || age > 39) {
        uni.showToast({
          title: '女方年龄需在18-39岁之间',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 计算公式
      const numerator = (Math.pow((40 - age), 2) + Math.pow(this.lf, 3)) * 10;
      const denominator = (Math.pow(this.lm, 2) + parseFloat(this.wm)) * Math.pow((parseFloat(this.sf) + 1), 2);

      // 计算并格式化结果
      const result = numerator / denominator;
      this.resultDays = result > 1000 ? Math.round(result) : result.toFixed(2);
      this.showResult = true;

      // 平滑滚动到结果
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.result-card').boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            uni.pageScrollTo({
              duration: 300,
              scrollTop: res[0].top - 100
            });
          }
        });
      }, 100);
    },

    setContentHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      const headerHeight = 120; // 头部大约高度
      this.contentHeight = windowHeight - headerHeight;
    }
  },
  onReady() {
    this.setContentHeight();
  },
  onResize() {
    this.setContentHeight();
  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f7fa;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.page-header {
  background: white;
  padding: 30rpx 40rpx 25rpx;
  border-bottom: 1rpx solid #e8e8e8;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;

  .header-content {
    text-align: center;
  }

  .main-title {
    display: block;
    font-size: 38rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 10rpx;
  }

  .sub-title {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.main-content {
  flex: 1;
  position: relative;
}

.content-wrapper {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  max-width: 750rpx;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.input-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .card-title {
    font-size: 34rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
  }
}

.input-item {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.label-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .label-text {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
  }

  .label-value {
    font-size: 30rpx;
    color: #666;
    font-weight: 500;
  }
}

.slider-area {
  margin-top: 10rpx;
}

.slider-range {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;

  text {
    font-size: 24rpx;
    color: #999;
  }
}

.counter-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30rpx;
  margin-top: 10rpx;
}

.counter-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  font-size: 36rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background: #e0e0e0;
  }

  &.minus {
    color: #FF6B9D;
  }

  &.plus {
    color: #4A90E2;
  }

  &:disabled {
    opacity: 0.4;
  }
}

.counter-value {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
  min-width: 120rpx;
  text-align: center;
}

.calculate-button {
  background: linear-gradient(135deg, #FF6B9D 0%, #4A90E2 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 30rpx;
  font-size: 34rpx;
  font-weight: 500;
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 157, 0.3);
  margin: 20rpx 0 10rpx;

  &:active {
    opacity: 0.9;
    transform: translateY(1rpx);
  }
}

.result-card {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
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

.result-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25rpx 30rpx;
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
}

.result-content {
  padding: 40rpx 30rpx;
  text-align: center;
}

.result-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 30rpx;

  .days {
    font-size: 80rpx;
    font-weight: 700;
    color: #333;
    line-height: 1;
  }

  .unit {
    font-size: 36rpx;
    color: #666;
    margin-left: 15rpx;
  }
}

.result-conversion {
  display: flex;
  justify-content: center;
  gap: 50rpx;
  margin-bottom: 30rpx;

  .conversion-item {
    text {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.result-desc {
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;

  text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.5;
  }
}

.formula-card,
.example-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.formula-header,
.example-header {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 25rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.formula-content {
  .formula-text {
    display: block;
    font-family: 'Courier New', monospace;
    font-size: 28rpx;
    color: #333;
    background: #f8f9fa;
    padding: 25rpx;
    border-radius: 12rpx;
    text-align: center;
    line-height: 1.5;
    margin-bottom: 25rpx;
  }
}

.formula-vars {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;

  .var-item {
    display: flex;
    align-items: center;
    gap: 15rpx;

    .var-name {
      font-weight: 600;
      color: #667eea;
      font-size: 28rpx;
      min-width: 50rpx;
    }

    .var-desc {
      font-size: 26rpx;
      color: #666;
      flex: 1;
    }
  }
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.example-item {
  padding-bottom: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.example-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.example-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10rpx;
}

.example-result {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

.disclaimer {
  background: #fff8e1;
  border-radius: 12rpx;
  padding: 25rpx;
  margin-top: 10rpx;

  text {
    font-size: 24rpx;
    color: #666;
    line-height: 1.5;
  }
}

.bottom-space {
  height: 50rpx;
}

/* 响应式调整 */
@media (max-width: 750px) {
  .content-wrapper {
    padding: 20rpx;
  }

  .input-card,
  .result-card,
  .formula-card,
  .example-card {
    padding: 25rpx 20rpx;
  }

  .main-title {
    font-size: 36rpx;
  }

  .sub-title {
    font-size: 26rpx;
  }
}
</style>
