#!/usr/bin/env node
import process from "process";
import axios from "axios";
import fs from "fs";
import { commandMapping } from "./commandMapping.js";

function main() {
    const args = process.argv.slice(2);
    console.log(args);
    // 发起请求到后端的 swagger-codegen API
    const bodyObj: Record<string, unknown> = {};
    args.forEach((arg) => {
        const [key, value] = arg.split("=");
        bodyObj[key] = value;
    });
    const swaggerCodegenAPI = String(bodyObj["server"]) || "http://localhost:8787/generate-code"; // 后端 Swagger Codegen 的 API 地址
    if (Object.keys(bodyObj).length === 0) {
        console.error("缺少参数。支持的参数有：");
        console.table(commandMapping);
        console.error("以【node index.js key1=value1 key2=value2】的形式传入");
        console.log(
            "参考链接：https://github.com/swagger-api/swagger-codegen?tab=readme-ov-file#to-generate-a-sample-client-library",
        );
        throw new Error("No parameters provided");
    }
    axios
        .post(swaggerCodegenAPI, bodyObj, {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer", // 设置为下载文件（arraybuffer）响应类型
        })
        .then((response) => {
            if (response.status === 200) {
                // 如果返回的是 ZIP 文件（成功），保存文件
                const zipFileName = "swagger-codegen.zip";
                fs.writeFileSync(zipFileName, response.data);
                console.log(`Generated code saved to ${zipFileName}`);
            } else {
                console.error("Unexpected response status:", response.status);
            }
        })
        .catch((error) => {
            if (error.response) {
                // 如果响应中包含错误码（> 399），处理失败
                if (error.response.status > 399) {
                    console.error(`Error: ${error.response.status} - ${error.response.data}`);
                }
            } else {
                // 如果请求本身失败（例如网络问题），处理网络错误
                console.error("Request failed:", error.message);
            }
        });
}

process.on("uncaughtException", (err) => {
    console.error(err);
});

main();
