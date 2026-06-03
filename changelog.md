---
title: Changelog
description: Release notes for php-n8n/client and links to the source changelog.
---

# Changelog

The source changelog lives in the client repository:

```text
https://github.com/php-n8n/client/blob/main/CHANGELOG.md
```

## v1.0.2 - 2026-06-03

- Added a security policy with supported versions and private vulnerability reporting instructions.
- No runtime API changes.

## v1.0.1 - 2026-06-03

- Added post-CI repository dispatch automation using `saedyousef/repository-dispatch`.
- Added a repository-dispatch receiver workflow that builds and uploads a Composer package archive after CI passes.
- No runtime API changes.

## v1.0.0 - 2026-05-10

- Added webhook triggering through `$client->webhooks()->trigger()`.
- Added execution fetching and polling through the n8n API.
- Added explicit webhook request body helpers for JSON, text, streams, and empty requests.
- Added lifecycle hooks for webhook requests, execution tracking, polling, and errors.
- Added strict webhook URL validation for absolute `http` and `https` URLs.
- Added PSR-7, PSR-17, and PSR-18 based transport abstractions.

## Versioning

`php-n8n/client` follows Semantic Versioning.

The latest stable release is `v1.0.2`.

`v1.0.0` established the initial stable public API for the client package. Future breaking changes will be reserved for major releases.
