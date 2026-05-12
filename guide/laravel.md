---
title: Laravel Usage
description: Use php-n8n/client in Laravel by binding PSR dependencies and N8nClient in a service provider.
---

# Laravel Usage

There is no Laravel-specific package required to use `php-n8n/client`.

The client is framework agnostic, so Laravel only needs to provide the PSR dependencies and bind `N8nClient` in the container.

The examples below avoid facades, runtime helper functions, and invokable controllers. Dependencies are resolved through Laravel's container and passed through constructors or method injection.

## Install

```bash
composer require php-n8n/client guzzlehttp/guzzle nyholm/psr7
```

## Environment

```dotenv
N8N_API_URL=https://n8n.example.com/api/v1
N8N_API_KEY=your-api-key
N8N_ORDER_CREATED_WEBHOOK=https://n8n.example.com/webhook/order-created
```

`N8N_API_URL` and `N8N_API_KEY` are only needed for execution tracking. Webhook triggering only needs the webhook URL.

## Configuration

Expose these values through your Laravel configuration:

| Config key | Purpose |
| --- | --- |
| `services.n8n.api_url` | n8n API base URI, for execution tracking. |
| `services.n8n.api_key` | n8n API key, for execution tracking. |
| `services.n8n.webhooks.order_created` | n8n webhook URL for the order-created workflow. |

For example, your `config/services.php` may contain:

```php
'n8n' => [
    'api_url' => env('N8N_API_URL'),
    'api_key' => env('N8N_API_KEY'),
    'webhooks' => [
        'order_created' => env('N8N_ORDER_CREATED_WEBHOOK'),
    ],
],
```

Runtime application code should read these values through `Illuminate\Contracts\Config\Repository`, not through the `config()` helper.

## Service Provider

Create a provider such as `app/Providers/N8nServiceProvider.php`.

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\ServiceProvider;
use Nyholm\Psr7\Factory\Psr17Factory;
use PhpN8n\Client\Config\ApiConfig;
use PhpN8n\Client\N8nClient;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;

final class N8nServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Psr17Factory::class);

        $this->app->singleton(ClientInterface::class, static fn (): ClientInterface => new GuzzleClient([
            'timeout' => 10,
            'connect_timeout' => 5,
        ]));

        $this->app->singleton(
            RequestFactoryInterface::class,
            static fn (Container $app): RequestFactoryInterface => $app->make(Psr17Factory::class),
        );

        $this->app->singleton(
            StreamFactoryInterface::class,
            static fn (Container $app): StreamFactoryInterface => $app->make(Psr17Factory::class),
        );

        $this->app->singleton(N8nClient::class, function (Container $app): N8nClient {
            $config = $app->make(ConfigRepository::class);
            $psr17 = $app->make(Psr17Factory::class);
            $apiUrl = $config->get('services.n8n.api_url');
            $apiKey = $config->get('services.n8n.api_key');

            return new N8nClient(
                httpClient: $app->make(ClientInterface::class),
                requestFactory: $app->make(RequestFactoryInterface::class),
                streamFactory: $app->make(StreamFactoryInterface::class),
                apiConfig: $this->apiConfig($psr17, $apiUrl, $apiKey),
            );
        });
    }

    private function apiConfig(Psr17Factory $psr17, mixed $apiUrl, mixed $apiKey): ?ApiConfig
    {
        if (! is_string($apiUrl) || $apiUrl === '') {
            return null;
        }

        return new ApiConfig(
            apiUri: $psr17->createUri($apiUrl),
            apiKey: is_string($apiKey) && $apiKey !== '' ? $apiKey : null,
        );
    }
}
```

Register the provider using the provider registration style for your Laravel version.

## Trigger A Webhook From A Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Jobs\TrackN8nExecutionJob;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Nyholm\Psr7\Factory\Psr17Factory;
use PhpN8n\Client\N8nClient;
use PhpN8n\Client\Webhooks\Webhook;
use PhpN8n\Client\Webhooks\WebhookRequest;
use RuntimeException;

final class OrderWorkflowController
{
    public function __construct(
        private readonly N8nClient $n8n,
        private readonly Psr17Factory $psr17,
        private readonly ConfigRepository $config,
        private readonly ResponseFactory $responses,
        private readonly Dispatcher $bus,
    ) {
    }

    public function store(Request $request): JsonResponse
    {
        $orderId = (string) $request->input('order_id');

        $response = $this->n8n->webhooks()->trigger(
            Webhook::fromUri($this->psr17->createUri($this->webhookUrl('order_created'))),
            WebhookRequest::json([
                'orderId' => $orderId,
                'total' => 129.50,
            ]),
        );

        $reference = $response->executionReference();

        if ($reference !== null) {
            $this->bus->dispatch(new TrackN8nExecutionJob($reference->id(), $orderId));
        }

        return $this->responses->json([
            'statusCode' => $response->statusCode(),
            'executionId' => $reference?->id(),
        ], 202);
    }

    private function webhookUrl(string $name): string
    {
        $value = $this->config->get("services.n8n.webhooks.{$name}");

        if (! is_string($value) || $value === '') {
            throw new RuntimeException("n8n webhook [{$name}] is not configured.");
        }

        return $value;
    }
}
```

