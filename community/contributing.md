---
title: Contributing
description: Contribute to php-n8n/client with focused bug reports, examples, tests, integrations, and documentation improvements.
---

# Contributing

Contributions are welcome.

The most useful contributions are focused, testable, and aligned with the package direction: a small, strongly typed, PSR-first client for n8n webhooks and execution tracking.

## Good Contribution Areas

- Bug reports with reproduction steps.
- Documentation fixes and clearer examples.
- Tests for edge cases.
- Improvements to webhook response handling.
- Framework integration examples.
- Small features that keep the core package framework agnostic.

## Before Large Changes

Open an issue before starting large changes. This helps avoid duplicated work and keeps the package focused.

Source repository:

```text
https://github.com/php-n8n/client
```

Issue tracker:

```text
https://github.com/php-n8n/client/issues
```

## Development Checks

The client package uses Composer scripts for checks:

```bash
composer check
```

This runs Composer validation, PHPUnit, PSR-12 checks, and PHPStan.

## Contribution Guidelines

- Keep changes small and focused.
- Preserve PSR compliance.
- Avoid framework-specific dependencies in the core client.
- Add tests when behavior changes.
- Update docs when public behavior changes.
- Prefer explicit typed APIs over magic behavior.

## Recognition

People who contribute to the package or documentation can be recognized through the project site and repository history.

See [Contributors](/community/contributors) for the current site listing.
