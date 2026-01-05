/**
 * 太岁查询工具类
 */

// ===================== 基础常量定义 =====================
export const EARTHLY_BRANCHES = {
  ZI: { name: '子' },
  CHOU: { name: '丑' },
  YIN: { name: '寅' },
  MAO: { name: '卯' },
  CHEN: { name: '辰' },
  SI: { name: '巳' },
  WU: { name: '午' },
  WEI: { name: '未' },
  SHEN: { name: '申' },
  YOU: { name: '酉' },
  XU: { name: '戌' },
  HAI: { name: '亥' }
};

export const HEAVENLY_STEMS = {
  JIA: { name: '甲' },
  YI: { name: '乙' },
  BING: { name: '丙' },
  DING: { name: '丁' },
  WU: { name: '戊' },
  JI: { name: '己' },
  GENG: { name: '庚' },
  XIN: { name: '辛' },
  REN: { name: '壬' },
  GUI: { name: '癸' }
};

// 每个生肖新增icon字段
export const CHINESE_ZODIAC = {
  RAT: { name: '鼠', branch: EARTHLY_BRANCHES.ZI, icon: '🐭' },
  OX: { name: '牛', branch: EARTHLY_BRANCHES.CHOU, icon: '🐂' },
  TIGER: { name: '虎', branch: EARTHLY_BRANCHES.YIN, icon: '🐯' },
  RABBIT: { name: '兔', branch: EARTHLY_BRANCHES.MAO, icon: '🐰' },
  DRAGON: { name: '龙', branch: EARTHLY_BRANCHES.CHEN, icon: '🐲' },
  SNAKE: { name: '蛇', branch: EARTHLY_BRANCHES.SI, icon: '🐍' },
  HORSE: { name: '马', branch: EARTHLY_BRANCHES.WU, icon: '🐴' },
  GOAT: { name: '羊', branch: EARTHLY_BRANCHES.WEI, icon: '🐑' },
  MONKEY: { name: '猴', branch: EARTHLY_BRANCHES.SHEN, icon: '🐒' },
  ROOSTER: { name: '鸡', branch: EARTHLY_BRANCHES.YOU, icon: '🐔' },
  DOG: { name: '狗', branch: EARTHLY_BRANCHES.XU, icon: '🐶' },
  PIG: { name: '猪', branch: EARTHLY_BRANCHES.HAI, icon: '🐷' }
};

export const TAI_SUI_TYPE = {
  ZHI_TAI_SUI: { desc: '值太岁（本命年）' },
  CHONG_TAI_SUI: { desc: '冲太岁' },
  HAI_TAI_SUI: { desc: '害太岁' },
  XING_TAI_SUI: { desc: '刑太岁' },
  PO_TAI_SUI: { desc: '破太岁' },
  HE_LIU_TAI_SUI: { desc: '六合太岁' },
  HE_SAN_TAI_SUI: { desc: '三合太岁' }
};

// ===================== 太岁规则定义 =====================
const CHONG_RULES = [
  [EARTHLY_BRANCHES.ZI, EARTHLY_BRANCHES.WU],
  [EARTHLY_BRANCHES.CHOU, EARTHLY_BRANCHES.WEI],
  [EARTHLY_BRANCHES.YIN, EARTHLY_BRANCHES.SHEN],
  [EARTHLY_BRANCHES.MAO, EARTHLY_BRANCHES.YOU],
  [EARTHLY_BRANCHES.CHEN, EARTHLY_BRANCHES.XU],
  [EARTHLY_BRANCHES.SI, EARTHLY_BRANCHES.HAI]
];

const HAI_RULES = [
  [EARTHLY_BRANCHES.ZI, EARTHLY_BRANCHES.WEI],
  [EARTHLY_BRANCHES.CHOU, EARTHLY_BRANCHES.WU],
  [EARTHLY_BRANCHES.YIN, EARTHLY_BRANCHES.SI],
  [EARTHLY_BRANCHES.MAO, EARTHLY_BRANCHES.CHEN],
  [EARTHLY_BRANCHES.SHEN, EARTHLY_BRANCHES.HAI],
  [EARTHLY_BRANCHES.YOU, EARTHLY_BRANCHES.XU]
];

