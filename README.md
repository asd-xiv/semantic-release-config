[![Release](https://github.com/asd-xiv/semantic-release-config/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/asd-xiv/semantic-release-config/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/@asd14/semantic-release-config.svg)](https://www.npmjs.com/package/@asd14/semantic-release-config)

# @asd14/semantic-release-config

> ASD14's reusable semantic-release config.

<!-- vim-markdown-toc GFM -->

- [Installation](#installation)
- [Usage](#usage)
- [Configuration Details](#configuration-details)
  - [Release notes](#release-notes)
- [License](#license)

<!-- vim-markdown-toc -->

## Installation

```sh
npm install --save-dev @asd14/semantic-release-config semantic-release@^25
```

> [!NOTE]  
> `semantic-release` is a peerDependency

## Usage

In your `.releaserc`:

```json
{
  "$schema": "https://json.schemastore.org/semantic-release.json",
  "branches": ["main"],
  "extends": "@asd14/semantic-release-config"
}
```

> [!IMPORTANT]  
> semantic-release does not merge lists. If you set `plugins` in your
> `.releaserc`, you replace all six plugins of this config.

## Configuration Details

semantic-release runs the plugins one phase at a time. Within a phase, it runs
them in their order in `plugins`. Each plugin is `@semantic-release/<name>`:

| Order | Phase              | Plugins                   | Job                                                                                       |
| ----- | ------------------ | ------------------------- | ----------------------------------------------------------------------------------------- |
| 1     | `verifyConditions` | `npm`, `github`, `git`    | Check credentials and settings                                                            |
| 2     | `analyzeCommits`   | `commit-analyzer`         | Pick the next version from the commits                                                    |
| 3     | `verifyRelease`    | `exec`                    | Stop if the next tag exists on origin or the next version exists on npm                   |
| 4     | `generateNotes`    | `release-notes-generator` | Write the release notes                                                                   |
| 5     | `prepare`          | `npm`, `git`              | Write version to `package.json` and `package-lock.json`, push as `chore(release)`         |
| 6     | -                  | semantic-release          | Add and push the tag                                                                      |
| 7     | `publish`          | `npm`, `github`           | Publish to npm, unless `"private": true`, then publish the GitHub release                 |
| 8     | `success`, `fail`  | `github`                  | Comment on the released issues and pull requests, or open an issue when the release fails |

### Release notes

The [conventional-changelog-conventionalcommits] preset writes the notes. They
show one section for each commit type, in this order:

[conventional-changelog-conventionalcommits]:
  https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits

| Type       | Section                  |
| ---------- | ------------------------ |
| `feat`     | Features                 |
| `fix`      | Bug Fixes                |
| `perf`     | Performance Improvements |
| `style`    | Styles                   |
| `test`     | Tests                    |
| `docs`     | Documentation            |
| `build`    | Build System             |
| `refactor` | Refactors                |
| `ci`       | CI                       |
| `chore`    | - not included -         |

## License

MIT
