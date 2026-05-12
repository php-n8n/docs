# php-n8n Documentation Site

This repository contains the VitePress documentation site for `php-n8n/client`.

It is only for the documentation website. Client package installation and usage are documented inside the site.

## Install

```bash
npm install
```

## Development

Start the local docs server:

```bash
npm run docs:dev
```

Open the URL printed by VitePress, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run docs:build
```

The static site is generated in:

```text
.vitepress/dist
```

## Preview Production Build

```bash
npm run docs:preview
```