const PO_RULES = [
  [EARTHLY_BRANCHES.ZI, EARTHLY_BRANCHES.YOU],
  [EARTHLY_BRANCHES.CHOU, EARTHLY_BRANCHES.CHEN],
  [EARTHLY_BRANCHES.YIN, EARTHLY_BRANCHES.HAI],
  [EARTHLY_BRANCHES.MAO, EARTHLY_BRANCHES.WU],
  [EARTHLY_BRANCHES.SI, EARTHLY_BRANCHES.SHEN],
  [EARTHLY_BRANCHES.WEI, EARTHLY_BRANCHES.XU]
];

const HE_LIU_RULES = [
  [EARTHLY_BRANCHES.ZI, EARTHLY_BRANCHES.CHOU],
  [EARTHLY_BRANCHES.YIN, EARTHLY_BRANCHES.HAI],
  [EARTHLY_BRANCHES.MAO, EARTHLY_BRANCHES.XU],
  [EARTHLY_BRANCHES.CHEN, EARTHLY_BRANCHES.YOU],
  [EARTHLY_BRANCHES.SI, EARTHLY_BRANCHES.SHEN],
  [EARTHLY_BRANCHES.WU, EARTHLY_BRANCHES.WEI]
];

const HE_SAN_RULES = [
  [EARTHLY_BRANCHES.ZI, EARTHLY_BRANCHES.SHEN, EARTHLY_BRANCHES.CHEN],
  [EARTHLY_BRANCHES.HAI, EARTHLY_BRANCHES.MAO, EARTHLY_BRANCHES.WEI],
  [EARTHLY_BRANCHES.YIN, EARTHLY_BRANCHES.WU, EARTHLY_BRANCHES.XU],
  [EARTHLY_BRANCHES.SI, EARTHLY_BRANCHES.YOU, EARTHLY_BRANCHES.CHOU]
];

const XING_RULES = {
  WUEN: [EARTHLY_BRANCHES.YIN, EARTHLY_BRANCHES.SI, EARTHLY_BRANCHES.SHEN],
  WULI: [EARTHLY_BRANCHES.ZI, EARTHLY_BRANCHES.MAO],
  SHISHI: [EARTHLY_BRANCHES.CHOU, EARTHLY_BRANCHES.XU, EARTHLY_BRANCHES.WEI],
  SELF: [EARTHLY_BRANCHES.CHEN, EARTHLY_BRANCHES.WU, EARTHLY_BRANCHES.YOU, EARTHLY_BRANCHES.HAI]
};


/**
 * 根据地支查找对应生肖
 */
const getZodiacByBranch = (branch) => {
  return Object.values(CHINESE_ZODIAC).find(zodiac => zodiac.branch === branch);
};

/**
 * 处理JS负数取模问题
 */
const mod = (num, mod) => {
  return ((num % mod) + mod) % mod;
};

/**
 * 从双向配对规则中查找对应地支
 */
const findPairBranch = (rules, branch) => {
  for (const pair of rules) {
    if (pair.includes(branch)) {
      return pair[0] === branch ? pair[1] : pair[0];
    }
  }
  return null;
};

/**
 * 查找三合地支（排除自身）
 */
const findSanHeBranches = (branch) => {
  for (const group of HE_SAN_RULES) {
    if (group.includes(branch)) {
      return group.filter(item => item !== branch);
    }
  }
  return [];
};

/**
 * 查找双向刑太岁地支
 */
const findXingBranches = (branch) => {
  const xingList = [];
  if (XING_RULES.WUEN.includes(branch)) {
    xingList.push(...XING_RULES.WUEN.filter(item => item !== branch));
  }
  if (XING_RULES.WULI.includes(branch)) {
    xingList.push(...XING_RULES.WULI.filter(item => item !== branch));
  }
  if (XING_RULES.SHISHI.includes(branch)) {
    xingList.push(...XING_RULES.SHISHI.filter(item => item !== branch));
  }
  if (XING_RULES.SELF.includes(branch)) {
    xingList.push(branch);
  }
  return xingList;
};

/**
 * 通用构造方法
 */
const buildTaiSuiVoWithList = (type, mainBranch, branchList, isSanHe) => {
  const mainZodiac = getZodiacByBranch(mainBranch);
  // 有多个就添加icon图标
  const more = branchList.length>1;
  // 拼接「生肖(地支)」格式，顿号分隔
  const zodiacInfo = branchList.map(item => {
    const zodiac = getZodiacByBranch(item);
    return `${item.name}(${zodiac.name}${zodiac.icon})`;
  }).join('、');
  
  let desc = '';
  if (isSanHe) {
    desc = `${type.desc}：${mainBranch.name}(${mainZodiac.name}) 合局: ${zodiacInfo}`;
  } else {
    desc = `${type.desc}：${zodiacInfo}`;
  }

  return {
    type: type,
    earthlyBranch: mainBranch,
    zodiac: more?mainZodiac:getZodiacByBranch(branchList[0])||mainZodiac, // 这里的zodiac包含icon字段
    desc: desc
  };
};

