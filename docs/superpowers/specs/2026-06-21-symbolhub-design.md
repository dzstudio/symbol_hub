# SymbolHub 设计文档

## 概述

符号仓库（SymbolHub）是一个高颜值、极致易用的 Unicode 符号大全网站。单页面版本，无需后端，支持直接部署到 GitHub Pages / Cloudflare Pages / Vercel。

## 视觉设计系统

### 风格定位

Apple 磨砂玻璃（Glassmorphism）+ 绿色渐变主色调，强调明亮光泽感、高级感、留白舒适。

### 颜色系统

#### 亮色模式（Light）

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-gradient` | `linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 30%, #ffffff 70%)` | 页面背景 |
| `--bg-glass` | `rgba(255, 255, 255, 0.72)` | 卡片/导航栏背景 |
| `--bg-glass-hover` | `rgba(255, 255, 255, 0.85)` | 卡片 hover |
| `--color-primary` | `#22c55e` | 主色（翠绿） |
| `--color-primary-light` | `#86efac` | 浅绿高光 |
| `--color-primary-dark` | `#16a34a` | 深绿 |
| `--color-accent` | `#10b981` | 辅助色（青绿） |
| `--text-primary` | `#1a1a2e` | 主文字 |
| `--text-secondary` | `#6b7280` | 次要文字 |
| `--text-tertiary` | `#9ca3af` | 第三级文字 |
| `--border-glass` | `rgba(34, 197, 94, 0.12)` | 玻璃边框 |

