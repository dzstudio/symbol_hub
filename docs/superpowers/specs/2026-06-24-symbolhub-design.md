# SymbolHub 设计文档

> Unicode 符号大全网站 — 高颜值、极致易用的单页面应用

## 1. 技术架构

### 技术栈

| 层 | 选型 | 说明 |
|---|------|------|
| 构建 | Vite 6 | 快速 HMR，原生 ESM |
| 框架 | Vue 3.5 | Composition API + `<script setup>` |
| 样式 | 纯 CSS | CSS 变量 + scoped styles，无 UI 框架 |
| 状态 | composables | `reactive()` + `provide/inject`，无 Pinia |
| 数据 | 内联 JS | ~500 符号，构建时自动压缩 |
| 部署 | 静态托管 | `dist/` 目录，可部署到任意静态服务器 |

### 目录结构

```
symbol-hub/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js                 # 入口，初始化 Vue app
│   ├── App.vue                 # 根组件，状态中心
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css   # CSS 变量（亮/暗色 tokens）
│   │       ├── reset.css       # CSS Reset
│   │       └── global.css      # 全局样式（布局、动画）
│   ├── components/
│   │   ├── AppNavbar.vue       # 顶部导航栏
│   │   ├── AppSidebar.vue      # 左侧分类栏
│   │   ├── SymbolGrid.vue      # 符号网格容器（按分类分组）
│   │   ├── SymbolCard.vue      # 单个符号卡片
│   │   ├── SearchResults.vue   # 搜索结果视图
│   │   ├── FavoritesPanel.vue  # 收藏夹模态框
│   │   ├── RecentPanel.vue     # 最近使用模态框
│   │   ├── SettingsModal.vue   # 设置模态框
│   │   ├── LangDropdown.vue    # 语言下拉菜单
│   │   └── ToastContainer.vue  # Toast 通知
│   ├── composables/
│   │   ├── useTheme.js         # 深色模式（Light/Dark/Auto）
│   │   ├── useI18n.js          # 多语言（7 种）
│   │   ├── useSearch.js        # 搜索逻辑（防抖 + 多字段匹配）
│   │   ├── useFavorites.js     # 收藏管理（localStorage）
│   │   ├── useRecent.js        # 最近使用（localStorage，上限 50）
│   │   ├── useClipboard.js     # 复制到剪贴板
│   │   └── useScrollSpy.js     # 侧栏滚动定位（IntersectionObserver）
│   ├── data/
│   │   ├── symbols.js          # ~500 符号数据
│   │   ├── categories.js       # 8 个分类定义
│   │   └── i18n.js             # 7 种语言翻译
│   └── utils/
│       └── storage.js          # localStorage 封装（get/set/remove）
```

## 2. 数据架构

### 符号数据结构

```javascript
// src/data/symbols.js
export const symbols = [
  {
    char: '∞',           // 符号字符本身
    name: 'Infinity',    // 英文名
    nameZh: '无穷大',    // 中文名
    unicode: 'U+221E',   // Unicode 码点
    category: 'math',    // 所属分类 ID
    sub: 'basicOp'       // 所属子分类 ID
  },
  // ...~500 条
]
```

精简设计：去掉 `aliases` 和 `keywords`，搜索直接匹配 `char`、`name`、`nameZh`、`unicode`。500 条数据全量遍历性能无压力。

### 分类定义

```javascript
// src/data/categories.js
export const categories = [
  {
    id: 'common',
    icon: '&#128209;',       // 图标 HTML entity
    subs: [
      { id: 'digits', nameKey: 'sub.digits' },
      { id: 'letters', nameKey: 'sub.letters' },
      { id: 'cnPunct', nameKey: 'sub.cnPunct' },
      { id: 'enPunct', nameKey: 'sub.enPunct' },
      { id: 'spaces', nameKey: 'sub.spaces' }
    ]
  },
  // ...共 8 个分类
]
```

8 个分类顺序：常用字符 → 数学与科学 → 图形与装饰 → 排版与样式 → 单位货币 → 热门专区 → Emoji → 世界文字。

### i18n 结构

