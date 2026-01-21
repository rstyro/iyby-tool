<template>
  <view class="cl-type-writer">
    <!-- 文字区域 -->
    <view class="content" :class="{show: showContent}">
      <view class="text-line" v-for="(line, index) in displayedLines" :key="index">
        <text class="text">{{ line.text }}</text>
        <!-- 光标效果 -->
        <text v-if="line.showCursor && typing" class="cursor">_</text>
      </view>

      <!-- 签名区域 -->
      <view class="signature" v-if="showSignature">
        <text> -- {{ signature }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'cl-type-writer',
  props: {
    // 文本列表
    textList: {
      type: Array,
      default: () => [
        "有一美人兮，见之不忘。",
        "一日不见兮，思之如狂。",
        "凤飞翱翔兮，四海求凰。",
        "无奈佳人兮，不在东墙。",
        "将琴代语兮，聊写衷肠。",
        "何时见许兮，慰我彷徨。",
        "愿言配德兮，携手相将。",
        "不得於飞兮，使我沦亡。",
      ]
    },
    // 打字速度（毫秒/字符）
    typeSpeed: {
      type: Number,
      default: 80
    },
    // 行间延迟（毫秒）
    lineDelay: {
      type: Number,
      default: 100
    },
    // 是否自动开始
    autoStart: {
      type: Boolean,
      default: false
    },
    // 签名
    signature: {
      type: String,
      default: '胖不了小陆'
    },
    // 是否显示签名
    showSignatureProp: {
      type: Boolean,
      default: true
    },
    // 开始前延迟（毫秒）
    startDelay: {
      type: Number,
      default: 300
    },
    // 完成后延迟显示（毫秒）
    finishDelay: {
      type: Number,
      default: 500
    },
    // 是否自动显示内容区域
    autoShowContent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showContent: false, // 控制内容区域显示
      displayedLines: [], // 显示的行数据
      currentLineIndex: 0, // 当前行索引
      currentCharIndex: 0, // 当前字符索引
      typing: false, // 是否正在打字
      showSignature: false, // 是否显示签名
      typewriterTimer: null, // 打字机定时器
      isCompleted: false, // 是否已完成
      hasStarted: false // 是否已经开始过
    }
  },
  watch: {
    // 监听textList变化
    textList: {
      handler(newVal) {
        if (newVal && newVal.length > 0 && this.autoStart && !this.hasStarted) {
          this.resetAndStart();
        }
      },
      deep: true,
      immediate: true
    },
    // 监听autoStart变化
    autoStart(newVal) {
      if (newVal && !this.isCompleted && !this.hasStarted) {
        this.start();
      }
    }
  },
  mounted() {
    if (this.autoStart) {
      setTimeout(() => {
        this.start();
      }, this.startDelay);
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    // 开始打字机效果
    start() {
      if (this.isCompleted || this.typing) {
        console.log('打字机已经在运行或已完成');
        return;
      }

      this.hasStarted = true;

      // 自动显示内容区域
      if (this.autoShowContent) {
        this.showContent = true;
      }
      this.$emit('start');
      setTimeout(() => {
        this.startTypewriter();
      }, this.startDelay);
    },

    // 重置并重新开始
    resetAndStart() {
      this.clearTimer();
      this.reset();
      this.start();
    },

    // 重置状态
    reset() {
      this.showContent = false;
      this.displayedLines = [];
      this.currentLineIndex = 0;
      this.currentCharIndex = 0;
      this.typing = false;
      this.showSignature = false;
      this.isCompleted = false;
      this.typewriterTimer = null;
      this.hasStarted = false;
    },

    // 开始打字
    startTypewriter() {
      console.log('开始打字机效果');
      this.typing = true;
      this.displayedLines = [];
      this.currentLineIndex = 0;
      this.currentCharIndex = 0;
      this.showSignature = false;
      this.isCompleted = false;

      // 初始化第一行
      if (this.textList && this.textList.length > 0) {
        this.displayedLines.push({
          text: '',
          showCursor: true
        });
        this.typeNextCharacter();
      } else {
        console.warn('textList为空，无法开始打字机效果');
        this.$emit('finish');
        this.isCompleted = true;
      }
    },

    // 打字下一个字符
    typeNextCharacter() {
      if (this.currentLineIndex >= this.textList.length) {
        // 所有行打字完成
        this.typing = false;
        this.showSignature = this.showSignatureProp;
        this.isCompleted = true;

        // 移除最后一行的光标
        if (this.displayedLines.length > 0) {
          this.displayedLines[this.displayedLines.length - 1].showCursor = false;
        }

        // 触发完成事件
        setTimeout(() => {
          this.$emit('finish');
        }, this.finishDelay);

        return;
      }

      const currentLine = this.textList[this.currentLineIndex];

      if (this.currentCharIndex < currentLine.length) {
        // 打字进行中
        const newChar = currentLine.charAt(this.currentCharIndex);
        this.displayedLines[this.currentLineIndex].text += newChar;
        this.currentCharIndex++;

        // 触发打字事件
        this.$emit('typing', {
          lineIndex: this.currentLineIndex,
          charIndex: this.currentCharIndex,
          char: newChar,
          lineText: this.displayedLines[this.currentLineIndex].text
        });

        // 继续下一个字符
        this.typewriterTimer = setTimeout(() => {
          this.typeNextCharacter();
        }, this.typeSpeed);
      } else {
        // 当前行完成，准备下一行
        this.displayedLines[this.currentLineIndex].showCursor = false;
        this.currentLineIndex++;
        this.currentCharIndex = 0;

        // 触发行完成事件
        this.$emit('line-complete', {
          lineIndex: this.currentLineIndex - 1,
          lineText: this.textList[this.currentLineIndex - 1]
        });

        if (this.currentLineIndex < this.textList.length) {
          // 添加新行并继续
          this.displayedLines.push({
            text: '',
            showCursor: true
          });

          this.typewriterTimer = setTimeout(() => {
            this.typeNextCharacter();
          }, this.lineDelay);
        } else {
          // 所有行完成
          this.typing = false;
          this.showSignature = this.showSignatureProp;
          this.isCompleted = true;

          // 触发完成事件
          setTimeout(() => {
            this.$emit('finish');
          }, this.finishDelay);
        }
      }
    },

    // 清除定时器
    clearTimer() {
      if (this.typewriterTimer) {
        clearTimeout(this.typewriterTimer);
        this.typewriterTimer = null;
      }
    },

    // 跳过动画，立即显示所有文字
    skipAnimation() {
      this.clearTimer();
      this.typing = false;
      this.showContent = true; // 确保内容区域显示
      this.displayedLines = [];
      this.showSignature = this.showSignatureProp && this.signature !== '';
      this.isCompleted = true;

      // 直接显示所有文本
      if (this.textList && this.textList.length > 0) {
        this.textList.forEach((line, index) => {
          this.displayedLines.push({
            text: line,
            showCursor: false
          });
        });
      } else {
        console.warn('跳过动画时textList为空');
      }

      this.$emit('skip');
      this.$emit('finish');
    },

    // 暂停打字
    pause() {
      this.clearTimer();
      if (this.typing) {
        this.typing = false;
        this.$emit('pause');
      }
    },

    // 继续打字
    resume() {
      if (!this.typing && !this.isCompleted) {
        this.typing = true;
        this.$emit('resume');
        this.typeNextCharacter();
      }
    },

    // 获取当前打字进度
    getProgress() {
      if (this.textList.length === 0) return 0;

      let totalChars = 0;
      let typedChars = 0;

      this.textList.forEach(line => {
        totalChars += line.length;
      });

      // 计算已打字的字符数
      for (let i = 0; i < this.currentLineIndex; i++) {
        if (i < this.textList.length) {
          typedChars += this.textList[i].length;
        }
      }
      typedChars += this.currentCharIndex;

      return totalChars === 0 ? 0 : Math.min(100, (typedChars / totalChars) * 100);
    },

    // 手动显示内容区域
    show() {
      this.showContent = true;
    },

    // 手动隐藏内容区域
    hide() {
      this.showContent = false;
    }
  },

  // 暴露给父组件的方法
  expose: ['start', 'reset', 'skipAnimation', 'pause', 'resume', 'getProgress', 'show', 'hide']
}
</script>

<style scoped>
.cl-type-writer {
  position: relative;
  width: 100%;
}

/* 文字区域 */
.content {
  width: 100%;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.content.show {
  opacity: 1;
}

/* 文本行 */
.text-line {
  display: flex;
  align-items: center;
}

/* 打字机文字 */
.text {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  font-family: '微软雅黑', '宋体', sans-serif;
}

/* 光标效果 */
.cursor {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  animation: blink 1s infinite;
  margin-left: 2px;
}

/* 签名样式 */
.signature {
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-top: 20rpx;
  font-style: italic;
}

/* 光标闪烁动画 */
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>
