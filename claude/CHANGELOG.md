# Changelog

All notable changes to Case Study Maker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-02-26

### Added

- Cursor plugin with skills, rules, hooks, commands, and hub
- Reflection capture: constraints, tradeoffs, risks, security, iteration
- Git metadata capture via post-commit and session-end hooks
- Portfolio case study generation (HTML + CSS)
- Marketing landing page generation from starter template
- Portfolio card generation for embedding
- Theme system: separate design tokens (themes/) from layout (templates/)
- OUTPUTS folder with selective send-to-pages deployment
- Home button in portfolio nav
- `/csm` hub command and slash commands

### Changed

- Pivoted from standalone web app to Cursor plugin
- Outputs now use `OUTPUTS/` with `[type]_[project].[ext]` naming
- Logo updated to SVG format
