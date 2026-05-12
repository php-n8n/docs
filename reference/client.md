---
title: Client Classes
description: Reference for N8nClient and the Execution helper class.
---

# Client Classes

## `N8nClient`

Namespace:

```php
PhpN8n\Client\N8nClient
```

Main entry point for webhook triggering and execution tracking.

### Constructor

```php
public function __construct(
    ClientInterface $httpClient,
    RequestFactoryInterface $requestFactory,
    StreamFactoryInterface $streamFactory,
    ?ApiConfig $apiConfig = null,
    ?WebhookResponseResolverContract $webhookResponseResolver = null,
    HookRunnerContract $hooks = new NullHookRunner(),
    ?WebhookTriggererContract $webhookTriggerer = null,
    ?ExecutionTrackerContract $executionTracker = null,
)
```

| Parameter | Type | Required | Purpose |
| --- | --- | --- | --- |
| `httpClient` | `Psr\Http\Client\ClientInterface` | Yes | Sends HTTP requests. |
| `requestFactory` | `Psr\Http\Message\RequestFactoryInterface` | Yes | Creates PSR-7 requests. |
| `streamFactory` | `Psr\Http\Message\StreamFactoryInterface` | Yes | Creates request body streams. |
| `apiConfig` | `ApiConfig|null` | No | Enables execution tracking. |
| `webhookResponseResolver` | `WebhookResponseResolverContract|null` | No | Custom webhook response parsing. |
| `hooks` | `HookRunnerContract` | No | Lifecycle hook runner. |
| `webhookTriggerer` | `WebhookTriggererContract|null` | No | Custom webhook triggerer. |
| `executionTracker` | `ExecutionTrackerContract|null` | No | Custom execution tracker. |

### `webhooks()`

```php
public function webhooks(): WebhookTriggererContract
```

Returns the configured webhook triggerer or creates the default `WebhookTriggerer`.

### `executions()`

```php
public function executions(): ExecutionTrackerContract
```

Returns the configured execution tracker or creates the default `ExecutionTracker`.

Throws `N8nException` when no `ApiConfig` is available and no custom execution tracker was provided.

### `execution()`

```php
public function execution(ExecutionReference $reference): Execution
```

Returns a convenience wrapper for one execution reference.

## `Execution`

Namespace:

```php
PhpN8n\Client\Execution
```

Small wrapper around `ExecutionTrackerContract` for one `ExecutionReference`.

### Constructor

```php
public function __construct(
    ExecutionReference $reference,
    ExecutionTrackerContract $tracker,
)
```

### Methods

| Method | Returns | Purpose |
| --- | --- | --- |
| `reference()` | `ExecutionReference` | Returns the wrapped reference. |
| `refresh(?ExecutionFetchOptions $options = null)` | `ExecutionResult` | Fetches the latest execution result. |
| `wait(?PollingConfig $polling = null)` | `ExecutionResult` | Waits until the execution reaches a terminal status. |
