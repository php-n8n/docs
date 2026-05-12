---
title: Advanced Usage
description: Customize response resolution, HTTP behavior, lifecycle hooks, and integration boundaries for php-n8n/client.
---

# Advanced Usage

Most applications only need `N8nClient`, `Webhook`, and `WebhookRequest`. The package also exposes contracts and extension points for cases where your application needs more control.

## Custom Webhook Response Resolver

By default, webhook responses are parsed as empty, JSON, or text based on the response body and content type.

If your n8n workflows return a custom shape, implement `WebhookResponseResolverContract`.

```php
use PhpN8n\Client\Contracts\WebhookResponseResolverContract;
use PhpN8n\Client\Executions\ExecutionReference;
use PhpN8n\Client\Webhooks\WebhookResponse;
use PhpN8n\Client\Webhooks\WebhookResponseType;
use Psr\Http\Message\ResponseInterface;

final class CustomWebhookResponseResolver implements WebhookResponseResolverContract
{
    public function resolve(ResponseInterface $response): WebhookResponse
    {
        $payload = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);

        return new WebhookResponse(
            response: $response,
            type: WebhookResponseType::Json,
            body: $payload,
            executionReference: isset($payload['id'])
                ? ExecutionReference::fromId($payload['id'])
                : null,
        );
    }
}
```

Pass it to the client:

```php
$client = new N8nClient(
    httpClient: $httpClient,
    requestFactory: $requestFactory,
    streamFactory: $streamFactory,
    webhookResponseResolver: new CustomWebhookResponseResolver(),
);
```

## Custom Triggerer Or Tracker

`N8nClient` accepts custom implementations of:

| Constructor argument | Contract |
| --- | --- |
| `webhookTriggerer` | `WebhookTriggererContract` |
| `executionTracker` | `ExecutionTrackerContract` |

This is useful for tests, instrumentation, or application-specific wrappers.

```php
$client = new N8nClient(
    httpClient: $httpClient,
    requestFactory: $requestFactory,
    streamFactory: $streamFactory,
    webhookTriggerer: $customWebhookTriggerer,
    executionTracker: $customExecutionTracker,
);
```

## HTTP Client Policy

The package does not own retries, TLS policy, proxies, or connection pooling. Configure those in your PSR-18 client.

With Guzzle:

```php
use GuzzleHttp\Client as GuzzleClient;

$httpClient = new GuzzleClient([
    'timeout' => 10,
    'connect_timeout' => 5,
]);
```

If you need retries, add them through your HTTP client stack or application infrastructure. The core client stays deterministic and small.

## Shared Webhook Definitions

Because `Webhook` is immutable, you can safely define base webhooks and derive specific variants.

```php
$baseWebhook = Webhook::fromUri($psr17->createUri($_ENV['N8N_WEBHOOK_URL']))
    ->withHeader('X-App', 'billing')
    ->withQueryParameter('source', 'php');

$productionWebhook = $baseWebhook
    ->withQueryParameter('environment', 'production');
```

## Security Notes

Keep webhook URLs and API keys outside source control.

Use environment variables, your framework's secret management, or your deployment platform's secret store.

```php
new ApiConfig(
    apiUri: $psr17->createUri($_ENV['N8N_API_URL']),
    apiKey: $_ENV['N8N_API_KEY'],
);
```

Do not log full webhook URLs if they contain sensitive tokens.

## When To Use Hooks Instead Of Custom Classes

Use hooks when you only need to observe behavior:

- Log outgoing webhook attempts.
- Count polling attempts.
- Record execution status changes.
- Send errors to your error tracker.

Use custom contracts when you need to change behavior:

- Parse a non-standard webhook response shape.
- Replace the execution tracker in tests.
- Wrap webhook triggering in application-specific rules.
