# Design System — 约球吧

## 1. Visual Theme & Atmosphere

约球吧是一个面向年轻人的网球社交小程序，融合小红书式内容发现与猫眼式评分体验。视觉风格汲取 Airbnb 的温暖友好感与 Pinterest 的图片优先瀑布流布局，注入运动活力色彩。

整体氛围：温暖、活力、年轻、社交感。米白色画布上承载白色圆角卡片，活力橙作为唯一品牌色贯穿所有主要交互，青绿色点缀场馆与健康元素，粉红色用于社交互动（点赞、热门）。

**Key Characteristics:**
- 温暖米白画布 (`#FAFAF8`) — 小红书同款质感，比纯白更柔和
- 活力橙 (`#FF6B35`) 作为唯一品牌强调色 — CTA、Tab 高亮、价格
- 双列瀑布流首页 — Pinterest 式内容发现
- 16rpx 统一圆角 + 轻阴影 — Airbnb 式温暖卡片
- Pill 形按钮和搜索栏 — 年轻、触控友好
- 猫眼式大数字评分 — 场馆和球友评价核心视觉

## 2. Color Palette & Roles

### Brand
- **Primary / 活力橙** (`#FF6B35`): 主 CTA、Tab 高亮、价格数字、评分
- **Secondary / 清新青绿** (`#2EC4B6`): 场馆标签、健康元素、辅助信息
- **Accent / 活力粉红** (`#FF3366`): 点赞、热门标记、社交互动

### Surface
- **Canvas** (`#FAFAF8`): 页面背景
- **Card** (`#FFFFFF`): 卡片、输入框、弹窗背景
- **Surface Soft** (`#F5F5F3`): 搜索栏、未选中 chip、次要表面

### Text
- **Ink** (`#1A1A1A`): 标题、主要文字
- **Body** (`#666666`): 正文、次要信息
- **Muted** (`#999999`): 辅助文字、占位符
- **On Primary** (`#FFFFFF`): 主色按钮上的白色文字

### Border & Divider
- **Hairline** (`#EEEEEE`): 输入框边框、列表分割线
- **Hairline Soft** (`#F5F5F3`): 更轻的分割

### Semantic
- **Success** (`#22C55E`): 成功、已完成
- **Warning** (`#FACC15`): 警告、提醒
- **Error** (`#EF4444`): 错误、取消

### Tinted Backgrounds
- **Primary Tint** (`#FFF0E8`): 橙色浅底，水平标签背景
- **Secondary Tint** (`#F0FBF9`): 青绿浅底，场馆标签背景
- **Accent Tint** (`#FFF0F3`): 粉红浅底，热门标记背景

## 3. Typography Rules

### Font Family
`-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei', sans-serif`

### Hierarchy (rpx for WeChat Mini Program)

| Role | Size | Weight | Color | Notes |
|------|------|--------|-------|-------|
| Page Title | 44rpx | 700 | Ink | 页面大标题 |
| Section Title | 36rpx | 700 | Ink | 区块标题 |
| Card Title | 30rpx | 600 | Ink | 卡片标题 |
| Body | 28rpx | 400 | Ink/Body | 正文内容 |
| Body Small | 26rpx | 400 | Body | 次要正文 |
| Caption | 24rpx | 400 | Muted | 辅助说明 |
| Badge | 22rpx | 500 | varies | 标签、徽章 |
| Micro | 20rpx | 400 | Muted | 最小文字 |
| Rating Score | 36-56rpx | 700 | Primary | 猫眼式评分大数字 |
| Price | 28-32rpx | 700 | Primary | 价格显示 |

## 4. Component Stylings

### Card
- Background: `#FFFFFF`
- Border radius: 16rpx
- Shadow: `0 4rpx 16rpx rgba(0,0,0,0.06)`
- No border
- Padding: 20-28rpx (内容区)

### Button Primary (Pill)
- Background: `#FF6B35`
- Text: `#FFFFFF`, 26-32rpx, weight 600
- Border radius: 9999rpx (full pill)
- Height: 80-96rpx (large), 64rpx (medium), 48rpx (small)
- Padding: 0 40rpx

