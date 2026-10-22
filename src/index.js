import { fileURLToPath } from "node:url"
import createPreset from "conventional-changelog-conventionalcommits"

const conventionalCommits = createPreset({
  // Sections of the release notes, in display order.
  // A commit type missing from this list stays out of the notes,
  // unless the commit marks a breaking change.
  types: [
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
    { type: "perf", section: "Performance Improvements" },
    { type: "style", section: "Styles", hidden: false },
    { type: "test", section: "Tests", hidden: false },
    { type: "docs", section: "Documentation", hidden: false },
    { type: "build", section: "Build System", hidden: false },
    { type: "refactor", section: "Refactors", hidden: false },
    { type: "ci", section: "CI", hidden: false },
  ],
})

/**
 * Absolute path to `verify-release.sh`. semantic-release runs the command in
 * the project folder, so a relative path would miss the script.
 */
const VERIFY_RELEASE_SCRIPT = fileURLToPath(
  new URL("verify-release.sh", import.meta.url)
)

/**
 * semantic-release runs the plugins one phase at a time. Within a phase, it
 * runs them in their order in `plugins`:
 *
 *   1  verifyConditions  npm, github, git         check credentials and settings
 *   2  analyzeCommits    commit-analyzer          pick the next version
 *   3  verifyRelease     exec                     stop if the tag or the version exists,
 *                                                 see `verify-release.sh`
 *   4  generateNotes     release-notes-generator  write the notes
 *   5  prepare           npm, git                 write the version, commit and push it
 *   6  -                 semantic-release         add and push the tag
 *   7  publish           npm, github              publish to npm, publish the GitHub release
 *   8  success, fail     github                   comment on released issues and pull
 *                                                 requests, or open an issue on failure
 *
 * commit-analyzer and release-notes-generator get the parser of the preset as
 * an option. release-notes-generator also gets the writer. Neither plugin
 * loads a preset by name, so both use the preset version this package depends
 * on. Both still load the Angular preset as a base and put these options over
 * it.
 *
 * @type {import("semantic-release").Options}
 */
const config = {
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      { parserOpts: conventionalCommits.parser },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        parserOpts: conventionalCommits.parser,
        writerOpts: conventionalCommits.writer,
      },
    ],
    [
      "@semantic-release/exec",
      {
        // semantic-release pushes the release commit before it pushes the tag.
        // Check the tag and the version before any plugin writes. `exec` fills
        // in `${nextRelease…}`
        verifyReleaseCmd: `sh "${VERIFY_RELEASE_SCRIPT}" "\${nextRelease.gitTag}" "\${nextRelease.version}"`,
      },
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ],
}

export default config
