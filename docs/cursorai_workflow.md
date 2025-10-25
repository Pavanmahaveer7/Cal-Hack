# CursorAI Engineering Workflow

## Overview
Defines the AI-assisted development cycle using Cursor. Follows a classic workflow accelerated by AI automation.

## Phases
| Step | Description |
|------|--------------|
| PRD Generation | Gather requirements through structured questions |
| Understand | Clarify requirements |
| Review | Identify gaps or unclear assumptions |
| Design | Draft architecture & data models |
| Plan | Break into actionable tasks |
| Implement | Generate and refine code |
| Test | Write and run automated tests |
| Deploy | Release and monitor |

## Example Workflow Commands
```
# Start with PRD Generation
@.cursor/rules/100-PRD-Generation.mdc create a PRD for user authentication

# Then follow the workflow
Using @Docs/cursorai_workflow.md and @.cursor/rules/005-Tech-Stack.mdc,
create a plan for implementing the CheckoutService module.
```

## Folder Structure
```
docs/
 ├── ai/
 │   ├── requirement/
 │   ├── design/
 │   ├── plan/
 │   ├── implementation/
 │   └── knowledge/
tasks/ (PRD files)
.cursor/
 └── rules/*.mdc
```

## Automation
`.cursor/settings.json` example:
```json
{
  "rules_dir": ".cursor/rules",
  "default_docs": [
    "docs/cursorai_practices.md",
    "docs/cursor_mdc_rules.md",
    "docs/cursorai_workflow.md"
  ],
  "model": "sonet-3.7"
}
```

> “The process stays the same — AI just removes the friction.”