### Button Secondary
- Background: `#F5F5F3`
- Text: `#666666`
- Border radius: 9999rpx
- Same sizing as primary

### Button Outline
- Background: transparent
- Border: 2rpx solid `#EEEEEE`
- Text: `#666666`
- Border radius: 9999rpx

### Filter Chip
- Default: background `#F5F5F3`, text `#666666`
- Active: background `#FF6B35`, text `#FFFFFF`
- Border radius: 9999rpx
- Padding: 12rpx 28rpx
- Font size: 26rpx

### Search Bar
- Background: `#F5F5F3`
- Border radius: 9999rpx
- Height: 72rpx
- Padding: 0 32rpx
- Placeholder color: `#999999`

### Input Field
- Background: `#FFFFFF`
- Border: 2rpx solid `#EEEEEE`
- Border radius: 16rpx
- Height: 80rpx
- Focus border: `#FF6B35`

### Rating Display (猫眼式)
- Score number: 36-56rpx, weight 700, color `#FF6B35`
- Star color: `#FF6B35`
- Review count: 22rpx, color `#999999`

### Tag
- Padding: 4rpx 12-16rpx
- Border radius: 8rpx
- Font size: 20-22rpx
- Sport type: tinted primary background
- Venue tag: tinted secondary background

### Avatar
- Border radius: 9999rpx (circle)
- Sizes: 120rpx (profile), 64rpx (card), 48rpx (inline)

## 5. Layout Principles

### Spacing Scale (8rpx grid)
- 8rpx: tight inline gaps
- 16rpx: card gaps, list item spacing
- 24rpx: page padding, section gaps
- 32rpx: large section padding
- 48rpx: section separation
- 64rpx: major section breaks

### Page Structure
- Page padding: 24-32rpx horizontal
- Bottom safe area: 环境自适应

### Waterfall Grid (发现页)
- 2 columns, 16rpx gap
- Cards: full width within column, variable height
- Image: fills card width, aspect ratio preserved

## 6. Depth & Elevation

- **Level 0** (Canvas): `#FAFAF8`, no shadow
- **Level 1** (Cards): `#FFFFFF`, shadow `0 4rpx 16rpx rgba(0,0,0,0.06)`
- **Level 2** (Elevated): `#FFFFFF`, shadow `0 8rpx 32rpx rgba(0,0,0,0.10)`
- **Level 3** (Modal/Sheet): `#FFFFFF`, shadow `0 -4rpx 24rpx rgba(0,0,0,0.12)`

## 7. Do's and Don'ts

### Do
- 用活力橙作为所有主要 CTA 的唯一颜色
- 保持卡片圆角统一为 16rpx
- 用 pill 形状（9999rpx）做按钮和搜索栏
- 评分数字要大而醒目（猫眼风格）
- 图片优先，文字精简（小红书风格）
- 保持温暖米白背景，避免冷白

### Don't
- 不要在同一页面混用多种强调色
- 不要使用直角卡片
- 不要让文字密度过高，保持呼吸感
- 不要在深色背景上使用品牌橙（对比度不足）
- 不要给评分数字用小号字体

## 8. Responsive Behavior

微信小程序使用 rpx 单位自动适配，设计稿基准宽度 750rpx。

- TabBar: 固定底部，5 个 tab
- 搜索栏: 固定在顶部或跟随滚动
- 瀑布流: 始终 2 列
- 卡片: 宽度自适应列宽
- 弹窗: 从底部滑出，圆角 32rpx 顶部

## 9. Agent Prompt Guide

### Quick Color Reference
```
Primary CTA / Tab active / Price: #FF6B35
Venue / Health tags: #2EC4B6
Like / Hot / Social: #FF3366
Page background: #FAFAF8
Card background: #FFFFFF
Main text: #1A1A1A
Secondary text: #666666
Muted text: #999999
```

### Ready-to-use Prompts
- "创建一个约球卡片：白底、16rpx 圆角、轻阴影、标题 30rpx 加粗、底部橙色 pill 按钮"
- "设计场馆评分区域：大号橙色评分数字、星星、维度小分、评价列表"
- "做一个小红书式双列瀑布流：16rpx 间距、图片卡片、底部作者信息和点赞数"
