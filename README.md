# Case Study Maker

**Capture your build decisions in real time. Generate portfolio and marketing case studies from your development journey.**

An always-on AI partner that watches your coding sessions and prompts reflection questions when you're making architecture tradeoffs, hardening security, or navigating constraints. When you ship, generate polished case study pages from the real decisions you captured — not from memory weeks later. Everything runs locally in your project folder.

Free Cursor & Claude plugin. No API keys, no cloud, no accounts.

[casestudymaker.dev](https://casestudymaker.dev) — Premium themes, PDF export, LinkedIn kit, and more.

## Install

> **Important:** Clone this repo _inside_ the project you want to document.

### Cursor
```bash
cd ~/my-awesome-app
git clone https://github.com/julieclarkson/case-study-maker.git .case-study-maker
mkdir -p .cursor/rules
cp .case-study-maker/cursor/.cursor/rules/case-study-partner.mdc .cursor/rules/
```
Then say **"activate case study maker"** in Cursor.

### Claude Desktop (Cowork)
```bash
cd ~/my-awesome-app
git clone https://github.com/julieclarkson/case-study-maker.git .case-study-maker
cp -r .case-study-maker/claude/skills .claude/skills
```
Then use `/activate-case-study-maker` in Claude.

### Bundle (all three plugins)
- **Cursor**: [launchpad-cursor](https://github.com/julieclarkson/launchpad-cursor)
- **Claude**: [launchpad-claude](https://github.com/julieclarkson/launchpad-claude)

## Structure

```
cursor/   — Cursor plugin (rules, skills, commands, templates, hooks)
claude/   — Claude plugin (skills, commands, templates)
```

See `cursor/README.md` or `claude/README.md` for full documentation, commands, and usage.

## Requirements

- **Node.js 18+** (optional) — for post-commit hooks. All core features work without it.

## Sandbox and Permissions

Case Study Maker runs entirely within the IDE sandbox. No sandbox escape is needed for normal operation. The only exception is `/send-to-pages`, which writes to a directory outside the project (your GitHub Pages repo) and may request expanded permissions.

**Your responsibility:** Cursor and Claude may request expanded permissions when an operation needs to write outside the project folder or access the network. Review each permission prompt carefully. Configure scope settings in your IDE to control what the AI agent is allowed to do.

## Companion Plugins

Case Study Maker works best with:
- [Demo Maker](https://github.com/julieclarkson/demo-maker) — Generate narrated video demos
- [Git Launcher](https://github.com/julieclarkson/git-launcher) — Create launch kits for every platform

**Recommended order:** Case Study Maker → Demo Maker → Git Launcher

## License

MIT
