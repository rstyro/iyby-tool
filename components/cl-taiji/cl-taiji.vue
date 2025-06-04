<template>
  <view
    class="taiji-container"
    :style="{
      '--size': `${size}px`,
      '--primary-color': primaryColor,
      '--secondary-color': secondaryColor,
      '--duration': `${duration}s`
    }"
  >
    <view class="square">
      <view class="rect rect-one">
        <view class="inner-circle rect-one-one">
          <view class="dot rect-one-two"></view>
        </view>
      </view>
      <view class="rect rect-two">
        <view class="inner-circle rect-two-one">
          <view class="dot rect-two-two"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Taiji',
  props: {
    size: {
      type: Number,
      default: 400
    },
    primaryColor: {
      type: String,
      default: '#000'
    },
    secondaryColor: {
      type: String,
      default: '#fff'
    },
    duration: {
      type: Number,
      default: 5
    }
  }
}
</script>

<style scoped>
/* 全局变量 */
.taiji-container {
  --size: 400px;
  --primary-color: #000;
  --secondary-color: #fff;
  --duration: 5s;
  --half-size: calc(var(--size) / 2);
  --quarter-size: calc(var(--size) / 4);
  --eighth-size: calc(var(--size) / 8);

  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--size);
  height: var(--size);
}

.square {
  width: var(--size);
  height: var(--size);
  position: relative;
  transform: rotate(45deg);
  animation: rotate infinite linear var(--duration);
}

.rect {
  width: var(--size);
  height: var(--half-size);
  position: absolute;
  left: 0;
  right: 0;
}

.inner-circle {
  width: var(--half-size);
  height: var(--half-size);
  border-radius: 50%;
  position: absolute;
  z-index: 1;
}

.dot {
  width: var(--eighth-size);
  height: var(--eighth-size);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

/* 上半部分 */
.rect-one {
  top: 0;
  border-radius: var(--half-size) var(--half-size) 0 0;
  background: var(--secondary-color);
}

.rect-one-one {
  bottom: calc(var(--quarter-size) * -1);
  left: 0;
  background: var(--primary-color);
}

.rect-one-two {
  background: var(--secondary-color);
}

/* 下半部分 */
.rect-two {
  bottom: 0;
  border-radius: 0 0 var(--half-size) var(--half-size);
  background: var(--primary-color);
}

.rect-two-one {
  top: calc(var(--quarter-size) * -1);
  right: 0;
  background: var(--secondary-color);
}

.rect-two-two {
  background: var(--primary-color);
}

/* 动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>