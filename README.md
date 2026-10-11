# SymbolHub

> Unicode 特殊符号大全 —— 收录数学、图形、排版、单位货币、Emoji 等各类特殊字符，支持搜索与一键复制，即用即走。

在线体验：<https://dillonz.com/symbolhub/>

## 简介

SymbolHub 是一个基于 **Vue 3 + Vite** 构建的 Unicode 符号大全网站。纯静态部署、无后端依赖（心愿单为可选的 PHP 小接口），收录 **960+ 个特殊符号**，按 **8 大分类**组织，支持 **7 种语言**，并提供收藏、最近使用、深色模式等体验细节。

## 功能特性

- **即时搜索** —— 按符号、名称、Unicode 编码、别名多字段匹配，带输入防抖
- **一键复制** —— 点击即复制到剪贴板，Toast 反馈
- **8 大分类** —— 常用、数学与科学、图形与装饰、排版与样式、单位与专业、热门、Emoji、世界文字
- **7 种语言** —— 简体中文 / English / 日本語 / 한국어 / Español / Français / Deutsch
- **收藏与最近使用** —— 本地保存，无需登录
- **深色模式** —— 跟随系统或手动切换
- **可拖拽悬浮导航** —— 位置本地记忆，支持触屏
- **心愿单** —— 用户可提交想要的符号，附带 token 校验的管理后台
- **Cookie 同意横幅**
- **SEO 与统计** —— 结构化数据（JSON-LD）、Open Graph、GA4 / 百度统计

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vue 3.5（Composition API / `<script setup>`） |
| 构建 | Vite 8 |
| 样式 | 原生 CSS + CSS 变量（无 UI 框架） |
| 状态 | Vue composables（reactive 状态 + provide/inject） |
| 国际化 | 自研轻量 i18n（7 语言） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本（产物输出到 dist/）
npm run build

# 本地预览生产构建
npm run preview
```

## 项目结构

```
symbol_hub/
├── index.html              # 主页面入口
├── admin.html              # 心愿单管理页（token 鉴权）
├── vite.config.js
├── public/                 # 静态资源（favicon、图标）
├── api/
│   ├── wishlist.php        # 心愿单接口（GET/PUT 需 token，POST 公开）
│   └── config.php.example  # 服务端配置模板（部署时复制为 config.php）
└── src/
    ├── main.js             # 入口
    ├── App.vue             # 根组件 / 状态中心
    ├── components/         # 导航栏、符号网格、卡片、弹窗等
    ├── composables/        # useTheme / useI18n / useSearch / useFavorites ...
    ├── data/               # symbols.js / categories.js / i18n.js
    ├── utils/storage.js    # localStorage 封装
    └── assets/
        ├── icons.js        # 矢量图标
        └── styles/         # variables.css / reset.css / global.css
```

## 部署

### 静态站点

`vite.config.js` 中的 `base: '/symbolhub/'` 用于子目录部署，按实际路径修改。构建后把 `dist/` 上传到任意静态服务器即可。

仓库自带部署脚本 `.claude/skills/deploy.sh`。服务器信息不写入仓库，通过环境变量或本地 `.claude/deploy.env`（已 gitignore）提供：

```bash
cp .claude/deploy.env.example .claude/deploy.env   # 填入 SYMBOLHUB_HOST 等
.claude/skills/deploy.sh <目标目录>
```

可配置项：`SYMBOLHUB_HOST`（必填）、`SYMBOLHUB_USER`、`SYMBOLHUB_SSH_KEY`、`SYMBOLHUB_TARGET_DIR`。

### 心愿单 API（可选）

管理操作需要共享密钥。首次部署后，在服务器上创建 `api/config.php`：

```bash
cp api/config.php.example api/config.php
# 编辑 config.php，把 token 换成随机值：
openssl rand -hex 32
```

接口权限：

| 操作 | 鉴权 |
|---|---|
| `POST` 提交心愿 | 公开 |
| `GET` 读取列表（含用户邮箱） | 需 `X-Auth-Token` 请求头 |
| `PUT` 修改状态 | 需 `X-Auth-Token` 请求头 |

管理页位于 `/symbolhub/admin.html`，首次访问会提示输入 token。

## 添加新符号

编辑 `src/data/symbols.js`：

```javascript
{
  char: '∞',           // 符号本身
  name: 'Infinity',    // 英文名称
  nameZh: '无穷大',     // 中文名称
  unicode: 'U+221E',   // Unicode 码位
  category: 'math',    // 分类 ID（见 src/data/categories.js）
  sub: 'basicOp'       // 子分类 ID
}
```

## 分类一览

| 分类 | 子分类 |
|---|---|
| `common` 常用 | digits, punctuation |
| `math` 数学与科学 | basicOp, compare, setLogic, calculus, geometry |
| `graphics` 图形与装饰 | arrows, stars, shapes, lines, borders |
| `typography` 排版与样式 | circled, supSub, fancy |
| `units` 单位与专业 | currency, music, chess, tech |
| `popular` 热门 | nickname, hearts, emojiAll |
| `emoji` 表情 | faces, gestures, animals, food, weather |
| `world` 世界文字 | greek, japanese, korean, braille |

## 许可证

本项目暂未声明开源许可证。如需公开复用，请先补充 `LICENSE` 文件。
