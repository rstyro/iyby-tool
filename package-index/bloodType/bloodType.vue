<template>
	<view class="container">
		<view class="header">
			<view class="header-content">
				<text class="title">血型遗传规律表</text>
				<text class="subtitle">了解血型遗传的科学规律，探索父母血型组合与子女血型之间的奇妙关系</text>
			</view>
		</view>

		<view class="calculator">
			<text class="calc-title">血型遗传计算器</text>
			<view class="selector-container">
				<view class="selector">
					<text class="label">父亲血型</text>
					<picker :value="fatherIndex" :range="bloodTypes" @change="fatherChange">
						<view class="blood-select">{{ bloodTypes[fatherIndex] }}</view>
					</picker>
				</view>

				<view class="selector">
					<text class="label">母亲血型</text>
					<picker :value="motherIndex" :range="bloodTypes" @change="motherChange">
						<view class="blood-select">{{ bloodTypes[motherIndex] }}</view>
					</picker>
				</view>
			</view>

			<view class="result-container">
				<text class="result-title">子女可能血型</text>
				<view class="result-value">
					<view v-for="(blood, index) in possibleBloodTypes" :key="index" class="blood-type"
						:class="'blood-' + blood">{{ blood }}</view>
					<text v-if="possibleBloodTypes.length === 0">无匹配数据</text>
				</view>
			</view>
		</view>
		
		<view class="card-container">
			
			<view class="card">
				<view class="card-header">
					<view class="card-icon">
						<cl-icon type="icon-xiexing" size="30" color="#fff" />
					</view>
					<text class="card-title">血型配对表</text>
				</view>
				<view class="table">
					<view class="tr">
						<view class="th">父母血型组合</view>
						<view class="th">子女可能血型</view>
						<view class="th">子女不可能血型</view>
					</view>
					<view class="tr">
						<view class="td">A + A</view>
						<view class="td">
							<view class="blood-type blood-A">A</view> 
							<view class="blood-type blood-O">O</view>
						</view>
						<view class="td">
							<view class="blood-type blood-B">B</view>
							<view class="blood-type blood-AB">AB</view>
						</view>
					</view>
					<view class="tr">
						<view class="td">A + B</view>
						<view class="td">
							<view class="blood-type blood-A">A</view>
							<view class="blood-type blood-B">B</view>
							<view class="blood-type blood-AB">AB</view>
							<view class="blood-type blood-O">O</view>
						</view>
						<view class="td">-</view>
					</view>
					<view class="tr">
						<view class="td">A + AB</view>
						<view class="td">
							<view class="blood-type blood-A">A</view>
							<view class="blood-type blood-B">B</view>
							<view class="blood-type blood-AB">AB</view>
						</view>
						<view class="td">
							<view class="blood-type blood-O">O</view>
						</view>
					</view>
					<view class="tr">
						<view class="td">A + O</view>
						<view class="td">
							<view class="blood-type blood-A">A</view>
							<view class="blood-type blood-O">O</view>
						</view>
						<view class="td">
							<view class="blood-type blood-B">B</view>
							<view class="blood-type blood-AB">AB</view>
						</view>
					</view>
					<view class="tr">
						<view class="td">B + B</view>
						<view class="td">
							<view class="blood-type blood-B">B</view>
							<view class="blood-type blood-O">O</view>
						</view>
						<view class="td">
							<view class="blood-type blood-A">A</view>
							<view class="blood-type blood-AB">AB</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-header">
					<view class="card-icon">
						<cl-icon type="icon-jiyintupu" size="30" color="#fff" />
					</view>
					<text class="card-title">血型遗传规律表</text>
				</view>
				<view class="table">
					<view class="tr">
						<view class="th">血型</view>
						<view class="th">基因型</view>
						<view class="th">遗传特性</view>
					</view>
					<view class="tr">
						<view class="td">
							<view class="blood-type blood-A">A</view>
						</view>
						<view class="td">AA 或 AO</view>
						<view class="td">A抗原，抗B抗体</view>
					</view>
					<view class="tr">
						<view class="td">
							<view class="blood-type blood-B">B</view>
						</view>
						<view class="td">BB 或 BO</view>
						<view class="td">B抗原，抗A抗体</view>
					</view>
					<view class="tr">
						<view class="td">
							<view class="blood-type blood-AB">AB</view>
						</view>
						<view class="td">AB</view>
						<view class="td">A和B抗原，无抗体</view>
					</view>
					<view class="tr">
						<view class="td">
							<view class="blood-type blood-O">O</view>
						</view>
						<view class="td">OO</view>
						<view class="td">无抗原，抗A和抗B抗体</view>
					</view>
				</view>
			</view>


		</view>



		<view class="science-section">
			<text class="science-title">血型遗传科学原理</text>
			<view class="science-content">
				<view class="science-card">
					<text class="title"><cl-icon type="minus" size="16" /> ABO血型系统</text>
					<text
						class="desc">ABO血型系统是人类最早发现的血型系统，由三个等位基因控制：I<sup>A</sup>、I<sup>B</sup>和i。其中I<sup>A</sup>和I<sup>B</sup>为共显性，i为隐性。</text>
				</view>

				<view class="science-card">
					<text class="title"><cl-icon type="minus" size="16" /> 遗传规律</text>
					<text class="desc">血型遗传遵循孟德尔遗传定律。子女的血型由父母双方各提供一个等位基因决定。例如，O型血父母只能生出O型血子女，AB型血父母不可能生出O型血子女。</text>
				</view>

				<view class="science-card">
					<text class="title"><cl-icon type="minus" size="16" /> 临床应用</text>
					<text class="desc">了解血型遗传规律在输血、器官移植、新生儿溶血病预防和法医学亲子鉴定等方面有重要意义。Rh血型系统同样重要，尤其是对孕妇的产前检查。</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				bloodTypes: ['A型', 'B型', 'AB型', 'O型'],
				fatherIndex: 0,
				motherIndex: 0,
				fatherBlood: 'A',
				motherBlood: 'A'
			}
		},
		computed: {
			possibleBloodTypes() {
				const bloodMap = {
					'A型': 'A',
					'B型': 'B',
					'AB型': 'AB',
					'O型': 'O'
				};
				const father = bloodMap[this.bloodTypes[this.fatherIndex]];
				const mother = bloodMap[this.bloodTypes[this.motherIndex]];
				const combinations = {
					'A+A': ['A', 'O'],
					'A+B': ['A', 'B', 'AB', 'O'],
					'A+AB': ['A', 'B', 'AB'],
					'A+O': ['A', 'O'],
					'B+B': ['B', 'O'],
					'B+AB': ['A', 'B', 'AB'],
					'B+O': ['B', 'O'],
					'AB+AB': ['A', 'B', 'AB'],
					'AB+O': ['A', 'B'],
					'O+O': ['O'],
					'B+A': ['A', 'B', 'AB', 'O'],
					'AB+A': ['A', 'B', 'AB'],
					'O+A': ['A', 'O'],
					'AB+B': ['A', 'B', 'AB'],
					'O+B': ['B', 'O'],
					'O+AB': ['A', 'B']
				};
				const key = `${father}+${mother}`;
				return combinations[key] || [];
			}
		},
		methods: {
			fatherChange(e) {
				this.fatherIndex = e.detail.value;
			},
			motherChange(e) {
				this.motherIndex = e.detail.value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
		margin: 0 auto;
		padding: 40rpx;
		min-height: 100vh;
		color: #333;
	}

	.header {
		text-align: center;
		margin: 30px 0;
	}

	.title {
		font-size: 48rpx;
		color: #2c3e50;
		margin-bottom: 15px;
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
		display: block;
		font-weight: bold;

		&:after {
			content: "";
			position: absolute;
			bottom: -20rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 160rpx;
			height: 8rpx;
			background: linear-gradient(to right, #3498db, #e74c3c);
			border-radius: 4rpx;
		}
	}

	.subtitle {
		font-size: 32rpx;
		color: #7f8c8d;
		max-width: 800px;
		margin: 0 auto;
		line-height: 1.6;
		display: block;
		margin-top: 40rpx;
	}

	.card-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400rpx, 1fr));
		gap: 30px;
		margin-bottom: 40px;
	}

	.card {
		background: white;
		border-radius: 20rpx;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		padding: 30rpx;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		padding-bottom: 20rpx;
		border-bottom: 2px solid #f0f4f8;
	}

	.card-icon {
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20px;
		color: white;
		font-size: 1.8rem;
	}

	.card-title {
		font-size: 36rpx;
		color: #2c3e50;
		font-weight: 600;
	}

	.table {
		width: 100%;
		margin-top: 40rpx;
		font-size: 32rpx;
	}

	.tr {
		display: flex;
		border-bottom: 1px solid #eee;
	}

	.th {
		flex: 1;
		background: linear-gradient(to right, #3498db, #2c98db);
		color: white;
		padding: 30rpx;
		text-align: center;
		font-weight: 500;
	}

	.td {
		flex: 1;
		padding: 20rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	.blood-type {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		text-align: center;
		font-weight: bold;
		color: white;
		margin: 0 6rpx;
	}

	.blood-A {
		background: linear-gradient(135deg, #e74c3c, #c0392b);
	}

	.blood-B {
		background: linear-gradient(135deg, #3498db, #2980b9);
	}

	.blood-AB {
		background: linear-gradient(135deg, #9b59b6, #8e44ad);
	}

	.blood-O {
		background: linear-gradient(135deg, #2ecc71, #27ae60);
	}

	.calculator {
		background: linear-gradient(135deg, #fff 0%, #f8fafd 100%);
		border-radius: 20px;
		padding: 35px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		margin: 40px 0;
	}

	.calc-title {
		text-align: center;
		font-size: 40rpx;
		color: #2c3e50;
		margin-bottom: 30px;
		position: relative;
		display: block;
		font-weight: bold;

		&:after {
			content: "";
			position: absolute;
			bottom: -20rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 240rpx;
			height: 8rpx;
			background: linear-gradient(to right, #3498db, #e74c3c);
			border-radius: 4rpx;
		}
	}

	.selector-container {
		display: flex;
		justify-content: center;
		gap: 40px;
		margin: 30px 0;
		flex-wrap: wrap;
	}

	.selector {
		text-align: center;
		flex: 1;
		min-width: 200px;
		max-width: 300px;
	}

	.label {
		display: block;
		margin-bottom: 15px;
		font-size: 34rpx;
		color: #2c3e50;
		font-weight: 500;
	}

	.blood-select {
		width: 93%;
		padding: 30rpx;
		border: none;
		border-radius: 24rpx;
		background: #f0f4f8;
		font-size: 34rpx;
		color: #2c3e50;
		text-align: center;
		cursor: pointer;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
		transition: all 0.3s;
	}

	.result-container {
		background: linear-gradient(135deg, #f8fafd 0%, #e4edf9 100%);
		border-radius: 30rpx;
		padding: 30px;
		margin-top: 30px;
		text-align: center;
		border: 2px dashed #3498db;
	}

	.result-title {
		font-size: 38rpx;
		color: #2c3e50;
		margin-bottom: 20px;
		display: block;
		font-weight: bold;
	}

	.result-value {
		font-size: 36rpx;
		font-weight: bold;
		color: #e74c3c;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 15px;
	}

	.science-section {
		background: linear-gradient(135deg, #fff 0%, #f8fafd 100%);
		border-radius: 40rpx;
		padding: 35px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		margin: 40px 0;
	}

	.science-title {
		text-align: center;
		font-size: 40rpx;
		color: #2c3e50;
		margin-bottom: 60rpx;
		position: relative;
		display: block;
		font-weight: bold;

		&:after {
			content: "";
			position: absolute;
			bottom: -20rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 240rpx;
			height: 8rpx;
			background: linear-gradient(to right, #3498db, #e74c3c);
			border-radius: 4rpx;
		}
	}

	.science-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400rpx, 1fr));
		gap: 30px;
	}

	.science-card {
		background: white;
		border-radius: 30rpx;
		padding: 25px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

		.title {
			color: #3498db;
			margin-bottom: 15px;
			font-size: 36rpx;
			display: block;
			text-align: center;
			font-weight: bold;
		}

		.desc {
			line-height: 1.7;
			color: #555;
			display: block;
		}
	}
</style>