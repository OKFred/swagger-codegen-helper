# Swagger Codegen Helper

## 描述

发送请求到 Swagger Codegen，并生成API代码。

## 先决条件

本地模式：

-   [Node.js 最新版](https://nodejs.org/download/release/latest/)
-   [OpenJDK 17](https://openjdk.org/projects/jdk/17/)

远程模式：

-   swagger-code-server (npm)

## 运行

1. 运行 `npm install`
2. 运行 `npm run start`
3. 运行 `npm run test:v2` 或 `npm run test:v3`

### 使用 npx 运行（推荐）

```bash
npx swagger-codegen-helper lang=typescript-fetch swaggerUrl=https://petstore3.swagger.io/api/v3/openapi.json swaggerVersion=3
npx swagger-codegen-helper lang=typescript-fetch swaggerJson=v2.json swaggerVersion=2 server=http://localhost:8787/generate-code
```

#### 说明

[支持的参数](/src/commandMapping.ts)

重要的参数：

-   swaggerUrl: swagger 文件的 URL，比如 https://petstore3.swagger.io/api/v3/openapi.json
-   swaggerJson: swagger 文件的路径，比如 ./v2.json
-   swaggerVersion: swagger 文件的版本，2 或 3
-   lang: 生成的代码的语言，比如 typescript-fetch、javascript、python、java 等等
-   server（远程模式）（可选）：swagger codegen 服务器的 URL

## 高级

[高级生成器配置](https://github.com/swagger-api/swagger-codegen/blob/master/docs/generators.md)


## 参考

[swagger-codegen](https://github.com/swagger-api/swagger-codegen)

## 许可证

MIT
