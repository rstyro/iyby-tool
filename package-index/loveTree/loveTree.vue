<template>
  <view class="container">
    <!-- 全屏背景 -->
    <view class="background"></view>
    
    <!-- 主要内容区域 -->
    <view class="main">
      <!-- 左侧文字区域 - 还原旧版排版+原版打字机 -->
      <view id="content" class="content" :class="{show: showText}">
        <p class="text" v-for="(item, index) in params.textList" :key="index">{{ item }}</p>
        <br/>
        <br/>
        <!-- 所有文字打完才显示签名 -->
        <p><span class="space"></span> -- {{ params.name }}</p>
      </view>
      
      <!-- 时间显示区域 -->
      <view id="clock" class="clock" :class="{show: showClock}">
        <view class="clock-content">
          <view><text class="name">{{ params.boyName }}</text>与<text class="name">{{ params.girlName }}</text> 在一起的</view>
          <view class="time-display">
            第<text class="time-number">{{togetherTime.days}}</text>天
            <text class="time-number">{{togetherTime.hours}}</text>小时
            <text class="time-number">{{togetherTime.minutes}}</text>分钟
            <text class="time-number">{{togetherTime.seconds}}</text>秒
          </view>
        </view>
      </view>
      
      <!-- Canvas画布 -->
      <canvas 
        canvas-id="loveTreeCanvas" 
        id="loveTreeCanvas"
        class="canvas"
        @touchstart="handleCanvasTouch"
        @tap="handleCanvasTap"
      ></canvas>
    </view>
  </view>
</template>

<script>
import { Tree } from '@/common/LoveTree.js'

export default {
  data() {
    return {
      hold: 1,
      showText: false,
      showClock: false,
      clicked: false,
      // 只保留打字速度配置，删除原冗余的打字机变量
      typeSpeed: 80,             // 打字速度【可自定义：50超快/80适中/120慢/180超慢】
      params: {
        title: '标题',
        time: '2021-10-28 11:39:00',
        showTime: false,
        name: '司马相如',
        boyName: '小猪',
        girlName: '佩奇',
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
        beginTime: '2021-01-01 12:00:00',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      tree: null,
      animationRunning: false,
      screenWidth: 0,
      screenHeight: 0,
      treeMoved: false // 标记树是否已经移动
    }
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
    })
  },
  
  onShow() {
    // 页面显示时重新获取屏幕尺寸
    this.getScreenSize()
  },
  
  onResize() {
    // 屏幕旋转或尺寸变化时重新获取
    this.getScreenSize()
  },
  
  methods: {
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
        // 树的枝干 - 使用相对坐标，将在Tree类中根据屏幕尺寸缩放
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
        
        // 6. 显示文字+【原版打字机效果】
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
      } while (this.tree.canGrow()) // 限制最大生长次数
    },
    
    async flowerAnimation() {
      let flowerCount = 0
      do {
        this.tree.flower(5) // 每次开放更多花朵
        flowerCount++
        await this.delay(30)
      } while (this.tree.canFlower()) // 限制最大花朵开放次数
      // 花开完成后延迟一小会儿，让所有花都显示完整
      await this.delay(1000);
    },
    
    // ========== 移动树的核心方法 ==========
    async moveTreeForText() {
      if (this.treeMoved) return;
      console.log('开始执行：生成画布快照 → 平移树');
      // 1. 生成当前画布的快照（把整棵树转成图片）
      await this.tree.createCanvasSnapshot();
      // 2. 计算要向右移动的距离：屏幕宽度的40%，和原逻辑一致
      const moveDistance = this.screenWidth * 0.25;
      // 3. 调用Tree类的平移方法，执行平滑动画
      await this.tree.moveTreeForText(moveDistance);
      // 4. 标记移动完成
      this.treeMoved = true;
      await this.delay(300);
    },
    
    // ========== 核心替换：原版打字机效果 【复刻你旧代码1:1】 ==========
    typeWriter(el, speed) {
      let d = el;
      let c = d.innerHTML;
      let b = 0;
      d.innerHTML = "";
      let e = setInterval(() => {
        let f = c.substr(b, 1);
        // 兼容标签截取，防止特殊字符打断打字机
        if (f == "<") {
          b = c.indexOf(">", b) + 1;
        } else {
          b++;
        }
        // 核心：逐字拼接 + 奇偶位闪烁下划线光标(_)
        d.innerHTML = c.substring(0, b) + (b & 1 ? "_" : "");
        // 打字完成：清除定时器 + 显示签名 + 移除光标
        if (b >= c.length) {
          clearInterval(e);
          d.innerHTML = c;
        }
      }, speed);
    },

    // ========== 修改后的文字动画 - 启动【原版打字机】 ==========
    async textAnimation() {
      // 显示文字容器
      this.showText = true;
      this.$nextTick(() => {
        setTimeout(() => {
          // 获取文字容器DOM，执行原版打字机
          const contentEl = document.getElementById('content');
          this.typeWriter(contentEl, this.typeSpeed);
        }, 300);
      })
      // 延迟显示时钟，动画节奏更丝滑
      setTimeout(() => {
        this.showClock = true;
      }, 1500);
      await this.delay(1000);
    },
    
    // ========== 花瓣动画 流畅无残留 ==========
    async petalAnimation() {
      console.log('开始花瓣动画 - 流畅无残留');
      const animatePetal = async () => {
        while (true) {
          if (this.tree && this.tree.isMoved) {
              // 清除画布！这是解决花瓣重叠的核心
              this.tree.clearAll();
              // 先绘制平移后的树快照，再绘制花瓣，层级正确
              this.tree.drawSnapshot();
              //绘制飘落的花瓣
              this.tree.jump();
              // 绘制底部土地，和web版一致
              this.tree.footer.draw();
              // 统一绘制，不要滥用draw(true)
              this.tree.ctx.draw(true);
          }
          await this.delay(25);
        }
      }
      animatePetal();
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

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
	padding: 0;
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 左侧文字区域 - 还原旧版样式 */
.content {
  position: absolute;
  left: 5%;
  top: 35%;
  transform: translateY(-50%);
  width: 30%;
  max-width: 50%;
  padding: 20rpx;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  z-index: 10;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.content.show {
  opacity: 1;
}

/* 打字机诗词文本 - 原版样式 */
.text {
  font-size: 16px;
  color: #333;
}

/* 签名缩进空格 - 原版核心样式 */
.space {
  margin-right: 180px;
}

/* 签名样式 */
.signature {
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-top: 20rpx;
}

/* 时间显示区域 */
.clock {
  position: absolute;
  left: 5%;
  top: 70%;
  width: 40%;
  max-width: 50%;
  padding: 20rpx;
  border-radius: 15rpx;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
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
  margin: 0 5px;
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
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>