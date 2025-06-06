// import * as EncryptUtil from '@/common/encrypt.js'; // 引入 encrypt.js 文件

const install = (Vue, vm) => {
	// 工具方法集合
	Vue.prototype.$t = {
		// 转大写
		toUpperCase(arg) {
			return arg && arg.toUpperCase();
		},
		 copyData(data){
			uni.setClipboardData({
				data: data,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: "success",
						duration: 1000
					});
				}
			});
		}

	};

	// 版本相关工具方法
	Vue.prototype.$version = {
		/**
		 * 获取当前小程序的版本类型
		 * @returns {string} 'develop' | 'trial' | 'release'
		 */
		getMiniProgramVersion() {
			try {
				const accountInfo = wx.getAccountInfoSync();
				// 手动修改环境
				// accountInfo.miniProgram.envVersion = 'release';
				return accountInfo.miniProgram.envVersion || 'release'; // 默认返回正式版
			} catch (error) {
				console.error('获取小程序版本信息失败:', error);
				return 'release'; // 如果获取失败，默认认为是正式版
			}
		},

		/**
		 * 判断当前是否是开发版或体验版
		 * @returns {boolean} true 表示开发版或体验版，false 表示正式版
		 */
		isDevOrTrialVersion() {
			const version = this.getMiniProgramVersion();
			return version === 'develop' || version === 'trial';
		},

		/**
		 * 检查小程序更新
		 * 注意：此方法仅适用于微信小程序平台
		 */
		checkUpdate() {
			if (!wx.canIUse('getUpdateManager')) {
				console.warn('当前客户端版本不支持 getUpdateManager 方法');
				return;
			}

			const updateManager = uni.getUpdateManager();

			// 监听更新检测事件
			updateManager.onCheckForUpdate((res) => {
				if (res.hasUpdate) {
					console.log("检测到新版本，正在下载更新...");
				} else {
					console.log("当前已是最新版本");
				}
			});

			// 监听下载完成事件
			updateManager.onUpdateReady(() => {
				uni.showModal({
					title: "更新提示",
					content: "新版本已准备好，是否重启小程序？",
					success(resModal) {
						if (resModal.confirm) {
							// 用户确认后，强制小程序重启并应用更新
							updateManager.applyUpdate();
						}
					},
				});
			});

			// 监听更新失败事件
			updateManager.onUpdateFailed(() => {
				uni.showToast({
					title: "更新失败，请稍后再试",
					icon: "none",
				});
			});
		},
	};

	// 常量集合（分类管理）
	Vue.prototype.$const = {
		// 图片资源
		IMAGES: {
			SHARE_URL: "https://66dashun.xyz/static/images/share.png",
		},
	}

};

export default {
	install,
};