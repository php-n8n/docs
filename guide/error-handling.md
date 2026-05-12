---
title: Error Handling
description: Handle authentication failures, request failures, invalid webhook responses, execution timeouts, and validation errors.
---

# Error Handling

The client uses explicit exception types for n8n and transport failures. Some value-object validation errors use PHP's `InvalidArgumentException`.

## Exception Types

| Exception | Parent | Used for |
| --- | --- | --- |
| `N8nException` | `RuntimeException` | Base package exception. |
| `RequestException` | `N8nException` | Failed HTTP requests or invalid n8n API responses. |
| `AuthenticationException` | `RequestException` | HTTP `401` responses. |
| `ExecutionTimeoutException` | `N8nException` | Polling exceeded the configured timeout. |
| `InvalidWebhookResponseException` | `N8nException` | Webhook response claimed JSON but could not be decoded. |
| `InvalidArgumentException` | PHP SPL | Invalid local input such as an empty execution ID or invalid webhook URL. |

## Webhook Errors

```php
use PhpN8n\Client\Exceptions\AuthenticationException;
use PhpN8n\Client\Exceptions\InvalidWebhookResponseException;
use PhpN8n\Client\Exceptions\RequestException;

try {
    $response = $client->webhooks()->trigger($webhook, $request);
} catch (AuthenticationException $exception) {
    // n8n returned 401.
} catch (InvalidWebhookResponseException $exception) {
    // Response Content-Type looked like JSON, but the body was invalid JSON.
} catch (RequestException $exception) {
    // HTTP error response or PSR-18 client failure.
    $httpResponse = $exception->response();
}
```

Webhook behavior:

| Situation | Exception |
| --- | --- |
| HTTP status `401` | `AuthenticationException` |
| HTTP status `>= 400` | `RequestException` |
| PSR-18 client throws `ClientExceptionInterface` | `RequestException` |
| JSON request body cannot be encoded | `RequestException` |
| JSON webhook response cannot be decoded | `InvalidWebhookResponseException` |

## Execution Tracking Errors

```php
use PhpN8n\Client\Exceptions\AuthenticationException;
use PhpN8n\Client\Exceptions\ExecutionTimeoutException;
use PhpN8n\Client\Exceptions\RequestException;

try {
    $result = $client->executions()->wait($reference, $polling);
} catch (AuthenticationException $exception) {
    // n8n API key is missing, invalid, or rejected.
} catch (ExecutionTimeoutException $exception) {
    $reference = $exception->reference();
} catch (RequestException $exception) {
    $httpResponse = $exception->response();
}
```

Execution behavior:

| Situation | Exception |
| --- | --- |
| `executions()` called without `ApiConfig` | `N8nException` |
| HTTP status `401` | `AuthenticationException` |
| HTTP status `>= 400` | `RequestException` |
| PSR-18 client throws `ClientExceptionInterface` | `RequestException` |
| n8n execution response is invalid JSON | `RequestException` |
| n8n execution response is not a JSON object | `RequestException` |
| Polling timeout reached | `ExecutionTimeoutException` |

## Validation Errors

Local validation uses `InvalidArgumentException`.

```php
use PhpN8n\Client\Executions\ExecutionReference;

ExecutionReference::fromId(''); // throws InvalidArgumentException
```

Examples:

| Input | Validation |
| --- | --- |
| Empty webhook URL | Invalid. |
| Webhook URL without host | Invalid. |
| Webhook URL with unsupported scheme | Invalid. |
| Unsupported webhook method string | Invalid. |
| Empty execution reference ID | Invalid. |
| Negative polling timeout or interval | Invalid. |
| Text body with non-string value | Invalid. |
| Stream body without a PSR-7 stream | Invalid. |

## Keep HTTP Policy In Your HTTP Client

Retries, proxy configuration, TLS options, and connection timeouts are not hard-coded by `php-n8n/client`.

Configure them in the PSR-18 HTTP client you choose. This keeps the package small and avoids surprising global behavior.
