# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SymbolHub is a Unicode symbol library/encyclopedia website built with Vue 3 and Vite. It provides a searchable collection of special symbols organized by category, with multi-language support (7 languages), clipboard functionality, and recent history tracking.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to remote server (see Deployment section for required config)
npm run build && .claude/skills/deploy.sh <target_directory>
```

## Architecture

### Tech Stack
- **Framework**: Vue 3.5 with Composition API (`<script setup>`)
- **Build Tool**: Vite 8
- **Styling**: Pure CSS with CSS variables (no UI framework)
- **State Management**: Vue composables with reactive state
- **Internationalization**: Custom i18n implementation (7 languages)

### Project Structure

```
src/
├── App.vue                    # Root component, main state center
├── main.js                    # Entry point
├── assets/
│   ├── icons.js               # Lucide SVG icons (navbar, categories)
│   └── styles/
│       ├── variables.css      # CSS design tokens (light/dark themes)
│       ├── reset.css          # CSS reset
│       └── global.css         # All component styles
├── components/
│   ├── AppNavbar.vue          # Top navigation bar with search
│   ├── FloatingNav.vue        # Draggable floating category navigation
│   ├── SymbolGrid.vue         # Main symbol display grid
│   ├── SymbolCard.vue         # Individual symbol card
│   ├── SearchResults.vue      # Search results view
│   ├── RecentSection.vue      # Recently used symbols section
│   ├── ToastContainer.vue     # Toast notifications
│   └── LangDropdown.vue       # Language selector dropdown
├── composables/
│   ├── useTheme.js            # Dark/light mode management
│   ├── useI18n.js             # Internationalization (7 languages)
│   ├── useSearch.js           # Search with debounce
│   ├── useRecent.js           # Recent symbols history
│   ├── useClipboard.js        # Clipboard operations
│   └── useScrollSpy.js        # IntersectionObserver for navigation
└── data/
    ├── symbols.js             # Symbol data (add new symbols here)
    ├── categories.js          # Category definitions
    └── i18n.js                # Language translations
```

### Key Components

**App.vue** is the state center that coordinates all composables:
- Theme, i18n, search, recent, clipboard
- Manages modal states and toast notifications
- Passes data down to child components via props

**FloatingNav.vue** is a draggable floating navigation panel on the right side:
- Shows category icons with labels
- Has a drag handle button at the bottom
- Position saved to localStorage
- Supports touch/mouse drag

**SymbolGrid.vue** groups symbols by category:
- Static pre-computed at module load (not reactive)
- Uses Map for efficient category/subcategory lookup
- Only shows subcategory headers for "common" category

### Theme System

CSS variables in `variables.css` define the design tokens:
- Light mode: `:root` selector
- Dark mode: `[data-theme="dark"]` selector
- Theme toggled by changing `data-theme` attribute on `<html>`

### Internationalization

- 7 languages: zh-CN, en, ja, ko, es, fr, de
- Language detected from browser on first visit
- User preference saved to localStorage
- HTML `lang` attribute updated dynamically

### Adding New Symbols

Edit `src/data/symbols.js`:

```javascript
{
  char: '∞',           // The symbol character
  name: 'Infinity',    // English name
  nameZh: '无穷大',    // Chinese name
  unicode: 'U+221E',   // Unicode code point
  category: 'math',    // Category ID (see categories.js)
  sub: 'basicOp'       // Subcategory ID (see categories.js)
}
```

### Available Categories

| Category ID | Subcategory IDs |
|-------------|-----------------|
| common | digits, punctuation |
| math | basicOp, compare, setLogic, calculus, geometry |
| graphics | arrows, stars, shapes, lines, borders |
| typography | circled, supSub, fancy |
| units | currency, music, chess, tech |
| popular | nickname, hearts, emojiAll |
| emoji | faces, gestures, animals, food, weather |
| world | greek, japanese, korean, braille |

### Deployment

The app is deployed to `https://dillonz.com/symbolhub/`

Build configuration in `vite.config.js`:
```javascript
base: '/symbolhub/'  // Required for subdirectory deployment
```

**使用 Deploy Skill:**

服务器信息不写入仓库。首次使用前，复制模板并填入自己的配置（`deploy.env` 已被 git 忽略）：

```bash
cp .claude/deploy.env.example .claude/deploy.env
# 编辑 .claude/deploy.env 填入 SYMBOLHUB_HOST / SYMBOLHUB_USER / SYMBOLHUB_SSH_KEY / SYMBOLHUB_TARGET_DIR
```

然后执行部署：

```bash
# 部署到指定目录
.claude/skills/deploy.sh <target_directory>

# 或者在 Claude Code 中调用，会自动构建并部署
```

也可直接用环境变量覆盖（无需配置文件）：

- `SYMBOLHUB_HOST` — 服务器地址（必填）
- `SYMBOLHUB_USER` — SSH 用户，默认 `root`
- `SYMBOLHUB_SSH_KEY` — 私钥路径，默认 `$HOME/.ssh/id_rsa`
- `SYMBOLHUB_TARGET_DIR` — 部署目录，也可作为第一个参数传入

### Wishlist API（`api/wishlist.php`）

心愿单接口，服务端配置放在 **`api/config.php`**（不进仓库，参考 `api/config.php.example`）：

- `token` — 管理操作所需的共享密钥，用 `openssl rand -hex 32` 生成
- `dataFile` — 提交数据存放路径（含用户邮箱，建议放到 web 根目录之外）

首次部署后需在服务器上手动创建该文件（`api/` 的 rsync 不带 `--delete`，会保留）。

权限约定：

| 操作 | 鉴权 |
|---|---|
| `POST`（提交心愿） | 公开 |
| `GET`（读取列表，含邮箱） | 需 `X-Auth-Token` 头 |
| `PUT`（修改状态） | 需 `X-Auth-Token` 头 |

管理页 `/symbolhub/admin.html` 首次访问会提示输入 token，保存在浏览器 localStorage。

### Performance Notes

- Symbol cards don't use `backdrop-filter` (GPU intensive)
- Search index pre-computed at module load
- Floating nav uses `v-once` for static icons
- Theme changes use CSS variable swaps (minimal reflow)
