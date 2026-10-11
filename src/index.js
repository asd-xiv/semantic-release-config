import createPreset from "conventional-changelog-conventionalcommits"

/**
 * Sections of the release notes, in display order. A commit type missing from
 * this list stays out of the notes, unless the commit marks a breaking change.
 */
const types = [
  { type: "feat", section: "Features" },
  { type: "fix", section: "Bug Fixes" },
  { type: "perf", section: "Performance Improvements" },
  { type: "style", section: "Styles", hidden: false },
  { type: "test", section: "Tests", hidden: false },
  { type: "docs", section: "Documentation", hidden: false },
  { type: "build", section: "Build System", hidden: false },
  { type: "refactor", section: "Refactors", hidden: false },
  { type: "ci", section: "CI", hidden: false },
]

const { parser, writer } = createPreset({ types })

/**
 * The release steps, in run order:
 *
 * 1. commit-analyzer: pick the next version from the commits
 * 2. release-notes-generator: write the notes
 * 3. npm: write the version to `package.json` and `package-lock.json`,
 *    publish unless `private`
 * 4. github: create the GitHub release
 * 5. git: commit the files that step 3 changed
 *
 * Steps 1 and 2 get the parser of the preset as an option, step 2 also gets
 * the writer. Neither searches for a preset by name, so npm cannot hand them
 * another version.
 *
 * @type {import("semantic-release").Options}
 */
const config = {
  plugins: [
    ["@semantic-release/commit-analyzer", { parserOpts: parser }],
    [
      "@semantic-release/release-notes-generator",
      { parserOpts: parser, writerOpts: writer },
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ],
}

export default config
