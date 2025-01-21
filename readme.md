# Swagger Codegen Helper

## Description

This is a helper for initializing a request to the Swagger Codegen Server.

## Prerequisites

Remote Mode: Requires the `swagger-code-server` to be running.
Local Mode:

-   Node.js
-   JDK 17

## Run

1. Run `npm install`
2. Run `npm run start`

### Run with npx

```bash
npx swagger-codegen-helper lang=typescript-fetch swaggerUrl=https://petstore3.swagger.io/api/v3/openapi.json swaggerVersion=3

npx swagger-codegen-helper lang=typescript-fetch swaggerJson=v2.json swaggerVersion=2 server=http://localhost:8787/generate-code
```

Specify the language, swaggerJson file, and the server URL(optional).
[Supported parameters](/src/commandMapping.ts)

Extra Parameters:

-   swaggerUrl: URL to the swagger file
-   swaggerJson: Path to the swagger file
-   swaggerVersion: Version of the swagger file
-   server(Remote Mode): URL to the swagger codegen server

## References

[swagger-codegen](https://github.com/swagger-api/swagger-codegen)

## License

MIT
