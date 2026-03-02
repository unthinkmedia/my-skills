# Marketplace Readiness

Use this document to decide if an extension is ready for publication.

## Metadata Requirements

Required `package.json` fields:

1. `name`, `displayName`, `description`, `version`, `publisher`
2. `engines.vscode`
3. categories and keywords
4. repository and issue tracker links
5. icon path (if applicable)

## Contribution Consistency

Ensure docs and implementation match for:

1. commands
2. views/menus
3. configuration settings
4. activation events

## Documentation Requirements

1. `README.md` includes install, usage, commands, settings, limitations
2. `CHANGELOG.md` includes current release notes
3. known limitations and troubleshooting are explicit

## Minimum Quality Bars

1. README quality includes quick start, command list, configuration section, and troubleshooting section.
2. README command and setting names match implementation exactly.
3. Screenshot quality includes at least 2 screenshots covering primary workflows.
4. Screenshots are clear and reflect the current UI.
5. Changelog quality lists user-visible changes and any breaking changes/migrations.
6. Description quality has a concise value statement and clear use case scope.

## Packaging Checks

1. `vsce package` (or equivalent) succeeds
2. package contents exclude unnecessary files
3. extension installs from VSIX without runtime errors
4. basic workflow smoke test passes post-install

## Security And Quality Checks

1. no hardcoded secrets
2. WebView policies validated (if WebView exists)
3. accessibility checks completed
4. no new compile/lint/test regressions

## Ready/Not Ready Decision

Mark `Ready` only if:

1. metadata complete
2. docs complete
3. package install verified
4. critical checks pass
5. minimum quality bars pass

If `Not Ready`, provide:

1. blocker list by file
2. exact remediation steps
3. revalidation checklist
