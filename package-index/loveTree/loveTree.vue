<template>
  <view class="container">
    <!-- 全屏背景 -->
    <view class="background"></view>

    <!-- 主要内容区域 -->
    <view class="main">
      <!-- 使用抽离出的打字机组件 -->
      <cl-type-writer
          ref="typeWriter"
          :class="{show: showText}"
          :textList="params.textList"
          :typeSpeed="typeSpeed"
          :signature="params.name"
          :startDelay="300"
      @finish="onTypewriterFinish"
      class="type-writer-container"
      />

      <!-- 时间显示区域 -->
      <view v-if="params.showTime" id="clock" class="clock" :class="{show: showClock}">
        <view class="clock-content">
          <view><text class="name">{{ params.boyName }}</text>与<text class="name">{{ params.girlName }}</text>
            在一起的</view>
          <view class="time-display">
            第<text class="time-number">{{togetherTime.days}}</text>天
            <text class="time-number">{{togetherTime.hours}}</text>小时
            <text class="time-number">{{togetherTime.minutes}}</text>分钟
            <text class="time-number">{{togetherTime.seconds}}</text>秒
          </view>
        </view>
      </view>

      <!-- Canvas画布 -->
      <canvas canvas-id="loveTreeCanvas" id="loveTreeCanvas" class="canvas" @touchstart="handleCanvasTouch"
              @tap="handleCanvasTap"></canvas>
    </view>

    <!-- 背景音乐控制按钮 -->
    <view class="music-btn" @click="toggleMusic">
      <cl-icon :type="musicPlaying ? 'icon-diyinliang' : 'icon-jingyin'" color="#fff" size="20"></cl-icon>
      <view v-if="musicPlaying" class="music-wave">
        <view class="music-bar"></view>
        <view class="music-bar"></view>
        <view class="music-bar"></view>
      </view>
    </view>

    <view class="back-btn" @click="goBack">
      <cl-icon type="icon-setting" color="#fff" size="20"></cl-icon>
    </view>

  </view>
</template>

<script>
import {
  Tree
} from '@/common/LoveTree.js'

