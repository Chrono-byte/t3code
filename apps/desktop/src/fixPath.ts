import { defaultShellCandidates, resolvePathFromLoginShells } from "@t3tools/shared/shell";

export function fixPath(): void {
  if (process.platform === "win32") return;

  const result = resolvePathFromLoginShells(defaultShellCandidates());
  if (result) {
    process.env.PATH = result;
  }
}
