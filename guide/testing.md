---
title: Testing
description: Test php-n8n/client integrations with fake PSR-18 clients, typed requests, and execution responses.
---

# Testing

`php-n8n/client` is easy to test because it depends on PSR interfaces and exposes explicit value objects.

You can test your integration without sending real requests to n8n by using a fake PSR-18 client.

## Fake HTTP Client

```php
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

final class FakeHttpClient implements ClientInterface
{
    /** @var list<RequestInterface> */
    public array $requests = [];

    public function __construct(private ResponseInterface $response)
    {
    }

    public function sendRequest(RequestInterface $request): ResponseInterface
    {
        $this->requests[] = $request;

        return $this->response;
    }
}
```

## Test A Webhook Request

```php
use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7\Response;
use PhpN8n\Client\N8nClient;
use PhpN8n\Client\Webhooks\Webhook;
use PhpN8n\Client\Webhooks\WebhookRequest;

$psr17 = new Psr17Factory();
$http = new FakeHttpClient(new Response(
    status: 200,
    headers: ['Content-Type' => 'application/json'],
    body: json_encode(['executionId' => '123'], JSON_THROW_ON_ERROR),
));

$client = new N8nClient(
    httpClient: $http,
    requestFactory: $psr17,
    streamFactory: $psr17,
);

$response = $client->webhooks()->trigger(
    Webhook::fromUri($psr17->createUri('https://n8n.example.com/webhook/test')),
    WebhookRequest::json(['ok' => true]),
);

assert($response->executionReference()?->id() === '123');
assert($http->requests[0]->getMethod() === 'POST');
assert($http->requests[0]->getHeaderLine('Content-Type') === 'application/json');
```

## Test Execution Tracking

```php
use PhpN8n\Client\Config\ApiConfig;
use PhpN8n\Client\Executions\ExecutionReference;

$http = new FakeHttpClient(new Response(
    status: 200,
    headers: ['Content-Type' => 'application/json'],
    body: json_encode([
        'id' => '123',
        'status' => 'success',
        'finished' => true,
    ], JSON_THROW_ON_ERROR),
));

$client = new N8nClient(
    httpClient: $http,
    requestFactory: $psr17,
    streamFactory: $psr17,
    apiConfig: new ApiConfig(
        apiUri: $psr17->createUri('https://n8n.example.com/api/v1'),
        apiKey: 'test-key',
    ),
);

$result = $client->executions()->get(ExecutionReference::fromId('123'));

assert($result->status()->isSuccessful());
assert($http->requests[0]->getHeaderLine('X-N8N-API-KEY') === 'test-key');
```

## Test Your Own Services

Prefer testing the service that uses `N8nClient`, not the package internals.

Good integration tests usually assert:

- The expected webhook URL was called.
- The request method is correct.
- Required headers are present.
- The JSON body contains the expected payload.
- Execution IDs and statuses are handled correctly.

The package itself already has unit tests for its value objects, request creation, response resolution, hooks, and execution tracking behavior.
