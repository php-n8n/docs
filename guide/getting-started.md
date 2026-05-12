---
title: Getting Started
description: Install php-n8n/client and trigger your first n8n webhook from PHP.
---

# Getting Started

`php-n8n/client` is a strongly typed PHP client for triggering n8n webhooks and tracking workflow executions.

The package requires PHP `>=8.2` and uses PSR interfaces for HTTP. It does not force a specific HTTP client, PSR-7 implementation, or framework.

## Install

Install the client and the PSR implementations you want to use:

```bash
composer require php-n8n/client guzzlehttp/guzzle nyholm/psr7
```

This example uses:

| Package | Role |
| --- | --- |
| `php-n8n/client` | The n8n client package. |
| `guzzlehttp/guzzle` | PSR-18 HTTP client. |
| `nyholm/psr7` | PSR-7 messages and PSR-17 factories. |

You can use other PSR-compatible packages if they implement the same interfaces.

## Create A Client

```php
<?php

declare(strict_types=1);

use GuzzleHttp\Client as GuzzleClient;
use Nyholm\Psr7\Factory\Psr17Factory;
use PhpN8n\Client\N8nClient;

$psr17 = new Psr17Factory();

$client = new N8nClient(
    httpClient: new GuzzleClient(),
    requestFactory: $psr17,
    streamFactory: $psr17,
);
```

The constructor accepts PSR interfaces:

| Argument | Interface |
| --- | --- |
| `httpClient` | `Psr\Http\Client\ClientInterface` |
| `requestFactory` | `Psr\Http\Message\RequestFactoryInterface` |
| `streamFactory` | `Psr\Http\Message\StreamFactoryInterface` |

## Trigger A Webhook

```php
use PhpN8n\Client\Webhooks\Webhook;
use PhpN8n\Client\Webhooks\WebhookRequest;

$response = $client->webhooks()->trigger(
    Webhook::fromUri($psr17->createUri('https://n8n.example.com/webhook/order-created')),
    WebhookRequest::json([
        'orderId' => 'ORD-1001',
        'total' => 129.50,
    ]),
);

if ($response->executionReference() !== null) {
    $executionId = $response->executionReference()->id();
}
```

Webhook URLs must be absolute `http` or `https` URLs with a host.

## Enable Execution Tracking

Execution tracking uses the n8n API. It requires an API base URI and usually an API key.

```php
use PhpN8n\Client\Config\ApiConfig;
use PhpN8n\Client\Config\ExecutionFetchOptions;
use PhpN8n\Client\Config\PollingConfig;
use PhpN8n\Client\Executions\ExecutionReference;
use PhpN8n\Client\N8nClient;

$client = new N8nClient(
    httpClient: new GuzzleClient(),
    requestFactory: $psr17,
    streamFactory: $psr17,
    apiConfig: new ApiConfig(
        apiUri: $psr17->createUri('https://n8n.example.com/api/v1'),
        apiKey: $_ENV['N8N_API_KEY'],
    ),
);

$result = $client->executions()->wait(
    ExecutionReference::fromId('123'),
    new PollingConfig(
        timeoutSeconds: 60,
        intervalMilliseconds: 1000,
        fetchOptions: ExecutionFetchOptions::withData(),
    ),
);
```

If you only trigger webhooks and do not track executions, `apiConfig` is not needed.

## Recommended First Read

- [Why This Client](/guide/why-php-n8n-client)
- [Client Setup](/guide/client-setup)
- [Webhooks](/guide/webhooks)
- [Execution Tracking](/guide/execution-tracking)
