<template>
  <view>
    <view class="cl-edit-modal" :class="{show}">
      <view class="modal-content" v-if="show">
        <view class="modal-header">
          <text class="modal-title">话题选项编辑</text>
		  <cl-icon type="icon-guanbi" size="30" color="#999" @click="closeModal" />
        </view>
        
        <scroll-view scroll-y="true" class="modal-body">
          <view class="form-container">
            <view class="form-item">
              <text class="form-label">话题名称</text>
              <input class="form-input" v-model="localData.topicName" placeholder="请输入话题名称" />
            </view>
            
            <view class="section">
              <text class="section-title">选项列表</text>
              <view class="section-actions">
                <button class="mini-btn" @click="addOption">添加选项</button>
              </view>
            </view>
            
            <view v-for="(item, index) in localData.list" :key="index" class="option-item">
              <view class="option-header">
                <text class="option-index">选项 {{index + 1}}</text>
                <cl-icon 
                  type="icon-guanbi" 
                  size="20" 
                  color="#ff4d4f" 
                  @click="removeOption(index)" 
                  class="remove-icon" />
              </view>
              <view class="form-item">
                <text class="form-label">名称</text>
                <input :maxlength="15" class="form-input" v-model="item.name" placeholder="请输入选项名称" />
              </view>
              <view class="form-item">
                <text class="form-label">描述</text>
                <textarea 
                  class="form-textarea"
                  v-model="item.desc" 
                  placeholder="请输入选项描述"
                  auto-height />
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn save" @click="save">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    data: {
      type: Object,
      required: true,
	  default: () => ({})
    }
  },
  data() {
    return {
      localData: {
        topicName: '月老给你绑的是什么红线',
        list: [{
          name: '暖阳晨曦线',
          desc: '你们的爱情如同清晨的第一缕阳光，温暖而不刺眼，总能给人带来希望与新的开始'
        }]
      }
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.localData = JSON.parse(JSON.stringify(newVal));
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    
    save() {
      this.$emit('save', JSON.parse(JSON.stringify(this.localData)));
      this.closeModal();
    },
    
    addOption() {
      this.localData.list.unshift({ name: '', desc: '' });
    },
    
    removeOption(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除此选项吗？',
        success: (res) => {
          if (res.confirm) {
            this.localData.list.splice(index, 1);
          }
        }
      });
    },
   
  }
}
</script>

<style lang="scss" scoped>
	/* 导入公共样式 */
	@import "@/common/css/cl-edit-style.scss";
</style>