# Koncert Together

`Koncert Together` 是一个面向中文用户的 K-pop 巡演与观演信息站。当前阶段采用 `GitHub Pages` 作为公开前台，用结构化静态数据承载艺人页、巡演日历、活动详情、场馆指南和 fandom 内容，再由本地主机低频自动更新内容并触发发布。

公开站点：<https://suidge.github.io/koncert-together/>

## 1. 项目定位

项目不是泛资讯站，也不是一开始就做重社区后台，而是先把最常用、最容易影响观演决策的信息做扎实：

- 真实可浏览的巡演日历
- 重点艺人的成员资料与活动集合页
- 可执行的城市与场馆指南
- 可信的官方来源自动同步
- 适合试运行阶段的低运维静态发布方式

当前版本的核心目标是：

- 给小范围真实用户提供可持续使用的 K-pop 观演信息入口
- 用尽可能低的维护复杂度跑出稳定更新的内容站
- 保留未来迁移回全栈架构的扩展空间

## 2. 当前产品范围

当前站点包含这些公开模块：

- 首页：内容入口、重点艺人、重点场次、巡演雷达、指南和社区精选
- 巡演日历：按艺人、地区、状态筛选活动与巡演消息
- 活动详情：时间、场馆、购票入口、出行提示、来源核对
- 艺人主页：成员档案、已官宣场次、巡演消息、相关指南、最近官方动态
- 指南中心：购票、出行、城市和场馆资料页
- 社区精选：静态精选内容与投稿入口
- 图片署名页：对外部图片来源做统一说明
- 内部状态页：不在公开导航中显示，用于运维侧检查来源状态

## 3. 技术栈

当前公开站点采用静态导出方案，核心技术栈如下：

- `Next.js 16` App Router
- `React 19`
- `TypeScript`
- `pnpm`
- `GitHub Pages`
- `JSON` 结构化内容文件
- `Node.js` 本地同步脚本

关键配置：

- 静态导出：`next.config.ts` 中启用 `output: "export"`
- Pages 子路径：通过 `NEXT_PUBLIC_BASE_PATH=/koncert-together`
- 图片策略：全部走本地静态资源，不依赖 `next/image` 优化服务
- 发布方式：GitHub Actions 构建 `out/` 目录并发布到 Pages

## 4. 设计结构

### 4.1 内容模型

项目当前以 `data/` 目录下的结构化文件为中心：

- `data/artists.json`
  - 艺人资料、成员、官方入口、宣传图信息
- `data/events.json`
  - 活动卡片、状态、票务入口、场馆、提示、来源、活动图
- `data/tour-plans.json`
  - 尚未落到具体日期的巡演雷达
- `data/guides.json`
  - 购票、城市、场馆、fandom 指南
- `data/venue-guides.json`
  - 场馆指南源数据，由脚本合并进 `guides.json`
- `data/community.json`
  - 社区精选内容
- `data/source-registry.json`
  - 已跟踪的官方来源列表
- `data/source-status.json`
  - 来源可达性与最近检查结果
- `data/image-sources.json`
  - 官方艺人图片来源登记表
- `data/event-image-sources.json`
  - 官方活动海报来源登记表
- `data/official-update-sources.json`
  - 官方动态同步源登记表
- `data/official-updates.json`
  - 最近同步到的官方动态结果
- `data/site-meta.json`
  - 构建时间、计数、来源健康摘要

### 4.2 页面结构

页面入口放在 `app/`：

- `app/page.tsx`
  - 首页
- `app/calendar/page.tsx`
  - 巡演日历
- `app/artists/page.tsx`
  - 艺人目录
- `app/artists/[slug]/page.tsx`
  - 艺人详情页
- `app/events/[slug]/page.tsx`
  - 活动详情页
- `app/guides/page.tsx`
  - 指南列表页
- `app/guides/[slug]/page.tsx`
  - 指南详情页
- `app/community/page.tsx`
  - 社区精选页
- `app/credits/page.tsx`
  - 图片署名页
- `app/ops/status/page.tsx`
  - 内部状态页

### 4.3 共享逻辑

- `lib/site-data.ts`
  - 统一定义站内数据类型和静态数据导出
- `lib/events.ts`
  - 页面读取活动、艺人、巡演消息的访问层
- `lib/assets.ts`
  - Pages 子路径下的资源路径处理
- `components/*`
  - 卡片、头部、页脚、筛选器、交互组件

## 5. 图片策略

当前图片策略刻意分层：

- 艺人页：优先使用官方艺人宣传图
- 活动页：优先使用活动专属官方海报
- 其余情况：回退到站内生成海报，保证一致性和可维护性

当前同步脚本：

- `scripts/sync-approved-images.mjs`
  - 同步官方艺人图并更新艺人页数据
- `scripts/sync-official-event-images.mjs`
  - 同步官方活动海报并更新活动页数据
