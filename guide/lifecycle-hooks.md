---
title: Lifecycle Hooks
description: Observe webhook requests, execution polling, status changes, and errors with typed lifecycle hooks.
---

# Lifecycle Hooks

Lifecycle hooks let you observe what the client is doing without replacing the client internals.

Hooks are useful for logging, metrics, tracing, and status notifications.

## Register Hooks

```php
use PhpN8n\Client\Hooks\HookContext;
use PhpN8n\Client\Hooks\HookRegistry;
use PhpN8n\Client\Hooks\LifecycleHook;
use PhpN8n\Client\N8nClient;

$hooks = (new HookRegistry())
    ->on(LifecycleHook::BeforeWebhookRequest, function (HookContext $event): void {
        $webhook = $event->context()['webhook'];
    })
    ->on(LifecycleHook::ExecutionStatusChanged, function (HookContext $event): void {
        $previous = $event->context()['previous_status'];
        $current = $event->context()['status'];
    })
    ->on(LifecycleHook::ExceptionThrown, function (HookContext $event): void {
        $exception = $event->exception();
    });

$client = new N8nClient(
    httpClient: $httpClient,
    requestFactory: $requestFactory,
    streamFactory: $streamFactory,
    hooks: $hooks,
);
```

`HookRegistry` is immutable. Each `on()` call returns a new registry instance.

## Available Hooks

| Hook | When it runs |
| --- | --- |
| `BeforeWebhookRequest` | Before sending a webhook HTTP request. |
| `AfterWebhookResponse` | After a successful webhook HTTP response is received. |
| `ExecutionReferenceCreated` | After a webhook response exposes an execution reference. |
| `BeforeExecutionRefresh` | Before fetching an execution from the n8n API. |
| `AfterExecutionRefresh` | After an execution is fetched and mapped. |
| `BeforePollingStarts` | Before execution polling begins. |
| `PollingAttempt` | Before each polling attempt. |
| `ExecutionStatusChanged` | When polling observes a status change. |
| `ExecutionSucceeded` | When polling reaches a successful terminal status. |
| `ExecutionFailed` | When polling reaches a failed or canceled terminal status. |
| `ExecutionTimedOut` | When polling times out. |
| `ExceptionThrown` | When the client catches and rethrows an exception during supported operations. |

## Hook Context

Each callback receives `HookContext`.

```php
$hook = $event->hook();
$context = $event->context();
$exception = $event->exception();
```

Common context keys:

| Hook | Context keys |
| --- | --- |
| `BeforeWebhookRequest` | `webhook`, `webhook_request`, `http_request` |
| `AfterWebhookResponse` | `webhook`, `webhook_request`, `http_response` |
| `ExecutionReferenceCreated` | `reference`, `webhook_response` |
| `BeforeExecutionRefresh` | `reference`, `options` |
| `AfterExecutionRefresh` | `reference`, `result` |
| `BeforePollingStarts` | `reference`, `polling` |
| `PollingAttempt` | `reference`, `attempt` |
| `ExecutionStatusChanged` | `reference`, `previous_status`, `status`, `result` |
| `ExecutionSucceeded` | `reference`, `result` |
| `ExecutionFailed` | `reference`, `result` |
| `ExecutionTimedOut` | `reference`, `last_result` |

## Logging Example

```php
$hooks = (new HookRegistry())
    ->on(LifecycleHook::PollingAttempt, function (HookContext $event): void {
        $reference = $event->context()['reference'];
        $attempt = $event->context()['attempt'];

        error_log("Polling n8n execution {$reference->id()}, attempt {$attempt}");
    })
    ->on(LifecycleHook::ExecutionSucceeded, function (HookContext $event): void {
        $reference = $event->context()['reference'];

        error_log("n8n execution {$reference->id()} succeeded");
    });
```

## Metrics Example

```php
$hooks = (new HookRegistry())
    ->on(LifecycleHook::AfterWebhookResponse, function (HookContext $event): void {
        $response = $event->context()['http_response'];

        // Example only. Send this to the metrics system used by your app.
        error_log('n8n_webhook_status=' . $response->getStatusCode());
    });
```

## Important Behavior

Hook callbacks run inside the client process. Keep them fast and safe.

If a hook callback throws, the operation can stop. Treat hooks as observability code unless you intentionally want to abort the request or polling flow.
