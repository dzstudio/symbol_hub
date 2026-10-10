#!/bin/bash

# Deploy SymbolHub to a remote server.
#
# Server details are NOT stored in this repo. Configure them via environment
# variables, or via a local (git-ignored) file at .claude/deploy.env:
#
#   SYMBOLHUB_HOST=<host or ip>
#   SYMBOLHUB_USER=<ssh user>            # default: root
#   SYMBOLHUB_SSH_KEY=<path to key>      # default: $HOME/.ssh/id_rsa
#   SYMBOLHUB_TARGET_DIR=<remote dir>    # default: first CLI argument
#
# Usage: deploy.sh [target_directory]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load local config if present (git-ignored)
if [ -f "$SCRIPT_DIR/deploy.env" ]; then
    # shellcheck disable=SC1091
    . "$SCRIPT_DIR/deploy.env"
fi

REMOTE_HOST="${SYMBOLHUB_HOST:?未配置服务器地址：请在 .claude/deploy.env 中设置 SYMBOLHUB_HOST，或导出同名环境变量}"
REMOTE_USER="${SYMBOLHUB_USER:-root}"
SSH_KEY="${SYMBOLHUB_SSH_KEY:-$HOME/.ssh/id_rsa}"
TARGET_DIR="${1:-${SYMBOLHUB_TARGET_DIR:-}}"

if [ -z "$TARGET_DIR" ]; then
    echo "❌ 错误：请指定目标目录"
    echo "用法: deploy.sh <target_directory>"
    echo "或设置环境变量 SYMBOLHUB_TARGET_DIR"
    exit 1
fi

# Ensure the target path ends with a slash so rsync writes inside it
case "$TARGET_DIR" in
    */) ;;
    *) TARGET_DIR="$TARGET_DIR/" ;;
esac

echo "🔨 开始构建项目..."
npm run build || { echo "❌ 构建失败"; exit 1; }

echo "📦 部署前端到 $REMOTE_HOST:$TARGET_DIR ..."
# --exclude='api/' protects the server-side api/ dir (config.php, wishlist.json)
# from --delete, since it is not part of dist/.
rsync -avz --delete --exclude='api/' -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    dist/ "$REMOTE_USER@$REMOTE_HOST:$TARGET_DIR"

# Deploy API if exists
if [ -d "api" ]; then
    echo "📦 部署 API 到 $REMOTE_HOST:${TARGET_DIR}api/ ..."
    rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
        api/ "$REMOTE_USER@$REMOTE_HOST:${TARGET_DIR}api/"
    # Tighten permissions: dir 755, data file pre-created 664 (no world-write).
    # If the web server runs as a different user, chown the data file to that
    # user (or its group) instead of loosening the mode.
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" \
        "chmod 755 ${TARGET_DIR}api && touch ${TARGET_DIR}api/wishlist.json && chmod 664 ${TARGET_DIR}api/wishlist.json"
fi

echo "✅ 部署完成！"
