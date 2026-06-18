import * as z from 'zod/v4'

// Shared scalar-coercion preprocessors for MCP Tool input schemas.
//
// MCP clients differ in whether they JSON-encode scalar tool args as native
// numbers/booleans or as strings — some bridges (incl. the Claude Code tool
// bridge used for bulk operator pushes) stringify every scalar, while others
// (claude.ai web) send native types. Coerce defensively so the Tool tolerates
// both. Boolean coercion is EXPLICIT ('true'/'false' -> bool) to avoid the
// Boolean('false') === true trap; non-string inputs pass through untouched.
//
// Extracted from push-green-bean.ts (PR #457) when patch-green-bean's
// roast_priority (an int written by the Claude-Code Roasting Coordinator over
// the stringifying CC bridge) needed the same treatment.

export const numField = (inner: z.ZodNumber) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v),
    inner.optional().nullable(),
  )

export const boolField = () =>
  z.preprocess(
    (v) => (v === 'true' ? true : v === 'false' ? false : v),
    z.boolean().optional().nullable(),
  )
