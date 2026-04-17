#!/usr/bin/env bash
# Stop hook: keep README.md and CHANGELOG.md current.
#
# Fires when Claude's turn ends. If there are uncommitted *source* changes
# and neither README.md nor CHANGELOG.md is among them, the hook outputs
# a JSON block decision that re-activates the model with a reminder.
#
# The hook exits silently (0) when:
#   - The working tree is clean (nothing to document).
#   - README.md or CHANGELOG.md are already among the changed files.
#   - The only changed files are infrastructure (.claude/, node_modules/,
#     build outputs, etc.).
#
# Resolve the block by either:
#   1. Updating README.md and/or CHANGELOG.md as part of the current
#      change set, or
#   2. Deciding the change is trivial and committing it (the check
#      operates on uncommitted changes only).

set -u

# Move to the repo root, or silently exit if we're not in a git repo.
repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$repo_root" || exit 0

# Collect changed + untracked files.
changed=$(git status --porcelain 2>/dev/null) || exit 0
[ -z "$changed" ] && exit 0  # clean tree

# Extract file paths (last whitespace-separated field of each porcelain line).
files=$(printf '%s\n' "$changed" | awk '{print $NF}')

# Docs already being edited — no reminder needed.
if printf '%s\n' "$files" | grep -qE '^(README\.md|CHANGELOG\.md)$'; then
  exit 0
fi

# Filter out infrastructure and generated paths to see if real source changed.
meaningful=$(printf '%s\n' "$files" | grep -vE '^(\.claude/|\.superpowers/|\.DS_Store|node_modules/|\.next/|\.vercel/|coverage/|test-results/|playwright-report/|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)' || true)
[ -z "$meaningful" ] && exit 0

# Build the reminder payload. `decision: "block"` re-activates the model
# with the reason as injected context; Claude should then update docs or
# commit the trivial change.
cat <<EOF
{
  "decision": "block",
  "reason": "Uncommitted source changes detected, but README.md and CHANGELOG.md are unchanged this session.\\n\\nPer project discipline (see README \"Documentation discipline\" and CHANGELOG header), both files stay current with every user-visible change. Review what changed:\\n\\n$(printf '%s\n' "$meaningful" | sed 's/^/  - /' | head -20)\\n\\nIf these changes warrant a doc update, update README.md and/or CHANGELOG.md as part of the same commit. If not (trivial internal fix with no user-visible impact), commit the changes — the check operates on uncommitted work only and will pass once the tree is clean."
}
EOF
