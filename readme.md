# Swagger Codegen Helper

## Description

This is a helper for initializing a request to the Swagger Codegen Server.

## Prerequisites

Requires the `swagger-code-server` to be running.

## Run

1. Run `npm install`
2. Run `npm run start`

### Run with npx

```bash
npx swagger-codegen-helper lang=typescript-fetch swaggerJson=./swaggerApi.json server=http://localhost:8787/generate-code
```

Specify the language, swaggerJson file, and the server URL(optional).
[Supported parameters](/src/commandMapping.ts)

Extra Parameters: 
swaggerUrl: URL to the swagger file
swaggerJson: Path to the swagger file
swaggerVersion: Version of the swagger file
server: URL to the swagger codegen server

## License

MIT
