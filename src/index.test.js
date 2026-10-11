import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"

import config from "./index.js"

const plugins = config.plugins ?? []

/**
 * Split a plugin into its name and its options. A plugin is a name, or a name
 * paired with options.
 *
 * @param {import("semantic-release").PluginSpec} plugin
 */
const splitPlugin = plugin =>
  Array.isArray(plugin)
    ? { name: plugin[0], options: plugin[1] }
    : { name: plugin, options: {} }

/** Name of each plugin, in run order */
const pluginNames = plugins.map(plugin => splitPlugin(plugin).name)

test("runs the five steps in order", () => {
  assert.deepEqual(pluginNames, [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ])
})

test("declares every plugin it runs", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
  )

  for (const name of pluginNames) {
    assert.ok(
      packageJson.dependencies[name],
      `"${name}" is not in dependencies`
    )
  }
})

test("gives one parser to steps 1 and 2, the writer to step 2", () => {
  const [analyzer, generator] = plugins.map(plugin => splitPlugin(plugin))

  assert.deepEqual(Object.keys(analyzer?.options), ["parserOpts"])
  assert.deepEqual(Object.keys(generator?.options), [
    "parserOpts",
    "writerOpts",
  ])
  assert.equal(typeof analyzer?.options.parserOpts, "object")
  assert.equal(typeof generator?.options.writerOpts, "object")
  assert.equal(analyzer?.options.parserOpts, generator?.options.parserOpts)
})
