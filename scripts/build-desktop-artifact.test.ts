import { describe, expect, it } from "vitest";

import {
  createLinuxDesktopEntry,
  renderAppImageAppData,
  resolveAppImageReleaseDate,
  resolveAppImageUpdateInformation,
} from "./build-desktop-artifact.ts";

describe("build-desktop-artifact AppImage metadata helpers", () => {
  it("renders AppData templates with the current release version and date", () => {
    const template = [
      "<releases>",
      '  <release version="__T3CODE_APP_VERSION__" date="__T3CODE_RELEASE_DATE__"/>',
      "</releases>",
    ].join("\n");

    expect(renderAppImageAppData(template, "1.2.3", "2026-03-10")).toContain(
      '<release version="1.2.3" date="2026-03-10"/>',
    );
  });

  it("rejects templates that are missing release placeholders", () => {
    expect(() => renderAppImageAppData("<releases />", "1.2.3", "2026-03-10")).toThrow(
      /missing required placeholders/i,
    );
  });

  it("derives AppImage release dates in UTC calendar format", () => {
    expect(resolveAppImageReleaseDate(new Date("2026-03-10T18:42:15.999Z"))).toBe("2026-03-10");
  });

  it("keeps the published artifact arch token when generating gh-releases-zsync metadata", () => {
    expect(
      resolveAppImageUpdateInformation(
        "/tmp/T3-Code-1.2.3-x64.AppImage",
        "pingdotgg/t3code",
        undefined,
        "x64",
      ),
    ).toBe("gh-releases-zsync|pingdotgg|t3code|latest|T3-Code-*-x64.AppImage.zsync");
  });

  it("pins the Linux desktop entry identity to the packaged executable name", () => {
    expect(createLinuxDesktopEntry("T3 Code (Alpha)")).toEqual({
      Name: "T3 Code (Alpha)",
      Icon: "t3-code-desktop",
      StartupWMClass: "t3-code-desktop",
    });
  });
});