```javascript
// src/data/i18n.js
export const i18n = {
  'zh-CN': {
    'app.title': 'SymbolHub - Unicode 符号仓库',
    'nav.search': '搜索符号、名称、Unicode...',
    'cat.common': '常用字符',
    'sub.digits': '数字与编号',
    // ...~120 个 key
  },
  'en': { ... },
  'ja': { ... },
  'ko': { ... },
  'es': { ... },
  'fr': { ... },
  'de': { ... }
}
```

支持 7 种语言：简体中文、English、日本語、한국어、Español、Français、Deutsch。

### 数据规模

| 分类 | 预估数量 |
|------|----------|
| 常用字符 | ~60 |
| 数学与科学 | ~80 |
| 图形与装饰 | ~60 |
| 排版与样式 | ~60 |
| 单位货币 | ~50 |
| 热门专区 | ~50 |
| Emoji | ~80 |
| 世界文字 | ~60 |
| **合计** | **~500** |

## 3. 组件架构

### 组件树

```
App.vue（状态中心）
├── AppNavbar.vue
│   ├── 搜索框 → emit('search', query)
│   ├── 主题切换按钮
│   ├── LangDropdown.vue
│   ├── 收藏按钮 → 打开 FavoritesPanel
│   ├── 最近使用按钮 → 打开 RecentPanel
│   └── 设置按钮 → 打开 SettingsModal
├── AppSidebar.vue
│   └── 分类列表 → emit('navigate', categoryId)
├── 主内容区
│   ├── SymbolGrid.vue（正常浏览模式）
│   │   └── SymbolCard.vue × N
│   └── SearchResults.vue（搜索结果模式）
│       └── SymbolCard.vue × N
├── FavoritesPanel.vue（模态框）
├── RecentPanel.vue（模态框）
├── SettingsModal.vue（模态框）
└── ToastContainer.vue
```

### 数据流

```
App.vue
  ├─ useTheme()     → theme, setTheme()
  ├─ useI18n()      → lang, t(), setLang()
  ├─ useSearch()    → query, results, search()
  ├─ useFavorites() → favorites, toggle(), clear()
  ├─ useRecent()    → recent, add(), clear()
  ├─ useClipboard() → copy()
  └─ useScrollSpy() → activeSection, scrollTo()
```

App.vue 是唯一的状态中心。子组件通过 props 接收数据，通过 emit 向上传递事件。composables 之间在 App.vue 中协调（如点击符号 → 复制 + 加入最近使用 + 显示 Toast）。

### App.vue 核心职责

1. 初始化主题、语言、收藏、最近使用（从 localStorage 恢复）
2. 根据搜索状态切换显示 SymbolGrid 或 SearchResults
3. 管理模态框的打开/关闭状态
4. 协调各 composables 之间的交互

## 4. 视觉设计系统

### 风格定位

Apple Glassmorphism + 绿色渐变主色调。参考 Raycast 的简洁、Linear 的留白、Notion 的舒适、Arc Browser 的高级感。

### 颜色系统（CSS 变量）

#### 亮色模式

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-gradient` | `linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 30%, #ffffff 70%)` | 页面背景 |
| `--bg-glass` | `rgba(255, 255, 255, 0.72)` | 卡片/导航栏背景 |
| `--bg-glass-hover` | `rgba(255, 255, 255, 0.85)` | hover 状态 |
| `--bg-glass-active` | `rgba(255, 255, 255, 0.92)` | active 状态 |
| `--color-primary` | `#22c55e` | 主色（翠绿） |
| `--color-primary-light` | `#86efac` | 浅绿高光 |
| `--color-primary-dark` | `#16a34a` | 深绿 |
| `--color-accent` | `#10b981` | 辅助色（青绿） |
| `--text-primary` | `#1a1a2e` | 主文字 |
| `--text-secondary` | `#6b7280` | 次要文字 |
| `--text-tertiary` | `#9ca3af` | 第三级文字 |
| `--border-glass` | `rgba(34, 197, 94, 0.12)` | 玻璃边框 |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | 小阴影 |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.08)` | 中阴影 |
| `--shadow-lg` | `0 8px 32px rgba(34,197,94,0.15)` | 大阴影（绿色） |
| `--shadow-glow` | `0 0 20px rgba(34,197,94,0.4)` | 光晕 |

#### 深色模式

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-gradient` | `linear-gradient(135deg, #0a1f0d 0%, #0d1117 50%, #111827 100%)` | 页面背景 |
| `--bg-glass` | `rgba(30, 40, 30, 0.6)` | 卡片/导航栏背景 |
| `--bg-glass-hover` | `rgba(40, 55, 40, 0.75)` | hover 状态 |
| `--bg-glass-active` | `rgba(50, 65, 50, 0.85)` | active 状态 |
| `--color-primary` | `#4ade80` | 主色（亮绿） |
| `--text-primary` | `#f0fdf4` | 主文字 |
| `--text-secondary` | `#9ca3af` | 次要文字 |
| `--border-glass` | `rgba(74, 222, 128, 0.15)` | 玻璃边框 |

