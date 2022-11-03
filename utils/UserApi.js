export const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			lang: 'zh_CN',
			desc: '用于展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，
			success: (res) => {
				resolve(res.userInfo)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export const getUserInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			lang: 'zh_CN',
			desc: '用于展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，
			success: (res) => {
				console.log("userinfo-res:",res);
				resolve(res.userInfo)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export const getLogin = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			success: (res) => {
				// console.log('res：', res);
				// console.log('code：', res.code);
				//todo 客户端成功获取授权临时票据（code）,向业务服务器发起登录请求
				resolve(res)
			},
			fail: (err) => {
				console.log(err, 'logoer')
				reject(err)
			}
		})
	})
}

// 保存用户信息
export const saveUserInfoCache = (info) => {
	if (info) {
		uni.setStorage({
			key: 'qr_user_info',
			data: info,
			success: function() {
				console.log('缓存添加成功');
			}
		});
	}
}

// 获取用户信息
export const getUserInfoCache=()=>{
	return uni.getStorageSync('qr_user_info');
}

// 微信登录
export const weixinLogin = () => {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'oauth',
			success: (res) => {
				//支持微信、qq和微博等
				if (~res.provider.indexOf('weixin')) {
					let userInfo = getUserProfile();
					let loginRes = getLogin();
					Promise.all([userInfo, loginRes]).then((result) => {
						let userInfo = result[0];
						let loginRes = result[1];
						userInfo.needLogin = false;
						resolve(userInfo);
					}).catch((error) => {
						console.log("登录失败：",error)
					});
				} else if (~res.provider.indexOf('qq')) {
					//todo 
				}
			},
			fail: (err) => {
				// uni.hideLoading();
				uni.showToast({
					icon: 'none',
					title: err
				});
				reject(err);
			}
		})
	})
	
}
