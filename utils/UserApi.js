export const getUserInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			lang: 'zh_CN',
			desc: '用户登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，
			success: (res) => {
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
				console.log('res：', res);
				console.log('code：', res.code);
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
export const saveUserInfo = (info) => {
	if(info){
		uni.setStorage({
			key: 'qr_user_info',
			data: info,
			success: function() {
				console.log('缓存添加成功');
			}
		});
	}
}

export const weixinLogin = () => {
	uni.getProvider({
		service: 'oauth',
		success: (res) => {
			//支持微信、qq和微博等
			if (~res.provider.indexOf('weixin')) {
				console.log('res：', res)
				let userInfo = this.getUserInfo();
				let loginRes = this.getLogin();
				Promise.all([userInfo, loginRes]).then((result) => {
					let userInfo = result[0];
					let loginRes = result[1];
					console.log("userInfo1:", userInfo);
					console.log("loginRes:", loginRes);
					userInfo.needLogin = false;
					console.log("userInfo2:", userInfo);
					saveUserInfo(userInfo);
				})
			} else if (~res.provider.indexOf('qq')) {
				//todo 
			}
		},
		fail: (err) => {
			// uni.hideLoading();
			uni.showToast({
				icon: 'none',
				title: err
			})
		}
	})
}


