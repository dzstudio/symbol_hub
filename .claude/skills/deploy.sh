#!/bin/bash

# Deploy SymbolHub to remote server
# Usage: deploy.sh <target_directory>
# Example: deploy.sh /var/www/sites/index/symbolhub/

set -e

# Configuration
REMOTE_HOST="REDACTED_HOST"
REMOTE_USER="root"
SSH_KEY="~/.ssh/id_rsa"

# Check if target directory is provided
if [ -z "$1" ]; then
    echo "❌ 错误：请指定目标目录"
    echo "用法: deploy.sh <target_directory>"
    echo "示例: deploy.sh /var/www/sites/index/symbolhub/"
    exit 1
fi

TARGET_DIR="$1"

echo "🔨 开始构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "📦 部署到 $REMOTE_HOST:$TARGET_DIR ..."
rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" dist/ $REMOTE_USER@$REMOTE_HOST:$TARGET_DIR

if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

echo "✅ 部署完成！"