export default {
  data() {
    return {
      hold: 1,
      showText: false, // 控制打字机容器显示
      showClock: false,
      clicked: false,

      // 背景音乐相关
      musicPlaying: false, // 音乐播放状态

      // 打字速度配置
      typeSpeed: 80, // 打字速度【可自定义：50超快/80适中/120慢/180超慢】

      params: {
        title: '标题',
        time: '2021-10-28 11:39:00',
        showTime: true,
        name: '司马相如',
        boyName: '胖不了小陆',
        girlName: '她',
        textList: [
          "有一美人兮，见之不忘。",
          "一日不见兮，思之如狂。",
          "凤飞翱翔兮，四海求凰。",
          "无奈佳人兮，不在东墙。",
          "将琴代语兮，聊写衷肠。",
          "何时见许兮，慰我彷徨。",
          "愿言配德兮，携手相将。",
          "不得於飞兮，使我沦亡。",
        ],
      },
      togetherTime: {
        beginTime: '',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      animationRunning: false,
      screenWidth: 0,
      screenHeight: 0,
      treeMoved: false // 标记树是否已经移动
    }
  },
  onLoad(options) {
    // 在实例上直接挂载tree属性，不在响应式系统中
    this.tree = null;
    console.log("params1=", this.params);
    // 从URL参数中获取设置
    let query = this.$Route.query;
    if(query && query.textList){
      this.params = {
        ...query
      };
    }
    console.log("params2=", this.params);
  },
  onUnload() {
    // 页面卸载时清理定时器
    this.stopBackgroundMusic();
  },
  onReady() {
    this.getScreenSize()
    this.initCanvas()
    this.startTimer()

    // 初始绘制种子
    this.$nextTick(() => {
      setTimeout(() => {
        this.drawInitialSeed()
      }, 500)
    });
  },

  onShow() {
    // 页面显示时重新获取屏幕尺寸
    this.getScreenSize()
  },

  onResize() {
    // 屏幕旋转或尺寸变化时重新获取
    this.getScreenSize()
  },

  onShareAppMessage(res) {
    return this.generateShareConfig();
  },
  onShareTimeline() {
    return this.generateShareConfig(true);
  },
  methods: {
    // 打字机完成回调
    onTypewriterFinish() {
      // 显示时钟
      setTimeout(() => {
        this.showClock = true;
      }, 500);
    },

    generateShareConfig(isTimeline = false) {
      // 分享标题
      let title = `${this.params.boyName}和${this.params.girlName}的爱情`;
      let query = '';

      if (isTimeline) {
        // 朋友圈分享的标题
        title = `💌 ${this.params.boyName} ❤ ${this.params.girlName} 💌\n`;
        title += `相识于：${this.formatFullDateTime(this.params.time)}\n`;
        title += `留言人：${this.params.name}`;
      } else {
        // 好友分享的标题
        title = `${this.params.boyName}和${this.params.girlName}的爱情`;

        // 构建查询参数
        const params = {
          time: encodeURIComponent(this.params.time || ''),
          showTime: this.params.showTime,
          name: encodeURIComponent(this.params.name || ''),
          boyName: encodeURIComponent(this.params.boyName || ''),
          girlName: encodeURIComponent(this.params.girlName || ''),
          textList: encodeURIComponent(JSON.stringify(this.params.textList || []))
        };

        // 生成查询字符串
        query = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
      }

      // 分享图片路径
      let imageUrl = this.$const.IMAGES.SHARE_URL;

      return {
        title: title,
        path: `/package-index/loveTree/loveTree?${query}`,
        ...(isTimeline && {
          imageUrl: this.$const.IMAGES.SHARE_URL
        }),
        success: (res) => {
          uni.showToast({
            title: '分享成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('分享失败:', err);
          uni.showToast({
            title: '分享失败',
            icon: 'error'
          });
        }
      };
    },

    // 切换音乐播放状态
    toggleMusic() {
      this.musicPlaying = !this.musicPlaying
      if (this.musicPlaying) {
        this.playBackgroundMusic();
      } else {
        this.stopBackgroundMusic();
      }
    },
    // 播放背景音乐
    playBackgroundMusic() {
      try {
        if (this.musicPlaying) {
          uni.$emit('global-user-interaction');
          this.$soundManager.play("gouai");
        }
      } catch (e) {
        console.log("e", e);
      }
    },

    // 停止背景音乐
    stopBackgroundMusic() {
      try {
        this.$soundManager.stopAll()
      } catch (e) {
        console.log("e", e);
      }

    },
    goBack() {
      let page = getCurrentPages();
      if (page && page.length > 1) {
        uni.navigateBack();
      } else {
        this.$Router.push({
          name: "loveTreeIndex"
        });
      }
    },

    // ========== 文字动画方法 ==========
    async textAnimation() {
      // 先显示打字机容器
      this.showText = true;
      await this.delay(300);
      // 启动打字机组件
      if (this.$refs.typeWriter) {
        this.$refs.typeWriter.start();
      }
      await this.delay(1000);
    },

    getScreenSize() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.screenWidth = systemInfo.windowWidth
        this.screenHeight = systemInfo.windowHeight
        console.log(`屏幕尺寸: ${this.screenWidth}x${this.screenHeight}`)
      } catch (e) {
        console.error('获取屏幕尺寸失败:', e)
        // 使用默认值
        this.screenWidth = 1100
        this.screenHeight = 680
      }
    },

    delay(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },

    startTimer() {
      this.togetherTime.beginTime = this.params.time;
      // 更新在一起的时间
      setInterval(() => {
        this.timeElapse(new Date(this.togetherTime.beginTime))
      }, 1000)
    },

    initCanvas() {
      // 获取canvas上下文
      const ctx = uni.createCanvasContext('loveTreeCanvas', this)
      const width = this.screenWidth
      const height = this.screenHeight

      console.log(`初始化Canvas: ${width}x${height}`)

      // 自适应配置
      const opts = {
        seed: {
          x: width / 2,
          y: height / 2 - height * 0.1,
          color: "rgb(190, 26, 37)",
          scale: 2
        },
        // 树的枝干
        branch: [
          [535, 680, 570, 250, 500, 200, 30, 100, [
            [540, 500, 455, 417, 340, 400, 13, 100, [
              [450, 435, 434, 430, 394, 395, 2, 40]
            ]],
            [550, 445, 600, 356, 680, 345, 12, 100, [
              [578, 400, 648, 409, 661, 426, 3, 80]
            ]],
            [539, 281, 537, 248, 534, 217, 3, 40],
            [546, 397, 413, 247, 328, 244, 9, 80, [
              [427, 286, 383, 253, 371, 205, 2, 40],
              [498, 345, 435, 315, 395, 330, 4, 60]
            ]],
            [546, 357, 608, 252, 678, 221, 6, 100, [
              [590, 293, 646, 277, 648, 271, 2, 80]
            ]]
          ]]
        ],
        bloom: {
          num: 500,
          width: width,
          height: height,
        },
        footer: {
          width: width * 1.5,
          height: Math.max(5, height * 0.007),
          speed: 10,
        }
      }

      this.tree = new Tree(ctx, width, height, opts)
    },

    drawInitialSeed() {
      if (this.tree && this.tree.seed) {
        // 清空画布
        this.tree.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)
        // 绘制初始种子
        this.tree.seed.draw()
        this.tree.ctx.draw(true)
      }
    },

    async runAnimation() {
      if (this.animationRunning) return

      this.animationRunning = true

      try {
        this.playBackgroundMusic();
        // 1. 种子缩放动画
        await this.seedScaleAnimation();

        // 2. 种子下落动画
        await this.seedMoveAnimation()

        // 3. 树枝生长动画
        await this.growAnimation()

        // 4. 花朵开放动画
        await this.flowerAnimation()

        // 5. 生成快照+平滑移动树
        await this.moveTreeForText()

        // 6. 显示文字+打字机效果
        await this.textAnimation()

        // 7. 花瓣飘落动画
        await this.petalAnimation()

      } catch (error) {
        console.error('动画执行错误:', error)
        this.animationRunning = false
      }
    },

    async seedScaleAnimation() {
      const seed = this.tree.seed

      // 缩放动画
      for (let i = 0; i < 20; i++) {
        if (seed.canScale()) {
          seed.scale(0.95)
          await this.delay(30)
        } else {
          break
        }
      }
    },

    async seedMoveAnimation() {
      const seed = this.tree.seed
      const foot = this.tree.footer

      while (seed.canMove()) {
        // 清空画布
        this.tree.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight)

        seed.move(0, 8)
        foot.draw()

        await this.delay(25)
      }
    },

    async growAnimation() {
      do {
        this.tree.grow()
        this.tree.footer.draw()
        // 减慢生长速度
        await this.delay(15)
      } while (this.tree.canGrow())
    },

    async flowerAnimation() {
      console.log('开始花朵开放动画');
      const batchSize = 3;
      const delayTime = 25;
      let frameCount = 0;
      do {
        this.tree.flower(batchSize);
        await this.delay(delayTime);
        frameCount++;
        if (frameCount % 15 === 0) {
          await this.delay(80);
        }
      } while (this.tree.canFlower());
      await this.delay(1000);
      console.log('花朵开放动画完成');
    },

    // 移动树的核心方法
    async moveTreeForText() {
      if (this.treeMoved) return;
      console.log('开始执行：生成画布快照 → 平移树');
      // 1. 生成当前画布的快照
      await this.tree.createCanvasSnapshot();
      // 2. 计算要向右移动的距离
      const moveDistance = this.screenWidth * 0.25;
      // 3. 调用Tree类的平移方法
      await this.tree.moveTreeForText(moveDistance);
      // 4. 标记移动完成
      this.treeMoved = true;
      await this.delay(300);
    },

    // 花瓣动画
    async petalAnimation() {
      console.log('开始花瓣动画');
      if (this.tree.isH5) {
        const animatePetal = async () => {
          while (true) {
            if (this.tree && this.tree.isMoved) {
              // 清除画布
              this.tree.clearAll();
              // 绘制树
              this.tree.drawSnapshot();
              // 绘制花瓣
              this.tree.jump();
              // 绘制底部
              this.tree.footer.draw();
              // 统一绘制
              this.tree.ctx.draw(true);
            }
            await this.delay(25);
          }
        }
        animatePetal();
      }
    },

    // 处理canvas点击事件
    handleCanvasTap(e) {
      this.handleCanvasClick(e)
    },

    // 处理canvas触摸事件
    handleCanvasTouch(e) {
      this.handleCanvasClick(e)
    },

    // 处理点击事件
    handleCanvasClick(e) {
      if (this.clicked) return

      // 获取点击位置
      const touch = e.touches ? e.touches[0] : e
      let x = touch.x || touch.clientX
      let y = touch.y || touch.clientY

      // 在uni-app中，可能需要使用uni.createSelectorQuery获取canvas位置
      const query = uni.createSelectorQuery().in(this)
      query.select('#loveTreeCanvas').boundingClientRect(data => {
        if (data) {
          // 计算相对于canvas的点击位置
          x = touch.clientX - data.left
          y = touch.clientY - data.top

          console.log('点击位置(相对):', x, y)

          // 检查是否点击到种子
          if (this.tree && this.tree.checkClick(x, y)) {
            console.log('点击到种子，开始动画')
            this.clicked = true
            this.runAnimation()
          } else {
            console.log('未点击到种子')
          }
        }
      }).exec()
    },

    timeElapse(date) {
      let current = new Date()
      let seconds = (Date.parse(current) - Date.parse(date)) / 1000
      let days = Math.floor(seconds / (3600 * 24))
      seconds = seconds % (3600 * 24)
      let hours = Math.floor(seconds / 3600)
      if (hours < 10) {
        hours = "0" + hours
      }
      seconds = seconds % 3600
      let minutes = Math.floor(seconds / 60)
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      seconds = seconds % 60
      if (seconds < 10) {
        seconds = "0" + seconds
      }
      this.togetherTime.days = days
      this.togetherTime.hours = hours
      this.togetherTime.minutes = minutes
      this.togetherTime.seconds = seconds
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0px;
  overflow: hidden;
  background: #ffe;
  font-family: '微软雅黑', '宋体', sans-serif;
  color: #231F20;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffe 0%, #ffd6d6 100%);
  z-index: 0;
}

.main {
  position: relative;
  width: 99%;
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20rpx;
}

/* 打字机组件容器 */
.type-writer-container {
  position: absolute;
  left: 5%;
  top: 35%;
  transform: translateY(-50%);
  width: 40%;
  max-width: 50%;
  padding: 10rpx 20rpx;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 10;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.type-writer-container.show {
  opacity: 1;
}

/* 时间显示区域 */
.clock {
  position: absolute;
  left: 5%;
  top: 70%;
  width: 40%;
  max-width: 50%;
  padding: 10rpx 20rpx;
  border-radius: 15rpx;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  z-index: 10;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.clock.show {
  opacity: 1;
}

.clock-content {
  font-size: 18px;
  line-height: 1.6;
  color: #333;
}

.name {
  color: #e74c3c;
  font-weight: bold;
  margin: 0 5rpx;
}

.time-display {
  margin-top: 10px;
  font-size: 16px;
}

.time-number {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.2em;
  margin: 0 5px;
}

/* Canvas画布 */
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


.back-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(128, 0, 128, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    background: linear-gradient(135deg, #6a006a, #c23373);
  }
}


/* 背景音乐按钮样式 */
.music-btn {
  position: fixed;
  right: 20px;
  bottom: 70px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(128, 0, 128, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
  }

  /* 音乐波动画 */
  .music-wave {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;

    .music-bar {
      width: 2px;
      height: 8px;
      background-color: #fff;
      border-radius: 1px;
      animation: musicWave 1s infinite ease-in-out;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  @keyframes musicWave {

    0%,
    100% {
      height: 8px;
    }

    50% {
      height: 16px;
    }
  }
}

/* 测试按钮（可删除） */
.test-btn {
  position: fixed;
  right: 20px;
  bottom: 120px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(128, 0, 128, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
