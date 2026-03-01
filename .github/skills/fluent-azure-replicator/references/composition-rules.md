# Fluent v9 Component Composition Rules

Validation rules for legal component nesting in Fluent UI React v9. Run these checks against the generated JSX tree before writing output files.

---

## Hard Constraints (errors — must fix)

### 1. FluentProvider

- **MUST** be the outermost wrapper (or near-outermost, after React.StrictMode)
- **MUST NOT** be nested inside another FluentProvider (except for theme overrides on a sub-tree)
- **MUST** have a `theme` prop

### 2. Button

- **MUST NOT** contain another `Button` as a child
- **MUST NOT** contain interactive elements (`Input`, `Select`, `Link`, `Checkbox`) as children
- **MUST NOT** be wrapped inside `<a>` or another `<button>` (interactive elements can't nest)
- `icon` prop takes a React element, not a string — `icon={<AddRegular />}` not `icon="add"`

### 3. Dialog / DialogSurface

- `DialogSurface` **MUST** be a direct child of `Dialog`
- `DialogTitle`, `DialogBody`, `DialogActions` **MUST** be inside `DialogSurface`
- **MUST NOT** nest a `Dialog` inside another `Dialog`
- `DialogTrigger` **MUST** wrap exactly one child element

### 4. Menu / MenuList

- `MenuPopover` **MUST** be a direct child of `Menu`
- `MenuList` **MUST** be inside `MenuPopover`
- `MenuItem` **MUST** be inside `MenuList`
- `MenuTrigger` **MUST** wrap exactly one child element
- **MUST NOT** nest a `Menu` directly inside another `MenuItem` — use `MenuItemLink` or submenu pattern

### 5. Popover

- `PopoverSurface` **MUST** be a direct child of `Popover`
- `PopoverTrigger` **MUST** wrap exactly one child element
- **MUST NOT** nest a `Popover` inside another `PopoverSurface`

### 6. TabList / Tab

- `Tab` **MUST** be a direct child of `TabList`
- **MUST NOT** put interactive elements inside `Tab` (it's already a button)
- **MUST NOT** use `<a>` tags inside `Tab` — use `Tab`'s `value` for routing

### 7. Table / DataGrid

- `TableHeader` **MUST** contain exactly one `TableRow`
- `TableBody` **MUST** contain `TableRow` children
- `TableRow` children **MUST** be `TableCell` or `TableHeaderCell`
- `TableHeaderCell` **MUST** be inside a `TableRow` within `TableHeader`
- `TableCell` **MUST** be inside a `TableRow` within `TableBody`
- Same rules apply to `DataGrid*` variants

### 8. Field

- `Field` **MUST** wrap exactly one input component (`Input`, `Textarea`, `Select`, `Combobox`, `Dropdown`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `SpinButton`, `DatePicker`, `SearchBox`)
- **MUST NOT** wrap non-input components
- **MUST NOT** nest `Field` inside another `Field`

### 9. Card

- **MUST NOT** contain another `Card` as a direct child
- `CardHeader`, `CardPreview`, `CardFooter` **MUST** be direct children of `Card`
- If `Card` has `onClick`, **MUST NOT** contain focusable elements (buttons, links, inputs) — they create nested interactive elements. Use `CardHeader`'s `action` slot instead.

### 10. Accordion

- `AccordionItem` **MUST** be a direct child of `Accordion`
- `AccordionHeader` and `AccordionPanel` **MUST** be inside `AccordionItem`
- `AccordionHeader` **MUST** come before `AccordionPanel`

### 11. Tree

- `TreeItem` **MUST** be a direct child of `Tree` or another `TreeItem`'s nested `Tree`
- `TreeItemLayout` **MUST** be inside `TreeItem`

### 12. Breadcrumb

- `BreadcrumbItem` **MUST** be a direct child of `Breadcrumb`
- `BreadcrumbButton` or `BreadcrumbDivider` **MUST** be inside `BreadcrumbItem`

### 13. Toast

- `Toast` **MUST** be dispatched via `useToastController()` — not rendered inline
- `ToastTitle` and `ToastBody` **MUST** be inside `Toast`

### 14. Nav (v9 NavDrawer)

- `NavItem` and `NavCategory` **MUST** be inside `NavDrawer` or `NavDrawerBody`
- `NavSubItem` **MUST** be inside `NavSubItemGroup` within `NavCategory`

---

## Soft Constraints (warnings — review but may be intentional)

### 1. Avatar in non-typical contexts

- `Avatar` inside `TableCell` is fine (common for user columns)
- `Avatar` as `Button` icon is unusual — prefer standard icons for actions

### 2. Spinner placement

- `Spinner` inside `Button` is fine for loading states (use `Button`'s own loading pattern if available)
- `Spinner` as the only child of a full-page container is fine (loading state)
- `Spinner` inside `TableCell` — prefer `SkeletonItem` for table loading states

### 3. Badge inside Button

- `CounterBadge` next to Button text is acceptable for notification counts
- `Badge` as Button's only content is unusual — prefer `Button` with `icon`

### 4. Multiple Toolbars

- Multiple `Toolbar` components on a page is fine if they serve different contexts (page-level vs. panel-level)
- Adjacent `Toolbar` components should probably be merged into one

### 5. Divider overuse

- More than 3 consecutive `Divider` components between content sections may indicate the layout needs `Card` boundaries instead

---

## Validation Pseudocode

```
function validateJSXTree(node):
  for each child in node.children:
    rule = findRule(node.type, child.type)
    if rule.forbidden:
      emit ERROR: "{child.type} cannot be inside {node.type}: {rule.reason}"
    if rule.warn:
      emit WARNING: "{child.type} inside {node.type} is unusual: {rule.reason}"
    if rule.required_parent and node.type !== rule.required_parent:
      emit ERROR: "{child.type} must be inside {rule.required_parent}, found inside {node.type}"
    validateJSXTree(child)  // recurse
```

Run this validation after BUILD phase, before writing output files. Fix all ERRORs automatically. Present WARNINGs in the diff report.
