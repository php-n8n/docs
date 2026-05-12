---
title: Contracts
description: Reference for the public interfaces used to extend or replace php-n8n/client behavior.
---

# Contracts

The package exposes small contracts for extension and testing.

## `WebhookTriggererContract`

Namespace:

```php
PhpN8n\Client\Contracts\WebhookTriggererContract
```

```php
public function trigger(Webhook $webhook, ?WebhookRequest $request = null): WebhookResponse;
```

## `WebhookResponseResolverContract`

Namespace:

```php
PhpN8n\Client\Contracts\WebhookResponseResolverContract
```

```php
public function resolve(ResponseInterface $response): WebhookResponse;
```

## `ExecutionTrackerContract`

Namespace:

```php
PhpN8n\Client\Contracts\ExecutionTrackerContract
```

```php
public function get(
    ExecutionReference $reference,
    ?ExecutionFetchOptions $options = null,
): ExecutionResult;

public function wait(
    ExecutionReference $reference,
    ?PollingConfig $polling = null,
): ExecutionResult;
```

## `HookRunnerContract`

Namespace:

```php
PhpN8n\Client\Contracts\HookRunnerContract
```

```php
public function run(HookContext $hook): void;
```

## When To Implement A Contract

Implement a contract when you need to change behavior, not just observe it.

| Need | Suggested approach |
| --- | --- |
| Log requests or statuses | Use lifecycle hooks. |
| Parse a custom webhook response shape | Implement `WebhookResponseResolverContract`. |
| Replace network calls in tests | Implement `WebhookTriggererContract` or `ExecutionTrackerContract`. |
| Integrate with an application-specific abstraction | Wrap or implement the relevant contract. |
