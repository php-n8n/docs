---
title: Webhooks
description: Trigger n8n webhooks with typed URLs, HTTP methods, headers, query parameters, request bodies, and parsed responses.
---

# Webhooks

Webhook triggering is the core feature of `php-n8n/client`.

```php
$response = $client->webhooks()->trigger($webhook, $request);
```

## Webhook URLs

Create a webhook from a PSR-7 URI:

```php
use PhpN8n\Client\Webhooks\Webhook;

$webhook = Webhook::fromUri(
    $psr17->createUri('https://n8n.example.com/webhook/order-created')
);
```

The URL must be:

- Non-empty.
- Absolute.
- `http` or `https`.
- Valid according to PHP URL validation.
- Built with a host.

Invalid webhook URLs throw `InvalidArgumentException`.

## HTTP Methods

Webhooks use `POST` by default.

```php
use PhpN8n\Client\Webhooks\WebhookMethod;

$webhook = $webhook->withMethod(WebhookMethod::Post);
$webhook = $webhook->withMethod('POST');
```

Supported methods:

| Enum case | HTTP method |
| --- | --- |
| `WebhookMethod::Delete` | `DELETE` |
| `WebhookMethod::Get` | `GET` |
| `WebhookMethod::Head` | `HEAD` |
| `WebhookMethod::Options` | `OPTIONS` |
| `WebhookMethod::Patch` | `PATCH` |
| `WebhookMethod::Post` | `POST` |
| `WebhookMethod::Put` | `PUT` |

Unsupported string methods throw `InvalidArgumentException`.

## Headers And Query Parameters

Headers and query parameters can be placed on the webhook or on the request.

```php
$webhook = Webhook::fromUri($uri)
    ->withHeader('X-Workflow-Source', 'checkout')
    ->withQueryParameter('environment', 'production');

$request = WebhookRequest::json(['orderId' => 'ORD-1001'])
    ->withHeader('X-Request-ID', 'req_123')
    ->withQueryParameter('trace', '1');
```

When the same header or query key exists in both places, request-level values replace webhook-level values.

## Empty Requests

```php
use PhpN8n\Client\Webhooks\WebhookRequest;

$response = $client->webhooks()->trigger(
    $webhook,
    WebhookRequest::empty(),
);
```

If no request is passed, the client sends an empty request.

## JSON Requests

```php
$response = $client->webhooks()->trigger(
    $webhook,
    WebhookRequest::json([
        'orderId' => 'ORD-1001',
        'total' => 129.50,
    ]),
);
```

JSON bodies are encoded with `JSON_THROW_ON_ERROR`. If no `Content-Type` header is already set, the client adds `Content-Type: application/json`.

## Text Requests

```php
$response = $client->webhooks()->trigger(
    $webhook,
    WebhookRequest::text('plain text payload'),
);
```

If no `Content-Type` header is already set, the client adds `Content-Type: text/plain`.

## Stream Requests

```php
$stream = $psr17->createStreamFromFile('/path/to/export.json');

$response = $client->webhooks()->trigger(
    $webhook,
    WebhookRequest::stream($stream)
        ->withHeader('Content-Type', 'application/json'),
);
```

Stream requests use the PSR-7 stream you provide. Set the content type yourself when n8n needs one.

## Immutable Requests

`Webhook` and `WebhookRequest` are immutable. Methods such as `withHeader()`, `withQuery()`, and `withJsonBody()` return new instances.

```php
$baseRequest = WebhookRequest::json(['type' => 'order']);

$productionRequest = $baseRequest
    ->withQueryParameter('environment', 'production');
```

`$baseRequest` remains unchanged.

## Webhook Responses

`trigger()` returns `WebhookResponse`.

```php
$statusCode = $response->statusCode();
$type = $response->type();
$body = $response->body();
$httpResponse = $response->httpResponse();
$reference = $response->executionReference();
$status = $response->status();
```

Response body handling:

| Response | Result |
| --- | --- |
| Empty body | `WebhookResponseType::None`, body `null`. |
| JSON content type | JSON-decoded body, `WebhookResponseType::Json`. |
| Other content type | Raw string body, `WebhookResponseType::Text`. |

If the response is marked as JSON but contains invalid JSON, the client throws `InvalidWebhookResponseException`.

## Execution References From Webhook Responses

The resolver extracts an execution reference when the JSON response contains one of these shapes:

```json
{ "executionId": "123" }
```

```json
{ "execution_id": "123" }
```

```json
{ "executionReference": { "id": "123" } }
```

```json
{ "execution": { "id": "123" } }
```

Then you can track it:

```php
$reference = $response->executionReference();

if ($reference !== null) {
    $result = $client->execution($reference)->wait();
}
```

The client also extracts execution status from `status` or `execution.status` when present.
