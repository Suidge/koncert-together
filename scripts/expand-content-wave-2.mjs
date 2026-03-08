import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");
const artistMediaDir = path.join(root, "public", "media", "artists");
const eventMediaDir = path.join(root, "public", "media", "events");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initials(name) {
  const parts = name.replace(/[^A-Za-z0-9 ]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "KT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function tint(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: Math.max(0, Math.min(255, Math.round(r + (255 - r) * amount))),
    g: Math.max(0, Math.min(255, Math.round(g + (255 - g) * amount))),
    b: Math.max(0, Math.min(255, Math.round(b + (255 - b) * amount)))
  });
}

function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: Math.max(0, Math.min(255, Math.round(r * (1 - amount)))),
    g: Math.max(0, Math.min(255, Math.round(g * (1 - amount)))),
    b: Math.max(0, Math.min(255, Math.round(b * (1 - amount))))
  });
}

const roleCycle = [
  "主舞台焦点",
  "高辨识 vocal tone",
  "现场气氛担当",
  "fan-cam 热门成员",
  "表演线亮点",
  "舞台能量中轴"
];

const memberProfileCycle = [
  "适合优先补充饭拍热区、返图讨论和舞台记忆点。",
  "适合在中文页里记录最常被问到的现场看点和站位印象。",
  "适合承接第一次入坑用户最容易搜索到的舞台关键词。",
  "适合和选座建议、安可互动、应援点一起整理。"
];

const timezoneByCountry = {
  "Japan": "Asia/Tokyo",
  "South Korea": "Asia/Seoul",
  "United States": "America/New_York",
  "Philippines": "Asia/Manila",
  "Hong Kong": "Asia/Hong_Kong",
  "Taiwan": "Asia/Taipei",
  "Singapore": "Asia/Singapore",
  "Malaysia": "Asia/Kuala_Lumpur",
  "France": "Europe/Paris",
  "United Kingdom": "Europe/London",
  "Macau": "Asia/Macau",
  "Indonesia": "Asia/Jakarta",
  "Thailand": "Asia/Bangkok",
  "Australia": "Australia/Sydney"
};

async function readJson(file) {
  return JSON.parse(await fs.readFile(path.join(dataDir, file), "utf8"));
}

function memberObject(name, index) {
  return {
    slug: slugify(name),
    name,
    role: roleCycle[index % roleCycle.length],
    profile: `${name} 的 profile 入口会优先整理舞台记忆点、饭拍热区和 ${memberProfileCycle[index % memberProfileCycle.length]}`,
    initials: initials(name)
  };
}

