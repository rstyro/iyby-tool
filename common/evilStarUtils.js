/**
 * 十二神煞工具类 - 优化版本
 * 根据年份计算各生肖对应的神煞
 */

// ===================== 神煞枚举定义 =====================
export const EVIL_STAR = {
  TAI_SUI: {
    name: '太岁',
    luckLevel: '中',
    desc: '值年之主，中性。冲/刑/破则转凶，合则平',
    aliases: ['太岁', '剑锋', '伏尸', '建'],
    color: '#ffcc00'
  },
  TAI_YANG: {
    name: '青龙',
    luckLevel: '吉',
    desc: '主喜事、贵人运，男性更利',
    aliases: ['太阳', '青龙', '天空', '除'],
    color: '#4CAF50'
  },
  SANG_MEN: {
    name: '丧门',
    luckLevel: '大凶',
    desc: '主孝服、病灾、大破财',
    aliases: ['丧门', '地丧', '满'],
    color: '#9C27B0'
  },
  TAI_YIN: {
    name: '六合',
    luckLevel: '吉',
    desc: '主财运与人缘',
    aliases: ['太阴', '六合', '勾绞', '贯索', '平'],
    color: '#4CAF50'
  },
  WU_GUI: {
    name: '官符',
    luckLevel: '大凶',
    desc: '主官非、诉讼、口舌纠纷',
    aliases: ['五鬼', '官符', '定'],
    color: '#9C27B0'
  },
  SI_FU: {
    name: '小耗',
    luckLevel: '小凶',
    desc: '主小破财、健康损耗、孝服隐忧',
    aliases: ['死符', '小耗', '执'],
    color: '#FF9800'
  },
  SUI_PO: {
    name: '岁破',
    luckLevel: '大凶',
    desc: '主大破财、事业败落、意外',
    aliases: ['岁破', '大耗', '破'],
    color: '#9C27B0'
  },
  LONG_DE: {
    name: '朱雀',
    luckLevel: '吉',
    desc: '主贵人、庇护、解厄，可化小凶',
    aliases: ['龙德', '朱雀', '紫微', '暴败', '天厄', '危'],
    color: '#4CAF50'
  },
  BAI_HU: {
    name: '白虎',
    luckLevel: '小凶',
    desc: '主血光、意外、官非',
    aliases: ['白虎', '飞廉', '指背', '成'],
    color: '#FF9800'
  },
  FU_DE: {
    name: '贵神',
    luckLevel: '吉',
    desc: '主祖荫、天赐福，可化凶为吉',
    aliases: ['福德', '贵神', '卷舌', '福星', '收'],
    color: '#4CAF50'
  },
  DIAO_KE: {
    name: '天狗',
    luckLevel: '小凶',
    desc: '主吊丧、孝服、内外灾',
    aliases: ['吊客', '天狗', '开'],
    color: '#FF9800'
  },
  BING_FU: {
    name: '病符',
    luckLevel: '大凶',
    desc: '主疾病、健康耗损、久病缠绵',
    aliases: ['病符', '闭'],
    color: '#9C27B0'
  }
};

// 神煞顺序（根据传统排列）
const EVIL_STAR_ORDER = [
  EVIL_STAR.TAI_SUI,     // 太岁
  EVIL_STAR.TAI_YANG,    // 青龙
  EVIL_STAR.SANG_MEN,    // 丧门
  EVIL_STAR.TAI_YIN,     // 六合
  EVIL_STAR.WU_GUI,      // 官符
  EVIL_STAR.SI_FU,       // 小耗
  EVIL_STAR.SUI_PO,      // 岁破
  EVIL_STAR.LONG_DE,     // 朱雀
  EVIL_STAR.BAI_HU,      // 白虎
  EVIL_STAR.FU_DE,       // 贵神
  EVIL_STAR.DIAO_KE,     // 天狗
  EVIL_STAR.BING_FU      // 病符
];

// ===================== 生肖定义 =====================
export const CHINESE_ZODIAC = [
  { name: '鼠', icon: '🐭', branch: '子', index: 0 },
  { name: '牛', icon: '🐮', branch: '丑', index: 1 },
  { name: '虎', icon: '🐯', branch: '寅', index: 2 },
  { name: '兔', icon: '🐰', branch: '卯', index: 3 },
  { name: '龙', icon: '🐉', branch: '辰', index: 4 },
  { name: '蛇', icon: '🐍', branch: '巳', index: 5 },
  { name: '马', icon: '🐎', branch: '午', index: 6 },
  { name: '羊', icon: '🐑', branch: '未', index: 7 },
  { name: '猴', icon: '🐒', branch: '申', index: 8 },
  { name: '鸡', icon: '🐔', branch: '酉', index: 9 },
  { name: '狗', icon: '🐶', branch: '戌', index: 10 },
  { name: '猪', icon: '🐷', branch: '亥', index: 11 }
];

