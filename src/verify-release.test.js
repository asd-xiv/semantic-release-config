import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

const SCRIPT = fileURLToPath(new URL("verify-release.sh", import.meta.url))
const PACKAGE_DIR = fileURLToPath(new URL("..", import.meta.url))

// semantic-release writes each released version to package.json, so it names
// a tag on origin and a version on npm
const RELEASED_VERSION = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
).version

/**
 * @param {string} tag
 * @param {string} version
 */
const verifyRelease = (tag, version) =>
  spawnSync("sh", [SCRIPT, tag, version], {
    cwd: PACKAGE_DIR,
    encoding: "utf8",
  })

test("given [the released tag] should [exit 1 and name the tag]", () => {
  const result = verifyRelease(`v${RELEASED_VERSION}`, "0.0.0-free")

  assert.equal(result.status, 1)
  assert.match(
    result.stderr,
    new RegExp(`^Tag v${RELEASED_VERSION} already exists on origin`)
  )
})

test("given [a free tag and the released version] should [exit 1 and name the version]", () => {
  const result = verifyRelease("v0.0.0-free", RELEASED_VERSION)

  assert.equal(result.status, 1)
  assert.match(
    result.stderr,
    new RegExp(`^Version ${RELEASED_VERSION} already exists on npm`)
  )
})
