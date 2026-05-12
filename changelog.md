---
title: Changelog
description: Release notes for php-n8n/client and links to the source changelog.
---

# Changelog

The source changelog lives in the client repository:

```text
https://github.com/php-n8n/client/blob/main/CHANGELOG.md
```

## v1.0.0 - Unreleased

- Added webhook triggering through `$client->webhooks()->trigger()`.
- Added execution fetching and polling through the n8n API.
- Added explicit webhook request body helpers for JSON, text, streams, and empty requests.
- Added lifecycle hooks for webhook requests, execution tracking, polling, and errors.
- Added strict webhook URL validation for absolute `http` and `https` URLs.
- Added PSR-7, PSR-17, and PSR-18 based transport abstractions.

## Versioning

`php-n8n/client` follows Semantic Versioning.

The first public tag is expected to be `v1.0.0`, establishing the initial stable public API for the client package.