function artistSvg(artist) {
  const accentSoft = tint(artist.accent, 0.52);
  const accentDark = shade(artist.accent, 0.28);
  const band = tint(artist.accent, 0.18);
  const initialsText = initials(artist.name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="60" y1="40" x2="1100" y2="860" gradientUnits="userSpaceOnUse">
      <stop stop-color="${accentSoft}"/>
      <stop offset="1" stop-color="${accentDark}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" rx="48" fill="url(#bg)"/>
  <circle cx="900" cy="210" r="250" fill="rgba(255,247,236,0.18)"/>
  <circle cx="600" cy="362" r="188" fill="rgba(255,247,236,0.12)" stroke="rgba(255,247,236,0.34)" stroke-width="8"/>
  <path d="M138 714C256 578 406 514 546 514C686 514 804 592 942 734" stroke="${band}" stroke-width="24" stroke-linecap="round"/>
  <text x="600" y="400" text-anchor="middle" fill="#FFF7EC" font-size="92" font-family="Georgia, serif" letter-spacing="8">${initialsText}</text>
  <text x="96" y="128" fill="#FFF7EC" font-size="28" font-family="Arial, sans-serif" letter-spacing="7">KONCERT TOGETHER</text>
  <text x="96" y="690" fill="#FFF7EC" font-size="110" font-family="Georgia, serif" font-weight="700">${artist.name}</text>
  <text x="96" y="748" fill="#FFF7EC" font-size="34" font-family="Arial, sans-serif" opacity="0.88">${artist.nameKo}  •  ${artist.fandom}  •  ${artist.memberCount} members</text>
  <text x="96" y="814" fill="#FFF7EC" font-size="24" font-family="Arial, sans-serif" opacity="0.9">${artist.tagline}</text>
</svg>`;
}

function eventSvg(event, artist) {
  const accentSoft = tint(artist.accent, 0.55);
  const accentDark = shade(artist.accent, 0.3);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="720" viewBox="0 0 1200 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="card" x1="120" y1="40" x2="1080" y2="680" gradientUnits="userSpaceOnUse">
      <stop stop-color="${accentSoft}"/>
      <stop offset="1" stop-color="${accentDark}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" rx="42" fill="url(#card)"/>
  <circle cx="944" cy="144" r="164" fill="rgba(255,247,236,0.2)"/>
  <text x="96" y="126" fill="#FFF7EC" font-size="24" font-family="Arial, sans-serif" letter-spacing="6">TOUR CARD</text>
  <text x="96" y="286" fill="#FFF7EC" font-size="84" font-family="Georgia, serif" font-weight="700">${artist.name}</text>
  <text x="96" y="364" fill="#FFF7EC" font-size="72" font-family="Georgia, serif">${event.city}</text>
  <text x="96" y="428" fill="#FFF7EC" font-size="28" font-family="Arial, sans-serif">${event.country}  •  ${event.venue}</text>
  <text x="96" y="492" fill="#FFF7EC" font-size="24" font-family="Arial, sans-serif">${event.status.replaceAll("_", " ").toUpperCase()}  •  KONCERT TOGETHER</text>
</svg>`;
}

const newArtistSeeds = [
  { slug: "btob", name: "BTOB", nameKo: "비투비", fandom: "MELODY", accent: "#4e6c8a", agency: "BTOB Company", debutYear: 2012, origin: "South Korea", officialUrl: "https://www.instagram.com/offclbtob/", genres: ["Legacy", "Band-ish", "Arena"], tagline: "Legacy vocal group suited to seated-arena guidance", intro: "适合作为声场、座位舒适度和 long-run fandom 内容的代表页。", members: ["Eunkwang", "Minhyuk", "Changsub", "Hyunsik", "Peniel"] },
  { slug: "evnne", name: "EVNNE", nameKo: "이븐", fandom: "ENNVE", accent: "#75655a", agency: "Jellyfish Entertainment", debutYear: 2023, origin: "South Korea", officialUrl: "https://www.instagram.com/evnne_official/", genres: ["Fancon", "Rookie", "Travel"], tagline: "Fast-moving fancon routing with rising demand", intro: "适合作为 fancon 到 arena 过渡阶段男团的追踪页。", members: ["Keita", "Park Hanbin", "Lee Jeonghyeon", "Yoo Seungeon", "Ji Yunseo", "Mun Junghyun", "Park Jihoo"] },
  { slug: "got7", name: "GOT7", nameKo: "갓세븐", fandom: "iGOT7", accent: "#5c7b67", agency: "Warner Music Korea", debutYear: 2014, origin: "South Korea", officialUrl: "https://www.instagram.com/got7.with.igot7/", genres: ["Legacy", "Global", "Arena"], tagline: "Legacy act worth keeping on long-term reunion watch", intro: "适合作为团体回归和成员 solo 联动的长期监测页。", members: ["Jay B", "Mark", "Jackson", "Jinyoung", "Youngjae", "BamBam", "Yugyeom"] },
  { slug: "h1-key", name: "H1-KEY", nameKo: "하이키", fandom: "M1-KEY", accent: "#8a695c", agency: "GLG", debutYear: 2022, origin: "South Korea", officialUrl: "https://www.instagram.com/h1key_official/", genres: ["Rookie", "Festival", "Asia"], tagline: "Smaller venue act suited to theatre-scale guidance", intro: "适合作为中小型场馆和 festival 兼容路线的补充页。", members: ["Seoi", "Riina", "Hwiseo", "Yel"] },
  { slug: "izna", name: "izna", nameKo: "이즈나", fandom: "naya", accent: "#7a5b73", agency: "WAKEONE", debutYear: 2024, origin: "South Korea", officialUrl: "https://www.instagram.com/izna_official/", genres: ["Rookie", "Watchlist", "Fandom"], tagline: "Fresh rookie entry for early fandom monitoring", intro: "适合作为刚起步的新团页，先铺官方入口和巡演雷达。", members: ["Mai", "Jeemin", "Jiyoon", "Koko", "Sarang", "Jeongeun", "Saebi"] },
  { slug: "kep1er", name: "Kep1er", nameKo: "케플러", fandom: "Kep1ian", accent: "#6b7fa0", agency: "WAKEONE", debutYear: 2022, origin: "South Korea", officialUrl: "https://www.instagram.com/official.kep1er/", genres: ["Arena", "Japan", "Travel"], tagline: "Japan-linked routing makes them useful for ticketing comparisons", intro: "适合作为日韩两地票务机制对照的样板艺人页。", members: ["Yujin", "Xiaoting", "Chaehyun", "Dayeon", "Hikaru", "Huening Bahiyyih", "Youngeun"] },
  { slug: "kickflip", name: "KickFlip", nameKo: "킥플립", fandom: "Kickies", accent: "#7e7d4f", agency: "JYP Entertainment", debutYear: 2025, origin: "South Korea", officialUrl: "https://www.instagram.com/kickflip_official/", genres: ["Rookie", "Watchlist", "Travel"], tagline: "Early-cycle boy group suited to radar-first coverage", intro: "适合作为先做官方入口、后补日期卡片的新团模板。", members: ["Kyehoon", "Amaru", "Donghwa", "Juwang", "Minje", "Keiju", "Donghyeon"] },
  { slug: "nexz", name: "NEXZ", nameKo: "넥스지", fandom: "NEX2Y", accent: "#5d7793", agency: "JYP Entertainment", debutYear: 2024, origin: "Japan / South Korea", officialUrl: "https://nexz-official.com/", genres: ["Japan", "Rookie", "Arena"], tagline: "Japan-heavy routing broadens the site beyond Korea-first tours", intro: "适合作为日本市场和韩日双线运营艺人的样板页。", members: ["Tomoya", "Yu", "Haru", "So Geon", "Seita", "Hyui", "Yuki"] },
  { slug: "oneus", name: "ONEUS", nameKo: "원어스", fandom: "TO MOON", accent: "#6b5c85", agency: "RBW", debutYear: 2019, origin: "South Korea", officialUrl: "https://www.instagram.com/official_oneus/", genres: ["Travel", "Arena", "Asia"], tagline: "Reliable touring act for mid-size venue coverage", intro: "适合作为中型场馆和多城市 travel planning 的补充页。", members: ["Seoho", "Leedo", "Keonhee", "Hwanwoong", "Xion"] },
  { slug: "p1harmony", name: "P1Harmony", nameKo: "피원하모니", fandom: "P1ece", accent: "#79614d", agency: "FNC Entertainment", debutYear: 2020, origin: "South Korea", officialUrl: "https://p1harmony.us/", genres: ["North America", "Arena", "Travel"], tagline: "North America routing makes them useful for venue-guide expansion", intro: "适合作为北美中型 arena 和 theatre 场馆攻略样板。", members: ["Keeho", "Theo", "Jiung", "Intak", "Soul", "Jongseob"] },
  { slug: "plave", name: "PLAVE", nameKo: "플레이브", fandom: "PLLl", accent: "#666a93", agency: "VLAST", debutYear: 2023, origin: "South Korea", officialUrl: "https://weverse.io/plave", genres: ["Virtual", "Arena", "Fandom"], tagline: "Virtual idol act with distinct fandom behavior worth tracking", intro: "适合作为不同内容消费路径和 fandom 行为的特殊样板页。", members: ["Yejun", "Noah", "Bamby", "Eunho", "Hamin"] },
  { slug: "qwer", name: "QWER", nameKo: "큐더블유이알", fandom: "Bawige", accent: "#5e7b76", agency: "Tamago Production", debutYear: 2023, origin: "South Korea", officialUrl: "https://www.instagram.com/qwerband_official/", genres: ["Band", "Festival", "Theater"], tagline: "Band-format live act suited to theatre and festival guidance", intro: "适合作为剧场型乐队场和 festival 内容的扩展样本。", members: ["Chodan", "Magenta", "Hina", "Siyeon"] },
  { slug: "stayc", name: "STAYC", nameKo: "스테이씨", fandom: "SWITH", accent: "#946069", agency: "High Up Entertainment", debutYear: 2020, origin: "South Korea", officialUrl: "https://www.instagram.com/stayc_highup/", genres: ["Arena", "Asia", "Travel"], tagline: "Strong Asia demand with girl-group venue questions", intro: "适合作为亚洲女团巡演和中型场馆路线的补充页。", members: ["Sumin", "Sieun", "Isa", "Seeun", "Yoon", "J"] },
  { slug: "super-junior", name: "SUPER JUNIOR", nameKo: "슈퍼주니어", fandom: "E.L.F.", accent: "#4d6681", agency: "SM Entertainment", debutYear: 2005, origin: "South Korea", officialUrl: "https://www.smtown.com/", genres: ["Legacy", "Arena", "Asia"], tagline: "Legacy act with steady Asia demand and long-tail fandom", intro: "适合作为资深男团和大龄 fandom 观演偏好的长期内容入口。", members: ["Leeteuk", "Heechul", "Yesung", "Shindong", "Eunhyuk", "Donghae", "Siwon", "Ryeowook", "Kyuhyun"] },
  { slug: "triples", name: "tripleS", nameKo: "트리플에스", fandom: "WAV", accent: "#6c7391", agency: "MODHAUS", debutYear: 2023, origin: "South Korea", officialUrl: "https://www.mod-haus.com/", genres: ["Fandom", "Showcase", "Asia"], tagline: "Fandom-heavy structure that benefits from profile-rich pages", intro: "适合作为成员结构复杂、内容入口很多的艺人页样本。", members: ["Seoyeon", "Jiwoo", "Chaeyeon", "Yubin", "Soomin", "Nakyoung", "Kotone", "Nien", "Joobin", "Kaede", "Dahyun", "Lynn"] },
  { slug: "woodz", name: "WOODZ", nameKo: "우즈", fandom: "MOODZ", accent: "#835f4d", agency: "EDAM Entertainment", debutYear: 2018, origin: "South Korea", officialUrl: "https://www.instagram.com/woodz_dnwm/", genres: ["Solo", "Festival", "Arena"], tagline: "Solo act that expands the live mix beyond idol groups", intro: "适合作为 solo live、festival 和 theatre 兼容型艺人的页面。", members: ["WOODZ"] }
];

const eventSeeds = [
  ["btob", "Seoul", "South Korea", "Jamsil Indoor Stadium", "2026-06-21T18:00:00+09:00", "announced", ["Legacy", "Korea", "Seats"], "资深 vocal 团场次优先比较音场和正中区块。", "看台正中常比低层斜角更稳。", "蚕室一带散场人流大，返程最好提前想好。", ["优先看正中区块", "确认实名信息", "预留返程时间"]],
  ["evnne", "Seoul", "South Korea", "Olympic Hall", "2026-09-06T18:00:00+09:00", "announced", ["Fancon", "Korea", "Membership"], "fancon 场更要看福利票和会员入口。", "福利差异可能大于座位差异。", "小场馆排队节奏快，提早到场更稳。", ["确认会员入口", "核对福利说明", "提前到场"]],
  ["got7", "Seoul", "South Korea", "KSPO Dome", "2026-12-20T18:00:00+09:00", "announced", ["Legacy", "Korea", "Reunion"], "回归类场次优先看官宣和实名细节。", "需求高时尽量减少临场决策。", "首尔场适合提前锁住宿和返程。", ["盯紧官宣", "确认实名规则", "提早订住宿"]],
  ["h1-key", "Taipei", "Taiwan", "Legacy Taipei", "2026-11-14T19:30:00+08:00", "announced", ["Theater", "Taiwan", "Travel"], "剧场场更看视角和到场时机。", "靠前站位和坐席体验差距明显。", "台北夜间返程稳定，但仍要确认末班。", ["确认入场顺序", "比较前区与中区", "看捷运末班"]],
  ["izna", "Seoul", "South Korea", "Blue Square Mastercard Hall", "2026-10-31T18:00:00+09:00", "announced", ["Rookie", "Theater", "Watchlist"], "新团小中场更适合先看入场和福利。", "不同票档的近距离体验差别大。", "蓝色广场场次更适合提早到场。", ["看福利票规则", "提早排队", "确认楼层"]],
  ["kep1er", "Yokohama", "Japan", "K-Arena Yokohama", "2026-10-11T18:00:00+09:00", "announced", ["Japan", "Arena", "Travel"], "日本场优先看抽选和电子票。", "二轮抽选往往也有机会。", "横滨返程和住宿可一起规划。", ["确认抽选轮次", "核对电子票", "规划返程"]],
  ["kickflip", "Seoul", "South Korea", "Yes24 Live Hall", "2026-11-22T18:00:00+09:00", "announced", ["Rookie", "Korea", "Watchlist"], "新团 live hall 更适合先看入场和站位。", "别忽略包袋和排队规则。", "广津区场次散场后转地铁很关键。", ["确认包袋规则", "提早到场", "看排队信息"]],
  ["nexz", "Osaka", "Japan", "Asue Arena Osaka", "2026-09-27T18:00:00+09:00", "announced", ["Japan", "Arena", "Travel"], "日本路线要优先看账号和抽选。", "先准备支付方式和取票方式。", "大阪返程列车要提前确认。", ["准备日区账号", "确认取票方式", "预留返程"]],
  ["oneus", "Bangkok", "Thailand", "Thunder Dome", "2026-12-05T19:00:00+07:00", "announced", ["Asia", "Arena", "Travel"], "泰国中型 arena 场更要看交通和站席。", "支付成功率比多开几个页面更重要。", "散场交通提早锁定。", ["确认支付方式", "查看站席规则", "预订返程"]],
  ["p1harmony", "Newark", "United States", "Prudential Center", "2026-10-18T20:00:00-04:00", "announced", ["North America", "Arena", "Travel"], "北美场优先看 presale 和停车。", "下层看台与 floor 的性价比差异很大。", "纽瓦克返程和酒店区位要提前确认。", ["确认 presale", "比较区块", "确认返程"]],
  ["plave", "Seoul", "South Korea", "Gocheok Sky Dome", "2026-11-28T18:00:00+09:00", "announced", ["Korea", "Dome", "Fandom"], "高关注度场次更要盯官方。", "高尺场视角和大屏体验要一起考虑。", "散场交通缓冲要留足。", ["盯紧官宣", "比较视野", "预留缓冲"]],
  ["qwer", "Seoul", "South Korea", "Olympic Hall", "2026-10-04T18:00:00+09:00", "on_sale", ["Band", "Korea", "Theater"], "乐队场更值得看音场和视线。", "正中看台常比侧面更稳。", "奥林匹克公园区域散场节奏固定。", ["优先看音场", "选正中区", "提早返程"]],
  ["stayc", "Seoul", "South Korea", "Handball Gymnasium", "2026-09-13T18:00:00+09:00", "announced", ["Korea", "Arena", "Travel"], "手球馆更需要提早看区块图。", "近舞台不一定更适合看全景。", "园区演出日人流固定偏大。", ["确认区块图", "比较近区和中区", "预留返程"]],
  ["super-junior", "Taipei", "Taiwan", "Taipei Arena", "2026-12-12T19:30:00+08:00", "announced", ["Legacy", "Taiwan", "Arena"], "资深团台北场更适合看区块和交通。", "台北小巨蛋的正中区块通常更稳。", "住宿和捷运末班时间要提前看。", ["看正中区块", "确认返程", "提早订酒店"]],
  ["triples", "Taipei", "Taiwan", "TICC", "2026-10-25T19:30:00+08:00", "announced", ["Showcase", "Taiwan", "Travel"], "多人结构艺人更适合先看舞台覆盖和屏幕。", "剧院型场馆更看正面视角。", "信义区返程方便，但仍要确认末班。", ["优先正面区", "确认入场时间", "规划返程"]],
  ["woodz", "Seoul", "South Korea", "YES24 Live Hall", "2026-09-20T18:00:00+09:00", "announced", ["Solo", "Korea", "Theater"], "solo 场更值得看视角和音场。", "站席与坐席体验差异很大。", "广津区返程地铁更稳。", ["确认站席规则", "看好区块", "提早到场"]],
  ["h1-key", "Seoul", "South Korea", "MUV Hall", "2026-08-30T18:00:00+09:00", "announced", ["Korea", "Theater", "Rookie"], "中小型场馆更看视角和队列。", "福利票说明比票档名字更重要。", "江南区域散场打车成本要先估。", ["确认福利", "提前排队", "估算打车"]],
  ["aespa", "Los Angeles", "United States", "Kia Forum", "2026-12-19T20:00:00-08:00", "announced", ["North America", "Arena", "Travel"], "论坛场更适合比较 floor 与 lower bowl。", "停车和网约车预算都要单独算。", "Inglewood 演出日交通拥堵明显。", ["比较区块", "预留停车预算", "提前出发"]],
  ["day6", "Jakarta", "Indonesia", "Tennis Indoor Senayan", "2026-11-21T19:00:00+07:00", "announced", ["Band", "Asia", "Travel"], "乐队场要优先看音场和到场时机。", "印尼平台支付和取票方式要确认。", "Senayan 区域返程时间不可低估。", ["确认支付", "看音场", "预留返程"]],
  ["fromis-9", "Seoul", "South Korea", "Olympic Hall", "2026-09-14T18:00:00+09:00", "announced", ["Korea", "Live", "Fandom"], "核心饭观演更适合关注官宣和队列。", "福利和场馆动线值得单独整理。", "园区演出日提前到场更稳。", ["盯官宣", "看福利", "提早到场"]],
  ["gidle", "Paris", "France", "Accor Arena", "2026-11-07T20:00:00+01:00", "announced", ["Europe", "Arena", "Travel"], "欧洲场更看平台账户地区和支付。", "巴黎夜间返程要提前规划。", "VIP 和普通票入场时间差要看清。", ["确认账户地区", "看入场时间", "规划返程"]],
  ["illit", "Seoul", "South Korea", "Olympic Hall", "2026-10-12T18:00:00+09:00", "announced", ["Rookie", "Korea", "Membership"], "新团首尔场优先看会员路径。", "福利差异要比票档名字更重要。", "排队和队列节奏值得提前看。", ["确认会员入口", "核对福利", "提前到场"]],
  ["jin", "Osaka", "Japan", "Osaka-jō Hall", "2026-09-05T18:00:00+09:00", "announced", ["Solo", "Japan", "Membership"], "solo 日本场优先看抽选和会员。", "电子票和入场证件细节不能漏。", "大阪市区返程路线提早锁定。", ["确认抽选", "核对电子票", "规划返程"]],
  ["jimin", "Singapore", "Singapore", "Singapore Indoor Stadium", "2026-11-01T19:30:00+08:00", "announced", ["Solo", "Asia", "Travel"], "新加坡场要先看支付和公开发售。", "不同平台支持的卡不同。", "酒店优先沿地铁线。", ["确认支付方式", "留意公开发售", "订好酒店"]],
  ["jung-kook", "Los Angeles", "United States", "Crypto.com Arena", "2026-12-06T20:00:00-08:00", "announced", ["Solo", "North America", "Arena"], "高需求 solo 场更要先准备 presale。", "Floor 和 lower bowl 的取舍要提前想。", "LA 返程别临时决定。", ["准备 presale", "比较区块", "确认返程"]],
  ["kiss-of-life", "Bangkok", "Thailand", "Thunder Dome", "2026-10-26T19:00:00+07:00", "announced", ["Asia", "Travel", "Arena"], "曼谷场更看支付和交通。", "站席和坐席规则要先确认。", "散场交通最好提前锁定。", ["确认支付", "看站席规则", "预订返程"]],
  ["meovv", "Tokyo", "Japan", "Tokyo Garden Theater", "2026-11-15T18:00:00+09:00", "announced", ["Japan", "Rookie", "Travel"], "新团日本场要优先看抽选。", "电子票和发券方式更关键。", "丰洲区域返程路线要先确认。", ["确认抽选", "核对电子票", "规划返程"]],
  ["monsta-x", "Seoul", "South Korea", "KSPO Dome", "2026-11-29T18:00:00+09:00", "announced", ["Legacy", "Korea", "Arena"], "回归类男团场次更适合盯官方。", "区块视野和音场要同时看。", "奥林匹克公园返程别压最后一班车。", ["盯官宣", "比较视野", "提早返程"]],
  ["nct-127", "Bangkok", "Thailand", "Impact Arena", "2026-12-13T19:00:00+07:00", "announced", ["Asia", "Arena", "Travel"], "泰国 arena 场要把支付和返程一起考虑。", "不同区块对延伸台视野差异明显。", "Impact 周边住宿价值很高。", ["确认支付", "比较视野", "订周边酒店"]],
  ["newjeans", "Seoul", "South Korea", "Jamsil Indoor Stadium", "2026-12-27T18:00:00+09:00", "announced", ["Korea", "Global", "Watchlist"], "高关注艺人场次先盯官宣和实名。", "小到中型场更要提前看队列。", "蚕室返程和住宿提早安排。", ["盯官宣", "确认实名", "提早订住宿"]],
  ["red-velvet", "Manila", "Philippines", "Smart Araneta Coliseum", "2026-11-08T19:00:00+08:00", "announced", ["Legacy", "Asia", "Arena"], "legacy 女团菲律宾场更要看票档和交通。", "不同票档福利差异值得先看。", "Araneta 一带返程不要临时决定。", ["看福利差异", "确认支付", "规划返程"]],
  ["shinee", "Tokyo", "Japan", "Yoyogi National Stadium First Gymnasium", "2026-10-18T18:00:00+09:00", "announced", ["Japan", "Legacy", "Arena"], "日本资深团场优先看抽选和补票。", "高需求时补票也值得等待。", "代代木区域返程成熟，但演出日会拥挤。", ["确认抽选", "等补票", "规划返程"]],
  ["taemin", "Bangkok", "Thailand", "Impact Exhibition Hall 5", "2026-09-12T19:00:00+07:00", "announced", ["Solo", "Asia", "Performance"], "表演型 solo 更值得看舞台延伸和视角。", "站位和屏幕位置一起考虑。", "曼谷返程提早锁定。", ["比较视角", "确认站位", "预订返程"]],
  ["v", "Paris", "France", "Le Zenith Paris", "2026-12-05T20:00:00+01:00", "announced", ["Solo", "Europe", "Travel"], "欧洲 solo 场更要看账户地区和汇率。", "法国夜间返程路线要先定。", "场馆周边住宿提早订。", ["确认账户地区", "规划返程", "提早订酒店"]],
  ["wayv", "Macau", "Macau", "Broadway Theatre", "2026-10-17T19:00:00+08:00", "announced", ["Macau", "Travel", "Arena"], "澳门场要优先看口岸和酒店接驳。", "平台支付和实名要先确认。", "返程时间缓冲要给足。", ["确认支付", "预留口岸时间", "看接驳"]],
  ["zico", "Seoul", "South Korea", "SK Olympic Handball Gymnasium", "2026-11-14T18:00:00+09:00", "announced", ["Solo", "Korea", "Festival"], "solo live 更值得先看官宣和场馆动线。", "视角、舞台段落和音场一起考虑。", "园区返程节奏提前规划。", ["盯官宣", "比较视野", "规划返程"]]
];

const newTourPlans = [
  ["stayc", "STAYC Asia route watch", "先把亚洲主要城市和票务路径监测起来，等待完整路线。", ["Seoul", "Tokyo", "Bangkok"]],
  ["super-junior", "SUPER JUNIOR Asia legacy watch", "以亚洲主要市场和周年演出窗口为主。", ["Seoul", "Taipei", "Bangkok"]],
  ["got7", "GOT7 reunion watch", "保留团体回归窗口和官方入口，不在无明确信息时伪造多城市日期。", ["Seoul", "Bangkok", "Los Angeles"]],
  ["p1harmony", "P1Harmony North America watch", "北美路线和 theatre/arena 切换值得单独追踪。", ["Newark", "Los Angeles", "Chicago"]],
  ["triples", "tripleS showcase-to-tour watch", "先跟踪 show case、fan event 和台北/首尔场可能性。", ["Seoul", "Taipei", "Tokyo"]]
];

const newGuides = [
  {
    slug: "seoul-concert-city-guide",
    title: "首尔看演唱会：住哪里、几点到、散场怎么回",
    category: "travel",
    summary: "首尔不是难去，而是如果不提前想好线路，体验会被通勤拖垮。",
    body: "首尔看演唱会最值得提前确认的是场馆所在区域、地铁末班和是否需要围绕场馆住。KSPO Dome、手球馆、奥林匹克 Hall、蚕室一带虽然都在大首尔圈，但演出日的人流、候场和返程节奏差异很大。比起景点位置，更应该先围绕场馆和返程线路安排酒店。",
    bullets: ["优先围绕场馆和返程订酒店", "先看末班车和换乘次数", "演出日提早一次踩点"],
    relatedArtists: ["seventeen", "nct-dream", "taeyeon", "btob"]
  },
  {
    slug: "tokyo-concert-city-guide",
    title: "东京看演唱会：抽选、酒店和返程列车怎么一起想",
    category: "travel",
    summary: "东京场的难点常常不是抢票，而是抽选逻辑和散场后回酒店。",
    body: "东京场通常会把抽选、电子票、酒店和返程列车绑在一起。东京本身交通强，但演出日若场馆离你住处太远，散场后仍然会很累。适合优先围绕 Ariake、Tokyo Dome、Yoyogi、K-Arena 这些高频场馆来安排住宿和返程。",
    bullets: ["先理解抽选轮次", "住处优先围绕场馆或直达线", "返程列车最好先看好"],
    relatedArtists: ["aespa", "twice", "shinee", "kep1er"]
  },
  {
    slug: "hong-kong-concert-city-guide",
    title: "香港看演唱会：机场线、口岸、当天往返怎么选",
    category: "travel",
    summary: "香港场最容易被忽略的是口岸和机场线，而不是场馆本身。",
    body: "香港场往往会把票务支付、实名和跨境动线放在一起。对内地观众来说，是否当天往返、是否走机场快线、是否住九龙或港岛，会直接影响总成本和体力消耗。AsiaWorld-Arena 尤其要把机场线和口岸时间一起看。",
    bullets: ["先决定当天往返还是过夜", "港区支付方式提前确认", "口岸和机场线一起规划"],
    relatedArtists: ["le-sserafim", "riize"]
  },
  {
    slug: "bangkok-concert-city-guide",
    title: "曼谷看演唱会：酒店别只看市中心，返程比去程更难",
    category: "travel",
    summary: "IMPACT 一带的核心问题是距离和返程，而不是购票入口。",
    body: "曼谷看演唱会常见场馆包括 Impact Arena、Thunder Dome 等。真正影响体验的是酒店与场馆之间的距离、打车策略和演出后是否有稳妥返程。若想轻松一些，通常住在场馆周边或至少住在更好打车的区域，比住传统旅游区更稳。",
    bullets: ["酒店优先围绕场馆或打车便利区", "返程方案先锁定", "演出日不要塞太满"],
    relatedArtists: ["stray-kids", "oneus", "kiss-of-life", "taemin"]
  },
  {
    slug: "paris-concert-city-guide",
    title: "巴黎看演唱会：Accor Arena、夜间返程和酒店区域选择",
    category: "travel",
    summary: "巴黎场可以很好看，但一定要提早把返程和住宿选稳。",
    body: "巴黎看演唱会常见问题不是找不到场馆，而是散场后怎么回、住哪里更省心。Accor Arena 这类高频馆周边公共交通成熟，但夜间返程和跨区移动仍要提前看。若是第一次去巴黎看演出，住在直达地铁线周边通常比住景点区更稳。",
    bullets: ["优先直达地铁线酒店", "夜间返程路线提前确认", "VIP 到场时间和散场一起看"],
    relatedArtists: ["blackpink", "gidle", "v"]
  },
  {
    slug: "london-concert-city-guide",
    title: "伦敦看演唱会：The O2、温布利和夜间地铁怎么安排",
    category: "travel",
    summary: "伦敦场的重点不只是票，还包括账户地区、交通和演出后回酒店。",
    body: "伦敦看演唱会通常要同时理解英区票务平台、地铁/铁路和大场馆周边。The O2、OVO Arena Wembley 等高频场馆的共通点是演出后会集中排队，所以酒店是否直达、是否需要夜间换乘，应该在买票前一起判断。",
    bullets: ["优先住在直达馆的线路上", "英区账户和支付先准备", "夜间返程不要临时决定"],
    relatedArtists: ["ateez", "xg"]
  },
  {
    slug: "los-angeles-concert-city-guide",
    title: "洛杉矶看演唱会：别只看票价，停车和打车成本更真实",
    category: "travel",
    summary: "LA 场馆多，但真正影响总成本的是交通。",
    body: "洛杉矶看演唱会要把票价、停车、网约车和酒店一起算。BMO Stadium、Kia Forum、Crypto.com Arena 的交通逻辑都不完全一样。若你不想在散场后把快乐消耗在堵车里，就要提前决定是开车、拼车、地铁还是住在更近的区域。",
    bullets: ["停车和网约车单独算预算", "地铁可达性优先于地图直线距离", "散场回酒店要有 A/B 方案"],
    relatedArtists: ["blackpink", "jung-kook", "aespa", "xg"]
  },
  {
    slug: "gocheok-sky-dome-guide",
    title: "Gocheok Sky Dome 观演速查：区块视角、地铁和散场路线",
    category: "travel",
    summary: "高尺的关键是视角判断和返程缓冲。",
    body: "Gocheok Sky Dome 的特点是大场、视野差异大、散场节奏集中。买票前最好先判断你更重视近距离还是全景舞台，再决定是否追求低层边区。演出日建议把返程时间和地铁拥挤情况一起算进去。",
    bullets: ["先看区块视野", "避免只看低层不看角度", "散场预留缓冲"],
    relatedArtists: ["nct-dream", "plave"]
  },
  {
    slug: "jamsil-indoor-guide",
    title: "Jamsil Indoor Stadium：首尔老牌场馆的坐席、周边和散场",
    category: "travel",
    summary: "蚕室室内馆适合坐席体验，但返程和周边人流不能低估。",
    body: "Jamsil Indoor Stadium 的核心优势是传统坐席体验稳定，核心难点则是演出日周边人流大、打车与地铁会同时紧张。若你买的是 solo 场或 legacy 团体场，更适合优先比较正中区块和音场，而不是盲追最前排。",
    bullets: ["优先看正中区块", "返程别压最后一班", "周边餐饮高峰要预留时间"],
    relatedArtists: ["j-hope", "btob", "newjeans"]
  },
  {
    slug: "taipei-arena-guide",
    title: "Taipei Arena：台北小巨蛋买票后最该先看的三件事",
    category: "travel",
    summary: "台北小巨蛋稳定好用，但仍然值得先把区块、捷运和酒店想清楚。",
    body: "Taipei Arena 是很成熟的观演场馆，但不同类型艺人的最佳区块并不一样。solo 场更看视角和音场，团体场则要一起考虑舞台延伸和大屏位置。台北交通稳定，所以更适合围绕结束后的捷运和步行路线去选酒店。",
    bullets: ["先看舞台结构再选座", "住处优先步行或一线捷运", "看好末班捷运"],
    relatedArtists: ["ive", "iu", "super-junior", "triples"]
  },
  {
    slug: "k-arena-guide",
    title: "K-Arena Yokohama：大场馆日本场的电子票和返程逻辑",
    category: "travel",
    summary: "横滨大馆最值得提前搞清楚的是电子票和演后返程。",
    body: "K-Arena Yokohama 一类新型大馆，通常会把电子票、抽选和返程列车压力一起放大。对海外观众来说，真正要提早搞懂的是发券方式、账号登录和离场后是否要立刻回东京，而不是等演出完再想。",
    bullets: ["确认电子票机制", "提前看返程列车", "酒店别离场馆太远"],
    relatedArtists: ["tws", "kep1er"]
  },
  {
    slug: "singapore-national-stadium-guide",
    title: "Singapore National Stadium：体育场场次怎么选看台和返程",
    category: "travel",
    summary: "新加坡体育场比起抢票，更值得先看视野和演后人流。",
    body: "Singapore National Stadium 这类体育场场次，真正影响体验的是视野、天气和散场人流。若你预算有限，看台正面和大屏体验往往比盲追侧前排更稳。演后返程虽然比很多城市轻松，但也值得提前选好路线。",
    bullets: ["看台正面常比侧前排更稳", "天气和入场时间一起考虑", "返程路线提早选好"],
    relatedArtists: ["twice"]
  }
];

async function main() {
  const [artists, events, plans, guides, registry] = await Promise.all([
    readJson("artists.json"),
    readJson("events.json"),
    readJson("tour-plans.json"),
    readJson("guides.json"),
    readJson("source-registry.json")
  ]);

  const artistMap = new Map(artists.map((item) => [item.slug, item]));

  for (const seed of newArtistSeeds) {
    if (artistMap.has(seed.slug)) continue;
    const artist = {
      ...seed,
      memberCount: seed.members.length,
      coverImage: `/media/artists/${seed.slug}.svg`,
      heroImage: `/media/artists/${seed.slug}.svg`,
      members: seed.members.map((name, index) => memberObject(name, index))
    };
    artists.push(artist);
    artistMap.set(seed.slug, artist);
    await fs.writeFile(path.join(artistMediaDir, `${seed.slug}.svg`), artistSvg(artist));
  }

  const eventSlugs = new Set(events.map((item) => item.slug));
  for (const [artistSlug, city, country, venue, startDate, status, tags, purchaseHint, priceNote, travelNote, checklist] of eventSeeds) {
    const artist = artistMap.get(artistSlug);
    if (!artist) continue;
    const slug = `${artistSlug}-${slugify(city)}-${new Date(startDate).getUTCFullYear()}`;
    if (eventSlugs.has(slug)) continue;
    const event = {
      id: slug,
      artist: artist.name,
      artistSlug,
      slug,
      city,
      country,
      venue,
      startDate,
      timezone: timezoneByCountry[country] ?? "Asia/Seoul",
      status,
      source: `${artist.name} official channel`,
      sourceUrl: artist.officialUrl,
      sourceConfidence: "official",
      tags,
      title: `${artist.name} in ${city}`,
      tourName: `${artist.name} Tour Watch`,
      description: `${artist.name} 的 ${city} 场会把官宣入口、购票说明、场馆交通和中文观演决策放在一起。`,
      purchaseHint,
      priceNote,
      travelNote,
      checklist,
      heroImage: `/media/events/${slug}.svg`,
      ticketLinks: [{ label: `${artist.name} Official`, href: artist.officialUrl, type: "official" }]
    };
    events.push(event);
    eventSlugs.add(slug);
    await fs.writeFile(path.join(eventMediaDir, `${slug}.svg`), eventSvg(event, artist));
  }

  const planSlugs = new Set(plans.map((item) => item.slug));
  for (const [artistSlug, title, note, regions] of newTourPlans) {
    const artist = artistMap.get(artistSlug);
    if (!artist) continue;
    const slug = `${artistSlug}-tour-radar-2`;
    if (planSlugs.has(slug)) continue;
    plans.push({ slug, artistSlug, artist: artist.name, title, stage: "watch", note, regions, source: `${artist.name} official channel`, sourceUrl: artist.officialUrl });
  }

  const guideSlugs = new Set(guides.map((item) => item.slug));
  for (const guide of newGuides) {
    if (!guideSlugs.has(guide.slug)) {
      guides.push(guide);
    }
  }

  const sourceIds = new Set(registry.map((item) => item.id));
  for (const artist of artists) {
    const id = `artist-${artist.slug}`;
    if (artist.officialUrl && !sourceIds.has(id)) {
      registry.push({ id, label: `${artist.name} official`, category: "artist", artistSlug: artist.slug, url: artist.officialUrl });
      sourceIds.add(id);
    }
  }

  await Promise.all([
    fs.writeFile(path.join(dataDir, "artists.json"), `${JSON.stringify(artists, null, 2)}\n`),
    fs.writeFile(path.join(dataDir, "events.json"), `${JSON.stringify(events, null, 2)}\n`),
    fs.writeFile(path.join(dataDir, "tour-plans.json"), `${JSON.stringify(plans, null, 2)}\n`),
    fs.writeFile(path.join(dataDir, "guides.json"), `${JSON.stringify(guides, null, 2)}\n`),
    fs.writeFile(path.join(dataDir, "source-registry.json"), `${JSON.stringify(registry, null, 2)}\n`)
  ]);

  console.log(JSON.stringify({ task: "expand-content-wave-2", artists: artists.length, events: events.length, tourPlans: plans.length, guides: guides.length, sources: registry.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
