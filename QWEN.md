# ileben-landing-v2 — Qwen Code Project Context

## Project Overview

- **Type:** WordPress theme (mobile-first landing pages)
- **Version:** 0.1.14
- **Author:** ileben.cl
- **Compatibility:** PHP 8.3+, WordPress 6.0+ (tested 6.4), ACF Pro
- **Stack:** Bootstrap 5, GSAP animations, Swiper.js, Fancybox, Vite bundler, SCSS

## Key Conventions

- **Build:** `npm run dev` (Vite dev), `npm run build` (production), `npm run build:all`
- **ACF Pro:** Theme options stored in `acf-json/` (JSON-based field groups)
- **Blocks:** Custom Gutenberg blocks with GSAP animations, output buffering pattern, strict escaping
- **Updater:** GitHub-based auto-updater (see `GITHUB_UPDATER.md`)
- **CSS:** SCSS with PostCSS, separate back-CSS build (`npm run build:back-css`)

## Available WordPress Skills

All skills live under `.github/skills/`. Read the full SKILL.md before executing procedures.

### Router & Triage (always start here)

| Skill | Path | When to use |
|-------|------|-------------|
| **wordpress-router** | `.github/skills/wordpress-router/SKILL.md` | Classify repo type (plugin/theme/block theme/WP core) and route to correct skill. Run at start of most WP tasks. |
| **wp-project-triage** | `.github/skills/wp-project-triage/SKILL.md` | Deterministic inspection producing JSON report: project kind, tooling, tests, version hints. Run `node skills/wp-project-triage/scripts/detect_wp_project.mjs` |

### Development Skills

| Skill | Path | When to use |
|-------|------|-------------|
| **wp-block-development** | `.github/skills/wp-block-development/SKILL.md` | Gutenberg blocks: block.json, attributes, dynamic rendering, deprecations, @wordpress/scripts |
| **wp-block-themes** | `.github/skills/wp-block-themes/SKILL.md` | Block themes: theme.json, templates, patterns, style variations, Site Editor |
| **wp-plugin-development** | `.github/skills/wp-plugin-development/SKILL.md` | Plugin development: hooks, activation/uninstall, Settings API, security, release packaging |
| **wp-interactivity-api** | `.github/skills/wp-interactivity-api/SKILL.md` | Interactivity API: data-wp-* directives, @wordpress/interactivity, stores, hydration |
| **wp-abilities-api** | `.github/skills/wp-abilities-api/SKILL.md` | Abilities API: wp_register_ability, categories, REST exposure, permissions |
| **wp-rest-api** | `.github/skills/wp-rest-api/SKILL.md` | REST API: register_rest_route, WP_REST_Controller, schemas, authentication |

### Operations & Quality

| Skill | Path | When to use |
|-------|------|-------------|
| **wp-wpcli-and-ops** | `.github/skills/wp-wpcli-and-ops/SKILL.md` | WP-CLI: search-replace, DB ops, plugins/themes, cron, multisite, automation |
| **wp-performance** | `.github/skills/wp-performance/SKILL.md` | Performance profiling: WP-CLI profile/doctor, DB optimization, object cache, cron |
| **wp-phpstan** | `.github/skills/wp-phpstan/SKILL.md` | PHPStan static analysis: configuration, baselines, WordPress typing, stubs |
| **wp-playground** | `.github/skills/wp-playground/SKILL.md` | WordPress Playground: disposable WP instances, blueprints, snapshots, Xdebug |
| **wpds** | `.github/skills/wpds/SKILL.md` | WordPress Design System: components, tokens, patterns (requires WPDS MCP server) |

### Skill Usage Protocol

1. **Start with triage:** Run `node .github/skills/wp-project-triage/scripts/detect_wp_project.mjs` (or via `wordpress-router`)
2. **Read the SKILL.md** for the relevant skill before executing procedures
3. **Follow the skill's Procedure section** step by step
4. **Run verification commands** listed in the skill
5. **Reference files** are in each skill's `references/` subdirectory

## Target Versions

- WordPress: 6.9+ (PHP 7.2.24+)
- This theme: WP 6.0+, PHP 8.3+

## Important Paths

- Theme root: `c:\laragon\app\ileben-landing-v2\`
- Skills: `.github/skills/`
- ACF JSON: `acf-json/`
- Build output: `dist/`
- GitHub updater: `GITHUB_UPDATER.md`
