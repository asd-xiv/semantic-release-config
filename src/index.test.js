import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"

import config from "./index.js"

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

const PLUGINS = config.plugins ?? []
const PLUGIN_NAMES = PLUGINS.map(plugin => splitPlugin(plugin).name)

test("given [a plugin in the config] should [be in package.json dependencies]", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
  )

  for (const name of PLUGIN_NAMES) {
    assert.ok(
      packageJson.dependencies[name],
      `"${name}" is not in dependencies`
    )
  }
})
