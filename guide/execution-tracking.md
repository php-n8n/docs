---
title: Execution Tracking
description: Fetch and poll n8n workflow executions with ApiConfig, ExecutionReference, PollingConfig, and ExecutionResult.
---

# Execution Tracking

Execution tracking uses the n8n API. It is separate from webhook triggering and requires `ApiConfig`.

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

The client signs execution requests with `Accept: application/json`. When an API key is configured, it also sends `X-N8N-API-KEY`.

## Execution References

Execution references are strongly typed IDs.

```php
use PhpN8n\Client\Executions\ExecutionReference;

$reference = ExecutionReference::fromId('123');
```

Empty IDs throw `InvalidArgumentException`.

## Fetch One Execution

```php
use PhpN8n\Client\Config\ExecutionFetchOptions;

$result = $client->executions()->get(
    ExecutionReference::fromId('123'),
    ExecutionFetchOptions::withData(),
);
```

Fetch options are converted to n8n query parameters:

| Option | Query parameter |
| --- | --- |
| `includeData` | `includeData=true` or `includeData=false` |
| `redactExecutionData` | `redactExecutionData=true` or `redactExecutionData=false` when set |

Examples:

```php
ExecutionFetchOptions::default();
ExecutionFetchOptions::withData();
ExecutionFetchOptions::withData(redactExecutionData: true);
```

## Wait For Completion

`wait()` polls until the execution reaches a terminal status or times out.

```php
use PhpN8n\Client\Config\ExecutionFetchOptions;
use PhpN8n\Client\Config\PollingConfig;

$result = $client->executions()->wait(
    ExecutionReference::fromId('123'),
    new PollingConfig(
        timeoutSeconds: 60,
        intervalMilliseconds: 1000,
        fetchOptions: ExecutionFetchOptions::withData(),
    ),
);
```

`PollingConfig::default()` uses a 60 second timeout and a 1000 millisecond interval.

Timeout and interval values must be zero or greater. Negative values throw `InvalidArgumentException`.

## Single Execution Wrapper

The client can create an `Execution` helper for one reference.

```php
$execution = $client->execution(ExecutionReference::fromId('123'));

$latest = $execution->refresh();
$final = $execution->wait();
```

This is a convenience wrapper around the same execution tracker.

## Execution Results

`ExecutionResult` exposes typed accessors:

```php
$reference = $result->reference();
$status = $result->status();
$rawStatus = $result->rawStatus();
$finished = $result->finished();
$mode = $result->mode();
$workflowId = $result->workflowId();
$startedAt = $result->startedAt();
$stoppedAt = $result->stoppedAt();
$waitTill = $result->waitTill();
$data = $result->data();
```

When data is included, `ExecutionData` exposes:

```php
$payload = $result->data()?->payload();
$customData = $result->data()?->customData();
```

## Status Mapping

`ExecutionStatus::fromN8nStatus()` maps n8n status strings to a typed enum.

| n8n status | Client status |
| --- | --- |
| `new` | `ExecutionStatus::New` |
| `running` | `ExecutionStatus::Running` |
| `success` | `ExecutionStatus::Success` |
| `error`, `crashed`, `failed` | `ExecutionStatus::Failed` |
| `canceled` | `ExecutionStatus::Canceled` |
| `waiting` | `ExecutionStatus::Waiting` |
| Anything else | `ExecutionStatus::Unknown` |

Terminal statuses are `Success`, `Failed`, and `Canceled`.

```php
if ($result->status()->isSuccessful()) {
    // Workflow completed successfully.
}

if ($result->status()->isFailure()) {
    // Workflow failed or was canceled.
}
```

## Common Errors

| Situation | Exception |
| --- | --- |
| `executions()` called without `ApiConfig` | `N8nException` |
| n8n API returns `401` | `AuthenticationException` |
| n8n API returns another `4xx` or `5xx` | `RequestException` |
| n8n API response is not valid JSON | `RequestException` |
| Execution does not finish in time | `ExecutionTimeoutException` |