- `scripts/redesign-generated-visuals.mjs`
  - 生成 fallback 艺人与活动海报

## 6. 自动更新链路

当前项目已经不是纯手工更新，而是“结构化数据 + 少量官方同步”的模式。

### 6.1 来源健康检查

脚本：`scripts/sync-source-health.mjs`

作用：

- 对已登记的官方艺人页、票务页、场馆页做低频探测
- 记录 `status / checkedAt / finalUrl / contentType / etag / lastModified`
- 输出到 `data/source-status.json`
- 将 `401/403` 这种受限页面标成 `restricted`

命令：

```bash
pnpm sync:sources
```

### 6.2 官方艺人图同步

脚本：`scripts/sync-approved-images.mjs`

作用：

- 从已登记的官方站点抓取艺人主视觉
- 下载到本地 `public/media/artists/`
- 回写 `artists.json`
- 如配置允许，也可影响活动图逻辑

命令：

```bash
pnpm sync:images
```

### 6.3 官方活动海报同步

脚本：`scripts/sync-official-event-images.mjs`

作用：

- 从活动海报登记表抓取活动专属官方海报
- 下载到本地 `public/media/events/`
- 回写 `events.json`

命令：

```bash
pnpm sync:event-images
```

### 6.4 官方动态同步

脚本：`scripts/sync-official-updates.mjs`

作用：

- 从少量官方页面同步最近一条动态
- 目前主要用于艺人页展示“最近值得注意的官方更新”
- 当前以少量 JYPE 官方站为起点

命令：

```bash
pnpm sync:official-updates
```

### 6.5 场馆指南合并

脚本：`scripts/sync-venue-guides.mjs`

作用：

- 读取 `data/venue-guides.json`
- 合并到 `data/guides.json`
- 保持指南列表统一输出

命令：

```bash
pnpm sync:venue-guides
```

### 6.6 编辑性文案刷新

脚本：`scripts/refresh-editorial.mjs`

作用：

- 重写一部分艺人介绍、成员 profile、活动提示、巡演消息文案
- 让结构化数据保持统一的站点口吻

命令：

```bash
pnpm refresh:editorial
```

### 6.7 数据整理与构建元信息

脚本：`scripts/prepare-pages-data.mjs`

作用：

- 检查 slug 和 URL
- 排序数据
- 校验来源映射
- 更新 `site-meta.json`

命令：

```bash
pnpm prepare:pages
```

## 7. 本地开发

安装依赖：

```bash
pnpm install
```

本地开发：

```bash
pnpm dev
```

默认访问：

- <http://localhost:3000>

## 8. 构建与发布

### 8.1 本地完整构建

```bash
pnpm sync:sources
pnpm sync:official-updates
pnpm sync:images
pnpm sync:event-images
pnpm sync:venue-guides
pnpm refresh:editorial
pnpm redesign:visuals
pnpm prepare:pages
pnpm typecheck
NEXT_PUBLIC_BASE_PATH=/koncert-together NEXT_PUBLIC_SITE_URL=https://suidge.github.io/koncert-together pnpm build
```

### 8.2 GitHub Pages 工作流

工作流文件：`.github/workflows/deploy-pages.yml`

当前行为：

- 触发条件：推送到 `main`
- 构建环境：`Node.js 22` + `pnpm 10`
- 构建步骤：
  - 安装依赖
  - 运行 `scripts/prepare-pages-data.mjs`
  - 运行 `pnpm build`
  - 上传 `out/` 并部署到 Pages

### 8.3 页面基路径

项目托管在 GitHub Pages 子路径下：

- 站点地址：`https://suidge.github.io/koncert-together/`
- `NEXT_PUBLIC_BASE_PATH=/koncert-together`

因此：

- 所有静态资源必须通过 `assetPath()` 处理
- 不要手写根路径资源 URL

## 9. 运维指南

这部分按“试运行阶段长期维护”来写。

### 9.1 日常目标

日常运维的目标不是服务器维护，而是这四件事：

- 官方来源仍然可达
- 图片和海报仍然能正常更新
- 指南与活动数据没有被结构破坏
- GitHub Pages 发布链路正常

### 9.2 推荐的日常检查顺序

每天或每次批量更新前，按这个顺序：

1. 同步来源状态
2. 同步官方动态
3. 同步官方图片与活动海报
4. 同步场馆指南
5. 刷新文案与 fallback 视觉
6. 运行数据整理
7. 运行类型检查
8. 运行构建
9. 如果有变化则提交推送
10. 检查 GitHub Pages 工作流是否成功

### 9.3 一键刷新命令

本地主机或长期在线机器可以直接每天执行：

```bash
cd /Users/neoshi/kpop-events
pnpm refresh:pages
```

这个脚本会依次执行：

