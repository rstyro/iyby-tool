<template>
	<view class="container" id="container">
		<view class="marquee">
		  <view class="marquee-body">
		    <view class="content">You spin me right round, baby. Like a record, baby.</view>
		    <view class="content">You spin me right round, baby. Like a record, baby.</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('landscape-primary'); //锁定横屏
			plus.navigator.setFullscreen(true); //隐藏状态栏(应用全屏:只能隐藏状态栏，标题栏和虚拟返回键都还可以显示)		
			// #endif
		},
		onShow() {
			
		},
		methods: {
			// 手机横屏
			    resizeScreen(){
			      // 利用 CSS3 旋转 对根容器逆时针旋转 90 度
			      const detectOrient = function () {
			        let width = document.documentElement.clientWidth,
			            height = document.documentElement.clientHeight,
			            $wrapper = document.getElementById("container"), // 这里是页面最外层元素
			            style = "";
			
			        // canvas
			        let cavMain = document.getElementById("main");
			        let cavStyle = "";
			
			        // 是否是竖屏
			        let isVertical = true;
			        if (width >= height) {
			          // 竖屏
			          style += "width:" + width + "px;"; // 注意旋转后的宽高切换
			          style += "height:" + height + "px;";
			          style += "-webkit-transform: rotate(0); transform: rotate(0);";
			
			          style += "-webkit-transform-origin: 0 0;";
			          style += "transform-origin: 0 0;";
			
			          cavStyle +=  "-webkit-transform:  scale(1); transform:  scale(1);";
			          cavStyle += "-webkit-transform-origin: 0 0;";
			          cavStyle += "transform-origin: 0 0;";
			
			          isVertical = true;
			        } else {
			          // 横屏
			          style += "width:" + height + "px;";
			          style += "height:" + width + "px;";
			          style +=
			              "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
			          // 注意旋转中点的处理
			          style +=
			              "-webkit-transform-origin: " +
			              width / 2 +
			              "px " +
			              width / 2 +
			              "px;";
			
			          cavStyle +=  "-webkit-transform:  scale(0.5); transform:  scale(0.5);";
			          cavStyle += "-webkit-transform-origin: 0 0;";
			          cavStyle += "transform-origin: 0 0;";
			
			          isVertical = false;
			        }
			        cavMain.style.cssText = cavStyle;
			        $wrapper.style.cssText = style;
			
			        // 宽高切换
			        // if(isVertical){
			        //   resetCanvasSize(width,height);
			        // }else {
			        //   resetCanvasSize(height,width);
			        // }
			      };
			      window.onresize = detectOrient;
			      detectOrient();
			    }
		}
	}
</script>

<style lang="scss" scoped>

.container { margin: 20px; }

.marquee {
  height: 25px;
  width: 420px;
  overflow: hidden;
  position: relative;
  
  .marquee-body {
    display: block;
    width: 200%;
    height: 30px;
  
    position: absolute;
    overflow: hidden;
  
    animation: marquee 5s linear infinite;
  }
  
  .content {
    float: left;
    width: 50%;
  }
  
}

@keyframes marquee {
  0% { left: 0; }
  100% { left: -100%; }
}

</style>
