import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['store_token', 'store_uid', 'store_userInfo', 'store_fish', 'store_sound_enabled', 'store_fish_date', 'store_login'
,'store_topics_map', 'store_truth_dare_map', 'store_fly_task_map','store_fire_dice_map'];

// 保存变量到本地存储中
const saveLifeData = function (key, value) {
    // 判断变量名是否在需要存储的数组中
    if (saveStateKeys.indexOf(key) != -1) {
        // 获取本地存储的lifeData对象，将变量添加到对象中
        let tmp = uni.getStorageSync('lifeData');
        // 第一次打开APP，不存在lifeData变量，故放一个{}空对象
        tmp = tmp ? tmp : {};
        tmp[key] = value;
        // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
        uni.setStorageSync('lifeData', tmp);
    }
}

const store = new Vuex.Store({
    state: {
        store_token: '9ed74ffc6400464bb765048911416276',
        store_uid: '1',
        store_fish: {
            count: 0, // 今日叩击次数
            auto: 0,
            total: 0, // 累计功德
        },
        store_fish_date: '',
        store_userInfo: {},
        store_sound_enabled: true,
        store_login: 0,
        store_topics_map: {},
        store_truth_dare_map: {},
        store_fly_task_map: {},
        store_fire_dice_map:{}
    },
    getters: {},
    mutations: {
        $uStore(state, payload) {
            // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
            let nameArr = payload.name.split('.');
            let saveKey = '';
            let len = nameArr.length;
            if (nameArr.length >= 2) {
                let obj = state[nameArr[0]];
                for (let i = 1; i < len - 1; i++) {
                    obj = obj[nameArr[i]];
                }
                obj[nameArr[len - 1]] = payload.value;
                saveKey = nameArr[0];
            } else {
                // 单层级变量，在state就是一个普通变量的情况
                state[payload.name] = payload.value;
                saveKey = payload.name;
            }
            // 保存变量到本地，见顶部函数定义
            saveLifeData(saveKey, state[saveKey])
        }
    },
    actions: {},
    modules: {},
})

// 从缓存中取得相同的key进行覆盖操作
let lifeData = uni.getStorageSync('lifeData') || {};
for (let key in lifeData) {
    if (store.state.hasOwnProperty(key)) {
        store.commit('$uStore', {
            name: key,
            value: lifeData[key]
        })
    }
}

export default store;