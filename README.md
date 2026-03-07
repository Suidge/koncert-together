# Seoul Signal

面向中文用户的 K-pop 全球巡演聚合站骨架项目。

当前版本先完成五件事:

- 建立一个可继续扩展的 Next.js 全栈前端基础
- 定义巡演事件的核心数据结构
- 做出首页与巡演日历原型，验证产品方向和视觉基调
- 接入 Prisma schema，为真实数据库落地预留结构
- 产出可直接部署到 GitHub Pages 的第一版静态站点

## Why this stack

- `Next.js App Router`: 适合内容站、SEO、服务端渲染、后续会员体系与内容社区
- `TypeScript`: 先把事件模型、来源模型、票务链接模型定清楚
- `API Route`: 先提供统一事件接口，后续接数据库和抓取任务

## Product direction

参考 Weverse 的地方，不应该是照着做一个“更像社区 App 的外壳”，而是吸收两个更关键的方向:

- 艺人与内容入口非常清晰
- 一个品牌下可以同时容纳内容、活动、会员和交易触点

这个项目第一阶段更应该像 “K-pop tour intelligence + 中文消费入口”，而不是一开始就做重社区。

## Suggested next architecture

1. `Frontend`
   Next.js 继续承担官网、活动页、艺人页、SEO 落地页。
2. `Database`
   使用 PostgreSQL，核心表建议为 `artists`、`tours`、`events`、`ticket_links`、`sources`、`source_snapshots`。
3. `Ingestion`
   单独的 worker 抓取官方公告、票务网站、场馆日历，写入 `raw source -> normalized event -> review queue`。
4. `Review`
   重要活动走人工审核，避免票务链接错误、时间错误、重复事件。
5. `Expansion`
   再增加收藏、订阅提醒、评论、攻略、饭拍、城市榜单和粉丝贡献内容。

## Pages

- `/`
  首页，展示定位、示例活动、平台演进方向
- `/calendar`
  巡演日历页
- `/events/[slug]`
  活动详情页
- `/artists`
  艺人目录页
- `/artists/[slug]`
  艺人详情页

## Database

- 当前已提供 Prisma schema: `artist`、`tour`、`venue`、`event`、`ticket_link`、`source_snapshot`
- 未配置 `DATABASE_URL` 时，页面会自动回退到内置示例数据
- 配置数据库后，可执行以下命令:

```bash
cp .env.example .env
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```

## Local development

```bash
pnpm install
pnpm prisma:generate
pnpm dev
```

## GitHub Pages deployment

当前仓库已配置为静态导出模式，适合先上线第一版内容站:

```bash
pnpm build
```

构建后静态文件会输出到 `out/`，GitHub Actions 会自动将其发布到 GitHub Pages。

## Near-term implementation priorities

1. 接入真实数据库和 ORM
2. 建立抓取任务原型，先从少量官方来源开始
3. 做活动详情页和艺人页
4. 加入筛选条件: 艺人、城市、国家、售票状态、日期区间
5. 增加中文购票说明和观演攻略内容层
