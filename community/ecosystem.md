---
title: Ecosystem
description: Planned direction for the php-n8n ecosystem around the strongly typed PSR client.
---

# Ecosystem

`php-n8n/client` is the core package. It should stay small, strongly typed, PSR-first, and framework agnostic.

Additional packages can be planned around it without adding unnecessary dependencies to the core client.

## Current Package

| Package | Status | Purpose |
| --- | --- | --- |
| `php-n8n/client` | Current | Trigger n8n webhooks and track workflow executions. |

## Planned Direction

These package names describe possible ecosystem direction. They are not release promises.

| Package | Possible purpose |
| --- | --- |
| `php-n8n/contracts` | Shared contracts for integrations. |
| `php-n8n/laravel` | Laravel service provider, config publishing, and container bindings. |
| `php-n8n/symfony` | Symfony service definitions and bundle integration. |
| `php-n8n/testing` | Test helpers, fake clients, and assertions. |
| `php-n8n/events` | Event abstractions around lifecycle hooks. |
| `php-n8n/execution-tracker` | Higher-level execution tracking helpers if they outgrow the core client. |

## Why Separate Packages

Separate packages keep the core client low-risk for applications that only need the PSR client.

Framework users can still get convenience integrations later, but plain PHP users do not pay for dependencies they do not use.

## Contribute Ideas

If you want to help shape the ecosystem, open an issue with the problem you want to solve and the package where you think it belongs.

Start here:

```text
https://github.com/php-n8n/client/issues
```
