---
title: Class Reference
description: Reference for the current public classes, contracts, enums, and exceptions in php-n8n/client.
---

# Class Reference

This reference covers the current public surface of `php-n8n/client`.

It is grouped by namespace and focuses on the classes you use when integrating the package.

| Section | Covers |
| --- | --- |
| [Client](/reference/client) | `N8nClient` and `Execution`. |
| [Config](/reference/config) | `ApiConfig`, `ExecutionFetchOptions`, `PollingConfig`. |
| [Webhooks](/reference/webhooks) | Webhook targets, requests, responses, triggerer, resolver, enums. |
| [Executions](/reference/executions) | Execution references, results, statuses, data, tracker. |
| [Hooks](/reference/hooks) | Lifecycle hooks, hook context, registry. |
| [Contracts](/reference/contracts) | Public extension interfaces. |
| [Exceptions](/reference/exceptions) | Package exception types. |

## Package Namespace

The package uses this root namespace:

```php
PhpN8n\Client
```

Composer autoloads it from `src/`.

## Runtime Requirements

| Requirement | Version |
| --- | --- |
| PHP | `>=8.2` |
| `psr/http-client` | `^1.0` |
| `psr/http-factory` | `^1.0` |
| `psr/http-message` | `^1.0 || ^2.0` |

The package does not require a concrete HTTP client at runtime.
