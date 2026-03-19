# Case Study Maker

A Cursor/Claude plugin that tracks your build process, prompts reflection questions at the right moments, and generates portfolio and marketing case studies from your development journey.

**No API keys. No cloud. No cost.** Runs entirely on your IDE's built-in AI within your project folder.

[casestudymaker.dev](https://casestudymaker.dev) — Premium themes, PDF export, LinkedIn kit, and more.

## Install

### Cursor
```bash
git clone https://github.com/julieclarkson/case-study-maker.git .case-study-maker
```
Then copy `cursor/` contents into your project, or add the repo as a plugin in Cursor Settings > Features > Plugins.

### Claude Desktop (Cowork)
```bash
git clone https://github.com/julieclarkson/case-study-maker.git .case-study-maker
```
Then copy `claude/` contents into your project.

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
