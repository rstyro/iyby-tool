// utils/soundManager.js
class SoundManager {
	constructor() {
		this.sounds = new Map();
		this.isMuted = false;
		this._hasUserInteraction = false; // iOS交互标记
		this._initUserInteraction();
	}

	// 初始化用户交互监听
	_initUserInteraction() {
		uni.$on('global-user-interaction', () => {
			this._hasUserInteraction = true;
			// console.log('用户交互已记录，iOS可以播放音频');
		});
	}

	/**
	 * 添加音效
	 * @param {string} key - 音效标识
	 * @param {string} src - 音频路径
	 * @param {object} [options] - 配置项
	 * @param {boolean} [options.loop=false] - 是否循环
	 * @param {boolean} [options.iosBackground=false] - iOS是否作为背景音乐
	 */
	addSound(key, src, {
		loop = false,
		iosBackground = false
	} = {}) {
		if (this.sounds.has(key)) return;

		const isNetwork = src.startsWith('http');
		const isH5 = process.env.VUE_APP_PLATFORM === 'h5';

		if (isNetwork && !isH5) {
			uni.downloadFile({
				url: src,
				success: (res) => {
					this._createAudio(key, res.tempFilePath, loop, iosBackground);
				},
				fail: (err) => {
					console.error(`[音效下载失败] ${key}:`, err);
				}
			});
		} else {
			this._createAudio(key, src, loop, iosBackground);
		}
	}

	// 创建音频实例
	_createAudio(key, src, loop, iosBackground) {
		const audio = uni.createInnerAudioContext();

		// iOS后台播放配置
		if (this._isIOS() && iosBackground) {
			audio.obeyMuteSwitch = false; // 忽略静音键
			audio.sessionCategory = 'ambient'; // 混音模式
		}

		audio.src = src;
		audio.loop = loop;
		audio.volume = this.isMuted ? 0 : 1;

		// 错误监听
		audio.onError((err) => {
			console.error(`[音效错误] ${key}:`, err);
			this.destroy(key);
		});

		this.sounds.set(key, audio);
	}

	// 安全播放方法
	play(key) {
		if (!this.sounds.has(key)) {
			console.error(`[播放失败] 未找到音效: ${key}`);
			return;
		}

		// iOS交互检查
		if (this._isIOS() && !this._hasUserInteraction) {
			console.warn('iOS需用户点击界面后方可播放');
			uni.showToast({
				title: '请点击屏幕后播放',
				icon: 'none'
			});
			return;
		}

		const audio = this.sounds.get(key);
		try {
			audio.play();

			// iOS首次播放延迟处理
			if (this._isIOS() && audio.currentTime === 0) {
				setTimeout(() => audio.seek(0), 50);
			}
		} catch (err) {
			console.error(`[播放异常] ${key}:`, err);
		}
	}
	
	getSound(key){
		if (!this.sounds.has(key)) {
			console.error(`[获取失败] 未找到音效: ${key}`);
			return;
		}
		return this.sounds.get(key);
	}

	// 停止所有音效
	stopAll() {
		this.sounds.forEach(audio => {
			audio.stop();
			audio.offError(); // 清除监听
		});
	}

	// 销毁单个音效实例
	destroy(key) {
		if (this.sounds.has(key)) {
			const audio = this.sounds.get(key);
			audio.destroy();
			this.sounds.delete(key);

			// iOS需要额外释放资源
			if (this._isIOS()) {
				uni.getBackgroundAudioManager().stop();
			}
		}
	}

	// 销毁所有音效
	destroyAll() {
		this.sounds.forEach(audio => audio.destroy());
		this.sounds.clear();
	}

	// 切换静音状态
	toggleMute() {
		this.isMuted = !this.isMuted;
		const volume = this.isMuted ? 0 : 1;
		this.sounds.forEach(audio => audio.volume = volume);
	}

	// 平台检测
	_isIOS() {
		// const system = uni.getSystemInfoSync();
		// return system.platform === 'ios' || system.system.includes('iOS');

		const appBaseInfo = wx.getAppBaseInfo();
		return appBaseInfo.platform === 'ios';
	}
}

export default new SoundManager();