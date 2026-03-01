# Decision Table

Structured mapping from user intent to deterministic build plan. During ANALYZE or TEMPLATE-SELECT, match the user's request against this table. If a row matches, the build plan is fully determined — no ambiguity.

## How to Use

1. Parse the user's description or the ANALYZE output
2. Find the first matching row by checking the **Intent Patterns** column (case-insensitive substring or keyword match)
3. Use the matched row's **Layout Template**, **Fragments**, and **Canonical Example** to construct the build plan
4. If no row matches, fall back to the closest match and ask the user to confirm

## Intent → Build Plan

| Intent Patterns | Layout Template | Canonical Example | Fragments | Sidebar | DataGrid | CommandBar | FilterSidebar | Pagination | SaveBar |
|---|---|---|---|---|---|---|---|---|---|
| `resource overview`, `resource detail`, `VM overview`, `storage account overview`, `resource blade`, `resource page` | `azure-resource-blade` | `canonical-examples/resource-blade/` | breadcrumb-bar, command-bar, sidebar-nav, status-badge | **yes** | no | **yes** | no | no | no |
| `resource list`, `browse`, `all resources`, `list VMs`, `list storage`, `resource table` | `azure-browse-page` | `canonical-examples/browse-list/` | breadcrumb-bar, command-bar, data-table, filter-bar, status-badge, empty-state | no | **yes** | **yes** | **yes** (optional) | **yes** | no |
| `dashboard`, `home page`, `portal home`, `overview dashboard` | `azure-dashboard` | `canonical-examples/dashboard/` | metric-card | no | no | no | no | no | no |
| `create`, `create wizard`, `new resource`, `create VM`, `create storage`, `provision` | `azure-create-wizard` | — | breadcrumb-bar, form-section | no (step nav instead) | no | no | no | no | no |
| `settings`, `configuration`, `properties`, `resource settings` | `azure-settings-page` | — | breadcrumb-bar, sidebar-nav, form-section, save-bar | **yes** | no | no | no | no | **yes** |
| `monitoring`, `metrics page`, `alerts page` | `azure-resource-blade` | `canonical-examples/resource-blade/` | breadcrumb-bar, sidebar-nav, metric-card, command-bar | **yes** | no | **yes** | no | no | no |
| `activity log`, `audit log`, `log page` | `azure-resource-blade` | `canonical-examples/resource-blade/` | breadcrumb-bar, sidebar-nav, data-table, filter-bar, command-bar | **yes** | **yes** | **yes** | no | **yes** | no |

## Fragment Inclusion Rules

These rules apply regardless of which row matched:

| Condition | Fragment to Include |
|---|---|
| Page shows a list of Azure resources in a table | `data-table`, `status-badge` |
| Page has a primary action (Create, Connect, Start) | `command-bar` |
| Page is within a specific resource (not a list/browse) | `sidebar-nav` |
| Page contains form fields | `form-section` |
| Page has editable settings that can be saved | `save-bar` |
| Page has an empty/zero-data state | `empty-state` |
| Page allows filtering by properties | `filter-bar` |
| Page shows KPI metrics or numeric summaries | `metric-card` |
| Page has Azure-style navigation path | `breadcrumb-bar` |

## Layout Selection Rules

When the decision table doesn't produce a clear match:

1. **"Is the user looking at a specific deployed resource?"**
   - YES → `azure-resource-blade` (sidebar layout)
   - NO → continue

2. **"Is the user browsing a list of resources?"**
   - YES → `azure-browse-page` (full-width + DataGrid)
   - NO → continue

3. **"Is the user creating a new resource?"**
   - YES → `azure-create-wizard` (step nav + forms)
   - NO → continue

4. **"Is it a home/overview/dashboard?"**
   - YES → `azure-dashboard` (card grid)
   - NO → use `azure-resource-blade` as default
