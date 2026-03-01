# Code Fragments Library

Copy-paste-ready TSX + makeStyles blocks for recurring Azure portal sub-patterns. During BUILD, assemble the output by composing the relevant fragments and filling in page-specific data.

## Usage

1. Read the decision table (`references/decision-table.md`) to identify which fragments a page type needs
2. Read each required fragment file from this directory
3. Compose them into the output `index.tsx`, adapting prop names and data types to the specific page
4. Fragments use `tokens.*` and `makeStyles` — never modify token references

## Fragment Index

| Fragment | File | Description |
|----------|------|-------------|
| Command Bar | `command-bar.tsx` | Toolbar with action buttons, dividers, and overflow |
| Breadcrumb Bar | `breadcrumb-bar.tsx` | Breadcrumb navigation with Azure-style items |
| Status Badge | `status-badge.tsx` | Badge with status → color mapping for Azure resource states |
| Metric Card | `metric-card.tsx` | KPI card with value, label, and optional trend indicator |
| Data Table | `data-table.tsx` | DataGrid with sort, select, and cell rendering patterns |
| Sidebar Nav | `sidebar-nav.tsx` | Collapsible side navigation for resource pages |
| Empty State | `empty-state.tsx` | Empty state with icon, title, description, and CTA |
| Filter Bar | `filter-bar.tsx` | Search input + dropdown filters row |
| Form Section | `form-section.tsx` | Grouped form fields with section title and help text |
| Save Bar | `save-bar.tsx` | Sticky save/discard action bar for settings pages |