#### 深色模式（Dark）

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-gradient` | `linear-gradient(135deg, #0a1f0d 0%, #0d1117 50%, #111827 100%)` | 页面背景 |
| `--bg-glass` | `rgba(30, 40, 30, 0.6)` | 卡片/导航栏背景 |
| `--bg-glass-hover` | `rgba(40, 55, 40, 0.75)` | 卡片 hover |
| `--color-primary` | `#4ade80` | 主色（亮绿） |
| `--text-primary` | `#f0fdf4` | 主文字 |
| `--text-secondary` | `#9ca3af` | 次要文字 |
| `--border-glass` | `rgba(74, 222, 128, 0.15)` | 玻璃边框 |

### 字体

- 标题：`-apple-system, "SF Pro Display", "PingFang SC", sans-serif`
- 符号展示：系统 emoji 字体 + `Noto Sans Symbols` 回退
- 代码/Unicode：`"SF Mono", "JetBrains Mono", monospace`

### 光泽效果

- **导航栏顶部高光线**：`linear-gradient(to right, transparent, rgba(74,222,128,0.4), transparent)` 1px
- **卡片 hover**：`box-shadow: 0 8px 32px rgba(34, 197, 94, 0.15)` + `translateY(-2px)`
- **复制成功**：卡片短暂闪烁绿色光晕 `box-shadow: 0 0 20px rgba(34, 197, 94, 0.4)`
- **侧栏选中项**：左侧绿色渐变条 `3px` 宽

## 页面布局

### 整体结构（三栏）

```
┌─────────────────────────────────────────────────────┐
│  🟢 Logo    🔍 搜索框    🌙 🌐 ⭐ 🕐 ⚙️  │  顶部导航栏
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  常用字符  │   📁 常用字符 > 数字与编号                │
│  数学符号  │   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│  图形装饰  │   │① │ │② │ │③ │ │④ │ │⑤ │ │⑥ │ │⑦ │  │
│  排版样式  │   └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│  单位货币  │   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│  Emoji   │   │⑧ │ │⑨ │ │⑩ │ │⑪ │ │⑫ │ │⑬ │ │⑭ │  │
│  世界文字  │   └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│  热门专区  │   ...                                    │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
```

### 顶部导航栏

- 高度：`64px`，`position: fixed`，`z-index: 100`
- 毛玻璃背景：`backdrop-filter: blur(24px)` + 半透明背景
- 顶部绿色高光线 1px
- Logo：绿色渐变圆形图标 + "SymbolHub" 文字
- 搜索框：圆角 `16px`，占导航栏宽度 40%，带搜索图标
- 右侧图标组：深色模式切换 / 语言切换 / 收藏入口 / 最近使用入口 / 设置
- 设置按钮功能（弹出模态框）：
  - 深色模式切换（Light / Dark / Auto）
  - 语言切换
  - 字体大小调节（小/中/大）
  - 清除本地数据（收藏 + 最近使用）

### 左侧分类栏

- 宽度：`240px`，`position: sticky`，`top: 64px`
- 背景：半透明 + blur
- 分类项：圆角 `12px`，hover 时背景高亮
- 选中项：左侧 `3px` 绿色渐变条 + 文字变绿
- 支持折叠（移动端汉堡菜单）
- 滚动时自动高亮当前可见分类（IntersectionObserver）

### 右侧内容区

- 每个分类区块：
  - 分类标题：`28px` 粗体，带小绿色装饰线
  - 子分类标题：`18px` 灰色文字
  - 符号卡片网格：`display: grid` 布局

### 符号卡片

- 尺寸：`80px × 80px`（桌面端），响应式缩放
- 圆角：`20px`
- 背景：毛玻璃白/黑
- 内容：
  - 符号：`40px` 居中显示
  - 名称：底部 `10px` 灰色小字
- hover 效果：阴影 + 上移 2px + 绿色光晕
- 点击行为：复制到剪贴板 + 显示 "Copied ✓" + 绿色闪烁动画
- 右下角小图标：收藏心形 + 复制按钮（hover 时显示）

### 响应式断点

| 设备 | 分类栏 | 卡片列数 | 卡片尺寸 |
|------|--------|----------|----------|
| 桌面 (>1200px) | 240px 固定 | 8-10列 | 80px |
| 平板 (768-1200px) | 折叠/抽屉 | 6列 | 72px |
| 手机 (<768px) | 汉堡菜单 | 4列 | 64px |

## 数据架构

### 符号数据结构

```javascript
{
  char: "∞",           // 符号字符
  name: "Infinity",    // 英文名
  cnName: "无穷大",     // 中文名
  unicode: "U+221E",   // Unicode 码点
  aliases: ["infinite"], // 别名（英文）
  keywords: ["math", "无限"], // 关键词
  category: "math",    // 一级分类 ID
  subCategory: "basic" // 子分类 ID
}
```

### 数据规模规划（~5000 符号）

| 分类 | 预估数量 |
|------|----------|
| 常用字符 | ~300 |
| 数学与科学 | ~600 |
| 图形与装饰 | ~500 |
| 排版与样式 | ~800 |
| 单位货币 | ~400 |
| Emoji | ~1200 |
| 世界文字 | ~800 |
| 热门专区 | ~400 |

### 渲染策略

- 全量内联 JS 数组（~5000 条）
- 使用 `IntersectionObserver` 做视口可见渲染
- 搜索防抖 300ms
- CSS `contain` 属性优化重绘

## 功能设计

### 搜索引擎

- **防抖**：300ms
- **匹配逻辑**：同时搜索 `char`、`name`、`cnName`、`unicode`、`aliases`、`keywords`
- **模糊匹配**：支持部分匹配（如搜 "221E" 能匹配到 "∞"）
- **实时过滤**：输入即过滤，不跳转页面
- **高亮匹配**：搜索结果中匹配的文字高亮显示

### 侧栏滚动定位

- 使用 `IntersectionObserver` 监听各分类区块
- 滚动时自动高亮左侧对应分类项
- 点击分类项平滑滚动到对应区块（`scrollIntoView({ behavior: 'smooth' })`）

### 深色模式

- 三种模式：Light / Dark / Auto
- Auto 跟随系统 `prefers-color-scheme`
- 通过 CSS 变量统一管理
- 保存到 `localStorage('symbolhub-theme')`

### 语言切换（i18n）

- 支持语言：简体中文、English、日本語、한국어、Español、Français、Deutsch
- 7 种语言的 UI 文本 JSON（按钮、提示、分类名等）
- 符号名称显示策略：
  - 英文/日文/韩文/西/法/德：显示 `name` 字段（英文名）
  - 简体中文：显示 `cnName` 字段
  - 分类名通过 i18n JSON 翻译
- 浏览器语言自动检测
- 保存用户选择到 `localStorage('symbolhub-lang')`

### 收藏功能

- **存储**：`localStorage('symbolhub-favorites')` 存储 JSON 数组（序列化为字符串）
- **操作**：收藏/取消收藏、一键复制全部、导出 txt
- **UI**：心形图标，已收藏为实心绿色
- **去重**：使用 `Set` 去重，持久化时转为数组

### 最近使用

- **存储**：`localStorage('symbolhub-recent')` 存储数组，最多 50 个
- **操作**：清空、批量复制
- **排序**：最近使用的排在前面

## 动画

- hover 缩放：`transform: scale(1.05)` + `transition: 0.2s ease`
- 复制成功：绿色光晕闪烁 300ms
- 滚动渐入：`IntersectionObserver` + CSS `opacity/transform` 过渡
- CSS Transition 统一：`transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

## 性能

- 单文件 `index.html`，无需服务器
- 全量数据内联，首屏快速加载
- `IntersectionObserver` 视口渲染
- 搜索防抖 300ms
- CSS `contain` 属性优化
- 无外部依赖

## 技术约束

- HTML5 + CSS3 + Vanilla JavaScript
- 禁止 React / Vue / Angular
- 禁止 npm / Node 依赖
- 单文件 `index.html`
- 所有数据内置 JSON
- 代码达到生产级质量，结构清晰，完整注释
