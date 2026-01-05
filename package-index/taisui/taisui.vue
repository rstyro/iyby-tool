<template>
  <view class="tai-sui-container">
    <!-- 顶部标题区 -->
    <view class="header">
      <text class="header-title">太岁信息查询</text>
      <text class="header-subtitle">传统干支命理参考 · 民俗文化科普</text>
    </view>

    <!-- 查询区（卡片式） -->
    <view class="query-card">
      <view class="input-group">
        <text class="label">查询年份</text>
        <view class="input-wrap" :class="{ 'input-focus': inputFocus }">
          <input
              v-model="inputYear"
              type="number"
              placeholder="请输入年份（如2025）"
              class="year-input"
              @focus="inputFocus = true"
              @blur="handleInputBlur"
              @confirm="queryTaiSui"
              @input="handleYearInput"
          />
        </view>
      </view>

      <!-- 快捷年份：当前年前后2年 -->
      <view class="shortcut-years">
        <text
            class="shortcut-btn"
            v-for="(year, index) in shortcutYears"
            :key="index"
            @click="selectShortcutYear(year)"
            :class="{ 'active': inputYear === year }"
        >
          {{ year }}
        </text>
      </view>

      <button class="query-btn" @click="queryTaiSui" :disabled="isQuerying">
        <text class="btn-text">{{ isQuerying ? '查询中...' : '立即查询' }}</text>
      </button>
    </view>

    <!-- 结果展示区 -->
    <view
        class="result-card"
        v-if="taiSuiList.length > 0"
        :style="{ opacity: showResult ? 1 : 0, transform: showResult ? 'translateY(0)' : 'translateY(20rpx)' }"
    >
      <view class="result-header">
        <text class="result-title">
          {{ inputYear }}年
          <text class="zodiac-icon">{{ yearZodiac && yearZodiac.icon ? yearZodiac.icon : '🐾' }}</text>
          （{{ ganZhi ? ganZhi : '--' }}）太岁信息
        </text>
        <!-- 温馨提示 -->
        <text class="tips-text">以下建议为传统民俗文化参考，非迷信哦~</text>
        <view class="divider"></view>
      </view>

      <view class="result-list">
        <view
            class="result-item"
            v-for="(item, index) in taiSuiList"
            :key="index"
            :class="{
            'item-zhi': item && item.type && item.type.desc === '值太岁（本命年）',
            'item-xing': item && item.type && item.type.desc === '刑太岁',
            'item-hai': item && item.type && item.type.desc === '害太岁',
            'item-chong': item && item.type && item.type.desc === '冲太岁',
            'item-po': item && item.type && item.type.desc === '破太岁',
            'item-he': (item && item.type && item.type.desc === '三合太岁') || (item && item.type && item.type.desc === '六合太岁')
          }"
        >
          <view class="icon-wrapper">
            <text class="item-type-icon">{{ getTypeIcon(item) }}</text>
          </view>
          <view class="item-content">
            <!-- <text class="zodiac-small-icon">{{ item && item.zodiac && item.zodiac.icon ? item.zodiac.icon : '🐾' }}</text> -->
            <text class="item-desc">{{ item && item.desc ? item.desc : '--' }}</text>
            <!-- 核心修改：化解建议分行展示 -->
            <view class="advice-wrap">
              <text
                  class="advice-item"
                  v-for="(advice, idx) in splitAdvice(getTaiSuiAdvice(item))"
                  :key="idx"
              >
                {{ advice }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态/错误提示 -->
    <view class="empty-tip" v-if="hasQuery && taiSuiList.length === 0">
      <text class="empty-icon">📅</text>
      <text class="empty-text">{{ errorMsg || '暂无查询结果，请输入有效年份' }}</text>
    </view>
  </view>
</template>

<script>
// 导入工具类（确保路径正确）
import taiSuiUtils from '@/common/taiSuiUtils.js';

export default {
  name: 'TaiSuiQuery',
  data() {
    // 获取当前系统年份
    const currentYear = new Date().getFullYear();
    return {
      inputYear: currentYear,          // 默认年份改为当前年
      taiSuiList: [],                  // 太岁信息列表
      ganZhi: '',                      // 年份干支
      inputFocus: false,               // 输入框聚焦状态
      showResult: false,               // 结果展示动画开关
      hasQuery: false,                 // 是否触发过查询
      errorMsg: '',                    // 错误提示
      // 快捷年份：当前年前后2年（共5个年份）
      shortcutYears: [
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
        currentYear + 2
      ],
      yearZodiac: null,                // 查询年份的生肖信息
      isQuerying: false,               // 查询中状态
      queryTimer: null,                // 防抖定时器
      // 太岁化解建议映射表（民俗化、非迷信）
      taiSuiAdviceMap: {
        '值太岁（本命年）': '1. 可穿着红色系衣物（如红内衣、红袜子）讨个好彩头；2. 行事稳扎稳打，遇事别冲动，凡事多思虑；3. 年初可按民俗拜太岁祈福（仅作文化参考）',
        '冲太岁': '1. 遇事多换位思考、主动沟通，避免与人起争执；2. 出行多注意安全，非必要减少长途远行；3. 保持心态平和，为人处世留有余地',
        '害太岁': '1. 交友多留心，远离是非圈，避免口舌纷争；2. 理财以稳健保守为主，不盲目跟风投资；3. 日常多做力所能及的善事，积善积德',
        '刑太岁': '1. 谨言慎行，避免与人发生纠纷，凡事遵纪守法；2. 健康上多关注肠胃、关节等部位，规律作息饮食；3. 维系好家庭和睦，少计较个人得失',
        '破太岁': '1. 减少非必要大额消费，投资需谨慎，谨防破财；2. 感情里多包容理解，及时化解小矛盾；3. 定期做健康体检，日常多注意安全，防范意外',
        '六合太岁': '1. 把握好贵人运，多主动与人合作共赢；2. 适合拓展事业版图或学习新技能，提升自己；3. 做事顺势而为，能起到事半功倍的效果',
        '三合太岁': '1. 多和与自己生肖三合的人相处，借势增运；2. 适合出行拓展视野或尝试轻创业，整体运势向好；3. 保持积极乐观的心态，能让好运加倍'
      }
    };
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
        "查太岁、知宜忌，新的一年顺风顺水！小程序已存，快和朋友一起测～",
        "犯太岁分 5 种！值、冲、刑、害、破各有讲究，专业查询工具来了，查完心里有底～",
		"✨ 化太岁，迎好运，年度运势抢先看",
        "👉 查太岁，知运势，心安一整年"
      ];
      const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
      return {
        title: shareContent,
        path: 'package-index/taisui/taisui',
        ...(forTimeline && {
          imageUrl: this.$const.IMAGES.SHARE_URL
        })
      };
    },
    /**
     * 核心新增：拆分建议文本为多行（按1.2.3.分割）
     */
    splitAdvice(adviceText) {
      if (!adviceText || adviceText === '保持平常心，万事顺意~') {
        return [adviceText]; // 兜底文本不拆分
      }
      // 按“；”分割，过滤空值，去除首尾空格
      return adviceText.split('；').filter(item => item.trim()).map(item => item.trim());
    },

    /**
     * 语义化美观图标
     */
    getTypeIcon(item) {
      if (!item || !item.type || !item.type.desc) return '📿';

      const iconMap = {
        '值太岁（本命年）': '🧧', // 红包 - 本命年专属
        '冲太岁': '⚡',           // 闪电 - 相冲、冲突
        '害太岁': '⚠️',          // 警告 - 有害、注意
        '刑太岁': '⚖️',          // 法槌 - 刑克、刑律
        '破太岁': '💥',          // 爆炸 - 破损、破裂
        '六合太岁': '🤝',        // 握手 - 六合、和合
        '三合太岁': '🔱'         // 三叉戟 - 三合、祥瑞（国风替代）
      };
      return iconMap[item.type.desc] || '📿';
    },

    /**
     * 获取太岁化解建议
     */
    getTaiSuiAdvice(item) {
      if (!item || !item.type || !item.type.desc) return '保持平常心，万事顺意~';
      return this.taiSuiAdviceMap[item.type.desc] || '保持平常心，万事顺意~';
    },

    /**
     * 年份输入处理（防抖+自动补全）
     */
    handleYearInput(e) {
      try {
        const val = e.detail.value ? e.detail.value.toString().trim() : '';
        // 仅保留数字
        const numVal = val.replace(/\D/g, '');
        if (numVal.length === 2) {
          const num = Number(numVal);
          this.inputYear = num <= 50 ? 2000 + num : 1900 + num;
        } else if (numVal.length > 0) {
          this.inputYear = Number(numVal);
        }
      } catch (err) {
        console.error('年份输入处理异常：', err);
      }
    },

    /**
     * 输入框失焦处理
     */
    handleInputBlur() {
      this.inputFocus = false;
      // 空值重置为当前年
      const currentYear = new Date().getFullYear();
      if (!this.inputYear || isNaN(Number(this.inputYear))) {
        this.inputYear = currentYear;
      }
    },

    /**
     * 选择快捷年份
     */
    selectShortcutYear(year) {
      if (this.isQuerying) return;
      this.inputYear = year;
      this.queryTaiSui();
    },

    /**
     * 核心查询方法
     */
    queryTaiSui() {
      // 清除防抖定时器
      if (this.queryTimer) clearTimeout(this.queryTimer);

      this.queryTimer = setTimeout(() => {
        // 基础校验
        if (!this.inputYear || isNaN(Number(this.inputYear))) {
          this.errorMsg = '请输入有效的年份数字（如2025）';
          uni.showToast({
            title: this.errorMsg,
            icon: 'none',
            duration: 2000
          });
          return;
        }

        // 标记查询中
        this.isQuerying = true;
        this.hasQuery = true;
        this.taiSuiList = [];
        this.ganZhi = '';
        this.yearZodiac = null;
        this.errorMsg = '';
        this.showResult = false;

        try {
          // 调用工具类方法（兼容写法）
          const yearNum = Number(this.inputYear);
          this.yearZodiac = taiSuiUtils.getZodiacByYear ? taiSuiUtils.getZodiacByYear(yearNum) : null;
          this.ganZhi = taiSuiUtils.getYearGanZhi ? taiSuiUtils.getYearGanZhi(yearNum) : '';
          this.taiSuiList = taiSuiUtils.getTaiSuiInfoByYear ? taiSuiUtils.getTaiSuiInfoByYear(yearNum) : [];

          // 触发结果动画
          setTimeout(() => {
            this.showResult = true;
          }, 100);

        } catch (err) {
          console.error('查询太岁信息异常：', err);
          this.errorMsg = '查询失败，请重试';
          uni.showToast({
            title: this.errorMsg,
            icon: 'none',
            duration: 2000
          });
        } finally {
          this.isQuerying = false;
        }
      }, 200); // 200ms防抖
    }
  },
  /**
   * 页面加载时初始化
   */
  onLoad() {
    // 初始化查询当前年的太岁信息
    this.queryTaiSui();
  },
  /**
   * 页面销毁时清理定时器
   */
  onUnload() {
    if (this.queryTimer) clearTimeout(this.queryTimer);
  }
};
</script>

