<template>
	<view>
		<view class="container">
			<view class="header">
				<view class="header-title">生肖查询工具</view>
				<view class="header-sub-title">输入出生年份，查询您的生肖属相及运势</view>
			</view>

			<view class="zodiac-card">
				<view class="card-title">
					<view class="zodiac-icon" :class="currentZodiac.english">{{ currentZodiac.name }}</view>
					<view class="zodiac-title">生肖查询</view>
				</view>

				<view class="input-group">
					<input class="input" type="number" v-model="inputYear" placeholder="请输入出生年份（如：1990）"
						@keyup.enter="searchZodiac">
					<button class="searchBtn" @click="searchZodiac">查询</button>
				</view>

				<view class="year-selector">
					<button class="btn" @click="changeYear(-1)">-</button>
					<view class="year-value">{{ sliderYear }} 年</view>
					<button class="btn" @click="changeYear(1)">+</button>
				</view>

				<view class="result-container" :style="{display: showResult ? 'block' : 'none'}">
					<view class="result-header">
						<view class="zodiac-icon" :class="currentZodiac.english">{{ currentZodiac.name }}</view>
						<view class="zodiac-info">
							<view class="zodiac-info-title">
								{{ currentZodiac.name }}
								<view class="span">({{ currentZodiac.chinese }})</view>
							</view>
							<view class="zodiac-info-desc">{{ sliderYear }} 年出生 | {{ currentZodiac.years.join('、') }}年出生
							</view>
						</view>
					</view>

					<view class="description">
						<h4>性格特点:</h4>
						<p>{{ currentZodiac.description }}</p>
						<br>
					</view>
				</view>
			</view>

			<view class="zodiac-card">
				<view class="card-title">
					<view class="zodiac-icon icon12" :class="currentZodiac.english">十二</view>
					<view class="zodiac-title">十二生肖速查</view>
				</view>

				<view class="zodiac-grid">
					<view class="zodiac-item" v-for="(zodiac, index) in zodiacs" :key="index"
						:class="{active: currentZodiac.name === zodiac.name}" @click="selectZodiac(zodiac)">
						<view class="zodiac-name">{{ zodiac.name }}</view>
						<view class="zodiac-desc">{{ zodiac.chinese }}</view>
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
				inputYear: '',
				sliderYear: new Date().getFullYear(),
				showResult: true,
				currentZodiac: {
					name: '',
					english: '',
					chinese: '',
					description: '',
					years: []
				},
				zodiacs: [{
						name: "鼠",
						chinese: "子鼠",
						english: "rat",
						description: "灵眸慧心通机变，善察时势若狡猿；然遇险易生疑窦，须弥山前步踌躇。"
					},
					{
						name: "牛",
						chinese: "丑牛",
						english: "ox",
						description: "坤舆深耕显坚志，驮月犁星守诺重；偶执拗角抵南墙，衷情未解付东风。"
					},
					{
						name: "虎",
						chinese: "寅虎",
						english: "tiger",
						description: "啸谷风雷慑百兽，义胆昭昭镇山河；然性烈偶摧琼枝，须知刚极易折锋。"
					},
					{
						name: "兔",
						chinese: "卯兔",
						english: "rabbit",
						description: "捣药玉杵济世心，锦心绣口蕴玲珑；惟月窟踟蹰三顾，当效羿弓破长空。"
					},
					{
						name: "龙",
						chinese: "辰龙",
						english: "dragon",
						description: "九霄腾骧布云雨，麟爪飞扬创世雄；慎防亢龙生悔吝，海纳百川方为宗。"
					},
					{
						name: "蛇",
						chinese: "巳蛇",
						english: "snake",
						description: "灵蜕玄机参造化，衔珠智珠照幽冥；惟常怀杞人忧思，当化白素证至情。"
					},
					{
						name: "马",
						chinese: "午马",
						english: "horse",
						description: "汗血追风骋八极，赤诚燃鬃照丹心；莫效的卢跃檀溪，韧守方得伯乐音。"
					},
					{
						name: "羊",
						chinese: "未羊",
						english: "goat",
						description: "跪乳恩泽润四野，角挂素琴奏和风；慎避歧路亡羊叹，当效苏武持节雄。"
					},
					{
						name: "猴",
						chinese: "申猴",
						english: "monkey",
						description: "金睛破妄识真伪，巧借蟠桃戏仙翁；莫效掰玉米之戏，定海神针镇心猿。"
					},
					{
						name: "鸡",
						chinese: "酉鸡",
						english: "rooster",
						description: "冠顶丹霞催晓日，金距司晨守信风；勿因微尘掩明镜，五德俱全始成凤。"
					},
					{
						name: "狗",
						chinese: "戌狗",
						english: "dog",
						description: "忠义立雪护柴扉，吠尧只为守赤诚；当效狡兔开蹊径，莫固陈规困樊笼。"
					},
					{
						name: "猪",
						chinese: "亥猪",
						english: "pig",
						description: "福相天成纳鸿运，圆融处世若醍醐；须防笑面藏钩吻，慧眼识得豕鹿图。"
					}
				]
			}
		},
		mounted() {
			// 默认显示当前年份的生肖
			this.currentZodiac = this.getZodiac(this.sliderYear) || {};
			this.inputYear = this.sliderYear;
		},
		methods: {
			generateYears(baseYear) {
				const years = [];
				const cycles = 3; // 前后3个周期

				for (let i = -cycles; i <= cycles; i++) {
					const year = baseYear + i * 12;
					if (year > 1) { // 年份必须大于1
						years.push(year);
					}
				}
				return years;
			},
			getZodiac(year) {
				const zodiacIndex = (year - 4) % 12;
				let zodiac = this.zodiacs[zodiacIndex];
				zodiac.years = this.generateYears(year);
				return zodiac;
			},
			searchZodiac() {
				const year = this.inputYear || this.sliderYear;
				if (!year || year < 2) {
					alert("请输入的有效年份");
					return;
				}

				this.sliderYear = parseInt(year);
				this.currentZodiac = this.getZodiac(this.sliderYear);
				// this.currentZodiac.years = this.generateYears(this.sliderYear); // 动态生成年份
				this.showResult = true;
			},
			changeYear(delta) {
				this.sliderYear += delta;
				this.inputYear = this.sliderYear;
				this.searchZodiac();
			},
			selectZodiac(zodiac) {
				this.currentZodiac = zodiac;

				// 根据当前生肖计算基准年份（例如最近的一个该生肖年份）
				const currentYear = new Date().getFullYear();
				const zodiacIndex = this.zodiacs.indexOf(zodiac);
				const baseYear = currentYear - ((currentYear - 4) % 12 - zodiacIndex + 12) % 12;

				// 设置 sliderYear 为最近的该生肖年份
				this.sliderYear = baseYear;
				this.inputYear = this.sliderYear;
				// 动态更新
				this.currentZodiac.years = this.generateYears(this.sliderYear);
				this.showResult = true;

				// 滚动到结果区域
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				}, 300);
			}
		}
	}