- `git checkout main`
- `git pull --ff-only origin main`
- `pnpm install --frozen-lockfile`
- `pnpm sync:sources`
- `pnpm sync:official-updates`
- `pnpm sync:images`
- `pnpm sync:event-images`
- `pnpm sync:venue-guides`
- `pnpm refresh:editorial`
- `pnpm redesign:visuals`
- `pnpm prepare:pages`
- `pnpm build`
- 有内容变化时自动 `commit + push`

脚本文件：`scripts/run-pages-refresh.sh`

### 9.4 建议的定时任务

推荐每天一次，足够适合当前试运行模式：

```cron
17 6 * * * cd /Users/neoshi/kpop-events && /bin/bash -lc 'pnpm refresh:pages >> /Users/neoshi/kpop-events/.logs/pages-refresh.log 2>&1'
```

建议额外准备：

- `.logs/` 目录
- 非交互式 Git 凭证
- 失败通知方式，例如邮件、Telegram 或其他推送

### 9.5 常见运维检查项

#### 检查最近一次 Pages 发布

```bash
gh run list --workflow='Deploy Pages' --limit 5
```

#### 查看当前工作区是否有未提交变更

```bash
git status --short
```

#### 检查来源同步结果

```bash
cat data/source-status.json
```

#### 检查官方动态同步结果

```bash
cat data/official-updates.json
```

#### 检查某个活动页是否使用了官方海报

```bash
node - <<'NODE'
const events=require('./data/events.json');
console.log(events.find(e=>e.slug==='itzy-manila-2026'));
NODE
```

### 9.6 出问题时怎么定位

#### 情况 A：页面内容更新了，但线上没变

按这个顺序排查：

1. `git status` 是否真的有改动提交
2. `git push` 是否成功
3. `gh run list --workflow='Deploy Pages'` 是否成功
4. 浏览器是否缓存旧资源，强刷后再看

#### 情况 B：图片 404 或坏图

按这个顺序排查：

1. 检查 `public/media/` 里资源是否存在
2. 检查 `out/media/` 是否被正确导出
3. 检查 `data/artists.json` / `data/events.json` 中图片路径是否正确
4. 检查 SVG 是否有无效属性
5. 检查线上资源返回码：

```bash
curl -I https://suidge.github.io/koncert-together/media/events/example.svg
```

#### 情况 C：官方同步脚本报错

优先看：

- 官方站是否更换 HTML 结构
- 是否被临时限流或 TLS 异常
- `fetch` 的来源解析规则是否失效

排查方式：

```bash
pnpm sync:official-updates
pnpm sync:images
pnpm sync:event-images
```

逐个单跑，不要一上来先怀疑构建。

#### 情况 D：指南结构被破坏

优先检查：

- `data/venue-guides.json` 是否字段缺失
- `data/guides.json` 是否被非预期覆盖
- `app/guides/[slug]/page.tsx` 是否仍支持 `practical` 字段

### 9.7 当前适合自动做的事

- 来源可达性探测
- 官方动态低频同步
- 官方图片与海报同步
- 结构化数据校验
- fallback 海报重生成
- 静态构建与 Pages 发布

## 10. 设计方向与产品路线

当前方向非常明确：

### 10.1 试运行阶段

重点是把公开前台做成稳定可用的内容站：

- 扩艺人覆盖
- 扩活动覆盖
- 扩场馆/城市指南密度
- 扩官方图与官方海报覆盖
- 扩少量真实来源自动同步

### 10.2 下一阶段

在不放弃静态托管优势的前提下，继续做这三件事：

- 提高官方来源自动更新比例
- 把重点场馆指南做成真正可规划的资料页
- 提高活动页“专属海报”覆盖，而不是复用艺人宣传图

### 10.3 未来升级方向

如果未来不再受限于 `GitHub Pages`，项目会重新回到全栈方向：

- 用户系统
- 跨设备收藏
- 评论/发帖
- 提醒系统
- 真正的数据后台
- 数据库驱动的社区功能

仓库当前仍保留部分 Prisma 依赖，就是为了后续可以平滑迁回数据库架构，而不是从零重做。

## 11. 开发计划

当前优先级建议如下：

1. 优化站点图片质量。扩更多高质量的艺人图和活动海报，尝试自动抓取高质量fan club二次分发图。同时一定要避免重复使用图片，图片主题需要与页面场景匹配。
2. 把场馆指南继续深化，增加更细的站口、区域、酒店与地图入口。
3. 扩更多官方动态同步源。
4. 提高重点艺人的活动覆盖度。
5. 尽可能保证全自动更新维护。
6. 在试运行确认有真实用户价值后，再决定是否迁回全栈架构

## 12. 维护原则

最后保留一条维护原则，后续改这个仓库时尽量不要偏离：

- 前台公开内容优先稳和可信
- 自动化优先做低风险、可复核的同步
- 活动数据宁可慢一点，也不要把风声写成官宣
- 图片宁可少，也不要用不清晰或不可追溯的来源
- 指南内容要以“能帮助用户做决定”为标准，而不是只堆概念说明
