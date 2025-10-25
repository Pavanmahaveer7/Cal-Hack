# CursorAI Usage Guide

## Overview
CursorAI is a VS Code-based editor with integrated LLM support. It helps automate code generation, refactoring, documentation, and debugging.

## Key Practices
- Be clear and specific in prompts.
- Use `@` mentions to reference files and docs.
- Inline Edits (`Cmd/Ctrl+K`) for quick fixes.
- Composer Mode (`Cmd/Ctrl+L`) for multi-file operations.
- Prefer TypeScript for stronger AI reasoning.
- Iterate and refine responses for best results.

## Examples
```
Follow @.cursor/rules/001-Core-Security.mdc when refactoring @src/user.service.ts.
```
```
Write Jest tests for @src/utils/formatName.ts covering valid and invalid inputs.
```

## Debugging
Paste errors or stack traces and ask Cursor for explanations. Always use Git to back up before applying AI changes.

## Documentation
```
Add JSDoc comments to all exported functions in @src/payment.controller.ts.
```

> “Treat Cursor as a partner: you decide the logic, it handles the scaffolding.”
