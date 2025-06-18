<template>
	<view>
		<view class="cl-edit-modal" :class="{show}">
			<view class="modal-content" v-if="show">
				<view class="modal-header">
					<text class="modal-title">激情骰子编辑</text>
					<cl-icon type="icon-guanbi" size="24" color="#999" @click="closeModal" />
				</view>

				<scroll-view scroll-y="true" class="modal-body">
					<view class="form-container">
						<view class="form-item">
							<text class="form-label">主题名称</text>
							<input class="form-input" :maxlength="10" v-model="localData.version" placeholder="请输入主题名称" />
						</view>

						<view class="section">
							<text class="section-title">骰子1</text>
							<view class="section-actions">
								<button class="mini-btn" @click="addArr('arr1')">添加文案</button>
							</view>
						</view>

						<view v-for="(question, index) in localData.arr1" :key="index" class="list-item">
							<textarea class="form-textarea" :maxlength="6" v-model="localData.arr1[index]"
								placeholder="请输入文案" auto-height />
							<cl-icon type="icon-guanbi" size="20" color="#ff4d4f" @click="removeArr('arr1',index)"
								class="remove-icon" />
						</view>

						<view class="section">
							<text class="section-title">骰子2</text>
							<view class="section-actions">
								<button class="mini-btn" @click="addArr('arr2')">添加文案</button>
							</view>
						</view>

						<view v-for="(dare, index) in localData.arr2" :key="index" class="list-item">
							<textarea class="form-textarea" :maxlength="6" v-model="localData.arr2[index]"
								placeholder="请输入文案" auto-height />

							<cl-icon type="icon-guanbi" size="20" color="#ff4d4f" @click="removeArr('arr2',index)"
								class="remove-icon" />
						</view>
						
						<view class="section">
							<text class="section-title">骰子3</text>
							<view class="section-actions">
								<button class="mini-btn" @click="addArr('arr3')">添加文案</button>
							</view>
						</view>
						
						<view v-for="(dare, index) in localData.arr3" :key="index" class="list-item">
							<textarea class="form-textarea" :maxlength="6" v-model="localData.arr3[index]"
								placeholder="请输入文案" auto-height />
						
							<cl-icon type="icon-guanbi" size="20" color="#ff4d4f" @click="removeArr('arr3',index)"
								class="remove-icon" />
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
				required: true
			}
		},
		data() {
			return {
				localData: {
					version: '基础版',
					arr1: ["我"],
					arr2: ["爱"],
					arr3: ["你"]
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
			addArr(key){
				
				if(this.localData[key].length>=6){
					uni.$u.toast('最多只能添加6个');
					return;
				}
				this.localData[key].unshift('');
			},
			removeArr(key,index){
				uni.showModal({
					title: '确认删除',
					content: '确定要删除此选项吗？',
					success: (res) => {
						if (res.confirm) {
							this.localData[key].splice(index, 1);
						}
					}
				});
			},

			addArr1() {
				if(this.localData.arr1.length>=6){
					uni.$u.toast('最多只能添加6个');
					return;
				}
				this.localData.arr1.unshift('');
			},

			addArr2() {
				if(this.localData.arr2.length>=6){
					uni.$u.toast('最多只能添加6个');
					return;
				}
				this.localData.arr2.unshift('');
			},

			removeArr1(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除此选项吗？',
					success: (res) => {
						if (res.confirm) {
							this.localData.arr1.splice(index, 1);
						}
					}
				});
			},

			removeArr2(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除此选项吗？',
					success: (res) => {
						if (res.confirm) {
							this.localData.arr2.splice(index, 1);
						}
					}
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	/* 导入公共样式 */
	@import "@/common/css/cl-edit-style.scss";
	
</style>