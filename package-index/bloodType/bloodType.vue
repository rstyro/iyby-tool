<template>
	<view class="container">
		<!-- 简约标题区 -->
		<view class="title-section">
			<view class="title-badge">GENETIC</view>
			<text class="main-title">血型遗传计算器</text>
			<text class="subtitle">基于孟德尔遗传定律，科学预测子女血型</text>
		</view>

		<!-- 主计算区域 -->
		<view class="main-content">
			<!-- 父母血型选择器 -->
			<view class="selection-card">
				<view class="card-header">
					<view class="header-line"></view>
					<text class="card-title">选择父母血型</text>
					<view class="header-line"></view>
				</view>
				
				<view class="parents-selection">
					<view class="parent-card">
						<view class="parent-label">父亲</view>
						<picker :value="fatherIndex" :range="bloodTypes" @change="fatherChange" class="type-selector">
							<view class="selected-type" :class="'type-' + getBloodType(fatherIndex)">
								<view class="type-letter">{{ getBloodType(fatherIndex) }}</view>
								<view class="type-name">{{ bloodTypes[fatherIndex] }}</view>
							</view>
						</picker>
					</view>
					
					<view class="connector">+</view>
					
					<view class="parent-card">
						<view class="parent-label">母亲</view>
						<picker :value="motherIndex" :range="bloodTypes" @change="motherChange" class="type-selector">
							<view class="selected-type" :class="'type-' + getBloodType(motherIndex)">
								<view class="type-letter">{{ getBloodType(motherIndex) }}</view>
								<view class="type-name">{{ bloodTypes[motherIndex] }}</view>
							</view>
						</picker>
					</view>
				</view>
			</view>

			<!-- 计算结果 -->
			<view class="result-section" v-if="possibleBloodTypes.length > 0">
				<view class="result-header">
					<view class="result-dot"></view>
					<text class="result-title">可能血型与概率</text>
				</view>
				
				<view class="probability-display">
					<view v-for="(blood, index) in possibleBloodTypes" :key="index" class="probability-item">
						<view class="probability-type" :class="'probability-' + blood">
							<text class="type-symbol">{{ blood }}</text>
						</view>
						<view class="probability-info">
							<text class="probability-value">{{ getDetailedProbability(blood) }}</text>
							<view class="probability-bar">
								<view class="bar-fill" :style="{'width': getBarWidth(blood)}" :class="'bar-' + blood"></view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="genetic-hint">
					<text class="hint-text">基因型组合: {{ getGeneticCombination() }}</text>
				</view>
			</view>

			<!-- 遗传规则表格 -->
			<view class="rules-section">
				<view class="section-title">
					<view class="title-icon"></view>
					<text class="title-text">血型遗传规律</text>
				</view>
				
				<view class="rules-table">
					<view class="table-header">
						<text class="header-cell" style="flex: 1.5">父母组合</text>
						<text class="header-cell" style="flex: 2">子女可能血型</text>
						<text class="header-cell" style="flex: 1">概率分布</text>
					</view>
					
					<scroll-view scroll-y class="table-body" >
						<view v-for="(rule, index) in inheritanceRules" :key="index" class="table-row">
							<view class="row-cell" style="flex: 1.5">
								<view class="parent-combination">
									<view class="parent-type" :class="'parent-' + rule.parents.split('+')[0]">
										{{ rule.parents.split('+')[0] }}
									</view>
									<text class="combine-sign">+</text>
									<view class="parent-type" :class="'parent-' + rule.parents.split('+')[1]">
										{{ rule.parents.split('+')[1] }}
									</view>
								</view>
							</view>
							
							<view class="row-cell" style="flex: 2">
								<view class="child-types">
									<view v-for="(type, idx) in rule.children" :key="idx" 
										class="child-type" :class="'child-' + type">
										{{ type }}
									</view>
								</view>
							</view>
							
							<view class="row-cell" style="flex: 1">
								<text class="probability" :class="'prob-' + rule.probabilityType">
									{{ rule.probability }}
								</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- 血型知识 -->
			<view class="knowledge-section">
				<view class="section-title">
					<view class="title-icon"></view>
					<text class="title-text">血型知识</text>
				</view>
				
				<view class="knowledge-grid">
					<view v-for="(info, index) in bloodTypeInfo" :key="index" class="knowledge-card" :class="'card-' + info.type">
						<view class="knowledge-header">
							<view class="type-indicator" :class="'indicator-' + info.type"></view>
							<text class="type-name">{{ info.type }}型</text>
						</view>
						<view class="knowledge-content">
							<text class="type-desc">{{ info.description }}</text>
							<view class="type-details">
								<view class="detail-item">
									<text class="detail-label">抗原</text>
									<text class="detail-value">{{ info.antigen }}</text>
								</view>
								<view class="detail-item">
									<text class="detail-label">抗体</text>
									<text class="detail-value">{{ info.antibody }}</text>
								</view>
								<view class="detail-item">
									<text class="detail-label">基因型</text>
									<text class="detail-value">{{ info.genotype }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 遗传原理 -->
			<view class="principles-section">
				<view class="principles-header">
					<text class="principles-title">遗传学原理</text>
					<text class="principles-subtitle">ABO血型系统遗传规律</text>
				</view>
				
				<view class="principles-content">
					<view class="principle-item">
						<view class="principle-number">01</view>
						<view class="principle-text">
							<text class="principle-heading">等位基因遗传</text>
							<text class="principle-desc">由三个等位基因控制：Iᴬ、Iᴮ、i。Iᴬ和Iᴮ为共显性，i为隐性。</text>
						</view>
					</view>
					
					<view class="principle-item">
						<view class="principle-number">02</view>
						<view class="principle-text">
							<text class="principle-heading">孟德尔定律</text>
							<text class="principle-desc">遵循经典遗传学规律，父母各提供一个等位基因，组合决定子女血型。</text>
						</view>
					</view>
					
					<view class="principle-item">
						<view class="principle-number">03</view>
						<view class="principle-text">
							<text class="principle-heading">临床应用</text>
							<text class="principle-desc">在输血医学、器官移植、产前检查和法医学中具有重要意义。</text>
						</view>
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
				bloodTypes: ['A型', 'B型', 'AB型', 'O型'],
				fatherIndex: 0,
				motherIndex: 0,
				inheritanceRules: [
					{ parents: 'A+A', children: ['A', 'O'], probability: 'A:75% O:25%', probabilityType: 'high' },
					{ parents: 'A+B', children: ['A', 'B', 'AB', 'O'], probability: '各25%', probabilityType: 'equal' },
					{ parents: 'A+AB', children: ['A', 'B', 'AB'], probability: 'A:50% AB/B:25%', probabilityType: 'mixed' },
					{ parents: 'A+O', children: ['A', 'O'], probability: '各50%', probabilityType: 'equal' },
					{ parents: 'B+B', children: ['B', 'O'], probability: 'B:75% O:25%', probabilityType: 'high' },
					{ parents: 'B+AB', children: ['A', 'B', 'AB'], probability: 'B:50% AB/A:25%', probabilityType: 'mixed' },
					{ parents: 'B+O', children: ['B', 'O'], probability: '各50%', probabilityType: 'equal' },
					{ parents: 'AB+AB', children: ['A', 'B', 'AB'], probability: 'AB:50% A/B:25%', probabilityType: 'mixed' },
					{ parents: 'AB+O', children: ['A', 'B'], probability: '各50%', probabilityType: 'equal' },
					{ parents: 'O+O', children: ['O'], probability: '100%', probabilityType: 'high' }
				],
				bloodTypeInfo: [
					{ 
						type: 'A', 
						description: 'A型血是常见血型之一，拥有A抗原和抗B抗体。', 
						antigen: 'A抗原',
						antibody: '抗B抗体',
						genotype: 'AA/AO'
					},
					{ 
						type: 'B', 
						description: 'B型血拥有B抗原和抗A抗体，在全球分布较为广泛。', 
						antigen: 'B抗原',
						antibody: '抗A抗体',
						genotype: 'BB/BO'
					},
					{ 
						type: 'AB', 
						description: 'AB型血是较为稀少的血型，同时拥有A和B抗原，无天然抗体。', 
						antigen: 'A和B抗原',
						antibody: '无',
						genotype: 'AB'
					},
					{ 
						type: 'O', 
						description: 'O型血是最常见的血型，无A、B抗原，有抗A和抗B抗体。', 
						antigen: '无',
						antibody: '抗A、抗B',
						genotype: 'OO'
					}
				]
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
    onShareAppMessage(res) {
      return this.generateShareConfig();
    },
    onShareTimeline() {
      return this.generateShareConfig(true);
    },
    methods: {
      generateShareConfig(forTimeline = false) {
        const defaultTemplates = [
          "不止能查血型！这里还能根据父母血型预测你的可能血型",
          "分享一个好用小工具，快速查询血型。点击就能用"
        ];
        const shareContent = defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)];
        return {
          title: shareContent,
          path: 'package-index/bloodType/bloodType',
          ...(forTimeline && {
            imageUrl: this.$const.IMAGES.SHARE_URL
          })
        };
      },
			getBloodType(index) {
				return this.bloodTypes[index].replace('型', '');
			},
			
			getDetailedProbability(bloodType) {
				const combinations = {
					'A+A': { 'A': '75%', 'O': '25%' },
					'A+B': { 'A': '25%', 'B': '25%', 'AB': '25%', 'O': '25%' },
					'A+AB': { 'A': '50%', 'B': '25%', 'AB': '25%' },
					'A+O': { 'A': '50%', 'O': '50%' },
					'B+B': { 'B': '75%', 'O': '25%' },
					'B+AB': { 'A': '25%', 'B': '50%', 'AB': '25%' },
					'B+O': { 'B': '50%', 'O': '50%' },
					'AB+AB': { 'A': '25%', 'B': '25%', 'AB': '50%' },
					'AB+O': { 'A': '50%', 'B': '50%' },
					'O+O': { 'O': '100%' },
					'B+A': { 'A': '25%', 'B': '25%', 'AB': '25%', 'O': '25%' },
					'AB+A': { 'A': '50%', 'B': '25%', 'AB': '25%' },
					'O+A': { 'A': '50%', 'O': '50%' },
					'AB+B': { 'A': '25%', 'B': '50%', 'AB': '25%' },
					'O+B': { 'B': '50%', 'O': '50%' },
					'O+AB': { 'A': '50%', 'B': '50%' }
				};
				
				const father = this.getBloodType(this.fatherIndex);
				const mother = this.getBloodType(this.motherIndex);
				const key = `${father}+${mother}`;
				
				return combinations[key]?.[bloodType] || '计算中...';
			},
			
			getBarWidth(bloodType) {
				const probability = this.getDetailedProbability(bloodType);
				if (probability === '100%') return '100%';
				if (probability === '75%') return '75%';
				if (probability === '50%') return '50%';
				if (probability === '25%') return '25%';
				return '0%';
			},
			
			getGeneticCombination() {
				const father = this.getBloodType(this.fatherIndex);
				const mother = this.getBloodType(this.motherIndex);
				
				const genotypes = {
					'A': 'IAIA 或 IAi',
					'B': 'IBIB 或 IBi',
					'AB': 'IAIB',
					'O': 'ii'
				};
				
				return `${genotypes[father]} × ${genotypes[mother]}`;
			},
			
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
	background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
	min-height: 100vh;
	padding: 0 0 60rpx 0;
}

