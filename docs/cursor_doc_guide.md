# CursorAI Documentation Guide — When to Use Which

## Purpose of Each File
| Document | Use | When to Reference |
|-----------|-----|------------------|
| `cursorai_practices.md` | Daily AI prompting & editing | During coding, debugging, and tests |
| `cursor_mdc_rules.md` | Rule behavior & troubleshooting | When editing `.mdc` files |
| `cursorai_workflow.md` | Full lifecycle guide | At start of each new feature |
| `cursor_doc_guide.md` | Quick orientation | When onboarding or reviewing |
| **PRD Generation** | Requirements gathering | Before starting any new feature |
| **Task Generation** | Break PRD into actionable tasks | After creating a PRD |
| **Task Management** | Execute tasks one by one | When implementing from task list |
| **Tech Stack** | Technology decisions | When choosing frameworks/libraries |

## Relationship
```
PRD Generation (100-PRD-Generation.mdc) → starts the process
     ↓
Task Generation (101-Task-Generation.mdc) → breaks down into tasks
     ↓
Task Management (102-Task-Management.mdc) → executes tasks one by one
     ↓
cursorai_workflow.md  → defines the lifecycle
     ↓
cursorai_practices.md → details prompt style
     ↓
cursor_mdc_rules.md   → enforces code standards
     ↓
Tech Stack (005-Tech-Stack.mdc) → guides technology choices
```

## MVP Recommendation
Use only these day-to-day:
- **PRD Generation** before starting any new feature
- **Task Generation** after creating a PRD
- **Task Management** when implementing from task lists
- `cursorai_practices.md` while coding
- `cursorai_workflow.md` while planning
- **Tech Stack** when making technology decisions

Keep `cursor_mdc_rules.md` and this guide for reference.

> “Practices teach the *language*, Workflow gives the *path*, Rules enforce the *discipline*.”
