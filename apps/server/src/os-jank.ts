import * as OS from "node:os";
import { Effect, Path } from "effect";
import { readPathFromLoginShell } from "@t3tools/shared/shell";

export function fixPath(): void {
  if (process.platform === "win32") return;

  const shells = [
    process.env.SHELL,
    "/bin/zsh",
    "/usr/bin/zsh",
    "/bin/bash",
    "/usr/bin/bash",
  ].filter((shell): shell is string => typeof shell === "string" && shell.trim().length > 0);

  for (const shell of shells) {
    try {
      const result = readPathFromLoginShell(shell);
      if (result) {
        process.env.PATH = result;
        break;
      }
    } catch {
      // Keep searching other shell candidates.
    }
  }
}

export const expandHomePath = Effect.fn(function* (input: string) {
  const { join } = yield* Path.Path;
  if (input === "~") {
    return OS.homedir();
  }
  if (input.startsWith("~/") || input.startsWith("~\\")) {
    return join(OS.homedir(), input.slice(2));
  }
  return input;
});

export const resolveStateDir = Effect.fn(function* (raw: string | undefined) {
  const { join, resolve } = yield* Path.Path;
  if (!raw || raw.trim().length === 0) {
    return join(OS.homedir(), ".t3", "userdata");
  }
  return resolve(yield* expandHomePath(raw.trim()));
});
