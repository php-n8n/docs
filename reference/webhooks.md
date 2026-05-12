---
title: Webhook Classes
description: Reference for webhook targets, requests, responses, triggerers, resolvers, and webhook enums.
---

# Webhook Classes

## `Webhook`

Namespace:

```php
PhpN8n\Client\Webhooks\Webhook
```

Represents an n8n webhook endpoint.

### Constructor

```php
public function __construct(
    UriInterface $url,
    WebhookMethod $method = WebhookMethod::Post,
    array $headers = [],
    array $query = [],
)
```

Validation rules:

| Rule | Failure |
| --- | --- |
| URL cannot be empty. | `InvalidArgumentException` |
| Scheme must be `http` or `https`. | `InvalidArgumentException` |
| Host must be present. | `InvalidArgumentException` |
| URL must be valid. | `InvalidArgumentException` |

### Static Constructors

| Method | Returns |
| --- | --- |
| `fromUri(UriInterface $url)` | `Webhook` |

### Methods

| Method | Returns |
| --- | --- |
| `url()` | `UriInterface` |
| `method()` | `WebhookMethod` |
| `headers()` | `array<string, string|string[]>` |
| `query()` | `array<string, mixed>` |
| `withMethod(WebhookMethod|string $method)` | `Webhook` |
| `withHeader(string $name, string|array $value)` | `Webhook` |
| `withHeaders(array $headers)` | `Webhook` |
| `withQueryParameter(string $name, mixed $value)` | `Webhook` |
| `withQuery(array $query)` | `Webhook` |

All `with*` methods return a new instance.

## `WebhookMethod`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookMethod
```

Enum cases:

| Case | Value |
| --- | --- |
| `Delete` | `DELETE` |
| `Get` | `GET` |
| `Head` | `HEAD` |
| `Options` | `OPTIONS` |
| `Patch` | `PATCH` |
| `Post` | `POST` |
| `Put` | `PUT` |

### Methods

| Method | Returns |
| --- | --- |
| `fromString(string $method)` | `WebhookMethod` |

## `WebhookRequest`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookRequest
```

Represents the body, headers, and query parameters for one webhook trigger.

### Constructor

```php
public function __construct(
    mixed $body = null,
    array $headers = [],
    array $query = [],
    ?WebhookRequestBodyType $bodyType = null,
)
```

When `bodyType` is not provided, the client infers it:

| Body value | Inferred type |
| --- | --- |
| `null` | `Empty` |
| `StreamInterface` | `Stream` |
| `string` | `Text` |
| Anything else | `Json` |

### Static Constructors

| Method | Returns |
| --- | --- |
| `empty()` | `WebhookRequest` |
| `json(mixed $body)` | `WebhookRequest` |
| `text(string $body)` | `WebhookRequest` |
| `stream(StreamInterface $body)` | `WebhookRequest` |

### Methods

| Method | Returns |
| --- | --- |
| `body()` | `mixed` |
| `bodyType()` | `WebhookRequestBodyType` |
| `streamBody()` | `StreamInterface` |
| `textBody()` | `string` |
| `headers()` | `array<string, string|string[]>` |
| `query()` | `array<string, mixed>` |
| `withoutBody()` | `WebhookRequest` |
| `withJsonBody(mixed $body)` | `WebhookRequest` |
| `withTextBody(string $body)` | `WebhookRequest` |
| `withStreamBody(StreamInterface $body)` | `WebhookRequest` |
| `withHeader(string $name, string|array $value)` | `WebhookRequest` |
| `withHeaders(array $headers)` | `WebhookRequest` |
| `withQueryParameter(string $name, mixed $value)` | `WebhookRequest` |
| `withQuery(array $query)` | `WebhookRequest` |

## `WebhookRequestBodyType`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookRequestBodyType
```

Enum cases:

| Case |
| --- |
| `Empty` |
| `Json` |
| `Text` |
| `Stream` |

## `WebhookResponse`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookResponse
```

Represents the parsed webhook response plus the original PSR-7 response.

### Constructor

```php
public function __construct(
    ResponseInterface $response,
    WebhookResponseType $type,
    mixed $body = null,
    ?ExecutionReference $executionReference = null,
    ?ExecutionStatus $status = null,
)
```

### Methods

| Method | Returns |
| --- | --- |
| `httpResponse()` | `ResponseInterface` |
| `statusCode()` | `int` |
| `type()` | `WebhookResponseType` |
| `body()` | `mixed` |
| `executionReference()` | `ExecutionReference|null` |
| `status()` | `ExecutionStatus|null` |

## `WebhookResponseType`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookResponseType
```

Enum cases:

| Case | Value |
| --- | --- |
| `None` | `none` |
| `Json` | `json` |
| `Text` | `text` |

## `WebhookTriggerer`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookTriggerer
```

Default implementation of `WebhookTriggererContract`.

### Methods

| Method | Returns |
| --- | --- |
| `trigger(Webhook $webhook, ?WebhookRequest $request = null)` | `WebhookResponse` |

## `WebhookResponseResolver`

Namespace:

```php
PhpN8n\Client\Webhooks\WebhookResponseResolver
```

Default implementation of `WebhookResponseResolverContract`.

### Methods

| Method | Returns |
| --- | --- |
| `resolve(ResponseInterface $response)` | `WebhookResponse` |

The resolver extracts execution references from `executionId`, `execution_id`, `executionReference.id`, or `execution.id` when the webhook response is JSON.