/**
 * 基础构造方法
 */
const buildBaseTaiSuiVo = (type, branch) => {
  const zodiac = getZodiacByBranch(branch);
  return {
    type: type,
    earthlyBranch: branch,
    zodiac: zodiac, // 这里的zodiac包含icon字段
    desc: `${type.desc}：${branch.name}(${zodiac.name}${zodiac.icon})`
  };
};

// ===================== 核心业务方法 =====================
/**
 * 根据年份获取干支
 */
export const getYearGanZhi = (year) => {
  if (year < 1) {
    throw new Error('暂不支持公元前年份计算');
  }
  const stems = Object.values(HEAVENLY_STEMS);
  const branches = Object.values(EARTHLY_BRANCHES);
  const stemOffset = year - 4;
  const stemIndex = mod(stemOffset, 10);
  const branchOffset = year - 4;
  const branchIndex = mod(branchOffset, 12);
  return stems[stemIndex].name + branches[branchIndex].name;
};

/**
 * 从干支解析地支
 */
export const parseBranchFromGanZhi = (ganZhi) => {
  if (!ganZhi || ganZhi.length !== 2) {
    throw new Error('年干支格式错误，必须为2个字符（如甲辰）');
  }
  const branchName = ganZhi.charAt(1);
  return Object.values(EARTHLY_BRANCHES).find(item => item.name === branchName);
};

/**
 * 根据年份获取太岁信息
 */
export const getTaiSuiInfoByYear = (year) => {
  const taiSuiList = [];
  const ganZhi = getYearGanZhi(year);
  const yearBranch = parseBranchFromGanZhi(ganZhi);

  taiSuiList.push(buildBaseTaiSuiVo(TAI_SUI_TYPE.ZHI_TAI_SUI, yearBranch));

  const chongBranch = findPairBranch(CHONG_RULES, yearBranch);
  if (chongBranch) {
    taiSuiList.push(buildBaseTaiSuiVo(TAI_SUI_TYPE.CHONG_TAI_SUI, chongBranch));
  }

  const haiBranch = findPairBranch(HAI_RULES, yearBranch);
  if (haiBranch) {
    taiSuiList.push(buildBaseTaiSuiVo(TAI_SUI_TYPE.HAI_TAI_SUI, haiBranch));
  }

  const xingBranches = findXingBranches(yearBranch);
  if (xingBranches.length > 0) {
    taiSuiList.push(buildTaiSuiVoWithList(TAI_SUI_TYPE.XING_TAI_SUI, yearBranch, xingBranches, false));
  }

  const poBranch = findPairBranch(PO_RULES, yearBranch);
  if (poBranch) {
    taiSuiList.push(buildBaseTaiSuiVo(TAI_SUI_TYPE.PO_TAI_SUI, poBranch));
  }

  const heLiuBranch = findPairBranch(HE_LIU_RULES, yearBranch);
  if (heLiuBranch) {
    taiSuiList.push(buildBaseTaiSuiVo(TAI_SUI_TYPE.HE_LIU_TAI_SUI, heLiuBranch));
  }

  const sanHeBranches = findSanHeBranches(yearBranch);
  if (sanHeBranches.length > 0) {
    taiSuiList.push(buildTaiSuiVoWithList(TAI_SUI_TYPE.HE_SAN_TAI_SUI, yearBranch, sanHeBranches, true));
  }

  return taiSuiList;
};

// 新增：根据年份获取生肖（含icon），供页面调用
export const getZodiacByYear = (year) => {
  const branchOffset = year - 4;
  const branchIndex = mod(branchOffset, 12);
  const branches = Object.values(EARTHLY_BRANCHES);
  const targetBranch = branches[branchIndex];
  return getZodiacByBranch(targetBranch);
};

// 导出默认对象
export default {
  getYearGanZhi,
  parseBranchFromGanZhi,
  getTaiSuiInfoByYear,
  getZodiacByYear, // 新增导出
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  CHINESE_ZODIAC,
  TAI_SUI_TYPE
};