### 字体

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Segoe UI", sans-serif;
--font-mono: "SF Mono", "JetBrains Mono", "Fira Code", monospace;
```

### 符号卡片

```
┌──────────────┐
│              │  80×80px, 圆角 20px
│      ∞       │  符号字号 32px，居中
│              │
│  Infinity    │  名称 10px，灰色，底部居中
│          ♡ ⎘│  hover 时显示收藏/复制按钮
└──────────────┘
```

- 背景：毛玻璃 `backdrop-filter: blur(12px)`
- hover：`translateY(-2px)` + 绿色阴影
- 点击复制：绿色光晕闪烁 0.3s
- 已收藏：心形变红 `#ef4444`

### 光泽效果

- 导航栏顶部高光线：`linear-gradient(to right, transparent, rgba(74,222,128,0.4), transparent)` 1px
- 卡片 hover：`box-shadow: 0 8px 32px rgba(34, 197, 94, 0.15)` + `translateY(-2px)`
- 复制成功：`box-shadow: 0 0 20px rgba(34, 197, 94, 0.4)`
- 侧栏选中项：左侧 3px 绿色渐变条

### 动画规范

| 动画 | 时长 | 缓动 |
|------|------|------|
| hover 过渡 | 0.2s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| 复制闪烁 | 0.3s | ease |
| Toast 滑入/滑出 | 0.2s | ease |
| 滚动渐入 | 0.4s | ease |
| 模态框淡入 | 0.2s | ease |

禁止复杂动画（旋转、弹跳、弹性等）。

### 响应式

| 断点 | 侧栏 | 卡片列数 | 卡片尺寸 | 符号字号 |
|------|------|----------|----------|----------|
| >1200px | 240px 固定 | auto-fill 80px | 80px | 32px |
| 768-1200px | 抽屉覆盖 | auto-fill 72px | 72px | 28px |
| <768px | 汉堡菜单 | auto-fill 64px | 64px | 28px |

## 5. 功能设计

### 搜索引擎

- **防抖**：300ms
- **匹配范围**：`char`、`name`、`nameZh`、`unicode` 四个字段
- **匹配方式**：不区分大小写的子串匹配（`String.prototype.includes()`）
- **搜索模式**：输入非空时，主内容区切换为 SearchResults 视图；清空时恢复 SymbolGrid
- **空结果**：显示空状态图标 + "未找到匹配的符号" 提示
- **性能**：500 条数据全量遍历，无需索引

### 收藏功能

- **存储**：`localStorage('symbolhub-favorites')`，JSON 数组 `['∞', 'π', ...]`
- **操作**：
  - 点击卡片右下角心形图标收藏/取消
  - FavoritesPanel 中一键复制全部收藏
  - FavoritesPanel 中导出为 txt 文件
- **UI 反馈**：心形图标变红 + Toast 提示

### 最近使用

- **存储**：`localStorage('symbolhub-recent')`，JSON 数组，最多 50 个
- **行为**：
  - 点击任意符号自动记录到最近使用
  - 重复点击移到最前（去重 + 排序）
  - 超过 50 个时自动移除最旧的
- **操作**：支持清空、批量复制

### 深色模式

