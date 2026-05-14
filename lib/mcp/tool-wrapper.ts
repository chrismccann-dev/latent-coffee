// Sprint 3.2 (item #11) — defensive error wrapper for MCP Tool handlers.
//
// Today some handlers throw bare errors; the MCP SDK marshals the throw into
// a JSON-RPC error response (good for claude.ai) but production logs lose the
// "which Tool failed" attribution. Wrap each handler through this to add a
// `[tool_name] <err>` log line, then re-throw so the SDK's existing
// JSON-RPC error path still runs. Re-throw is non-negotiable: swallowing
// would turn a failure into a silent success.

export function withToolErrorLogging<H extends (...args: any[]) => any>(
  toolName: string,
  handler: H,
): H {
  return (async (...args: Parameters<H>) => {
    try {
      return await handler(...args)
    } catch (err) {
      console.error(`[${toolName}]`, err instanceof Error ? err.message : err)
      throw err
    }
  }) as H
}
