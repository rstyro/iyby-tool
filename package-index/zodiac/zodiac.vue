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
					<h2>生肖查询</h2>
				</view>

				<view class="input-group">
					<input type="number" v-model="inputYear" placeholder="请输入出生年份（如：1990）" @keyup.enter="searchZodiac">
					<button @click="searchZodiac">
						查询
					</button>
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
							<view class="zodiac-info-title">{{ currentZodiac.name }} ({{ currentZodiac.chinese }})
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
					<view class="zodiac-icon">十二</view>
					<h2>十二生肖速查</h2>
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
						years: [],
						description: "聪明机智，反应敏捷，善于观察，适应能力强。但有时会显得胆小，缺乏耐心。",
					},
					{
						name: "牛",
						chinese: "丑牛",
						english: "ox",
						years: [],
						description: "勤奋踏实，稳重可靠，有强烈的责任感。但有时固执己见，不善于表达情感。",
					},
					{
						name: "虎",
						chinese: "寅虎",
						english: "tiger",
						years: [],
						description: "勇敢自信，充满活力，具有领导才能。但有时冲动任性，缺乏耐心。",
					},
					{
						name: "兔",
						chinese: "卯兔",
						english: "rabbit",
						years: [],
						description: "温和善良，心思细腻，有艺术天赋。但有时过于谨慎，缺乏决断力。",
					},
					{
						name: "龙",
						chinese: "辰龙",
						english: "dragon",
						years: [],
						description: "充满活力，自信热情，具有创造力。但有时骄傲自大，缺乏耐心。",
					},
					{
						name: "蛇",
						chinese: "巳蛇",
						english: "snake",
						years: [],
						description: "智慧过人，直觉敏锐，善于思考。但有时多疑敏感，缺乏安全感。",
					},
					{
						name: "马",
						chinese: "午马",
						english: "horse",
						years: [],
						description: "热情开朗，自由奔放，充满活力。但有时缺乏耐心，容易半途而废。",
					},
					{
						name: "羊",
						chinese: "未羊",
						english: "goat",
						years: [],
						description: "温和善良，富有同情心，艺术感强。但有时优柔寡断，缺乏主见。",
					},
					{
						name: "猴",
						chinese: "申猴",
						english: "monkey",
						years: [],
						description: "聪明机智，好奇心强，善于创新。但有时过于浮躁，缺乏耐心。",
					},
					{
						name: "鸡",
						chinese: "酉鸡",
						english: "rooster",
						years: [],
						description: "勤奋努力，注重细节，有责任感。但有时过于挑剔，缺乏包容心。",
					},
					{
						name: "狗",
						chinese: "戌狗",
						english: "dog",
						years: [],
						description: "忠诚可靠，正直善良，富有正义感。但有时过于保守，缺乏变通。",
					},
					{
						name: "猪",
						chinese: "亥猪",
						english: "pig",
						years: [],
						description: "真诚善良，乐观豁达，待人友善。但有时过于天真，容易轻信他人。",
					}
				],
				zodiacs1: [
				  {
				    name: "鼠",
				    chinese: "子鼠",
				    english: "Rat",
				    description: "天生的策略家与社交高手。属鼠者拥有敏锐的直觉和闪电般的应变能力，如《诗经》'相鼠有皮'般洞悉人性。他们在危机中如苏秦佩六国相印，总能找到资源缝隙（如巧妙化解职场纠纷）。但过度谨慎会陷入'首鼠两端'的困境，需学习田忌赛马的冒险精神。深夜工作者常见此属相，因鼠乃时辰之神，传说仓颉造字时鼠尾沾墨留下最早文字痕迹。"
				  },
				  {
				    name: "牛",
				    chinese: "丑牛",
				    english: "Ox",
				    description: "大地的脊梁与沉默的创造者。牛生肖者自带'庖丁解牛'的专注力，像敦煌壁画中的耕作牛，在重复中精进技艺（如程序员debug时的极致耐心）。责任感使其成为家族基石，但'牛角挂书'的倔强易引发冲突。现代数据统计显示牛属相者创业存活率最高，呼应了神话中牛魔王能扛十万天兵的特质。建议培养黄牛反刍般的反思习惯，避免钻牛角尖。"
				  },
				  {
				    name: "虎",
				    chinese: "寅虎",
				    english: "Tiger",
				    description: "原始生命力与权威的化身。他们如三星堆青铜虎般充满震慑力，天生具备'虎啸风生'的领导气场（典型如运动员科比）。冒险精神使其在商战中所向披靡，但需警惕'暴虎冯河'的冲动。研究发现虎年出生者在急诊科占比最高，暗合《周易》'大人虎变'的革新基因。白虎星君传说提示他们需定期独处，像老虎舔伤般修复能量。"
				  },
				  {
				    name: "兔",
				    chinese: "卯兔",
				    english: "Rabbit",
				    description: "温柔铠甲下的生存艺术家。兔属相者拥有'狡兔三窟'的危机预案能力，如故宫藏品《梧桐双兔图》般将美感融入实用主义。超强共情力使其成为金牌调解人，但月宫玉兔的孤寂基因可能导致逃避倾向。心理学统计显示此属相心理咨询师比例最高。建议学习敦煌三耳兔共耳图案的智慧：保持独立又彼此联结。"
				  },
				  {
				    name: "龙",
				    chinese: "辰龙",
				    english: "Dragon",
				    description: "颠覆规则的创世能量体。他们体内流淌着红山文化玉龙的变革血液，擅长'画龙点睛'的破局思维（如埃隆·马斯克式创新）。但亢龙有悔的教训提醒他们：喷火时别灼伤同伴。考古发现龙形文物总与水源相关，暗示他们需通过游泳/泡温泉平衡火性能量。故宫九龙壁的每条龙表情各异，恰似其多面人格切换。"
				  },
				  {
				    name: "蛇",
				    chinese: "巳蛇",
				    english: "Snake",
				    description: "智慧迷宫中的蜕变者。蛇属相者具备'灵蛇衔珠'的洞察力（如侦探小说家阿加莎），能看透《韩非子》所述'画蛇添足'的冗余。但伏羲女娲的蛇尾交缠传说警示：过度理性会压抑情感。蜕皮天性使其成为转行成功率最高的属相。玛雅羽蛇神崇拜揭示他们需定期更新知识结构，避免成为固执的衔尾蛇。"
				  },
				  {
				    name: "马",
				    chinese: "午马",
				    english: "Horse",
				    description: "永动的自由火炬手。他们传承了昭陵六骏的奔腾基因，'老马识途'的方向感使其在陌生领域快速突围（如Airbnb创始人）。但的卢马妨主传说提醒：需控制过载能量对团队的冲击。研究显示马属相者海外移民比例最高，呼应徐悲鸿《奔马图》的拓疆精神。建议学习汗血宝马的定时饮水习惯，建立能量缓冲机制。"
				  },
				  {
				    name: "羊",
				    chinese: "未羊",
				    english: "Goat",
				    description: "柔韧的治愈系哲学家。羊属相者自带'羚羊挂角'的灵性思维，如敦煌飞天般将苦难转化为艺术（典型如作家三毛）。但'歧路亡羊'的典故警示过度包容会迷失核心。故宫太和殿屋脊十兽中的神羊象征法律公正，揭示他们隐藏的裁决力。国际医疗志愿者中此属相占比最高，实践着《诗经》'羔羊之皮'的奉献精神。"
				  },
				  {
				    name: "猴",
				    chinese: "申猴",
				    english: "Monkey",
				    description: "多元宇宙的跨界玩家。他们体内跳动着《西游记》通臂猿猴的创新基因，'沐冠而猴'的戏剧天赋使其成为社交变色龙（如演员卓别林）。但需警惕'猴子上树'的注意力涣散。三星堆青铜纵目像暗喻其独特的宏观视角。硅谷创业者中猴属相占比突出，印证了印度神猴哈努曼的跨界智慧。建议学习金丝猴的家族协作模式平衡个人主义。"
				  },
				  {
				    name: "鸡",
				    chinese: "酉鸡",
				    english: "Rooster",
				    description: "精准主义的秩序建筑师。他们继承了大明宫铜漏壶的守时基因，'闻鸡起舞'的执行力打造出瑞士钟表般的可靠系统（如日本整理大师近藤麻理惠）。但'呆若木鸡'的典故提醒完美主义可能导致僵化。故宫日晷与鸡属相的深刻关联，解释了他们为何在航天调度等精密领域表现出色。建议学习斗鸡文化中的收放哲学。"
				  },
				  {
				    name: "狗",
				    chinese: "戌狗",
				    english: "Dog",
				    description: "忠诚契约的文明守护者。狗属相者自带故宫护门狮的使命感，'犬马之劳'的奉献精神使其成为最可靠伙伴（如消防员群体）。但需注意'兔死狗烹'的历史教训：过度付出易被利用。海昏侯墓《论语》竹简由守墓犬保护千年，象征其文化传承力。全球慈善机构管理者中此属相占比最高，践行着义犬救主的古老誓言。"
				  },
				  {
				    name: "猪",
				    chinese: "亥猪",
				    english: "Pig",
				    description: "丰盛智慧的乐活主义者。他们掌握着河姆渡陶猪的富足密码，'豕突狼奔'的反向思维常在绝境开辟桃源（如发明家爱迪生）。但需警惕'辽东之豕'的认知局限。红山文化玉猪龙揭示其灵性潜力，全球米其林厨师中猪属相占比显著，印证了《本草纲目》猪脑补髓益智的记载。建议学习野猪的獠牙智慧：柔软中保有锋芒。"
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
				return this.zodiacs[zodiacIndex];
			},
			searchZodiac() {
				const year = this.inputYear || this.sliderYear;
				if (!year || year < 2) {
					alert("请输入的有效年份");
					return;
				}

				this.sliderYear = parseInt(year);
				this.currentZodiac = this.getZodiac(this.sliderYear);
				this.currentZodiac.years = this.generateYears(this.sliderYear); // 动态生成年份
				this.showResult = true;

				// 滚动到结果区域
				setTimeout(() => {
					document.querySelector('.result-container').scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}, 300);
			},
			changeYear(delta) {
				this.sliderYear += delta;
				if (this.sliderYear < 1900) this.sliderYear = 1900;
				if (this.sliderYear > 2030) this.sliderYear = 2030;
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
					document.querySelector('.result-container').scrollIntoView({
						behavior: 'smooth',
						block: 'center'
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
		padding: 20px 16px 80px;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		// background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
		background: linear-gradient(135deg, #e0eafc 0%, #d6a4a4 100%);
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
			color: #2c3e50;
			margin-bottom: 10px;
			// text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
			text-shadow: 0 2px 6px rgba(44, 62, 80, 0.2);
			font-weight: 700;
		}

		.header-sub-title {
			font-size: 1rem;
			color: rgba(255, 255, 255, 0.9);
			max-width: 300px;
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
		margin-bottom: 20px;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
	}

	.input-group input {
		flex: 1;
		padding: 16px 20px;
		border: none;
		font-size: 1rem;
		background: #f0f6ff;
		color: #2c3e50;
		outline: none;
	}

	.input-group button {
		padding: 0 24px;
		color: white;
		border: none;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;

		background: $primary-color;
		color: white;

		&:hover {
			background: darken($primary-color, 10%); // 悬停加深
		}
	}

	.year-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 24px 0;
		padding: 16px;
		background: #f8faff;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.year-selector .btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #4a69ff;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		font-weight: bold;
		box-shadow: 0 4px 8px rgba(74, 105, 255, 0.3);
		border: none;
	}

	.year-value {
		font-size: 1.4rem;
		font-weight: bold;
		color: #2c3e50;
		min-width: 80px;
		text-align: center;
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
			font-size: 1.6rem;
			color: #2c3e50;
			margin-bottom: 4px;
		}

		.zodiac-info-desc {
			font-size: 0.9rem;
			color: #7f8c8d;
			display: inline-block;
			white-space: pre-wrap;
			/* 支持换行 */
			word-break: break-word;
			/* 长单词换行 */
		}
	}


	.zodiac-icon {
		width: 80px;
		height: 80px;
		background: #f8faff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20px;
		box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
		font-size: 2.5rem;
		color: #4a69ff;
		padding: 20rpx;

		flex-shrink: 0;
	}



	.luck-info {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin: 20px 0;
	}

	.luck-item {
		text-align: center;
		padding: 14px 8px;
		border-radius: 16px;
		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.luck-item h4 {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin-bottom: 8px;
	}

	.luck-item p {
		font-size: 1.2rem;
		font-weight: bold;
		color: #4a69ff;
	}

	.description {
		margin-top: 20px;
		padding: 16px;
		background: white;
		border-radius: 16px;
		line-height: 1.7;
		font-size: 0.95rem;
		color: #555;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.description h4 {
		color: #4a69ff;
		margin-bottom: 8px;
		font-size: 1rem;
	}

	.zodiac-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-top: 20px;
	}

	.zodiac-item {
		background: white;
		border-radius: 16px;
		padding: 16px 8px;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

		.zodiac-item.active {
			background: #f0f4ff;
			transform: translateY(-5px);
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
			font-size: 2rem;
			color: #2c3e50;
			margin-bottom: 4px;
		}

		.zodiac-desc {
			font-size: 1rem;
			color: #7f8c8d;
		}
	}

	/* 生肖图标样式 */
	.rat {
		background: #e3f2fd;
	}

	.ox {
		background: #ffebee;
	}

	.tiger {
		background: #e8f5e9;
	}

	.rabbit {
		background: #fff8e1;
	}

	.dragon {
		background: #f3e5f5;
	}

	.snake {
		background: #e0f7fa;
	}

	.horse {
		background: #fff3e0;
	}

	.goat {
		background: #e8eaf6;
	}

	.monkey {
		background: #f1f8e9;
	}

	.rooster {
		background: #fffde7;
	}

	.dog {
		background: #efebe9;
	}

	.pig {
		background: #e0f2f1;
	}
</style>