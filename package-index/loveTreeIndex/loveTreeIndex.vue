<template>
	<view class="container">
		<!-- 顶部标题区 - 参考太岁查询页面设计 -->
		<view class="header">
			<view class="header-bg"></view>
			<text class="header-title">栽种爱情树 · 见证时光情长</text>
			<text class="header-subtitle">定制你们的专属浪漫，让爱在每一片枝叶间生长</text>
		</view>

		<view class="form-container">
			<!-- 模板选择区 -->
			<view class="form-item template-section">
				<text class="form-label">选择留言模板</text>
				<view class="template-grid">
					<view 
						v-for="(template, index) in templateList" 
						:key="index" 
						class="template-item"
						:class="{ 'active': activeTemplate === index }"
						@tap="selectTemplate(index)"
					>
						<text class="template-name">{{ template.name }}</text>
						<text class="template-desc">{{ template.description }}</text>
					</view>
				</view>
			</view>

			<!-- 留言句子列表 -->
			<view class="form-item">
				<view class="form-label-container">
					<text class="form-label">留言句子列表</text>
					<view class="template-hint" @tap="toggleShowPreview">
						<text class="hint-icon">👀</text>
						<text class="hint-text">{{ showPreview ? '隐藏' : '查看' }}模板预览</text>
					</view>
				</view>
				<text class="form-hint">（每行一句，最多8句，每句建议不超过20个字）</text>
				<textarea v-model="textListStr" placeholder="请输入留言句子，每行一句" class="textarea-field"
					@input="onTextListChange" :maxlength="-1"></textarea>
				<view class="hint-area">
					<text class="hint-text">当前{{ currentLineCount }}句，{{ currentWordCount }}/20字</text>
					<text v-if="currentLineCount > 8" class="error-text">（最多8句）</text>
				</view>
			</view>

			<!-- 模板预览弹窗 -->
			<view class="modal-overlay" v-if="showTemplatePreview" @tap="toggleShowPreview">
				<view class="modal-content" @tap.stop>
					<view class="modal-header">
						<text class="modal-title">模板预览</text>
						<text class="modal-close" @tap="toggleShowPreview">✕</text>
					</view>
					<view class="modal-body">
						<view v-for="(template, index) in templateList" :key="index" class="template-preview">
							<view class="template-preview-header">
								<text class="template-preview-name">{{ template.name }}</text>
								<text class="template-preview-desc">{{ template.description }}</text>
								<button 
									class="use-template-btn" 
									size="mini" 
									@tap="selectTemplate(index)"
								>使用此模板</button>
							</view>
							<view class="template-preview-content">
								<view v-for="(sentence, sIndex) in template.textList" :key="sIndex" class="preview-sentence">
									<text>{{ sIndex + 1 }}. {{ sentence }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 留言人 -->
			<view class="form-item">
				<text class="form-label">留言人</text>
				<input type="text" v-model="params.name" placeholder="请输入留言人" maxlength="10" class="input-field" />
			</view>

			<!-- 相识时间 -->
			<view class="form-item">
				<text class="form-label">相识时间</text>
				<picker mode="date" :start="startDate" :value="formatPickerDate(params.time)" @change="onDateChange" class="date-picker">
					<view class="picker-text">{{ formatDate(params.time) }}</view>
				</picker>
				<picker mode="time" :value="formatPickerTime(params.time)" @change="onTimeChange" class="time-picker">
					<view class="picker-text">{{ formatTime(params.time) }}</view>
				</picker>
			</view>

			<!-- 是否显示时间 -->
			<view class="form-item">
				<view class="checkbox-group">
					<switch :checked="params.showTime" @change="onShowTimeChange" color="#e91e63" />
					<text class="checkbox-label">显示相识时间</text>
				</view>
			</view>

			<!-- 男方名字 -->
			<view class="form-item">
				<text class="form-label">男方名字</text>
				<input type="text" v-model="params.boyName" placeholder="请输入男方名字" maxlength="10" class="input-field" />
			</view>

			<!-- 女方名字 -->
			<view class="form-item">
				<text class="form-label">女方名字</text>
				<input type="text" v-model="params.girlName" placeholder="请输入女方名字" maxlength="10" class="input-field" />
			</view>

			<!-- 操作按钮 - 优化为左右布局 -->
			<view class="button-group">
				<button type="primary" class="btn preview-btn" @tap="goToPreview" :disabled="!isValid">预览爱情树</button>
				<button type="default" class="btn share-btn" @tap="shareConfig" :disabled="!isValid">分享配置</button>
			</view>

			<!-- 参数预览 -->
			<view class="preview-section" v-if="showPreview">
				<text class="preview-title">当前配置预览</text>
				<view class="preview-box">
					<text class="preview-text">相识时间：{{ formatFullDateTime(params.time) }}</text>
					<text class="preview-text">显示时间：{{ params.showTime ? '是' : '否' }}</text>
					<text class="preview-text">留言人：{{ params.name }}</text>
					<text class="preview-text">男方：{{ params.boyName }}</text>
					<text class="preview-text">女方：{{ params.girlName }}</text>
					<text class="preview-text">留言句子：</text>
					<view v-for="(text, index) in filteredTextList" :key="index" class="preview-line">
						<text class="preview-line-text">{{ index + 1 }}. {{ text }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				startDate:'1945-08-15',
				// 默认参数 - 使用iOS兼容的日期格式
				defaultParams: {
					time: '2018/10/20 22:28:00', // iOS兼容格式: yyyy/MM/dd HH:mm:ss
					showTime: true,
					name: '胖不了小陆',
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
					]
				},
				// 当前参数
				params: {},
				// 文本列表字符串
				textListStr: '',
				// 是否显示预览
				showPreview: false,
				// 是否显示模板预览
				showTemplatePreview: false,
				// 当前选中的模板索引
				activeTemplate: 0,
				// 模板列表
				templateList: [
					{
						name: "经典古诗",
						description: "诗经楚辞，古风雅韵",
						textList: [
							"有一美人兮，见之不忘。",
							"一日不见兮，思之如狂。",
							"凤飞翱翔兮，四海求凰。",
							"无奈佳人兮，不在东墙。",
							"将琴代语兮，聊写衷肠。",
							"何时见许兮，慰我彷徨。",
							"愿言配德兮，携手相将。",
							"不得於飞兮，使我沦亡。"
						]
					},
					{
						name: "现代情话",
						description: "真挚告白，甜蜜浪漫",
						textList: [
							"遇见你，是我此生最美的意外。",
							"愿为你付出，此生不渝。",
							"你是我眼中最美的风景。",
							"执子之手，与子偕老。",
							"爱你，是我做过最好的事。",
							"你是我的星辰大海。",
							"此生有你，三生有幸。",
							"爱你，从心动到古稀。"
						]
					},
					{
						name: "简约告白",
						description: "简短直接，心意满满",
						textList: [
							"我喜欢你。",
							"想和你在一起。",
							"你是我的唯一。",
							"爱你不止今天。",
							"余生都是你。",
							"永远爱你。",
							"有你真好。",
							"一直爱你。"
						]
					},
					{
						name: "文艺情诗",
						description: "诗意浪漫，婉转深情",
						textList: [
							"你是人间四月天。",
							"月色与雪色，你是第三种绝色。",
							"山有木兮木有枝，心悦君兮君不知。",
							"晓看天色暮看云，行也思君，坐也思君。",
							"愿我如星君如月，夜夜流光相皎洁。",
							"只愿君心似我心，定不负相思意。",
							"玲珑骰子安红豆，入骨相思知不知。",
							"平生不会相思，才会相思，便害相思。"
						]
					},
					{
						name: "日常甜蜜",
						description: "生活点滴，温暖陪伴",
						textList: [
							"早安，我的爱人。",
							"今天也想你。",
							"好好吃饭，好好睡觉。",
							"累了就回来，我在等你。",
							"我会一直陪着你。",
							"有你在，就是幸福。",
							"我们一起慢慢变老。",
							"爱你，在每个日常。"
						]
					},
					{
						name: "承诺誓言",
						description: "坚定承诺，永恒誓言",
						textList: [
							"执子之手，与子偕老。",
							"此生不负，来世不弃。",
							"我会永远守护你。",
							"无论风雨，携手同行。",
							"你是我的命中注定。",
							"爱你，直到永远。",
							"愿为你遮风挡雨。",
							"你是我一生的选择。"
						]
					}
				]
			}
		},
		computed: {
			// 过滤后的文本列表（最多8句，每句最多10字）
			filteredTextList() {
				// 添加安全保护，确保 textList 是数组
				if (!this.params.textList || !Array.isArray(this.params.textList)) {
					return [];
				}
				return this.params.textList
					.filter(text => text.trim())
					.slice(0, 8)
					.map(text => text.substring(0, 20));
			},
			// 当前行数
			currentLineCount() {
				return this.textListStr.split('\n').filter(line => line.trim()).length;
			},
			// 最长句子的字数
			currentWordCount() {
				const lines = this.textListStr.split('\n').filter(line => line.trim());
				if (lines.length === 0) return 0;
				const maxLength = Math.max(...lines.map(line => line.length));
				return maxLength;
			},
			// 表单是否有效
			isValid() {
				return this.params.name &&
					this.params.boyName &&
					this.params.girlName &&
					this.filteredTextList.length > 0;
			}
		},
		onLoad(options) {
			// 从URL参数中获取设置
			let query = this.$Route.query;
			// console.log("query=", this.query);
			if (query && query.name) {
				this.params = {
					...query
				};
				this.updateTextListStr();
				console.log("query=", this.params);
			} else {
				// 参数没有默认缓存
				this.initParams();
			}
		},
		// 微信小程序分享到聊天
		onShareAppMessage(res) {
			return this.generateShareConfig();
		},
		// 微信小程序分享到朋友圈
		onShareTimeline() {
			return this.generateShareConfig(true);
		},
		methods: {
			// 初始化参数
			initParams() {
				// 从缓存加载配置
				const savedConfig = uni.getStorageSync('loveTreeConfig');
				if (savedConfig) {
					// 确保 textList 是数组
					const config = {
						...this.defaultParams,
						...savedConfig
					};
					config.textList = Array.isArray(config.textList) ? config.textList : this.defaultParams.textList;

					// 确保日期格式是iOS兼容格式
					if (config.time) {
						config.time = this.normalizeDateForIOS(config.time);
					}

					this.params = config;
				} else {
					this.params = {
						...this.defaultParams
					};
				}
				this.updateTextListStr();
			},

			// 更新文本列表字符串
			updateTextListStr() {
				this.textListStr = this.params.textList.join('\n');
			},

			// 选择模板
			selectTemplate(index) {
				if (index >= 0 && index < this.templateList.length) {
					const template = this.templateList[index];
					this.params.textList = [...template.textList];
					this.updateTextListStr();
					this.activeTemplate = index;
					this.saveToStorage();
					
					// 关闭预览弹窗
					this.showTemplatePreview = false;
					
					// 显示提示
					uni.showToast({
						title: `已应用「${template.name}」模板`,
						icon: 'success',
						duration: 1500
					});
				}
			},

			// 切换模板预览显示
			toggleShowPreview() {
				this.showTemplatePreview = !this.showTemplatePreview;
			},

			// 日期选择变化
			onDateChange(e) {
				const date = e.detail.value; // 格式: yyyy-MM-dd
				const timeStr = this.params.time.split(' ')[1] || '00:00:00';
				// 转换为iOS兼容格式: yyyy/MM/dd HH:mm:ss
				const formattedDate = date.replace(/-/g, '/');
				this.params.time = `${formattedDate} ${timeStr}`;
				this.saveToStorage();
			},

			// 时间选择变化
			onTimeChange(e) {
				const time = e.detail.value; // 格式: HH:mm
				const dateStr = this.params.time.split(' ')[0] || '2018/10/20';
				// 确保日期格式正确
				const formattedDate = dateStr.includes('-') ? dateStr.replace(/-/g, '/') : dateStr;
				this.params.time = `${formattedDate} ${time}:00`;
				this.saveToStorage();
			},

			// 显示时间开关变化
			onShowTimeChange(e) {
				this.params.showTime = e.detail.value;
				this.saveToStorage();
			},

			// 文本列表变化
			onTextListChange(e) {
				this.textListStr = e.detail.value;
				const lines = this.textListStr.split('\n')
					.map(line => line.trim())
					.filter(line => line)
					.slice(0, 8)
					.map(line => line.substring(0, 20));

				this.params.textList = lines;
				this.saveToStorage();
				
				// 如果用户修改了文本，取消选中的模板
				this.activeTemplate = -1;
			},

			// 为picker格式化日期 (yyyy-MM-dd)
			formatPickerDate(dateTime) {
				if (!dateTime) return '';
				const date = dateTime.split(' ')[0];
				// 将 yyyy/MM/dd 转换为 yyyy-MM-dd
				return date.replace(/\//g, '-');
			},

			// 为picker格式化时间 (HH:mm)
			formatPickerTime(dateTime) {
				if (!dateTime) return '';
				const time = dateTime.split(' ')[1];
				return time ? time.substring(0, 5) : '00:00';
			},

			// 格式化日期显示
			formatDate(dateTime) {
				if (!dateTime) return '请选择日期';
				const date = dateTime.split(' ')[0];
				return date.replace(/\//g, '/');
			},

			// 格式化时间显示
			formatTime(dateTime) {
				if (!dateTime) return '请选择时间';
				const time = dateTime.split(' ')[1];
				return time ? time.substring(0, 5) : '00:00';
			},

			// 格式化完整日期时间显示
			formatFullDateTime(dateTime) {
				if (!dateTime) return '';
				return dateTime.replace(/\//g, '/').replace(/(\d{2}:\d{2}):\d{2}/, '$1');
			},

			// 标准化日期格式为iOS兼容格式
			normalizeDateForIOS(dateString) {
				if (!dateString) return this.defaultParams.time;

				// 处理各种可能的日期格式
				let normalized = dateString.trim();

				// 如果包含空格，分开日期和时间
				if (normalized.includes(' ')) {
					const [datePart, timePart] = normalized.split(' ');

					// 处理日期部分
					let formattedDate = datePart;
					if (formattedDate.includes('-')) {
						// 将 yyyy-MM-dd 转换为 yyyy/MM/dd
						formattedDate = formattedDate.replace(/-/g, '/');
					}

					// 处理时间部分
					let formattedTime = timePart;
					if (!formattedTime.includes(':')) {
						formattedTime = '00:00:00';
					} else {
						const timeParts = formattedTime.split(':');
						if (timeParts.length === 2) {
							// 只有小时和分钟，添加秒
							formattedTime = `${formattedTime}:00`;
						} else if (timeParts.length === 1) {
							// 只有小时
							formattedTime = `${formattedTime}:00:00`;
						}
					}

					return `${formattedDate} ${formattedTime}`;
				} else {
					// 只有日期，没有时间
					let formattedDate = normalized;
					if (formattedDate.includes('-')) {
						formattedDate = formattedDate.replace(/-/g, '/');
					}
					return `${formattedDate} 00:00:00`;
				}
			},

			// 保存到本地存储
			saveToStorage() {
				uni.setStorageSync('loveTreeConfig', this.params);
			},

			// 跳转到预览页面
			goToPreview() {
				if (!this.isValid) {
					uni.showToast({
						title: '请填写必填项',
						icon: 'none'
					});
					return;
				}

				// 确保日期格式是iOS兼容的
				const normalizedTime = this.normalizeDateForIOS(this.params.time);

				// 跳转到loveTree页面
				this.$Router.push({
					name: "loveTree",
					params: {
						time: normalizedTime,
						showTime: this.params.showTime,
						name: this.params.name,
						boyName: this.params.boyName,
						girlName: this.params.girlName,
						textList: this.filteredTextList
					}
				});
			},

			// 生成分享配置
			generateShareConfig(isTimeline = false) {
				if (!this.isValid) {
					return {
						title: '爱情树配置',
						path: 'package-index/loveTreeIndex/loveTreeIndex',
						...(isTimeline && {
							imageUrl: this.$const.IMAGES.SHARE_URL
						})
					};
				}

				// 分享标题
				let title = `${this.params.boyName}和${this.params.girlName}的爱情树`;
				let query = '';

				if (isTimeline) {
					// 朋友圈分享的标题
					title = `💌 ${this.params.boyName} ❤ ${this.params.girlName} 💌\n`;
					title += `相识于：${this.formatFullDateTime(this.params.time)}\n`;
					title += `留言人：${this.params.name}`;
				} else {
					// 好友分享的标题
					title = `${this.params.boyName}和${this.params.girlName}的爱情树`;

					// 构建查询参数
					const params = {
						time: encodeURIComponent(this.params.time || ''),
						showTime: this.params.showTime,
						name: encodeURIComponent(this.params.name || ''),
						boyName: encodeURIComponent(this.params.boyName || ''),
						girlName: encodeURIComponent(this.params.girlName || ''),
						textList: encodeURIComponent(JSON.stringify(this.filteredTextList || []))
					};

					// 生成查询字符串
					query = Object.keys(params)
						.map(key => `${key}=${params[key]}`)
						.join('&');
				}

				// 分享图片路径 - 可以设置一个默认的分享图片
				let imageUrl = this.$const.IMAGES.SHARE_URL;

				// 如果有自定义分享图片，可以在这里设置
				// imageUrl = this.params.shareImage || imageUrl;

				return {
					title: title,
					path: `/package-index/loveTreeIndex/loveTreeIndex?${query}`,
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

			// 分享配置
			shareConfig() {
				if (!this.isValid) {
					uni.showToast({
						title: '请先完成配置',
						icon: 'none'
					});
					return;
				}

				uni.showActionSheet({
					itemList: ['复制配置', '分享给好友', '分享到朋友圈'],
					success: (res) => {
						if (res.tapIndex === 0) {
							// 复制配置
							this.copyConfig();
						} else if (res.tapIndex === 1) {
							// 分享给好友 - 显示分享菜单
							uni.showShareMenu({
								withShareTicket: true,
								success: () => {
									uni.showToast({
										title: '点击右上角分享',
										icon: 'none'
									});
								},
								fail: (err) => {
									console.error('显示分享菜单失败:', err);
									uni.showToast({
										title: '分享失败，请稍后重试',
										icon: 'none'
									});
								}
							});
						} else if (res.tapIndex === 2) {
							// 分享到朋友圈
							uni.showToast({
								title: '请在右上角菜单中分享到朋友圈',
								icon: 'none',
								duration: 3000
							});
						}
					}
				});
			},

			// 复制配置
			copyConfig() {
				const configStr = JSON.stringify(this.params, null, 2);
				uni.setClipboardData({
					data: configStr,
					success: () => {
						uni.showToast({
							title: '配置已复制',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('复制失败:', err);
						uni.showToast({
							title: '复制失败，请重试',
							icon: 'error'
						});
					}
				});
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx;
		background: linear-gradient(135deg, #ffd6e7 0%, #ffeff7 100%);
		min-height: 100vh;
	}

	/* 顶部标题区 - 参考太岁查询页面设计 */
	.header {
		position: relative;
		padding: 60rpx 32rpx 60rpx;
		text-align: center;
		overflow: hidden;
		margin: -30rpx -24rpx 40rpx -24rpx;
	}

	.header-bg {
		position: absolute;
		top: -175rpx;
		left: -50rpx;
		right: -50rpx;
		height: 420rpx;
		background: linear-gradient(135deg, #e91e63 0%, #ff4081 100%);
		border-radius: 0 0 50% 50%;
		opacity: 0.9;
	}

	.header-title {
		position: relative;
		font-size: 52rpx;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
		letter-spacing: 2rpx;
		display: block;
		margin-bottom: 16rpx;
	}

	.header-subtitle {
		position: relative;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
		letter-spacing: 1rpx;
		font-weight: 300;
	}

	.form-container {
		background: rgba(255, 255, 255, 0.9);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-top: 20rpx;
		box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.form-item {
		margin-bottom: 40rpx;
	}
	
	.template-section {
		margin-bottom: 30rpx;
	}
	
	.form-label-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.template-hint {
		display: flex;
		align-items: center;
		background: #f0f7ff;
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		color: #1890ff;
	}
	
	.hint-icon {
		margin-right: 8rpx;
	}
	
	.template-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		margin-top: 10rpx;
	}
	
	.template-item {
		background: #fff;
		border: 2rpx solid #eee;
		border-radius: 12rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}
	
	.template-item.active {
		border-color: #e91e63;
		background: #fff0f5;
		box-shadow: 0 4rpx 12rpx rgba(233, 30, 99, 0.2);
	}
	
	.template-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 8rpx;
		text-align: center;
	}
	
	.template-desc {
		font-size: 24rpx;
		color: #888;
		text-align: center;
	}
	
	/* 模板预览弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	
	.modal-content {
		background: #fff;
		border-radius: 20rpx;
		width: 90%;
		max-height: 80vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
	
	.modal-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.modal-close {
		font-size: 36rpx;
		color: #999;
		padding: 10rpx;
	}
	
	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 30rpx;
	}
	
	.template-preview {
		margin-bottom: 30rpx;
		padding: 20rpx;
		border: 2rpx solid #eee;
		border-radius: 12rpx;
		background: #fafafa;
	}
	
	.template-preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}
	
	.template-preview-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}
	
	.template-preview-desc {
		font-size: 24rpx;
		color: #666;
		margin-left: 20rpx;
		flex: 1;
	}
	
	.use-template-btn {
		background: #e91e63;
		color: #fff;
		border-radius: 20rpx;
		font-size: 24rpx;
		padding: 0 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		margin-top: 10rpx;
	}
	
	.template-preview-content {
		background: #fff;
		border-radius: 8rpx;
		padding: 20rpx;
	}
	
	.preview-sentence {
		padding: 8rpx 0;
		font-size: 26rpx;
		color: #666;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.preview-sentence:last-child {
		border-bottom: none;
	}

	.form-label {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.form-hint {
		display: block;
		font-size: 24rpx;
		color: #888;
		margin-bottom: 20rpx;
	}

	.picker-text {
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.date-picker,
	.time-picker {
		display: inline-block;
		width: 48%;
		margin-right: 2%;
	}

	.time-picker {
		margin-right: 0;
	}

	.checkbox-group {
		display: flex;
		align-items: center;
	}

	.checkbox-label {
		font-size: 28rpx;
		color: #333;
		margin-left: 20rpx;
	}

	.input-field,
	.textarea-field {
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
		width: 92%;
	}

	.textarea-field {
		min-height: 200rpx;
	}

	.hint-area {
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.hint-text {
		font-size: 24rpx;
		color: #666;
	}

	.error-text {
		font-size: 24rpx;
		color: #f44336;
	}

	/* 优化按钮组为左右布局 */
	.button-group {
		margin-top: 50rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 20rpx;
	}

	.button-group .btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}

	.preview-btn {
		background: linear-gradient(to right, #e91e63, #ff4081);
		color: #fff;
	}

	.share-btn {
		background: #fff;
		color: #e91e63;
		border: 1px solid #e91e63;
	}

	.preview-section {
		margin-top: 50rpx;
		padding-top: 30rpx;
		border-top: 1px solid #eee;
	}

	.preview-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.preview-box {
		background: #f9f9f9;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.preview-text {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		line-height: 1.6;
	}

	.preview-line {
		padding-left: 20rpx;
		margin-bottom: 5rpx;
	}

	.preview-line-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
</style>
