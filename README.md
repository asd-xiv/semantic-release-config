[![Release](https://github.com/asd-xiv/semantic-release-config/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/asd-xiv/semantic-release-config/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/@asd14/semantic-release-config.svg)](https://www.npmjs.com/package/@asd14/semantic-release-config)

# @asd14/semantic-release-config

> ASD14's reusable semantic-release config.

<!-- vim-markdown-toc GFM -->

- [Installation](#installation)
- [Usage](#usage)
- [Configuration Details](#configuration-details)
  - [Release steps](#release-steps)
  - [Release notes](#release-notes)
- [Limits](#limits)
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
  "branches": ["main"],
  "extends": "@asd14/semantic-release-config"
}
```

## Configuration Details

### Release steps

| Step | Plugin                                      | Job                                                                                                                     |
| ---- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1    | `@semantic-release/commit-analyzer`         | Pick the next version from the commits                                                                                  |
| 2    | `@semantic-release/release-notes-generator` | Write the release notes                                                                                                 |
| 3    | `@semantic-release/npm`                     | Write the version to `package.json` and `package-lock.json`. Publish to npm unless `package.json` has `"private": true` |
| 4    | `@semantic-release/github`                  | Create the GitHub release                                                                                               |
| 5    | `@semantic-release/git`                     | Commit the files that step 3 changed as `chore(release): <version> [skip ci]`                                           |

### Release notes

The notes show one section for each of these commit types, in this order:

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

> [!NOTE]  
> [conventional-changelog-conventionalcommits] plugin is used for the types
> above.

[conventional-changelog-conventionalcommits]:
  https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits

## Limits

This config takes no options.

semantic-release does not merge lists. If you set `plugins` in your
`.releaserc`, you replace all five plugins of this config.

## License

MIT
