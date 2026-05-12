---
title: Execution Classes
description: Reference for execution references, statuses, results, data, and the execution tracker.
---

# Execution Classes

## `ExecutionReference`

Namespace:

```php
PhpN8n\Client\Executions\ExecutionReference
```

Represents an n8n execution ID.

### Static Constructors

| Method | Returns |
| --- | --- |
| `fromId(int|string $id)` | `ExecutionReference` |

The ID is trimmed and cannot be empty.

### Methods

| Method | Returns |
| --- | --- |
| `id()` | `string` |
| `__toString()` | `string` |

## `ExecutionStatus`

Namespace:

```php
PhpN8n\Client\Executions\ExecutionStatus
```

Enum cases:

| Case | Value |
| --- | --- |
| `New` | `new` |
| `Running` | `running` |
| `Success` | `success` |
| `Failed` | `failed` |
| `Canceled` | `canceled` |
| `Waiting` | `waiting` |
| `Unknown` | `unknown` |

### Methods

| Method | Returns |
| --- | --- |
| `fromN8nStatus(?string $status)` | `ExecutionStatus` |
| `isTerminal()` | `bool` |
| `isSuccessful()` | `bool` |
| `isFailure()` | `bool` |

`Success`, `Failed`, and `Canceled` are terminal statuses.

## `ExecutionData`

Namespace:

```php
PhpN8n\Client\Executions\ExecutionData
```

Holds execution data returned by n8n when data is requested.

### Constructor

```php
public function __construct(
    mixed $payload = null,
    array $customData = [],
)
```

### Methods

| Method | Returns |
| --- | --- |
| `payload()` | `mixed` |
| `customData()` | `array<string, mixed>` |

## `ExecutionResult`

Namespace:

```php
PhpN8n\Client\Executions\ExecutionResult
```

Represents one mapped n8n execution response.

### Constructor

```php
public function __construct(
    ExecutionReference $reference,
    ExecutionStatus $status,
    ?string $rawStatus = null,
    bool $finished = false,
    ?string $mode = null,
    ?string $workflowId = null,
    ?DateTimeImmutable $startedAt = null,
    ?DateTimeImmutable $stoppedAt = null,
    ?DateTimeImmutable $waitTill = null,
    ?ExecutionData $data = null,
)
```

### Static Constructors

| Method | Returns |
| --- | --- |
| `fromN8nPayload(array $payload)` | `ExecutionResult` |

`fromN8nPayload()` requires a valid `id` field. Missing or invalid IDs throw `RequestException`.

### Methods

| Method | Returns |
| --- | --- |
| `reference()` | `ExecutionReference` |
| `status()` | `ExecutionStatus` |
| `rawStatus()` | `string|null` |
| `finished()` | `bool` |
| `mode()` | `string|null` |
| `workflowId()` | `string|null` |
| `startedAt()` | `DateTimeImmutable|null` |
| `stoppedAt()` | `DateTimeImmutable|null` |
| `waitTill()` | `DateTimeImmutable|null` |
| `data()` | `ExecutionData|null` |

## `ExecutionTracker`

Namespace:

```php
PhpN8n\Client\Executions\ExecutionTracker
```

Default implementation of `ExecutionTrackerContract`.

### Methods

| Method | Returns |
| --- | --- |
| `get(ExecutionReference $reference, ?ExecutionFetchOptions $options = null)` | `ExecutionResult` |
| `wait(ExecutionReference $reference, ?PollingConfig $polling = null)` | `ExecutionResult` |

`get()` calls the n8n execution endpoint once. `wait()` repeatedly calls `get()` until the status is terminal or the polling timeout is reached.
