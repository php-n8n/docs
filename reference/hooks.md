---
title: Hook Classes
description: Reference for lifecycle hooks, hook context, hook registry, and the null hook runner.
---

# Hook Classes

## `LifecycleHook`

Namespace:

```php
PhpN8n\Client\Hooks\LifecycleHook
```

Enum cases:

| Case | Value |
| --- | --- |
| `BeforeWebhookRequest` | `webhook.before_request` |
| `AfterWebhookResponse` | `webhook.after_response` |
| `ExecutionReferenceCreated` | `execution.reference_created` |
| `BeforeExecutionRefresh` | `execution.before_refresh` |
| `AfterExecutionRefresh` | `execution.after_refresh` |
| `BeforePollingStarts` | `execution.before_polling_starts` |
| `PollingAttempt` | `execution.polling_attempt` |
| `ExecutionStatusChanged` | `execution.status_changed` |
| `ExecutionSucceeded` | `execution.succeeded` |
| `ExecutionFailed` | `execution.failed` |
| `ExecutionTimedOut` | `execution.timed_out` |
| `ExceptionThrown` | `exception.thrown` |

## `HookContext`

Namespace:

```php
PhpN8n\Client\Hooks\HookContext
```

Carries hook name, context values, and optional exception.

### Constructor

```php
public function __construct(
    LifecycleHook $hook,
    array $context = [],
    ?Throwable $exception = null,
)
```

### Methods

| Method | Returns |
| --- | --- |
| `hook()` | `LifecycleHook` |
| `context()` | `array<string, mixed>` |
| `exception()` | `Throwable|null` |

## `HookRegistry`

Namespace:

```php
PhpN8n\Client\Hooks\HookRegistry
```

Immutable hook registry and default `HookRunnerContract` implementation for callbacks.

### Constructor

```php
public function __construct(array $callbacks = [])
```

### Methods

| Method | Returns |
| --- | --- |
| `on(LifecycleHook $hook, Closure $callback)` | `HookRegistry` |
| `run(HookContext $hook)` | `void` |

`on()` returns a new registry instance.

## `NullHookRunner`

Namespace:

```php
PhpN8n\Client\Hooks\NullHookRunner
```

No-op implementation of `HookRunnerContract`.

### Methods

| Method | Returns |
| --- | --- |
| `run(HookContext $hook)` | `void` |
