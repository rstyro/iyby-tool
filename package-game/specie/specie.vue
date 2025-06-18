<template>
  <view class="container">
    <!-- 硬币容器 -->
    <view class="coin-wrapper" :class="{ 'animate': isFlipping ,'show-front': showFront,'show-back': !showFront}"
      @animationend="handleAnimationEnd">
      <view class="coin">
        <view class="front"></view>
        <view class="back"></view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <button class="flip-btn" :disabled="isFlipping" @click="startFlip">
      {{ isFlipping ? '抛掷中...' : '抛硬币' }}
    </button>


    <!-- 结果弹窗 -->
    <u-modal :show="showResult" :content="resultText" @confirm="closeModal" @close="closeModal" :closeOnClickOverlay="true" :asyncClose="true"></u-modal>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        // frontUrl: "url('/static/images/lottery/specie1.png')",
        // backUrl: "url('/static/images/lottery/specie2.png')",
        isFlipping: false,
        showFront: true,
        showResult: false // null: 进行中, 'front': 正面, 'back': 反面
      }
    },
    computed: {
      resultText() {
        return this.showFront ? '恭喜！是正面！' : '结果是反面！'
      }
    },
    //分享
    onShareAppMessage(res) {
    	return this.generateShareConfig();
    },
    onShareTimeline() {
    	return this.generateShareConfig(true);
    },
    methods: {
    	generateShareConfig(forTimeline = false) {
    		const defaultTemplates = [
    			"抛硬币，赢福利！**正面红包，反面优惠券**，点一下看天意！100%有奖👉️",
    			"🤔 是欧皇还是非酋？抛枚硬币就知道！**不同面解锁不同惊喜福利**，快来测测！"
    		];
    		const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
    		return {
    			title: shareContent,
    			path: 'package-fun/pages/specie/specie',
    			...(forTimeline && {
    				imageUrl: this.$const.IMAGES.SHARE_URL
    			}) // 朋友圈强制要求 imageUrl [[7]]
    		};
    	},
      startFlip() {
        if (this.isFlipping) return
        this.isFlipping = true
        this.showResult = null;
        // 添加微小延迟确保动画触发
        setTimeout(() => {
          this.isFlipping = true
        }, 50);
		
		setTimeout(() => {
		  uni.$emit('global-user-interaction');
		  this.$soundManager.play("sound2");
		}, 2000);
		
      },
      handleAnimationEnd() {
        this.isFlipping = false
        this.showFront = Math.random() > 0.5;
		// 不显示弹框了
        // this.showResult = true;
      },
      
      closeModal() {
        this.showResult = false
      }
    }
  }
</script>

<style scoped>
  
  page{
     height: 100%;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    /* padding-top: 300rpx; */
    /* background: #2c3e50; */

    background: linear-gradient(to bottom right, #2c2c2c 0%, #000 100%);
  }

  /* 硬币容器 */
  .coin-wrapper {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    margin: 30px;
    perspective: 1000px;
    margin-top: 550rpx;
  }

  .coin {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  /* 3D光晕效果 */
  .coin::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 80rpx rgba(255, 215, 0, 0.4);
    opacity: 0;
    /* animation: pulse 1.3s ease-out; */

    animation: pulse 2s ease-in-out infinite;
    /* 添加infinite */
  }

  /* 添加硬币光泽效果 */
  .coin::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 0%,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%);
    opacity: 0.6;
    z-index: 2;
  }

  @keyframes pulse {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }

    50% {
      opacity: 1;
      transform: scale(1.2);
    }

    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }


  /* 正反面公共样式 */
  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    background-position: center;
    background-size: cover;
  }

  /* 正面样式 */
  .front {
    transform: rotateX(0deg);
	background-image: url('http://66dashun.xyz/static/images/lottery/specie1.png');
  }

  /* 反面样式 */
  .back {
    transform: rotateX(-180deg);
	background-image: url('http://66dashun.xyz/static/images/lottery/specie2.png');
  }

  /* 结果展示 */
  .coin-wrapper.show-front .coin {
    transform: rotateX(0deg);
    /* animation: result-bounce 0.6s ease-out; */
  }

  .coin-wrapper.show-back .coin {
    transform: rotateX(-180deg);
    /* animation: result-bounce 0.6s ease-out; */
  }

  /* 新增结果展示动画 */
  /* 结果确定后的弹跳动画 */
  @keyframes result-bounce {
    0% {
      transform: translateY(0) scale(1);
    }

    30% {
      transform: translateY(-30px) scale(1.1);
    }

    70% {
      transform: translateY(10px) scale(0.96);
    }

    100% {
      transform: translateY(0) scale(1);
    }
  }

  /* 抛硬币动画 */
  .animate {
    animation: coinFlip 1.8s ease-in-out forwards;
  }



  @keyframes coinFlip {
    0% {
      transform: translateY(0) rotateX(0deg);
      animation-timing-function: ease-out;
    }

    40% {
      transform: translateY(-500rpx) rotateX(1440deg);
      animation-timing-function: ease-in;
    }

    70% {
      transform: translateY(-200rpx) rotateX(2520deg);
      animation-timing-function: ease-out;
    }

    100% {
      transform: translateY(0) rotateX(3600deg);
    }
  }



  /* 按钮样式 */
  .flip-btn {
    margin-top: 40px;
    padding: 12px 30px;
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border-radius: 25px;
    font-size: 16px;
    transition: all 0.3s;
  }

  .flip-btn:disabled {
    opacity: 0.7;
    background: linear-gradient(45deg, #95a5a6, #7f8c8d);
  }

  .flip-btn:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  
</style>