</script>

<style lang="scss" scoped>
	$primary-color: #3498db;
	$secondary-color: #ecf0f1;

	.container {
		margin: 0 auto;
		padding: 10rpx 16rpx 80rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		// background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
		// background: linear-gradient(135deg, #e0eafc 0%, #d6a4a4 100%);
		background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
		min-height: 100vh;
		color: #333;
		line-height: 1.6;
		overflow-x: hidden;
	}

	.header {
		text-align: center;
		padding: 30rpx 0 20rpx;
		position: relative;

		.header-title {
			font-size: 2.2rem;
			color: #fff;
			margin-bottom: 10px;
			// text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
			text-shadow: 0 2px 6px rgba(44, 62, 80, 0.2);
			font-weight: 700;

			&::after {
				content: '';
				position: absolute;
				bottom: 80rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 120px;
				height: 4px;
				background: linear-gradient(to right, #ff9a9e, #fad0c4);
				border-radius: 2px;
			}
		}

		.header-sub-title {
			font-size: 1rem;
			color: rgba(255, 255, 255, 0.9);
			margin: 0 auto;
		}
	}

	.zodiac-card {
		background: white;
		border-radius: 24px;
		padding: 24rpx;
		margin-bottom: 24px;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;

		.zodiac-title {
			font-size: 50rpx;
			color: #2c3e50;
			font-weight: 600;
			margin-left: 20rpx;
			position: relative;
			padding-left: 30rpx;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 6px;
				height: 28px;
				background: linear-gradient(to bottom, #3498db, #8e44ad);
				border-radius: 3px;
			}
		}
	}

	.card-title {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid #f0f4ff;
	}

	.card-title h2 {
		font-size: 1.4rem;
		color: #2c3e50;
		font-weight: 600;
		margin-left: 12px;
	}

	.input-group {
		display: flex;
		margin-bottom: 20rpx;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);

		.input {
			flex: 1;
			padding: 16px 20px;
			border: none;
			font-size: 1rem;
			background: #f0f6ff;
			color: #2c3e50;
			outline: none;
		}

		.searchBtn {
			padding: 0 28px;
			color: white;
			border: none;
			font-size: 1.1rem;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.3s ease;
			background: linear-gradient(to right, #3498db, #8e44ad);
			font-family: 'Poppins', sans-serif;
			letter-spacing: 1px;
		}
	}




	.year-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 30rpx 0;
		padding: 18px;
		background: linear-gradient(to right, #f0f6ff, #e6eeff);
		border-radius: 16px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(52, 152, 219, 0.15);

		.btn {
			width: 45px;
			height: 45px;
			border-radius: 50%;
			background: linear-gradient(to right, #3498db, #8e44ad);
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.8rem;
			font-weight: bold;
			box-shadow: 0 4px 10px rgba(74, 105, 255, 0.3);
			border: none;
			cursor: pointer;
			transition: all 0.3s ease;
			margin: 0px;
		}

	}

	.year-value {
		font-size: 1.6rem;
		font-weight: bold;
		color: #2c3e50;
		min-width: 100px;
		text-align: center;
		font-family: 'Noto Serif SC', serif;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.result-container {
		margin-top: 20px;
		padding: 20rpx;
		border-radius: 20px;
		background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%);
		display: none;
		animation: fadeIn 0.6s ease forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result-header {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.zodiac-info {

		.zodiac-info-title {
			font-size: 50rpx;
			color: #2c3e50;
			margin-bottom: 4px;

			.span {
				font-size: 35rpx;
				display: inline;
				margin-left: 15rpx;
				color: #7f8c8d;
				font-weight: 400;
			}
		}

		.zodiac-info-desc {
			font-size: 0.9rem;
			color: #7f8c8d;
			display: inline-block;
			white-space: pre-wrap;
			word-break: break-word;
			background: rgba(52, 152, 219, 0.1);
			padding: 8px 15px;
			border-radius: 12px;
		}
	}


	.zodiac-icon {
		width: 80rpx;
		height: 80rpx;
		background: #f8faff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20px;
		box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
		font-size: 55rpx;
		color: #FFF;
		padding: 20rpx;
		flex-shrink: 0;
		font-weight: bold;
		transition: all 0.4s ease;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.5);
		}

		70% {
			box-shadow: 0 0 0 15px rgba(52, 152, 219, 0);
		}

		100% {
			box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
		}
	}

	.icon12 {
		font-size: 40rpx;
	}

	.description {
		margin-top: 20px;
		padding: 16px;
		background: white;
		border-radius: 16px;
		line-height: 1.7;
		font-size: 0.95rem;
		color: #444;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		border-left: 5px solid #3498db;
	}

	.description h4 {
		color: #4a69ff;
		margin-bottom: 8px;
		font-size: 1rem;
	}

	.zodiac-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10rpx;
		margin-top: 20px;
	}

	.zodiac-item {
		background: white;
		border-radius: 16px;
		padding: 10rpx;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 4px;
			background: linear-gradient(to right, #3498db, #8e44ad);
			transform: scaleX(0);
			transform-origin: left;
			transition: transform 0.4s ease;
		}


		.icon {
			font-size: 2rem;
			color: #4a69ff;
			margin-bottom: 10px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.zodiac-name {
			font-size: 60rpx;
			color: #2c3e50;
			margin-bottom: 4px;
		}

		.zodiac-desc {
			font-size: 30rpx;
			color: #7f8c8d;
		}
	}

	.zodiac-item.active {
		background: linear-gradient(to bottom right, #f0f6ff, #e6eeff);
		transform: translateY(-5px);
		box-shadow: 0 10px 22px rgba(0, 0, 0, 0.15);
	}

	.zodiac-item.active::before {
		transform: scaleX(1);
	}


	/* 生肖颜色样式 */
	.rat {
		background: linear-gradient(135deg, #ff9a9e, #fad0c4);
	}

	.ox {
		background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
	}

	.tiger {
		background: linear-gradient(135deg, #ffecd2, #fcb69f);
	}

	.rabbit {
		background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
	}

	.dragon {
		background: linear-gradient(135deg, #d4fc79, #96e6a1);
	}

	.snake {
		background: linear-gradient(135deg, #a6c0fe, #f68084);
	}

	.horse {
		background: linear-gradient(135deg, #fccb90, #d57eeb);
	}

	.goat {
		background: linear-gradient(135deg, #84fab0, #8fd3f4);
	}

	.monkey {
		background: linear-gradient(135deg, #f6d365, #fda085);
	}

	.rooster {
		background: linear-gradient(135deg, #f093fb, #f5576c);
	}

	.dog {
		background: linear-gradient(135deg, #5ee7df, #b490ca);
	}

	.pig {
		background: linear-gradient(135deg, #d299c2, #fef9d7);
	}
</style>