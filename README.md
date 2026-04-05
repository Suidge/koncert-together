# Koncert Together

`Koncert Together` 是一个面向中文用户的 K-pop 巡演与观演信息站。当前以 `Next.js + 静态导出 + JSON 内容文件` 运行，发布到 `GitHub Pages`。

公开站点：

- [https://suidge.github.io/koncert-together/](https://suidge.github.io/koncert-together/)

这个 README 的目标不是营销介绍，而是让一个第一次接手项目的 agent / 开发者，在只读 README 的前提下也能理解：

- 这个站点现在在做什么
- 内容和代码分别放在哪里
- 哪些脚本还能用，哪些脚本现在不该乱跑
- 如何本地修改、验证、部署
- 当前最重要的产品约束和维护注意事项

## 1. 当前状态

这是一个“编辑驱动的静态情报站”，不是 UGC 社区，也不是实时后端产品。

当前重点模块：

- 首页：展示站点定位、重点场次、重点艺人、巡演雷达、指南、社区精选
- 巡演日历：查看 `events` 和 `tour plans`
- 艺人页：成员档案、已官宣场次、巡演消息、相关指南、最近官方动态
- 指南页：抢票、选座、城市/场馆、fandom 相关内容
- 社区页：静态精选内容
- Credits / Ops：图片署名页、内部状态页

当前产品策略：

- 优先服务“看演出前的决策需求”
- 优先做头部热门艺人的覆盖
- 内容以手工结构化编辑为主，不依赖 CMS
- 部署简单、可维护，优先保证 Pages 可以稳定更新

## 2. 重要现状

### 2.1 当前站点是“无图模式”

这是当前最重要的状态之一。

截至最近一次调整：

- `data/artists.json` 和 `data/events.json` 里的图片字段已被清空
- `public/media` 已整体删除
- 艺人页和场次页保留了“缺图提醒”
- 目录页、首页卡片页不再展示图片

这意味着：

- 不要假设项目当前还有可用图片资源
- 不要假设 `public/media/...` 路径存在
- 如果未来要重新引入图片，需要重新建立图片来源、同步和展示策略

相关文件：

- [app/artists/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/artists/[slug]/page.tsx)
- [app/events/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/events/[slug]/page.tsx)
- [data/artists.json](/Users/neoshi/koncert2gether/data/artists.json)
- [data/events.json](/Users/neoshi/koncert2gether/data/events.json)

### 2.2 艺人目录现在是“头部艺人白名单模式”

艺人数据仍然可能包含更多追踪对象，但目录页和首页不会把所有人都展示出来。

当前逻辑：

- 通过 `headlinerArtistSlugs` 控制“热门艺人目录”
- 首页和 `/artists` 目录页只展示头部名单
- 其他艺人数据仍然可以存在于数据层，用于活动、指南或未来扩展

相关文件：

- [lib/site-data.ts](/Users/neoshi/koncert2gether/lib/site-data.ts)
- [lib/events.ts](/Users/neoshi/koncert2gether/lib/events.ts)
- [app/page.tsx](/Users/neoshi/koncert2gether/app/page.tsx)
- [app/artists/page.tsx](/Users/neoshi/koncert2gether/app/artists/page.tsx)

## 3. 技术栈

- `Next.js 16` App Router
- `React 19`
- `TypeScript`
- `pnpm`
- `GitHub Pages`
- `JSON` 结构化内容文件
- 少量 `Node.js` 同步/整理脚本

关键配置：

- 静态导出：`output: "export"`
- Pages 子路径：`NEXT_PUBLIC_BASE_PATH=/koncert-together`
- 图片优化：`images.unoptimized = true`
- 构建后导出目录：`out/`

配置文件：

- [next.config.ts](/Users/neoshi/koncert2gether/next.config.ts)
- [package.json](/Users/neoshi/koncert2gether/package.json)

## 4. 目录结构

### 4.1 页面层

页面在 `app/`：

- [app/page.tsx](/Users/neoshi/koncert2gether/app/page.tsx)：首页
- [app/calendar/page.tsx](/Users/neoshi/koncert2gether/app/calendar/page.tsx)：巡演日历
- [app/artists/page.tsx](/Users/neoshi/koncert2gether/app/artists/page.tsx)：艺人目录
- [app/artists/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/artists/[slug]/page.tsx)：艺人详情
- [app/events/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/events/[slug]/page.tsx)：场次详情
- [app/guides/page.tsx](/Users/neoshi/koncert2gether/app/guides/page.tsx)：指南列表
- [app/guides/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/guides/[slug]/page.tsx)：指南详情
- [app/community/page.tsx](/Users/neoshi/koncert2gether/app/community/page.tsx)：社区页
- [app/community/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/community/[slug]/page.tsx)：社区详情
- [app/credits/page.tsx](/Users/neoshi/koncert2gether/app/credits/page.tsx)：署名页
- [app/ops/status/page.tsx](/Users/neoshi/koncert2gether/app/ops/status/page.tsx)：内部状态页

### 4.2 组件层

主要 UI 组件在 `components/`：

- `artist-card.tsx`
- `event-card.tsx`
- `guide-card.tsx`
- `calendar-browser.tsx`
- `tour-plan-card.tsx`
- `header.tsx`
- `site-footer.tsx`

### 4.3 数据与访问层

主要逻辑在 `lib/`：

- [lib/site-data.ts](/Users/neoshi/koncert2gether/lib/site-data.ts)
  - 数据类型定义
  - JSON 导出
  - 常用辅助函数
  - 头部艺人白名单
- [lib/events.ts](/Users/neoshi/koncert2gether/lib/events.ts)
  - 页面对 `artists / events / tourPlans` 的访问层
  - 这里控制了 `getArtists({ headlinersOnly: true })`
- [lib/assets.ts](/Users/neoshi/koncert2gether/lib/assets.ts)
  - 资源路径处理

### 4.4 数据文件

数据主要放在 `data/`：

- [data/artists.json](/Users/neoshi/koncert2gether/data/artists.json)
  - 艺人资料、成员、官方链接
- [data/events.json](/Users/neoshi/koncert2gether/data/events.json)
  - 已官宣场次
- [data/tour-plans.json](/Users/neoshi/koncert2gether/data/tour-plans.json)
  - 还没落到具体日期的巡演消息
- [data/guides.json](/Users/neoshi/koncert2gether/data/guides.json)
  - 指南正文
- [data/venue-guides.json](/Users/neoshi/koncert2gether/data/venue-guides.json)
  - 场馆指南源数据
- [data/community.json](/Users/neoshi/koncert2gether/data/community.json)
  - 社区静态内容
- [data/official-updates.json](/Users/neoshi/koncert2gether/data/official-updates.json)
  - 最近官方动态同步结果
- [data/source-registry.json](/Users/neoshi/koncert2gether/data/source-registry.json)
  - 来源登记
- [data/source-status.json](/Users/neoshi/koncert2gether/data/source-status.json)
  - 来源健康状态
- [data/site-meta.json](/Users/neoshi/koncert2gether/data/site-meta.json)
  - 构建时间和计数信息

下面这些文件仍然存在，但当前“无图模式”下不再直接驱动前台：

- [data/image-sources.json](/Users/neoshi/koncert2gether/data/image-sources.json)
- [data/event-image-sources.json](/Users/neoshi/koncert2gether/data/event-image-sources.json)
- [data/fanclub-image-sources.json](/Users/neoshi/koncert2gether/data/fanclub-image-sources.json)
- [data/downloaded-image-urls.json](/Users/neoshi/koncert2gether/data/downloaded-image-urls.json)

## 5. 数据模型简述

### 5.1 艺人

`artists.json` 中每个对象通常包含：

- `slug`
- `name`
- `nameKo`
- `fandom`
- `tagline`
- `intro`
- `accent`
- `officialUrl`
- `agency`
- `debutYear`
- `origin`
- `genres`
- `memberCount`
- `members`

注意：

- 图片字段目前已清空
- `members` 允许为空数组
- 目录热门程度不是存在单条数据里，而是由 `lib/site-data.ts` 的白名单决定

### 5.2 场次

`events.json` 中每个对象通常包含：

- `id`
- `artist`
- `artistSlug`
- `slug`
- `city`
- `country`
- `venue`
- `startDate`
- `status`
- `source`
- `sourceUrl`
- `sourceConfidence`
- `tags`
- `description`
- `purchaseHint`
- `priceNote`
- `travelNote`
- `checklist`
- `ticketSaleDate`
- `doorsTime`
- `ticketLinks`

### 5.3 巡演消息

`tour-plans.json` 用于“还没到正式排期”的艺人动向：

- `artistSlug`
- `artist`
- `title`
- `note`
- `regions`
- `source`
- `sourceUrl`

### 5.4 指南

`guides.json` 当前是最需要人工维护质量的内容文件。

字段包括：

- `slug`
- `title`
- `category`
- `summary`
- `body`
- `bullets`
- `relatedArtists`
- `practical`

`practical` 内可能有：

- `accessTips`
- `seatTips`
- `stayTips`
- `foodTips`
- `convenienceTips`
- `stationExits`
- `zones`
- `nearbyHotels`
- `mapLinks`
- `links`

## 6. 当前内容策略

这是一个很关键的非代码约束。

当前站点不应该再走“模板批量灌水”的路线。过去项目里有一些脚本会生成高度模板化的文案和图片 fallback，这些脚本留下来了，但不能默认代表现在推荐的策略。

当前更合理的方向：

- 首页和目录页优先突出头部艺人
- 活动页优先回答“买票、进场、返程”问题
- 指南页优先做高价值 evergreen 内容和高频城市/场馆页
- 成员档案宁可少，也要尽量避免强模板感

如果要继续补内容，优先级建议：

1. 头部艺人页
2. 热门场次详情页
3. 东京 / 首尔 / 巴黎 / 香港等高频城市指南
4. 高频场馆指南

## 7. 图片相关脚本说明

项目里仍然保留了一批图片相关脚本：

- [scripts/sync-approved-images.mjs](/Users/neoshi/koncert2gether/scripts/sync-approved-images.mjs)
- [scripts/sync-official-event-images.mjs](/Users/neoshi/koncert2gether/scripts/sync-official-event-images.mjs)
- [scripts/fetch-real-images.mjs](/Users/neoshi/koncert2gether/scripts/fetch-real-images.mjs)
- [scripts/fallback-missing-images.mjs](/Users/neoshi/koncert2gether/scripts/fallback-missing-images.mjs)
- [scripts/inject-missing-images.mjs](/Users/neoshi/koncert2gether/scripts/inject-missing-images.mjs)
- [scripts/redesign-generated-visuals.mjs](/Users/neoshi/koncert2gether/scripts/redesign-generated-visuals.mjs)
- [scripts/sync-fanclub-images.mjs](/Users/neoshi/koncert2gether/scripts/sync-fanclub-images.mjs)
- [scripts/auto-discover-commons-images.mjs](/Users/neoshi/koncert2gether/scripts/auto-discover-commons-images.mjs)
- [scripts/scrape-remaining-artist-images.mjs](/Users/neoshi/koncert2gether/scripts/scrape-remaining-artist-images.mjs)

但请注意：

- 这些脚本当前不是“随时可安全运行”的默认路径
- 当前站点处于无图模式
- 如果未来要恢复图片，应该先重新确认来源合规、展示标准和数据回写策略，再决定是否启用这些脚本

简单说：

- 现在不要因为看到这些脚本存在，就默认运行 `pnpm sync:images`
- 除非明确要恢复图片策略，否则把它们视为“历史能力”更合适

## 8. 仍然常用的内容/数据脚本

### 8.1 准备构建数据

脚本：

- [scripts/prepare-pages-data.mjs](/Users/neoshi/koncert2gether/scripts/prepare-pages-data.mjs)

命令：

```bash
pnpm prepare:pages
```

作用：

- 整理 slug、排序和构建元信息

### 8.2 官方动态同步

脚本：

- [scripts/sync-official-updates.mjs](/Users/neoshi/koncert2gether/scripts/sync-official-updates.mjs)

命令：

```bash
pnpm sync:official-updates
```

### 8.3 来源健康检查

脚本：

- [scripts/sync-source-health.mjs](/Users/neoshi/koncert2gether/scripts/sync-source-health.mjs)

命令：

```bash
pnpm sync:sources
```

### 8.4 场馆指南合并

脚本：

- [scripts/sync-venue-guides.mjs](/Users/neoshi/koncert2gether/scripts/sync-venue-guides.mjs)

命令：

```bash
pnpm sync:venue-guides
```

### 8.5 编辑性文案刷新

脚本：

- [scripts/refresh-editorial.mjs](/Users/neoshi/koncert2gether/scripts/refresh-editorial.mjs)

命令：

```bash
pnpm refresh:editorial
```

注意：

- 这个脚本会批量重写文案
- 如果你刚做过精修内容，不要不加判断直接跑

## 9. 本地开发

安装依赖：

```bash
pnpm install
```

本地开发：

```bash
pnpm dev
```

本地构建检查：

```bash
pnpm typecheck
pnpm build
```

如果只做内容或样式修改，通常这两个命令已经足够。

## 10. 发布流程

### 10.1 Pages 部署方式

工作流文件：

- [/.github/workflows/deploy-pages.yml](/Users/neoshi/koncert2gether/.github/workflows/deploy-pages.yml)

触发条件：

- push 到 `main`
- 或手动 `workflow_dispatch`

核心流程：

1. `pnpm install --frozen-lockfile`
2. `node scripts/prepare-pages-data.mjs`
3. `pnpm build`
4. 上传 `out/`
5. 部署到 GitHub Pages

### 10.2 实际部署判断

如果你本地已经改好了，但线上站点没变，先检查：

- 是否已经 `git commit`
- 是否已经 `git push origin main`
- GitHub Actions 的 `Deploy Pages` workflow 是否成功

重要经验：

- 本地 `out/` 无图，不代表线上已经无图
- 线上只取决于最近一次成功部署到 Pages 的 commit

## 11. 维护规则

### 11.1 修改艺人名单时

优先检查：

- `data/artists.json` 是否需要新增 / 修改条目
- `lib/site-data.ts` 的 `headlinerArtistSlugs` 是否要同步更新
- 首页和目录页是否需要跟着调整展示文案

### 11.2 修改图片策略时

必须先回答三个问题：

1. 来源是否合规且稳定？
2. 是只恢复少量头部艺人，还是重建全站图片链路？
3. 前台是否仍然需要保留“缺图提醒”？

在没有明确答案前，不要直接恢复历史图片脚本。

### 11.3 修改指南内容时

优先人工检查：

- 是否真的提供决策帮助
- 是否避免模板化重复句式
- 是否和页面的 `relatedArtists`、`practical.links` 保持一致

### 11.4 修改部署或路径时

这是 Pages 子路径站点，必须注意：

- 不要手写绝对资源路径假设
- `NEXT_PUBLIC_BASE_PATH=/koncert-together`
- 构建和线上路径必须一致

## 12. 常用接手操作

### 12.1 接手后先做什么

推荐顺序：

1. 读这个 README
2. 看 [package.json](/Users/neoshi/koncert2gether/package.json)
3. 看 [lib/site-data.ts](/Users/neoshi/koncert2gether/lib/site-data.ts)
4. 看 [lib/events.ts](/Users/neoshi/koncert2gether/lib/events.ts)
5. 看 [app/page.tsx](/Users/neoshi/koncert2gether/app/page.tsx)
6. 看 [app/artists/page.tsx](/Users/neoshi/koncert2gether/app/artists/page.tsx)
7. 看 [app/artists/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/artists/[slug]/page.tsx)
8. 看 [app/events/[slug]/page.tsx](/Users/neoshi/koncert2gether/app/events/[slug]/page.tsx)
9. 跑 `pnpm typecheck`
10. 跑 `pnpm build`

### 12.2 如果用户说“线上没更新”

按这个顺序排查：

1. 本地改动是否已提交
2. 是否已 push 到 `origin/main`
3. `Deploy Pages` workflow 是否成功
4. 用户看的是否真的是线上站，而不是本地旧预览

### 12.3 如果用户说“艺人名单不够热门”

优先检查：

- `headlinerArtistSlugs`
- `data/artists.json` 是否缺少明显头部艺人
- `/artists` 页是不是仍在用 `getArtists()` 全量数据

## 13. 已知问题

- 项目里还保留了一些历史图片和内容生成脚本，但当前产品方向已经变化
- README 以当前代码状态为准，不保证历史脚本都继续推荐使用
- 站点当前是静态内容站，很多更新仍然依赖手动编辑和提交
- 项目里有 Prisma 文件，但当前公开站点主流程并不依赖数据库

## 14. 当前推荐工作方式

如果只是日常维护，推荐遵循：

1. 直接改 `data/*.json` 和必要页面
2. 小范围改 `lib/` 的筛选/排序逻辑
3. 跑 `pnpm typecheck`
4. 跑 `pnpm build`
5. 提交并 push 到 `main`

如果要做较大调整，优先明确：

- 是“内容策略调整”
- 是“目录/排序逻辑调整”
- 是“恢复图片”
- 还是“重做数据生产链路”

不要把这几件事混在一次改动里。
