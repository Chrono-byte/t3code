import OS from "node:os";
import path from "node:path";

import * as NodeServices from "@effect/platform-node/NodeServices";
import { assert, it } from "@effect/vitest";
import { Effect } from "effect";

import { expandHomePath } from "./os-jank";

it.layer(NodeServices.layer)("expandHomePath", (it) => {
  it.effect("expands bare tilde", () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* expandHomePath("~"), OS.homedir());
    }),
  );

  it.effect("expands tilde-prefixed unix paths", () =>
    Effect.gen(function* () {
      assert.strictEqual(
        yield* expandHomePath("~/.local/share/pnpm/codex"),
        path.join(OS.homedir(), ".local", "share", "pnpm", "codex"),
      );
    }),
  );

  it.effect("leaves non-tilde paths untouched", () =>
    Effect.gen(function* () {
      const expected = "bin/codex";
      assert.strictEqual(yield* expandHomePath(expected), expected);
    }),
  );

  it.effect("leaves non-home-relative tilde paths untouched", () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* expandHomePath("~foo/bar"), "~foo/bar");
    }),
  );
});
