import fs from 'fs/promises';
import path from 'path';

const guidesPath = path.join(process.cwd(), 'data/guides.json');

const cityInsights = {
    "巴黎": "巴黎场次安保通常较严，入场排队可能较慢；强烈建议选择住在一区至十一区的核心地铁线附近（如 1 号线、14 号线），避开东北部治安较弱区域。散场时 Accor Arena 等场馆门口人流极大，Uber 极难叫且容易迷路，推荐直接跟人流走向主要地铁站。",
    "东京": "日本场馆（巨蛋、Arena 系列）的散场动线管理在全亚洲属于最严密的一档，通常采用「规制退场」（按区域分批离场）机制。千万不要为了抢几分钟提前冲向出口，遵守工作人员引导反而最高效。Suica/Pasmo 西瓜卡一定在白天先充满足够余额。",
    "首尔": "首尔的 KSPO Dome 或高尺巨蛋等，周边在演出前几小时会有大量站姐发放免费应援物点位。11月至次年3月的首尔场务必注意防寒，很多场馆的室外候场区风非常大。地铁是首尔散场最稳的交通，但一定要查好所在线路的末班车时间。",
    "首尔看演唱会": "首尔的 KSPO Dome 或高尺巨蛋等，周边在演出前几小时会有大量站姐发放免费应援物点位。11月至次年3月的首尔场务必注意防寒，很多场馆的室外候场区风非常大。地铁是首尔散场最稳的交通，但一定要查好所在线路的末班车时间。",
    "曼谷": "曼谷（特别是 Impact Arena 一带）距离市中心极远，且常年堵车。如果你选择在 Sukhumvit 等市中心区域住宿，演出日当天下午 3 点后就应出发，建议能坐 BTS 换乘接驳车或摩托车，就不要全程打车。散场时拼车/包车是最好的离开方式。",
    "洛杉矶": "在北美，尤其是 LA（如 Kia Forum、BMO Stadium），交通如果没有车几乎寸步难行。不仅停车费昂贵（通常 40-80 美元不等），进出停车场的拥堵也会长达 1 小时。如果计划使用 Uber/Lyft，一定要在场馆划定的 Rideshare 区等待，并准备好面临 2-4 倍的动态溢价。",
    "伦敦": "伦敦 The O2 和温布利体育馆等，离市中心有一定距离，主要依靠地铁网络（如 Jubilee Line 等）。伦敦地铁夜间可能停运或维护，请提前上 TfL 官网查询当天的周末夜班车（Night Tube）是否涵盖你的路线。馆内餐饮昂贵但水洗手间较多，支持全非接支付（Contactless）。",
    "香港": "香港 AsiaWorld-Arena 位于大屿山，与机场相连，离港岛和九龙非常远（搭乘机场快线需 30 分钟）。若是内地看控且打算当晚过关往返深圳，必须密切关注皇岗口岸（24小时）或福田口岸的关闭时间。多数情况下，留宿一晚或住在东涌、青衣附近能极大缓解体力透支。",
    "马尼拉": "马尼拉（如 Mall of Asia Arena 或 Philippine Arena）最大挑战是极端的地面交通拥堵。特别是去位于 Bulacan 的 Philippine Arena，从市区出发可能需要 3-4 小时。强烈推荐预订官方或粉丝后援会组织的接驳大巴（Shuttle Bus），不要指望散场后能轻易用 Grab 叫到车。",
    "雅加达": "雅加达 ICE BSD 在唐格朗地区，相当于远郊的会展中心。场馆内部空调极冷，建议带一件薄外套。当地摩托车网约车（Gojek/Grab）在白天很方便，但夜间散场时大几率网络瘫痪、汽车网约车无法驶入，通常需要步行 15-20 分钟到主干道再呼叫。",
    "澳门": "澳门的银河综艺馆或威尼斯人金光综艺馆，全都在大型度假村内。交通完全可以依靠发财车和轻轨，步行也能穿梭于各大酒店。核心建议是演出开始前尽旨在度假村的美食广场解决晚餐，散场后大多只剩赌场区部分餐厅营业或者去官也街。"
};

const ticktingInsights = {
    "会员": "很多热门团的粉丝俱乐部（Fanclub/Membership）预售是抢票成功率最高的环节。务必要在 Weverse 等官方渠道确认「是否需要提前进行预售资格登记（Presale Registration）」。光买了会员不登记资格，等于没有资格。",
    "转售": "日场严格禁止转售，采用带照片的强实名电子票（如 AnyPASS、Ticketbo），海外入场查验极严，切勿购买黄牛票。韩场对于黑客刷票和黄牛转售的打击力度也在逐渐加强（特别是取消票不定期掉落机制），尽量在官方票池内捡漏（취켓팅）。北美 Ticketmaster 支持官方 Resale，可信度高但经常有溢价。",
    "选座": "对于带有中央延伸台的演出，内场（VIP/Standing）体验极佳，但对体力和身高有极高要求。如果你追求的是看清全舞台的群舞队形以及完整的灯光舞美，二层看台的最前排或者正对舞台的底层看台（Lower Bowl）反而能提供最完美的观演视听体验。"
};

