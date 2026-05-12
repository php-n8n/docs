---
title: Config Classes
description: Reference for ApiConfig, ExecutionFetchOptions, and PollingConfig.
---

# Config Classes

## `ApiConfig`

Namespace:

```php
PhpN8n\Client\Config\ApiConfig
```

Configures the n8n API base URI and optional API key for execution tracking.

### Constructor

```php
public function __construct(
    UriInterface $apiUri,
    ?string $apiKey = null,
)
```

The URI cannot be empty.

### Static Constructors

| Method | Returns |
| --- | --- |
| `fromUri(UriInterface $apiUri, ?string $apiKey = null)` | `ApiConfig` |

### Methods

| Method | Returns |
| --- | --- |
| `uri()` | `UriInterface` |
| `apiKey()` | `string|null` |

## `ExecutionFetchOptions`

Namespace:

```php
PhpN8n\Client\Config\ExecutionFetchOptions
```

Controls query parameters when fetching execution data from n8n.

### Constructor

```php
public function __construct(
    bool $includeData = false,
    ?bool $redactExecutionData = null,
)
```

### Static Constructors

| Method | Meaning |
| --- | --- |
| `default()` | Fetch execution metadata without execution data. |
| `withData(?bool $redactExecutionData = null)` | Include execution data and optionally control redaction. |

### Methods

| Method | Returns |
| --- | --- |
| `includeData()` | `bool` |
| `redactExecutionData()` | `bool|null` |
| `toQuery()` | `array<string, string>` |

`toQuery()` returns query parameters using the names expected by n8n.

## `PollingConfig`

Namespace:

```php
PhpN8n\Client\Config\PollingConfig
```

Controls execution polling behavior.

### Constructor

```php
public function __construct(
    int $timeoutSeconds = 60,
    int $intervalMilliseconds = 1000,
    ?ExecutionFetchOptions $fetchOptions = null,
)
```

`timeoutSeconds` and `intervalMilliseconds` must be zero or greater.

### Static Constructors

| Method | Returns |
| --- | --- |
| `default()` | `PollingConfig` |

### Methods

| Method | Returns |
| --- | --- |
| `timeoutSeconds()` | `int` |
| `intervalMilliseconds()` | `int` |
| `fetchOptions()` | `ExecutionFetchOptions` |
