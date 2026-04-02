import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "@/lib/logger";

afterEach(() => {
  vi.restoreAllMocks();
});

function parseLog(spy: ReturnType<typeof vi.spyOn>): Record<string, unknown> {
  return JSON.parse(spy.mock.calls[0][0] as string) as Record<string, unknown>;
}

describe("logger.info", () => {
  it("calls console.log with JSON containing level and message", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("test message");
    expect(spy).toHaveBeenCalledOnce();
    const parsed = parseLog(spy);
    expect(parsed.level).toBe("info");
    expect(parsed.message).toBe("test message");
    expect(typeof parsed.timestamp).toBe("string");
  });

  it("merges extra data into the log entry", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("with data", { attempt: 1, code: 200 });
    const parsed = parseLog(spy);
    expect(parsed.attempt).toBe(1);
    expect(parsed.code).toBe(200);
  });
});

describe("logger.warn", () => {
  it("calls console.warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("warning message", { statusCode: 429 });
    expect(spy).toHaveBeenCalledOnce();
    const parsed = parseLog(spy);
    expect(parsed.level).toBe("warn");
    expect(parsed.statusCode).toBe(429);
  });
});

describe("logger.error", () => {
  it("calls console.error with level error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("something failed", { statusCode: 500 });
    expect(spy).toHaveBeenCalledOnce();
    const parsed = parseLog(spy);
    expect(parsed.level).toBe("error");
    expect(parsed.message).toBe("something failed");
    expect(parsed.statusCode).toBe(500);
  });
});