// ===================== 吉凶等级配置 =====================
export const LUCK_LEVEL_CONFIG = {
  '大凶': {
    color: '#C41E3A',
    bgColor: '#FFF0F0',
    level: 0,
    lightColor: '#FFE6E6'
  },
  '小凶': {
    color: '#FF6B35',
    bgColor: '#FFF4E5',
    level: 1,
    lightColor: '#FFEFD5'
  },
  '中': {
    color: '#666666',
    bgColor: '#F5F5F5',
    level: 2,
    lightColor: '#EEEEEE'
  },
  '吉': {
    color: '#2E8B57',
    bgColor: '#F0FFF0',
    level: 3,
    lightColor: '#E6FFE6'
  }
};

// ===================== 工具方法 =====================

/**
 * 处理负数取模问题
 */
const mod = (num, mod) => {
  return ((num % mod) + mod) % mod;
};

/**
 * 获取当前年份
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * 根据年份计算地支索引
 */
const getYearBranchIndex = (year) => {
  // 公元4年为甲子年（地支子年）
  return mod(year - 4, 12);
};

/**
 * 根据年份获取生肖
 */
export const getZodiacByYear = (year) => {
  const index = getYearBranchIndex(year);
  return CHINESE_ZODIAC[index];
};

/**
 * 根据年份计算各生肖的神煞
 */
export const getEvilStarsByYear = (year) => {
  if (!year || typeof year !== 'number') {
    year = getCurrentYear();
  }
  
  const yearBranchIndex = getYearBranchIndex(year);
  const currentZodiac = getZodiacByYear(year);
  
  const result = CHINESE_ZODIAC.map((zodiac, index) => {
    // 计算偏移量
    let offset = mod(index - yearBranchIndex, 12);
    
    // 获取对应的神煞
    const evilStar = EVIL_STAR_ORDER[offset];
    const luckConfig = LUCK_LEVEL_CONFIG[evilStar.luckLevel];
    
    return {
      ...zodiac,
      evilStar: {
        ...evilStar,
        // 判断是否为太岁（本命生肖）
        isYearMaster: index === yearBranchIndex,
        // 简短的别名显示
        shortName: evilStar.aliases[0],
        // 详细描述
        fullDesc: `${evilStar.name}（${evilStar.luckLevel}）：${evilStar.desc}`
      },
      luckConfig,
      offset,
      year: year,
      displayInfo: `${zodiac.name}${zodiac.icon}(${zodiac.branch}) - ${evilStar.name}`
    };
  });
  
  return {
    list: result,
    year: year,
    yearZodiac: currentZodiac,
    summary: {
      total: result.length,
      greatMisfortune: result.filter(item => item.evilStar.luckLevel === '大凶').length,
      minorMisfortune: result.filter(item => item.evilStar.luckLevel === '小凶').length,
      neutral: result.filter(item => item.evilStar.luckLevel === '中').length,
      auspicious: result.filter(item => item.evilStar.luckLevel === '吉').length
    }
  };
};

/**
 * 获取吉凶等级分组
 */
export const getEvilStarsGroupedByLuck = (year) => {
  const data = getEvilStarsByYear(year);
  
  const grouped = {
    '大凶': [],
    '小凶': [],
    '中': [],
    '吉': []
  };
  
  data.list.forEach(item => {
    grouped[item.evilStar.luckLevel].push(item);
  });
  
  return {
    groups: grouped,
    summary: data.summary,
    year: data.year,
    yearZodiac: data.yearZodiac
  };
};

/**
 * 通过别名查找神煞
 */
export const findEvilStarByAlias = (alias) => {
  if (!alias || typeof alias !== 'string') {
    return null;
  }
  
  const lowerAlias = alias.trim().toLowerCase();
  
  for (const key in EVIL_STAR) {
    const star = EVIL_STAR[key];
    if (star.aliases.some(a => a.toLowerCase() === lowerAlias)) {
      return star;
    }
  }
  
  return null;
};

/**
 * 获取生肖详情
 */
export const getZodiacDetail = (zodiacName) => {
  return CHINESE_ZODIAC.find(z => z.name === zodiacName);
};



// 默认导出
export default {
  EVIL_STAR,
  CHINESE_ZODIAC,
  LUCK_LEVEL_CONFIG,
  getCurrentYear,
  getEvilStarsByYear,
  getEvilStarsGroupedByLuck,
  findEvilStarByAlias,
  getZodiacDetail,
  getZodiacByYear
};