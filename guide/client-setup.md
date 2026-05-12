---
title: Client Setup
description: Configure N8nClient with PSR-18, PSR-17, optional n8n API settings, hooks, and custom components.
---

# Client Setup

`N8nClient` is the main entry point.

```php
use PhpN8n\Client\N8nClient;

$client = new N8nClient(
    httpClient: $httpClient,
    requestFactory: $requestFactory,
    streamFactory: $streamFactory,
);
```

## Required Dependencies

The client needs three PSR dependencies:

| Argument | Required interface | Used for |
| --- | --- | --- |
| `httpClient` | `Psr\Http\Client\ClientInterface` | Sends requests. |
| `requestFactory` | `Psr\Http\Message\RequestFactoryInterface` | Creates PSR-7 requests. |
| `streamFactory` | `Psr\Http\Message\StreamFactoryInterface` | Creates request body streams. |

With Guzzle and Nyholm PSR-7:

```php
use GuzzleHttp\Client as GuzzleClient;
use Nyholm\Psr7\Factory\Psr17Factory;
use PhpN8n\Client\N8nClient;

$psr17 = new Psr17Factory();

$client = new N8nClient(
    httpClient: new GuzzleClient([
        'timeout' => 10,
        'connect_timeout' => 5,
    ]),
    requestFactory: $psr17,
    streamFactory: $psr17,
);
```

Timeouts, TLS settings, proxies, and retries belong to your PSR-18 HTTP client configuration.

## Optional API Configuration

`ApiConfig` is only required when you use execution tracking.

```php
use PhpN8n\Client\Config\ApiConfig;
use PhpN8n\Client\N8nClient;

$client = new N8nClient(
    httpClient: $httpClient,
    requestFactory: $requestFactory,
    streamFactory: $streamFactory,
    apiConfig: new ApiConfig(
        apiUri: $psr17->createUri('https://n8n.example.com/api/v1'),
        apiKey: $_ENV['N8N_API_KEY'],
    ),
);
```

The execution tracker appends `/executions/{id}` to the configured API URI path. For the standard n8n API, use a base URI such as `https://n8n.example.com/api/v1`.

If `apiConfig` is omitted and you call `$client->executions()`, the client throws `N8nException`.

## Entry Points

```php
$webhooks = $client->webhooks();
$executions = $client->executions();
$execution = $client->execution($reference);
```

| Method | Returns | Purpose |
| --- | --- | --- |
| `webhooks()` | `WebhookTriggererContract` | Trigger n8n webhooks. |
| `executions()` | `ExecutionTrackerContract` | Fetch or wait for executions. |
| `execution($reference)` | `Execution` | Convenience wrapper around a single execution reference. |

## Hooks

You can pass a hook runner to observe lifecycle events.

```php
use PhpN8n\Client\Hooks\HookContext;
use PhpN8n\Client\Hooks\HookRegistry;
use PhpN8n\Client\Hooks\LifecycleHook;
use PhpN8n\Client\N8nClient;

$hooks = (new HookRegistry())
    ->on(LifecycleHook::BeforeWebhookRequest, function (HookContext $event): void {
        // Add logging, metrics, or tracing here.
    });

$client = new N8nClient(
    httpClient: $httpClient,
    requestFactory: $requestFactory,
    streamFactory: $streamFactory,
    hooks: $hooks,
);
```

Hook callbacks should not throw unless you intentionally want to stop the operation.

## Custom Components

The constructor also accepts custom implementations for advanced use cases:

| Argument | Contract |
| --- | --- |
| `webhookResponseResolver` | `WebhookResponseResolverContract` |
| `webhookTriggerer` | `WebhookTriggererContract` |
| `executionTracker` | `ExecutionTrackerContract` |

Most applications do not need these. They are useful when you want to adapt response parsing, add test doubles, or integrate the client into a larger abstraction.
