<template>
	<view class="cl-edit-modal" :class="{show}">
		<view class="modal-content" v-if="show">
			<view class="modal-header">
				<text class="modal-title">飞行棋任务编辑</text>
				<cl-icon type="icon-guanbi" size="30" color="#999" @click="closeModal" />
			</view>

			<scroll-view scroll-y="true" class="modal-body">
				<view class="form-container">
					<view class="form-item">
						<text class="form-label">版本名称</text>
						<input class="form-input" v-model="localData.version" placeholder="请输入版本名称" />
					</view>

					<view class="section">
						<text class="section-title">任务列表</text>
						<view class="section-actions">
							<button class="mini-btn" @click="addTask">添加任务</button>
						</view>
					</view>

					<view v-for="(task, index) in localData.tasks" :key="index" class="list-item">
						<textarea class="form-textarea" v-model="localData.tasks[index]" placeholder="请输入任务内容"
							auto-height />

						<cl-icon type="icon-guanbi" size="20" color="#ff4d4f" @click="removeTask(index)"
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
					tasks: ["学猫叫三声", "来一张恶搞自拍"]
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

			addTask() {
				this.localData.tasks.unshift('');
			},

			removeTask(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除此任务吗？',
					success: (res) => {
						if (res.confirm) {
							this.localData.tasks.splice(index, 1);
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