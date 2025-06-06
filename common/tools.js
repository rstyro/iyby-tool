// import * as EncryptUtil from '@/common/encrypt.js'; // 引入 encrypt.js 文件

const install = (Vue, vm) => {
	// 工具方法集合
	Vue.prototype.$t = {
		// 转大写
		toUpperCase(arg) {
			return arg && arg.toUpperCase();
		},
		convertToCnMoney(money){
			//汉字的数字
			var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
			//基本单位
			var cnIntRadice = new Array('', '拾', '佰', '仟');
			//对应整数部分扩展单位
			var cnIntUnits = new Array('', '万', '亿', '兆');
			//对应小数部分单位
			var cnDecUnits = new Array('角', '分', '毫', '厘');
			//整数金额时后面跟的字符
			var cnInteger = '';
			//整型完以后的单位
			var cnIntLast = '';
			//最大处理的数字
			var maxNum = 999999999999999.9999;
			//金额整数部分
			var integerNum;
			//金额小数部分
			var decimalNum;
			//输出的中文金额字符串
			var chineseStr = '';
			//分离金额后用的数组，预定义
			var parts;
			if (money == '') {
				return '';
			}
			money = parseFloat(money);
			if (money >= maxNum) {
				//超出最大处理数字
				return '';
			}
			if (money == 0) {
				chineseStr = cnNums[0] + cnIntLast + cnInteger;
				return chineseStr;
			}
			//转换为字符串
			money = money.toString();
			if (money.indexOf('.') == -1) {
				integerNum = money;
				decimalNum = '';
			} else {
				parts = money.split('.');
				integerNum = parts[0];
				decimalNum = parts[1].substr(0, 4);
			}
			//获取整型部分转换
			if (parseInt(integerNum, 10) > 0) {
				var zeroCount = 0;
				var IntLen = integerNum.length;
				for (var i = 0; i < IntLen; i++) {
					var n = integerNum.substr(i, 1);
					var p = IntLen - i - 1;
					var q = p / 4;
					var m = p % 4;
					if (n == '0') {
						zeroCount++;
					} else {
						if (zeroCount > 0) {
							chineseStr += cnNums[0];
						}
						//归零
						zeroCount = 0;
						chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
					}
					if (m == 0 && zeroCount < 4) {
						chineseStr += cnIntUnits[q];
					}
				}
				chineseStr += cnIntLast + "圆";
			}
			//小数部分
			if (decimalNum != '') {
				var decLen = decimalNum.length;
				for (var i = 0; i < decLen; i++) {
					var n = decimalNum.substr(i, 1);
					if (n != '0') {
						chineseStr += cnNums[Number(n)] + cnDecUnits[i];
					} else if (n == '0') {
						chineseStr += cnNums[Number(n)];
					}
				}
			}
			if (chineseStr == '') {
				chineseStr += cnNums[0] + cnIntLast + cnInteger;
			} else if (decimalNum == '') {
				chineseStr += cnInteger + "整";
			}
			return chineseStr;
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
		},
		// 获取生肖年
		getZodiac(year){
			// const arr = ['猴','鸡','狗','猪','鼠','牛','虎','兔','龙','蛇','马','羊'];
			const arr = ['申猴', '酉鸡', '戌狗', '亥猪', '子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊'];
			return arr[year % 12];
		},
		
		// 十进制转其他进制
		baseTenToOther(value, baseTo){
			return value.toString(baseTo);
		},
		
		// 进制转换
		baseConversion(value, baseFrom, baseTo){
			let result = parseInt(value, baseFrom).toString(baseTo);
			if (baseTo == 10) {
				result = Number(result).toFixed(0);
			}
			return result;
		},
		// 判断字符串是否包含字母
		isCluderChar(data){
			var p = /[a-z]/i;
			return p.test(data);
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