<style scoped lang="scss">
// 全局容器
.tai-sui-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #faf8f5, #f5f0eb);
  padding: 30rpx 24rpx;
  box-sizing: border-box;
}

// 顶部标题
.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding-top: 20rpx;

  .header-title {
    font-size: 48rpx;
    font-weight: 700;
    color: #C41E3A;
    letter-spacing: 4rpx;
    display: block;
    margin-bottom: 12rpx;
  }

  .header-subtitle {
    font-size: 24rpx;
    color: #666;
    opacity: 0.8;
    letter-spacing: 2rpx;
  }
}

// 查询卡片
.query-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 30rpx;
  transition: all 0.3s ease;

  .input-group {
    margin-bottom: 30rpx;

    .label {
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      display: block;
      margin-bottom: 12rpx;
    }

    .input-wrap {
      border: 2rpx solid #eee;
      border-radius: 12rpx;
      transition: all 0.3s ease;

      &.input-focus {
        border-color: #C41E3A;
        box-shadow: 0 0 0 4rpx rgba(196, 30, 58, 0.1);
      }

      .year-input {
        width: 100%;
        height: 88rpx;
        padding: 0 24rpx;
        font-size: 32rpx;
        color: #333;
        box-sizing: border-box;
        background: transparent;
        border: none;
        outline: none;
      }
    }
  }

  // 快捷年份样式优化（适配5个年份）
  .shortcut-years {
    display: flex;
    gap: 16rpx; // 缩小间距，适配5个年份
    margin-bottom: 36rpx;
    flex-wrap: wrap;

    .shortcut-btn {
      padding: 16rpx 24rpx; // 缩小内边距
      background: #f5f5f5;
      border-radius: 10rpx;
      font-size: 26rpx;
      color: #666;
      transition: all 0.2s ease;

      &.active {
        background: #C41E3A;
        color: #fff;
      }

      &:active:not(.active) {
        background: #C41E3A;
        color: #fff;
        transform: scale(0.95);
      }
    }
  }

  .query-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: linear-gradient(to right, #C41E3A, #E63946);
    border-radius: 12rpx;
    border: none;
    box-shadow: 0 8rpx 16rpx rgba(196, 30, 58, 0.2);
    transition: all 0.3s ease;
    opacity: 1;

    &:disabled {
      opacity: 0.7;
      background: #ccc;
      box-shadow: none;
    }

    .btn-text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 600;
      letter-spacing: 4rpx;
    }

    &:active:not(:disabled) {
      transform: translateY(4rpx);
      box-shadow: 0 4rpx 8rpx rgba(196, 30, 58, 0.2);
    }
  }
}