/* 标题区样式 */
.title-section {
	padding: 60rpx 40rpx 40rpx;
	text-align: center;
	background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
	border-bottom: 1px solid #e2e8f0;
	margin-bottom: 30rpx;
}

.title-badge {
	display: inline-block;
	background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	color: white;
	font-size: 20rpx;
	font-weight: 600;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	letter-spacing: 2rpx;
	text-transform: uppercase;
}

.main-title {
	font-size: 48rpx;
	font-weight: 700;
	color: #1e293b;
	display: block;
	margin-bottom: 12rpx;
	letter-spacing: -0.5rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #64748b;
	display: block;
	line-height: 1.5;
}

/* 主要内容区 */
.main-content {
	padding: 0 40rpx;
}

/* 选择器卡片 */
.selection-card {
	background: white;
	border-radius: 24rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1px solid #f1f5f9;
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
}

.header-line {
	flex: 1;
	height: 2rpx;
	background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.card-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #475569;
	padding: 0 20rpx;
	white-space: nowrap;
}

.parents-selection {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
}

.parent-card {
	flex: 1;
	text-align: center;
}

.parent-label {
	font-size: 28rpx;
	color: #64748b;
	margin-bottom: 20rpx;
	font-weight: 500;
}

.type-selector {
	display: block;
	width: 100%;
}

