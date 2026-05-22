---
title: PHP n8n Client Documentation
description: Documentation for php-n8n/client, a PHP n8n client for triggering n8n webhooks and tracking workflow executions with PSR-7, PSR-17, and PSR-18.
layout: home
hero:
  text: 'php-n8n/client: typed PHP client for n8n webhooks'
  tagline: Documentation for php-n8n/client, the PSR-based PHP n8n client for webhooks and execution tracking.
  image:
    src: /php-n8n-logo.png
    alt: PHP n8n Client
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Class Reference
      link: /reference/
    - theme: alt
      text: Version v1
      link: /versions
    - theme: alt
      text: Star on GitHub
      link: https://github.com/php-n8n/client
features:
  - title: Small Runtime Surface
    details: The client depends on PSR interfaces only. Choose the PSR-18 HTTP client and PSR-17 factories already used by your application.
  - title: Strongly Typed PHP
    details: Public behavior is exposed through explicit classes, enums, contracts, and immutable value objects.
  - title: Framework Agnostic
    details: Use it in plain PHP, Laravel, Symfony, workers, CLIs, or any PHP application that can provide PSR implementations.
  - title: Focused on n8n Webhooks
    details: The package triggers n8n webhooks, reads webhook responses, and tracks workflow executions. It is not a full n8n SDK.
---

<div class="github-star-wrap">
  <a class="github-star-button" href="https://github.com/php-n8n/client" target="_blank" rel="noreferrer">
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.969.719 4.193a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.211-.611L7.327.668A.75.75 0 0 1 8 .25Z" /></svg>
    <span>Star php-n8n/client on GitHub</span>
  </a>
</div>

## What Is php-n8n/client?

`php-n8n/client` is a lightweight PHP library for applications that need to trigger n8n workflows through webhooks and optionally track executions through the n8n API.

It is the package behind searches such as `php-n8n`, `php n8n`, `php-n8n client`, `php n8n client`, `php-n8n-client`, and `n8n PHP client`.

It is designed around standards rather than framework integrations. The runtime dependencies are PSR interfaces:

| Dependency | Purpose |
| --- | --- |
| `psr/http-client` | Sends PSR-7 requests through a PSR-18 client. |
| `psr/http-factory` | Creates PSR-7 requests and streams. |
| `psr/http-message` | Represents requests, responses, streams, and URIs. |

You install concrete implementations yourself, for example Guzzle for PSR-18 and Nyholm PSR-7 for PSR-17/PSR-7.

```bash
composer require php-n8n/client guzzlehttp/guzzle nyholm/psr7
```

## Minimal Example

```php
<?php

declare(strict_types=1);

use GuzzleHttp\Client as GuzzleClient;
use Nyholm\Psr7\Factory\Psr17Factory;
use PhpN8n\Client\N8nClient;
use PhpN8n\Client\Webhooks\Webhook;
use PhpN8n\Client\Webhooks\WebhookRequest;

$psr17 = new Psr17Factory();

$client = new N8nClient(
    httpClient: new GuzzleClient(),
    requestFactory: $psr17,
    streamFactory: $psr17,
);

$response = $client->webhooks()->trigger(
    Webhook::fromUri($psr17->createUri('https://n8n.example.com/webhook/order-created')),
    WebhookRequest::json([
        'orderId' => 'ORD-1001',
        'total' => 129.50,
    ]),
);

$body = $response->body();
```

## Next Steps

- Start with [Getting Started](/guide/getting-started) for installation and the first webhook call.
- Read [Webhooks](/guide/webhooks) for request bodies, headers, query parameters, and responses.
- Read [Execution Tracking](/guide/execution-tracking) if you need to poll n8n workflow executions.
- Read [Laravel Usage](/guide/laravel) for a practical service-provider setup.
