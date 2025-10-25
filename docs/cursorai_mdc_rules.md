# CursorAI MDC Rules & Troubleshooting

## Overview
MDC (Model-Driven Cursor) rule files tell Cursor how to behave across your codebase.

## Naming Convention
```
.cursor/rules/
├── 001-Core-Security.mdc
├── 010-Core-Logging.mdc
├── 100-Integration.mdc
└── 200-Validation.mdc
```

## Example Rule
```yaml
---
name: Core Security Guidelines
version: "1.0"
globs:
  - "src/**/*.ts"
triggers:
  - file_change
  - prompt_request
---
rule_definition:
  description: "Apply security and async coding conventions."
  actions:
    - enforce_input_validation: true
    - prefer_async_await: true
    - require_auth_middleware: true
```

## Troubleshooting
| Issue | Cause | Fix |
|-------|--------|-----|
| Rule ignored | Missing `.mdc` extension | Rename the file properly |
| Changes not saving | Cursor cache issue | Restart Cursor and confirm override |
| Conflicting behavior | Rule overlap | Reorder numeric prefixes |

Prompt test example:
```
Refactor @src/auth.service.ts following @.cursor/rules/001-Core-Security.mdc.
```