.selected-type {
	background: white;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	border: 2rpx solid #e2e8f0;
	transition: all 0.2s ease;
	position: relative;
	overflow: hidden;
}

.selected-type:active {
	transform: scale(0.98);
	background: #f8fafc;
}

.selected-type::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 6rpx;
	background: currentColor;
	opacity: 0.3;
}

.type-A::before { color: #ef4444; }
.type-B::before { color: #3b82f6; }
.type-AB::before { color: #8b5cf6; }
.type-O::before { color: #10b981; }

.type-letter {
	font-size: 48rpx;
	font-weight: 700;
	margin-bottom: 10rpx;
}

.type-A .type-letter { color: #ef4444; }
.type-B .type-letter { color: #3b82f6; }
.type-AB .type-letter { color: #8b5cf6; }
.type-O .type-letter { color: #10b981; }

.type-name {
	font-size: 28rpx;
	color: #64748b;
	font-weight: 500;
}

.connector {
	font-size: 40rpx;
	color: #94a3b8;
	font-weight: 300;
	padding: 0 20rpx;
}

/* 结果区 */
.result-section {
	background: white;
	border-radius: 24rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1px solid #f1f5f9;
}

.result-header {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.result-dot {
	width: 12rpx;
	height: 12rpx;
	background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	border-radius: 50%;
	margin-right: 12rpx;
}

.result-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1e293b;
}

/* 概率显示 */
.probability-display {
	margin-bottom: 30rpx;
}

.probability-item {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	padding: 20rpx;
	background: #f8fafc;
	border-radius: 16rpx;
	border: 1px solid #f1f5f9;
}

.probability-type {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
	font-weight: 700;
}

.probability-A { 
	background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
	border: 2rpx solid #fecaca;
	color: #dc2626;
}
.probability-B { 
	background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
	border: 2rpx solid #bfdbfe;
	color: #2563eb;
}
.probability-AB { 
	background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
	border: 2rpx solid #ddd6fe;
	color: #7c3aed;
}
.probability-O { 
	background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
	border: 2rpx solid #bbf7d0;
	color: #059669;
}

.type-symbol {
	font-size: 36rpx;
	font-weight: 700;
}

.probability-info {
	flex: 1;
}

.probability-value {
	font-size: 28rpx;
	color: #475569;
	font-weight: 600;
	margin-bottom: 12rpx;
	display: block;
}

.probability-bar {
	height: 8rpx;
	background: #e2e8f0;
	border-radius: 4rpx;
	overflow: hidden;
}

.bar-fill {
	height: 100%;
	border-radius: 4rpx;
	transition: width 0.6s ease;
}

.bar-A { background: linear-gradient(90deg, #ef4444, #dc2626); }
.bar-B { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.bar-AB { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.bar-O { background: linear-gradient(90deg, #10b981, #059669); }

.genetic-hint {
	background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
	border-radius: 12rpx;
	padding: 20rpx;
	border: 1px solid #e2e8f0;
	text-align: center;
}

.hint-text {
	font-size: 24rpx;
	color: #64748b;
	font-family: 'Courier New', monospace;
}

/* 规则表格 */
.rules-section {
	background: white;
	border-radius: 24rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1px solid #f1f5f9;
}

.section-title {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.title-icon {
	width: 4rpx;
	height: 24rpx;
	background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	border-radius: 2rpx;
	margin-right: 12rpx;
}

.title-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #1e293b;
}

.rules-table {
	border: 1px solid #e2e8f0;
	border-radius: 12rpx;
	overflow: hidden;
}

.table-header {
	display: flex;
	background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
	padding: 24rpx 20rpx;
	border-bottom: 1px solid #e2e8f0;
}

.header-cell {
	font-size: 26rpx;
	font-weight: 600;
	color: #475569;
	text-align: center;
	padding: 0 10rpx;
}

.table-body {
	height: 800rpx;
	max-height: 800rpx;
}

.table-row {
	display: flex;
	padding: 24rpx 20rpx;
	border-bottom: 1px solid #f1f5f9;
	align-items: center;
	background: white;
	transition: background 0.2s ease;
}

.table-row:last-child {
	border-bottom: none;
}

.table-row:active {
	background: #f8fafc;
}

.row-cell {
	padding: 0 10rpx;
	text-align: center;
}

.parent-combination {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
}

.parent-type {
	min-width: 60rpx;
	padding: 8rpx 12rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	font-weight: 600;
}

.parent-A { background: #fee2e2; color: #dc2626; }
.parent-B { background: #dbeafe; color: #2563eb; }
.parent-AB { background: #ede9fe; color: #7c3aed; }
.parent-O { background: #dcfce7; color: #059669; }

.combine-sign {
	color: #94a3b8;
	font-size: 24rpx;
	margin: 0 4rpx;
}

.child-types {
	display: flex;
	justify-content: center;
	gap: 8rpx;
	flex-wrap: wrap;
}

.child-type {
	min-width: 50rpx;
	padding: 6rpx 10rpx;
	border-radius: 6rpx;
	font-size: 22rpx;
	font-weight: 600;
}

.child-A { background: #fee2e2; color: #dc2626; }
.child-B { background: #dbeafe; color: #2563eb; }
.child-AB { background: #ede9fe; color: #7c3aed; }
.child-O { background: #dcfce7; color: #059669; }

.probability {
	font-size: 24rpx;
	font-weight: 500;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	display: inline-block;
}

.prob-high { background: #f0fdf4; color: #059669; }
.prob-equal { background: #f8fafc; color: #475569; }
.prob-mixed { background: #f5f3ff; color: #7c3aed; }

/* 知识区 */
.knowledge-section {
	margin-bottom: 30rpx;
}

.knowledge-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300rpx, 1fr));
	gap: 20rpx;
	margin-top: 20rpx;
}

.knowledge-card {
	background: white;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	border: 1px solid #f1f5f9;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.knowledge-card:active {
	transform: translateY(-2rpx);
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-A { border-top: 4rpx solid #ef4444; }
.card-B { border-top: 4rpx solid #3b82f6; }
.card-AB { border-top: 4rpx solid #8b5cf6; }
.card-O { border-top: 4rpx solid #10b981; }

.knowledge-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.type-indicator {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	margin-right: 12rpx;
}

.indicator-A { background: #ef4444; }
.indicator-B { background: #3b82f6; }
.indicator-AB { background: #8b5cf6; }
.indicator-O { background: #10b981; }

.type-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1e293b;
}

.type-desc {
	font-size: 24rpx;
	color: #64748b;
	line-height: 1.5;
	margin-bottom: 20rpx;
	display: block;
}

.type-details {
	background: #f8fafc;
	border-radius: 12rpx;
	padding: 20rpx;
}

.detail-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.detail-item:last-child {
	margin-bottom: 0;
}

.detail-label {
	font-size: 22rpx;
	color: #64748b;
	font-weight: 500;
}

.detail-value {
	font-size: 22rpx;
	color: #1e293b;
	font-weight: 600;
}

/* 原理区 */
.principles-section {
	background: white;
	border-radius: 24rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	border: 1px solid #f1f5f9;
}

.principles-header {
	margin-bottom: 40rpx;
	text-align: center;
}

.principles-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #1e293b;
	display: block;
	margin-bottom: 8rpx;
}

.principles-subtitle {
	font-size: 26rpx;
	color: #64748b;
	display: block;
}

.principles-content {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.principle-item {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
	padding: 30rpx;
	background: #f8fafc;
	border-radius: 16rpx;
	border: 1px solid #e2e8f0;
	transition: all 0.2s ease;
}

.principle-item:active {
	background: #f1f5f9;
	transform: translateX(4rpx);
}

.principle-number {
	font-size: 24rpx;
	font-weight: 700;
	color: #3b82f6;
	background: white;
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border: 2rpx solid #dbeafe;
}

.principle-text {
	flex: 1;
}

.principle-heading {
	font-size: 28rpx;
	font-weight: 600;
	color: #1e293b;
	display: block;
	margin-bottom: 8rpx;
}

.principle-desc {
	font-size: 24rpx;
	color: #64748b;
	line-height: 1.5;
	display: block;
}

/* 响应式调整 */
@media (min-width: 768px) {
	.main-content {
		max-width: 750px;
		margin: 0 auto;
	}
	
	.parents-selection {
		max-width: 500px;
		margin: 0 auto;
	}
	
	.knowledge-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>