// 结果卡片
.result-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(20rpx);

  .result-header {
    margin-bottom: 30rpx;

    .result-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 8rpx;

      .zodiac-icon {
        font-size: 36rpx;
        margin: 0 8rpx;
        vertical-align: middle;
      }
    }

    // 温馨提示
    .tips-text {
      font-size: 22rpx;
      color: #999;
      display: block;
      margin-bottom: 16rpx;
      line-height: 1.4;
    }

    .divider {
      height: 2rpx;
      background: linear-gradient(to right, transparent, #C41E3A, transparent);
      width: 100%;
    }
  }

  .result-list {
    .result-item {
      display: flex;
      align-items: flex-start; // 顶部对齐，适配多行建议
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      font-size: 28rpx;

      &:last-child {
        border-bottom: none;
      }

      .icon-wrapper {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: #f8f8f8;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        flex-shrink: 0; // 防止图标被压缩

        .item-type-icon {
          font-size: 36rpx;
          line-height: 1;
        }
      }

      .item-content {
        flex: 1;
        display: flex;
        flex-direction: column; // 纵向排列（描述+建议）

        .zodiac-small-icon {
          font-size: 30rpx;
          margin-right: 12rpx;
          vertical-align: middle;
        }

        .item-desc {
          color: #333;
          line-height: 1.5;
          font-size: 28rpx;
          margin-bottom: 8rpx;
        }

        // 核心修改：分行建议样式
        .advice-wrap {
          padding: 12rpx;
          background: #f9f9f9;
          border-radius: 8rpx;
          margin-top: 4rpx;
        }

        .advice-item {
          font-size: 22rpx;
          color: #666;
          line-height: 1.6;
          display: block; // 强制分行
          margin-bottom: 4rpx;

          &:last-child {
            margin-bottom: 0; // 最后一行取消下间距
          }
        }
      }

      // 不同类型样式区分
      &.item-zhi {
        .icon-wrapper {
          background: rgba(196, 30, 58, 0.1);
        }

        .item-type-icon {
          color: #C41E3A;
        }

        .item-desc {
          color: #C41E3A;
          font-weight: 600;
        }
      }

      &.item-xing {
        .icon-wrapper {
          background: rgba(255, 140, 0, 0.1);
        }

        .item-type-icon {
          color: #FF8C00;
        }

        .item-desc {
          color: #FF8C00;
        }
      }

      &.item-hai {
        .icon-wrapper {
          background: rgba(255, 204, 0, 0.1);
        }

        .item-type-icon {
          color: #FFCC00;
        }

        .item-desc {
          color: #FFCC00;
        }
      }

      &.item-chong {
        .icon-wrapper {
          background: rgba(230, 60, 60, 0.1);
        }

        .item-type-icon {
          color: #E63C3C;
        }

        .item-desc {
          color: #E63C3C;
        }
      }

      &.item-po {
        .icon-wrapper {
          background: rgba(153, 102, 255, 0.1);
        }

        .item-type-icon {
          color: #9966FF;
        }

        .item-desc {
          color: #9966FF;
        }
      }

      &.item-he {
        .icon-wrapper {
          background: rgba(46, 139, 87, 0.1);
        }

        .item-type-icon {
          color: #2E8B57;
        }

        .item-desc {
          color: #2E8B57;
        }
      }
    }
  }
}

// 空状态提示
.empty-tip {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;

  .empty-icon {
    font-size: 60rpx;
    display: block;
    margin-bottom: 20rpx;
    opacity: 0.6;
  }

  .empty-text {
    opacity: 0.8;
  }
}

// 输入框聚焦样式
.input-focus {
  border-color: #C41E3A !important;
  box-shadow: 0 0 0 4rpx rgba(196, 30, 58, 0.1);
}
</style>