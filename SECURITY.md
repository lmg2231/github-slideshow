# Security audit — 22 October 2026

## Changes

- Replaced the committed Reveal.js 3.9.2 dependency tree with Reveal.js 6.0.2. The old speaker-note code accepted messages without origin validation; the maintained release also fixes cross-origin XSS through the presentation postMessage API. See the [upstream release](https://github.com/hakimel/reveal.js/releases/tag/6.0.2).
- Removed the entire committed `node_modules` tree. Only reproducibly copied presentation assets and the upstream license are served from `assets/reveal`; `npm run vendor` regenerates them from the locked package. Updated plugin loading, CSS paths and HTML title escaping.
- Updated Ruby dependencies. The latest `github-pages` meta-gem still pulled `rubyzip <3` through its unused remote-theme plugin, triggering CVE-2026-85396. Replaced that meta-gem with the actual build dependencies: Jekyll, its GFM parser and jemoji. No remote theme is configured or needed by this deck.
- Pinned Node 24.22.1 and Ruby 3.4.11. Node lifecycle checks reject an older runtime or disabled TLS verification. Added build, asset-regeneration and dependency-audit checks to CI.

## Validation

- `npm audit`: zero known vulnerabilities.
- `bundle exec bundler-audit check --update`: no vulnerabilities found against ruby-advisory-db commit `5fd86bbd406995ea4ed2df84651b209e28072031` (updated 21 October 2026).
- Jekyll build and HTML-Proofer internal image/link/script checks passed.
- Chromium initialized Reveal, rendered both slides and passed forward/back keyboard navigation with no runtime errors or missing assets.

Run `npm ci && npm run vendor`, then `bundle install` and `sh script/cibuild`. Use the versions in `.nvmrc` and `.ruby-version`. No live site was deployed.

## eMudhra and hosting scope

The [incident reference](https://emudhra.we-have-a-problem.com/) concerns compromised CA keys; [Node's official release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) includes the trust-store fix in 24.22.1. Ruby/OpenSSL and other system tools can use the operating system's CA store, which must be patched separately. Updating Ruby alone does not remediate that store.

GitHub's managed Pages builder controls its own runtime and dependency set. These locks govern local builds and the added validation workflow; they do not update that managed service. If strict control of deployment dependencies is needed, publish the validated `_site` artifact through an explicitly configured Pages deployment workflow. No hosting settings or deployment workflows were changed here.

This review covered the current repository, not full Git history, GitHub runner internals, custom CA overrides or deployed infrastructure. A clean dependency scan does not prove the absence of vulnerabilities.