`TrackN8nExecutionJob` is shown below. In a real application, import it from your `App\Jobs` namespace.

## Track Execution In A Queued Job

If the webhook response contains an execution reference, a queued job is a good place to poll n8n without blocking the HTTP request.

This example uses an application-level `N8nExecutionStore` contract. It is not provided by `php-n8n/client`; it represents your own persistence layer.

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Contracts\N8nExecutionStore;
use Illuminate\Contracts\Queue\ShouldQueue;
use PhpN8n\Client\Config\ExecutionFetchOptions;
use PhpN8n\Client\Config\PollingConfig;
use PhpN8n\Client\Exceptions\ExecutionTimeoutException;
use PhpN8n\Client\Executions\ExecutionReference;
use PhpN8n\Client\N8nClient;

final class TrackN8nExecutionJob implements ShouldQueue
{
    public function __construct(
        private readonly string $executionId,
        private readonly string $orderId,
    ) {
    }

    public function handle(N8nClient $n8n, N8nExecutionStore $executions): void
    {
        $reference = ExecutionReference::fromId($this->executionId);

        $executions->markTrackingStarted($this->orderId, $reference->id());

        try {
            $result = $n8n->execution($reference)->wait(new PollingConfig(
                timeoutSeconds: 120,
                intervalMilliseconds: 2000,
                fetchOptions: ExecutionFetchOptions::withData(),
            ));
        } catch (ExecutionTimeoutException $exception) {
            $executions->markTimedOut($this->orderId, $reference->id());

            throw $exception;
        }

        if ($result->status()->isSuccessful()) {
            $executions->markSucceeded($this->orderId, $result);

            return;
        }

        $executions->markFailed($this->orderId, $result);
    }
}
```

## Fetch Status Without Long Polling

If you do not want a queue worker to wait inside one job, dispatch short jobs that fetch the latest status once and reschedule from your own application logic.

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Contracts\N8nExecutionStore;
use Illuminate\Contracts\Queue\ShouldQueue;
use PhpN8n\Client\Config\ExecutionFetchOptions;
use PhpN8n\Client\Executions\ExecutionReference;
use PhpN8n\Client\N8nClient;

final class RefreshN8nExecutionStatusJob implements ShouldQueue
{
    public function __construct(private readonly string $executionId)
    {
    }

    public function handle(N8nClient $n8n, N8nExecutionStore $executions): void
    {
        $result = $n8n->executions()->get(
            ExecutionReference::fromId($this->executionId),
            ExecutionFetchOptions::default(),
        );

        $executions->syncStatus($result);
    }
}
```

## Persistence Is Your Responsibility

`php-n8n/client` does not persist execution history, workflow status, webhook payloads, or audit records.

That is intentional. Persistence requirements vary by application.

If your application needs history, create your own table and repository for values such as:

| Field | Purpose |
| --- | --- |
| `execution_id` | n8n execution ID returned by the webhook or API. |
| `workflow_name` | Your application label for the workflow. |
| `related_model_type` and `related_model_id` | Optional link to an order, user, invoice, or other model. |
| `status` | Last known `ExecutionStatus` value. |
| `raw_status` | Original n8n status string. |
| `started_at`, `stopped_at`, `wait_till` | Timestamps returned by n8n when available. |
| `payload` | Optional execution data if you fetch it. |

The client gives you typed execution data. Your application decides what to store, how long to keep it, and who can access it.

## Why This Setup Works

Laravel resolves the same PSR interfaces that the client expects. No Laravel-specific adapter is needed.

If a dedicated Laravel package is added later, it can wrap this setup with configuration publishing and auto-registration while keeping the core client unchanged.
