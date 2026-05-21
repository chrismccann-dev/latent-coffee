#!/usr/bin/env python3
"""
PreToolUse guard for Supabase execute_sql.

Reads the hook JSON payload from stdin, inspects the SQL in tool_input.query,
and converts the in-flight execute_sql call to a permission prompt when the
SQL looks destructive. Silent pass-through otherwise (existing allow rule wins).

Triggers prompt on:
  - DROP TABLE/DATABASE/SCHEMA/INDEX/VIEW/MATERIALIZED VIEW/TYPE/FUNCTION/TRIGGER
  - TRUNCATE
  - ALTER TABLE ... DROP COLUMN/CONSTRAINT
  - DELETE FROM <table>     (no WHERE clause in the same statement)
  - UPDATE <table> SET ...  (no WHERE clause in the same statement)
"""
import json
import re
import sys


DROP_RE = re.compile(
    r"\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW|MATERIALIZED\s+VIEW|TYPE|FUNCTION|TRIGGER)\b",
    re.IGNORECASE,
)
TRUNCATE_RE = re.compile(r"\bTRUNCATE\b", re.IGNORECASE)
ALTER_DROP_RE = re.compile(
    r"\bALTER\s+TABLE\b.*\bDROP\s+(COLUMN|CONSTRAINT)\b",
    re.IGNORECASE | re.DOTALL,
)
DELETE_RE = re.compile(r"\bDELETE\s+FROM\b", re.IGNORECASE)
UPDATE_RE = re.compile(r"\bUPDATE\s+\w", re.IGNORECASE)
SET_RE = re.compile(r"\bSET\b", re.IGNORECASE)
WHERE_RE = re.compile(r"\bWHERE\b", re.IGNORECASE)


def check_sql(sql):
    if not sql:
        return None

    # Strip line and block comments so commented-out WHERE clauses don't mask danger.
    cleaned = re.sub(r"--[^\n]*", "", sql)
    cleaned = re.sub(r"/\*.*?\*/", "", cleaned, flags=re.DOTALL)

    for raw_stmt in cleaned.split(";"):
        stmt = raw_stmt.strip()
        if not stmt:
            continue
        preview = " ".join(stmt.split())[:120]

        if DROP_RE.search(stmt):
            return "DROP statement: {}".format(preview)
        if TRUNCATE_RE.search(stmt):
            return "TRUNCATE: {}".format(preview)
        if ALTER_DROP_RE.search(stmt):
            return "ALTER TABLE DROP: {}".format(preview)
        if DELETE_RE.search(stmt) and not WHERE_RE.search(stmt):
            return "DELETE without WHERE: {}".format(preview)
        if UPDATE_RE.search(stmt) and SET_RE.search(stmt) and not WHERE_RE.search(stmt):
            return "UPDATE without WHERE: {}".format(preview)

    return None


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return  # malformed stdin — defer to existing permission rule

    tool_input = payload.get("tool_input") or {}
    sql = tool_input.get("query") or tool_input.get("sql") or ""

    reason = check_sql(sql)
    if not reason:
        return  # silent pass-through

    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": "Destructive SQL guard: {}".format(reason),
        }
    }
    print(json.dumps(output))


if __name__ == "__main__":
    main()
