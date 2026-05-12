---
title: Why This Client
description: Why php-n8n/client is strongly typed, PSR-first, framework agnostic, and intentionally small.
---

# Why This Client

`php-n8n/client` exists for one focused use case: trigger n8n webhooks from PHP applications and track workflow executions when needed.

It intentionally does not try to be a full n8n SDK.

## Strongly Typed By Default

The package exposes explicit PHP types instead of passing loosely shaped arrays through the whole client.

Examples:

| Concept | Type |
| --- | --- |
| Main client | `PhpN8n\Client\N8nClient` |
| Webhook target | `PhpN8n\Client\Webhooks\Webhook` |
| Webhook body | `PhpN8n\Client\Webhooks\WebhookRequest` |
| Webhook method | `PhpN8n\Client\Webhooks\WebhookMethod` |
| Webhook response type | `PhpN8n\Client\Webhooks\WebhookResponseType` |
| Execution reference | `PhpN8n\Client\Executions\ExecutionReference` |
| Execution status | `PhpN8n\Client\Executions\ExecutionStatus` |
| Polling configuration | `PhpN8n\Client\Config\PollingConfig` |

The result is easier to test and safer to refactor because behavior is attached to named objects and enums.

## PSR-Only Runtime Dependencies

The runtime dependency surface is intentionally small:

```json
{
  "psr/http-client": "^1.0",
  "psr/http-factory": "^1.0",
  "psr/http-message": "^1.0 || ^2.0"
}
```

That means the client depends on stable PHP standards rather than a specific framework or HTTP library.

This keeps dependency risk low:

| What the package does | What the package avoids |
| --- | --- |
| Accepts any PSR-18 HTTP client. | Does not force Guzzle at runtime. |
| Accepts any PSR-17 request and stream factories. | Does not force a PSR-7 implementation. |
| Uses PSR-7 requests, responses, streams, and URIs. | Does not wrap everything in framework-specific objects. |
| Keeps integrations explicit. | Does not register global state or service containers. |

You can use Guzzle and Nyholm PSR-7, Symfony HTTP Client with PSR adapters, or any compatible implementation already approved in your application.

## Immutable Value Objects

Objects such as `Webhook` and `WebhookRequest` use `with*` methods that return new instances:

```php
$webhook = Webhook::fromUri($uri)
    ->withHeader('X-Source', 'checkout')
    ->withQueryParameter('environment', 'production');
```

The original object is not modified. This keeps request construction predictable when objects are reused or passed between services.

## Framework Agnostic

The client works in any PHP runtime that can provide PSR implementations:

| Environment | Fit |
| --- | --- |
| Plain PHP | Direct construction. |
| Laravel | Bind `N8nClient` in a service provider. |
| Symfony | Register it as a service with PSR dependencies. |
| Workers and queues | Reuse the same typed client in jobs. |
| CLIs | Trigger workflows from scripts or commands. |

Framework-specific packages may be added later, but the core client remains independent.

## What It Does Not Do

The package does not currently provide:

- A full wrapper around every n8n REST endpoint.
- Laravel or Symfony auto-discovery.
- A built-in retry policy.
- A built-in logger.
- A webhook receiver for incoming n8n calls.

Those features can be built around the client or added as separate ecosystem packages where they make sense.
