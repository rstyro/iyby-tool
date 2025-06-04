<template>
  <view class="my-container">
    <!-- 顶部用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar-container">
        <image class="user-avatar" :src="userInfo.avatar || '/static/avatar-default.png'" mode="aspectFill"></image>
        <view class="vip-badge" v-if="userInfo.isVip">VIP</view>
      </view>
      <view class="user-details">
        <text class="user-name">{{ userInfo.nickname || '未登录' }}</text>
        <text class="user-id">ID: {{ userInfo.id || '---' }}</text>
      </view>
      <view class="settings-icon" @click="navTo('/pages/settings/index')">
        <cl-icon type="icon-axingxing" size="28" color="#fff"></cl-icon>
      </view>
    </view>

    <!-- 数据统计卡片 -->
    <view class="stats-card">
      <view class="stat-item" v-for="(item, index) in statsData" :key="index" @click="handleStatClick(item.type)">
        <text class="stat-value">{{ item.value }}</text>
        <text class="stat-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 功能入口网格 -->
    <view class="function-grid">
      <view class="grid-header">
        <text class="section-title">我的服务</text>
      </view>
      <view class="grid-content">
        <block v-for="(item, index) in functions" :key="index">
          <view class="grid-item" @click="navTo(item.path)">
            <image class="grid-icon" :src="item.icon" mode="aspectFit"></image>
            <text class="grid-text">{{ item.title }}</text>
          </view>
        </block>
      </view>
    </view>

    <!-- 广告横幅 -->
    <view class="banner-section">
      <image class="banner-image" src="/static/banner-vip.jpg" mode="scaleToFill"></image>
    </view>

    <!-- 底部功能列表 -->
    <view class="function-list">
      <view class="list-item" v-for="(item, index) in listItems" :key="index" @click="navTo(item.path)">
        <cl-icon class="list-icon" :type="item.icon" size="20" color="#666"></cl-icon>
        <text class="list-text">{{ item.title }}</text>
        <cl-icon type="forward" size="18" color="#ccc"></cl-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: '/static/avatar-demo.jpg',
        nickname: '设计师小明',
        id: 'UX2023',
        isVip: true
      },
      statsData: [
        { type: 'balance', value: '1,288', label: '余额' },
        { type: 'points', value: '5,888', label: '积分' },
        { type: 'coupon', value: '12', label: '优惠券' },
        { type: 'collect', value: '36', label: '收藏' }
      ],
      functions: [
        { title: '我的订单', icon: '/static/icon-order.png', path: '/pages/order/list' },
        { title: '收货地址', icon: '/static/icon-address.png', path: '/pages/address/list' },
        { title: '客服中心', icon: '/static/icon-service.png', path: '/pages/service/index' },
        { title: '我的收藏', icon: '/static/icon-favorite.png', path: '/pages/favorite/list' },
        { title: '会员中心', icon: '/static/icon-vip.png', path: '/pages/vip/index' },
        { title: '浏览记录', icon: '/static/icon-history.png', path: '/pages/history/list' },
        { title: '我的评价', icon: '/static/icon-comment.png', path: '/pages/comment/list' },
        { title: '关于我们', icon: '/static/icon-about.png', path: '/pages/about/index' }
      ],
      listItems: [
        { title: '系统设置', icon: 'settings', path: '/pages/settings/index' },
        { title: '帮助中心', icon: 'help', path: '/pages/help/index' },
        { title: '意见反馈', icon: 'compose', path: '/pages/feedback/index' }
      ]
    }
  },
  methods: {
    navTo(path) {
      uni.navigateTo({ url: path });
    },
    handleStatClick(type) {
      switch(type) {
        case 'balance': 
          this.navTo('/pages/wallet/index');
          break;
        case 'points':
          this.navTo('/pages/points/index');
          break;
        // 其他类型处理
      }
    }
  }
}
</script>

<style lang="scss">
.my-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 30rpx;
}

.user-info-section {
  height: 320rpx;
  background: linear-gradient(135deg, #4a6bff, #8150ff);
  border-radius: 0 0 30rpx 30rpx;
  padding: 60rpx 40rpx 0;
  display: flex;
  align-items: center;
  position: relative;
  color: #fff;
  
  .user-avatar-container {
    position: relative;
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255,255,255,0.3);
      background-color: #fff;
    }
    .vip-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      background: linear-gradient(to right, #ffd700, #ffb400);
      color: #8a6100;
      font-size: 20rpx;
      padding: 4rpx 12rpx;
      border-radius: 20rpx;
      font-weight: bold;
    }
  }
  
  .user-details {
    margin-left: 30rpx;
    display: flex;
    flex-direction: column;
    .user-name {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .user-id {
      font-size: 26rpx;
      opacity: 0.9;
    }
  }
  
  .settings-icon {
    position: absolute;
    top: 60rpx;
    right: 40rpx;
    padding: 10rpx;
  }
}

.stats-card {
  background: #fff;
  border-radius: 20rpx;
  margin: -40rpx 30rpx 30rpx;
  padding: 30rpx 0;
  display: flex;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
  
  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1rpx solid #f0f0f0;
    &:last-child {
      border-right: none;
    }
    
    .stat-value {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
    .stat-label {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.function-grid {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx 30rpx;
  padding: 0 20rpx;
  
  .grid-header {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .grid-content {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;
    
    .grid-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx 0;
      
      .grid-icon {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 15rpx;
      }
      .grid-text {
        font-size: 26rpx;
        color: #555;
      }
    }
  }
}

.banner-section {
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  .banner-image {
    width: 100%;
    height: 180rpx;
    border-radius: 20rpx;
  }
}

.function-list {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx;
  
  .list-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .list-icon {
      margin-right: 20rpx;
    }
    
    .list-text {
      flex: 1;
      font-size: 30rpx;
      color: #333;
    }
  }
}
</style>