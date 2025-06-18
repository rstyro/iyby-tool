<template>
	<view>
		<view class="cl-edit-modal" :class="{show}">
			<view class="modal-content" v-if="show">
				<view class="modal-header">
					<text class="modal-title">真心话大冒险编辑</text>
					<cl-icon type="icon-guanbi" size="24" color="#999" @click="closeModal" />
				</view>

				<scroll-view scroll-y="true" class="modal-body">
					<view class="form-container">
						<view class="form-item">
							<text class="form-label">主题名称</text>
							<input class="form-input" v-model="localData.version" placeholder="请输入主题名称" />
						</view>

						<view class="section">
							<text class="section-title">真心话问题</text>
							<view class="section-actions">
								<button class="mini-btn" @click="addTruthQuestion">添加问题</button>
							</view>
						</view>

						<view v-for="(question, index) in localData.truthQuestions" :key="index" class="list-item">
							<textarea class="form-textarea" v-model="localData.truthQuestions[index]"
								placeholder="请输入真心话问题" auto-height />
							<cl-icon type="icon-guanbi" size="20" color="#ff4d4f" @click="removeTruthQuestion(index)"
								class="remove-icon" />
						</view>

						<view class="section">
							<text class="section-title">大冒险挑战</text>
							<view class="section-actions">
								<button class="mini-btn" @click="addDareQuestion">添加挑战</button>
							</view>
						</view>

						<view v-for="(dare, index) in localData.dareQuestions" :key="index" class="list-item">
							<textarea class="form-textarea" v-model="localData.dareQuestions[index]"
								placeholder="请输入大冒险挑战" auto-height />

							<cl-icon type="icon-guanbi" size="20" color="#ff4d4f" @click="removeDareQuestion(index)"
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
					truthQuestions: ["你最后悔的一件事是什么"],
					dareQuestions: ["对着窗外大喊三声：我好寂寞啊！"]
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

			addTruthQuestion() {
				this.localData.truthQuestions.unshift('');
			},

			addDareQuestion() {
				this.localData.dareQuestions.unshift('');
			},

			removeTruthQuestion(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除此问题吗？',
					success: (res) => {
						if (res.confirm) {
							this.localData.truthQuestions.splice(index, 1);
						}
					}
				});
			},

			removeDareQuestion(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除此挑战吗？',
					success: (res) => {
						if (res.confirm) {
							this.localData.dareQuestions.splice(index, 1);
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