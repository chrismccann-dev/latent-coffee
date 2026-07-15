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

// IMPORTANT (required-axis fix, backlog #57, 2026-07-15): `.optional()` must sit
// OUTSIDE the z.preprocess wrap. With `inner.optional().nullable()` INSIDE the
// preprocess, the field's optionality never propagates to the published object
// schema — every numField/boolField consumer landed in the tool's `required`
// array (patch_green_bean published 6 required fields instead of 1). The outer
// `.optional()` keeps the object-level key optional (absent keys skip the
// preprocess entirely, which is fine — there is nothing to coerce); `.nullable()`
// stays inside so explicit nulls pass through the preprocess untouched.
// scripts/check-mcp-tools.ts gates this axis (optional zod field must not
// appear in a published `required` array).

export const numField = (inner: z.ZodNumber) =>
  z
    .preprocess(
      (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v),
      inner.nullable(),
    )
    .optional()

export const boolField = () =>
  z
    .preprocess(
      (v) => (v === 'true' ? true : v === 'false' ? false : v),
      z.boolean().nullable(),
    )
    .optional()
