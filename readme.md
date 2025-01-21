# Swagger Codegen Helper

# [中文文档](./readme-zh_CN.md)

## Description

Send requests to Swagger Codegen, and get API codes in return.

## Prerequisites

Local Mode:

-   [Node.js latest](https://nodejs.org/download/release/latest/)
-   [OpenJDK 17](https://openjdk.org/projects/jdk/17/)

Remote Mode:

-   swagger-code-server (npm)

## Run

1. Run `npm install`
2. Run `npm run start`
3. Run `npm run test:v2` or `npm run test:v3`

### Run with npx

```bash
npx swagger-codegen-helper lang=typescript-fetch swaggerUrl=https://petstore3.swagger.io/api/v3/openapi.json swaggerVersion=3
npx swagger-codegen-helper lang=typescript-fetch swaggerJson=v2.json swaggerVersion=2 server=http://localhost:8787/generate-code
```

#### Explanation:

[Supported parameters](/src/commandMapping.ts)

Important Parameters:

-   swaggerUrl: URL to the swagger file, e.g. https://petstore3.swagger.io/api/v3/openapi.json
-   swaggerJson: Path to the swagger file, e.g. ./v2.json
-   swaggerVersion: Version of the swagger file, 2 or 3
-   lang: Language of the generated code, e.g. typescript-fetch, javascript, python, java, etc.
-   server (Remote Mode) (optional): URL to the swagger codegen server, e.g. http://localhost:8787/generate-code

## References

[swagger-codegen](https://github.com/swagger-api/swagger-codegen)

## License

MIT
