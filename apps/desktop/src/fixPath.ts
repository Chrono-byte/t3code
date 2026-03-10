import { readPathFromLoginShell } from "@t3tools/shared/shell";

export function fixPath(): void {
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