async function main() {
  const data = JSON.parse(await fs.readFile(guidesPath, 'utf-8'));
  for (const guide of data) {
      if (!guide.originalBody) {
          guide.originalBody = guide.body; 
      }
      
      let expandedBody = guide.originalBody + "\n\n### 💡 核心策略与深度解析\n\n";
      
      // Inject Category Context
      if (guide.category === 'travel') {
          expandedBody += "跨国或跨城观演，最大的隐形成本往往不是门票本身，而是「交通衔接」与「夜间散场安全」。尤其是在演出散场后的高峰期，几万人同时涌出，常规的打车软件往往面临严重溢价、司机拒单或交通管制无车可坐的情况。提前做好「保底返程方案」是每一位成熟追星人的必修课。\n\n";
      } else if (guide.category === 'ticketing') {
          expandedBody += "在目前的 K-pop 票务环境下，单纯拼手速已经很难保证成功率。大多数票务平台都引入了复杂的排队机制（Queue）、风控系统（如海外信用卡拦截）以及动态验证码。建立「防风控意识」，提前测试环境，把抢票动作标准化，是抢票的第一要务。\n\n";
      } else {
          expandedBody += "追星和饭圈文化有其独特的运转逻辑。想要在入坑新团或参与大型活动时获得最好的体验，提前掌握官方信息的发布规律、周边应援规矩以及社群约定俗成的习惯非常重要，这能让你少走弯路，将时间花在真正享受演出上。\n\n";
      }

      // Inject City Specific Context
      for (const [key, text] of Object.entries(cityInsights)) {
          if (guide.title.includes(key) || guide.body.includes(key) || guide.summary.includes(key)) {
              expandedBody += `#### 🌆 针对 ${key} 场次的独家建议\n${text}\n\n`;
              break; 
          }
      }

      // Inject Ticketing Specific Context
      let usedTicketInsights = 0;
      for (const [key, text] of Object.entries(ticktingInsights)) {
          if (guide.title.includes(key) || guide.body.includes(key) || guide.category === 'ticketing') {
              if (usedTicketInsights === 0) {
                  expandedBody += `#### 🎟 票务进阶认知：${key}\n${text}\n\n`;
                  usedTicketInsights++;
              }
          }
      }

      // Expand on bullets
      if (guide.bullets && guide.bullets.length > 0) {
          expandedBody += "#### 📌 关键行动点落地指南\n\n";
          for (const bullet of guide.bullets) {
              expandedBody += `**${bullet}**\n`;
              if (guide.category === 'travel') {
                  expandedBody += `👉 针对这一环节，强烈建议提前在 Google Maps、Naver Map 或小红书上收藏目的地，排查最优步行路线。夜间离场时，无论多自信，也请至少准备好 A 和 B 两套返程方案（例如：地铁作为首选，提前联系好拼车或计程车接驳点做备选）。\n\n`;
              } else if (guide.category === 'ticketing') {
                  expandedBody += `👉 实施时，确保网络环境顺畅（避免免费代理导致的 IP 风控）。在开票前 30 分钟内完成所有设备的账号登录，并测试绑定好至少 2 种不同的结算渠道（如备用不同发卡行的 Visa / Mastercard），在关键时刻由于支付渠道拥堵导致掉票是家常便饭。\n\n`;
              } else {
                  expandedBody += `👉 优先为官方 SNS、Weverse 或 Fanclub 的通知开启「特别关注」提醒。在信息爆炸的时期，过滤不良与二手信息、认准经过证实的官方第一发声渠道，比什么都重要，能节省大量内耗。\n\n`;
              }
          }
      }

      // Expand practical tips if they exist
      if (guide.practical) {
          expandedBody += "#### 🛠 实用场景避坑细节\n\n";
          const sections = [
              { key: 'accessTips', label: '🚶‍♂️ 路线与进场节奏' },
              { key: 'seatTips', label: '💺 选区与机位实测逻辑' },
              { key: 'stayTips', label: '🏨 周边住宿与片区评级' },
              { key: 'foodTips', label: '🍔 餐饮、外卖与体力补给' },
              { key: 'convenienceTips', label: '🎒 场外便利店与临阵补件' }
          ];

          let practicalCounter = 0;
          for (const sec of sections) {
              if (guide.practical[sec.key] && guide.practical[sec.key].length > 0) {
                  expandedBody += `**${sec.label}**\n`;
                  guide.practical[sec.key].forEach(tip => {
                      expandedBody += `- ${tip}（强烈建议：最好能在社交媒体搜索近期的现场真实 Vlog 和返图进行双重验证，纸面攻略与实际体感可能会因场而异）。\n`;
                  });
                  expandedBody += '\n';
                  practicalCounter++;
              }
          }
      }

      guide.body = expandedBody.trim();
  }

  await fs.writeFile(guidesPath, JSON.stringify(data, null, 2) + '\n');
  console.log('Guides expanded successfully.');
}
main();
