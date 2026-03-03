#!/usr/bin/env bash
# Push production build to case-study-maker (public repo).
# Builds to dist/, then pushes dist contents to https://github.com/julieclarkson/case-study-maker

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIST="$PROJECT_ROOT/dist/case-study-maker"
PRODUCTION_REPO="https://github.com/julieclarkson/case-study-maker.git"
PROD_CLONE="$PROJECT_ROOT/.prod-clone"

echo "=== Push to Production ==="
echo ""

# 1. Build
echo "Step 1: Building production copy..."
bash "$SCRIPT_DIR/build-production.sh"
echo ""

# 2. Clone production repo (or pull), copy dist over, push
echo "Step 2: Pushing to $PRODUCTION_REPO ..."
rm -rf "$PROD_CLONE"
git clone "$PRODUCTION_REPO" "$PROD_CLONE"
cd "$PROD_CLONE"
rsync -a --delete --exclude='.git' "$DIST/" .
git add -A
if git diff --staged --quiet; then
  echo "No changes to push."
  rm -rf "$PROD_CLONE"
  exit 0
fi
git commit -m "Production build $(date +%Y-%m-%d)"
git push origin main
rm -rf "$PROD_CLONE"
echo ""
echo "=== Done. Production repo updated. ==="
