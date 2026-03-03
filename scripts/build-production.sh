#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIST="$PROJECT_ROOT/dist/case-study-maker"

echo "Building production copy of Case Study Maker..."
echo "Source: $PROJECT_ROOT"
echo "Target: $DIST"
echo ""

rm -rf "$DIST"
mkdir -p "$DIST"

PROD_DIRS=(".cursor-plugin" "commands" "skills" "rules" "hooks" "agents" "assets" "templates" "scripts")

for dir in "${PROD_DIRS[@]}"; do
  if [ -d "$PROJECT_ROOT/$dir" ]; then
    cp -r "$PROJECT_ROOT/$dir" "$DIST/$dir"
  fi
done

PROD_FILES=("README.md" "CHANGELOG.md" "LICENSE" "csm-init")

for file in "${PROD_FILES[@]}"; do
  if [ -f "$PROJECT_ROOT/$file" ]; then
    cp "$PROJECT_ROOT/$file" "$DIST/$file"
  fi
done

rm -f "$DIST/commands/build-production.md" "$DIST/commands/push-production.md"
find "$DIST" -name '.DS_Store' -delete 2>/dev/null || true

FILE_COUNT=$(find "$DIST" -type f | wc -l | tr -d ' ')
DIR_COUNT=$(find "$DIST" -type d | wc -l | tr -d ' ')

echo "Production build complete."
echo "Output: $DIST"
echo "Files:  $FILE_COUNT"
echo "Dirs:   $DIR_COUNT"
echo ""
echo "Contents:"
find "$DIST" -type f | sort | sed "s|$DIST/|  |"