- **三种模式**：Light / Dark / Auto
- **Auto 实现**：监听 `matchMedia('(prefers-color-scheme: dark)')` 的 change 事件
- **切换方式**：
  - 点击导航栏主题按钮循环切换 Light → Dark → Auto
  - 在设置模态框中直接选择
- **存储**：`localStorage('symbolhub-theme')`
- **生效**：通过 `[data-theme]` 属性切换 CSS 变量

### 语言切换

- **支持语言**：zh-CN、en、ja、ko、es、fr、de
- **自动检测**：`navigator.language` 匹配支持的语言，不匹配默认英文
- **手动切换**：导航栏语言按钮 → LangDropdown 下拉菜单
- **存储**：`localStorage('symbolhub-lang')`
- **生效范围**：
  - UI 文本通过 `t(key)` 翻译
  - 符号名称：中文环境显示 `nameZh`，其他语言显示 `name`
  - 分类名称通过 `t(category.nameKey)` 翻译

### 复制到剪贴板

- **API**：`navigator.clipboard.writeText()`
- **降级**：不支持时使用 `document.execCommand('copy')` + 临时 textarea
- **反馈**：卡片绿色光晕闪烁 + 底部 Toast "Copied ✓"

### 侧栏滚动定位

- **实现**：`IntersectionObserver` 监听各分类区块
- **阈值**：分类区块顶部进入视口上方 100px 时激活
- **点击导航**：`element.scrollIntoView({ behavior: 'smooth' })`
- **高亮**：侧栏对应分类项添加 `.active` 类（左侧绿色渐变条）

## 6. 性能策略

- **首屏加载**：~500 条符号内联在 JS 中，gzip 后约 30-50KB
- **CSS 优化**：`contain: layout style` 在符号卡片上，减少重绘范围
- **搜索防抖**：300ms，避免频繁过滤
- **硬件加速**：`backdrop-filter` 和 `transform` 触发 GPU 合成层
- **无不必要的依赖**：零外部 JS 依赖，CSS 无框架

## 7. 实施计划

### Phase 1：项目初始化 + 骨架

- `npm create vite@latest symbol-hub -- --template vue` 初始化项目
- 配置 CSS 变量（variables.css）、Reset（reset.css）、全局样式（global.css）
- 搭建 App.vue 骨架（Navbar + Sidebar + Main 三栏布局）
- 创建所有组件空壳文件
- 验证：页面可运行，三栏布局可见

### Phase 2：数据层 + 渲染引擎

- 编写 data/symbols.js（~500 条精选符号）
- 编写 data/categories.js（8 个分类定义）
- 编写 data/i18n.js（7 种语言翻译）
- 实现 SymbolGrid：按分类分组渲染符号卡片
- 实现 SymbolCard：显示符号字符 + 名称，基础样式
- 实现 AppSidebar：渲染分类列表
- 验证：页面显示所有分类和符号卡片

### Phase 3：交互功能

- 实现 useClipboard：点击卡片复制到剪贴板
- 实现 useFavorites：收藏/取消收藏，localStorage 持久化
- 实现 useRecent：记录最近使用，localStorage 持久化
- 实现 ToastContainer：复制成功 Toast 通知
- 实现 FavoritesPanel：模态框显示收藏列表，支持复制全部和导出
- 实现 RecentPanel：模态框显示最近使用，支持清空和批量复制
- 验证：点击卡片可复制，收藏和最近使用功能正常

### Phase 4：搜索 + 滚动定位

- 实现 useSearch：300ms 防抖，多字段匹配
- 实现 SearchResults：搜索结果视图
- 实现 useScrollSpy：IntersectionObserver 侧栏高亮
- 侧栏点击滚动导航
- 验证：搜索框可用，侧栏高亮跟随滚动

### Phase 5：主题 + i18n

- 实现 useTheme：Light/Dark/Auto，系统监听
- 实现 useI18n：语言切换、浏览器检测
- 实现 LangDropdown 组件
- 实现 SettingsModal
- 验证：深色模式切换正常，7 种语言切换正常

### Phase 6：响应式 + 打磨

- 移动端适配（抽屉侧栏、汉堡菜单）
- 动画细节（滚动渐入、hover 微调）
- AppNavbar 完善所有按钮功能
- 性能检查、无障碍优化
- 最终测试
