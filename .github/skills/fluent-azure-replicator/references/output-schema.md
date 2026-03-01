# Output Schema Validation

Structural rules that every generated output MUST satisfy. Run this checklist during **Post-Build Self-Review** (after BUILD, before VERIFY). Each rule is checkable via grep or AST inspection.

## How to Use

1. After BUILD generates all files, read this schema
2. For each file, run the checks listed below
3. If any check FAILS, fix the issue before proceeding to VERIFY
4. Report all checks as pass/fail in the build log

---

## index.tsx

### MUST contain:
- [ ] `FluentProvider` as root wrapper element
- [ ] Theme prop referencing `./theme` (`azureLightTheme` or `azureDarkTheme`)
- [ ] Exactly one default export (named component function or `export default`)
- [ ] All style classes applied via `useStyles()` (from `./styles`)
- [ ] Zero inline `style={{ }}` attributes
- [ ] At least one semantic HTML element (`<nav>`, `<main>`, `<header>`, or `<section>`)
- [ ] `aria-label` on every `<nav>`, `<Toolbar>`, `<DataGrid>`, and role="button" element
- [ ] Import from `./icons` (not directly from `@fluentui/react-icons`)
- [ ] Import from `./data` (not hardcoded data objects in component file)
- [ ] Import from `./styles` (not `makeStyles` defined in index.tsx)

### MUST NOT contain:
- [ ] No `import *` from any package
- [ ] No `style={{ }}` inline styles
- [ ] No hardcoded color/font/spacing values
- [ ] No `className="..."` string literals (only `styles.xxx` or `mergeClasses()`)
- [ ] No CDN URLs or external asset URLs
- [ ] No `console.log` or debugging statements

---

## styles.ts

### MUST contain:
- [ ] Single `makeStyles()` call exported as `useStyles`
- [ ] All values reference `tokens.*` from `@fluentui/react-components`
- [ ] A `root` class with `display: 'flex'`, `flexDirection: 'column'`, `height: '100%'`, `overflow: 'hidden'`

### MUST NOT contain:
- [ ] No hardcoded hex colors (`#xxx`, `#xxxxxx`)
- [ ] No hardcoded `rgb()` or `rgba()` or `hsl()` values
- [ ] No hardcoded pixel font sizes (use `tokens.fontSize*`)
- [ ] No hardcoded font weights as numbers (use `tokens.fontWeight*`)
- [ ] No hardcoded font families (use `tokens.fontFamily*`)
- [ ] No hardcoded shadow values (use `tokens.shadow*`)
- [ ] No hardcoded border-radius values (use `tokens.borderRadius*`)
- [ ] No `!important` declarations

### Grep checks:
```bash
# These should return 0 matches:
grep -En '#[0-9a-fA-F]{3,8}' styles.ts          # hardcoded colors
grep -En 'rgb\(|rgba\(|hsl\(' styles.ts          # hardcoded colors
grep -En "fontWeight:\s*['\"]?\d+" styles.ts      # hardcoded weights
grep -En '!important' styles.ts                   # !important
grep -En 'style=' index.tsx                       # inline styles
```

---

## data.ts

### MUST contain:
- [ ] TypeScript interfaces for all data shapes
- [ ] Exported typed arrays/objects
- [ ] Realistic Azure resource names and values (not "test1", "example", "foo")

### MUST NOT contain:
- [ ] No React components or JSX
- [ ] No styling imports
- [ ] No side effects

---

## icons.ts

### MUST contain:
- [ ] Named imports only from `@fluentui/react-icons` (e.g., `import { SearchRegular } from '...'`)
- [ ] Re-exports with semantic aliases (e.g., `export { SearchRegular as SearchIcon }`)
- [ ] `bundleIcon(Filled, Regular)` for any icons that toggle states

### MUST NOT contain:
- [ ] No `import *` or wildcard imports
- [ ] No Iconify URLs or CDN references
- [ ] No external icon service imports
- [ ] No inline SVG definitions (those go in `assets/` with wrapper components)

### Grep checks:
```bash
# Should return 0:
grep -En 'import \*' icons.ts                     # wildcard imports
grep -En 'iconify|cdn|unpkg' icons.ts             # external CDN
# Should return ≥1:
grep -En 'export \{' icons.ts                     # has re-exports
```

---

## theme.ts

### MUST contain:
- [ ] `BrandVariants` object with all 16 shade keys (10–160)
- [ ] Both `azureLightTheme` and `azureDarkTheme` exports
- [ ] Created via `createLightTheme()` and `createDarkTheme()`

### MUST NOT contain:
- [ ] No hardcoded theme token overrides (unless explicitly required by the source page)

---

## [Component].stories.tsx

### MUST contain:
- [ ] `Meta` type with `title: 'Azure/<ComponentName>'`
- [ ] `parameters: { layout: 'fullscreen' }`
- [ ] `Light` story (default theme)
- [ ] `Dark` story (with dark theme)

---

## Automated Validation Script

After BUILD, run these checks programmatically:

```bash
OUTPUT_DIR="<output-dir>"

echo "=== Output Schema Validation ==="

# 1. Required files exist
for f in index.tsx styles.ts data.ts icons.ts theme.ts; do
  [ -f "$OUTPUT_DIR/$f" ] && echo "✅ $f exists" || echo "❌ $f MISSING"
done

# 2. Stories file exists
ls "$OUTPUT_DIR"/*.stories.tsx >/dev/null 2>&1 && echo "✅ Stories file exists" || echo "❌ Stories file MISSING"

# 3. No hardcoded colors in styles.ts
if grep -qEn '#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(' "$OUTPUT_DIR/styles.ts"; then
  echo "❌ Hardcoded colors in styles.ts"
else
  echo "✅ No hardcoded colors"
fi

# 4. No inline styles in index.tsx
if grep -qEn 'style=\{' "$OUTPUT_DIR/index.tsx"; then
  echo "❌ Inline styles in index.tsx"
else
  echo "✅ No inline styles"
fi

# 5. No wildcard imports
if grep -rqEn 'import \*' "$OUTPUT_DIR/"*.ts "$OUTPUT_DIR/"*.tsx; then
  echo "❌ Wildcard imports found"
else
  echo "✅ No wildcard imports"
fi

# 6. FluentProvider present
if grep -qn 'FluentProvider' "$OUTPUT_DIR/index.tsx"; then
  echo "✅ FluentProvider present"
else
  echo "❌ FluentProvider MISSING"
fi

# 7. Both themes exported
if grep -qn 'azureLightTheme' "$OUTPUT_DIR/theme.ts" && grep -qn 'azureDarkTheme' "$OUTPUT_DIR/theme.ts"; then
  echo "✅ Both themes exported"
else
  echo "❌ Theme exports incomplete"
fi

echo "=== Done ==="
```
