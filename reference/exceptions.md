---
title: Exceptions
description: Reference for package exceptions thrown by php-n8n/client.
---

# Exceptions

## `N8nException`

Namespace:

```php
PhpN8n\Client\Exceptions\N8nException
```

Base package exception. Extends `RuntimeException`.

## `RequestException`

Namespace:

```php
PhpN8n\Client\Exceptions\RequestException
```

Used for failed HTTP requests and invalid n8n API responses. Extends `N8nException`.

### Constructor

```php
public function __construct(
    string $message,
    ?ResponseInterface $response = null,
    ?Throwable $previous = null,
)
```

### Methods

| Method | Returns |
| --- | --- |
| `response()` | `ResponseInterface|null` |

## `AuthenticationException`

Namespace:

```php
PhpN8n\Client\Exceptions\AuthenticationException
```

Used when n8n returns HTTP `401`. Extends `RequestException`.

## `ExecutionTimeoutException`

Namespace:

```php
PhpN8n\Client\Exceptions\ExecutionTimeoutException
```

Used when execution polling exceeds the configured timeout. Extends `N8nException`.

### Methods

| Method | Returns |
| --- | --- |
| `reference()` | `ExecutionReference` |

## `InvalidWebhookResponseException`

Namespace:

```php
PhpN8n\Client\Exceptions\InvalidWebhookResponseException
```

Used when a webhook response has a JSON content type but the body is invalid JSON. Extends `N8nException`.

## Validation Exceptions

Some local validation failures throw PHP's `InvalidArgumentException`, for example invalid webhook URLs, unsupported webhook methods, empty execution IDs, and invalid polling values.
