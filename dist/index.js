#!/usr/bin/env node
import process from "process";
import axios from "axios";
import fs from "fs";
import child_process from "child_process";
import { commandMapping } from "./commandMapping.js";
function main() {
    const args = process.argv.slice(2);
    console.log(args);
    // 发起请求到后端的 swagger-codegen API
    const bodyObj = { swaggerJson: "" };
    args.forEach((arg) => {
        const [key, value] = arg.split("=");
        bodyObj[key] = value;
    });
    if (Object.keys(bodyObj).length === 0) {
        console.error("缺少参数。支持的参数有：");
        console.table(commandMapping);
        console.error("以【node index.js key1=value1 key2=value2】的形式传入");
        console.log("参考Readme.md");
        throw new Error("No parameters provided");
    }
    if (bodyObj.swaggerJson) {
        if (fs.existsSync(bodyObj.swaggerJson)) {
            bodyObj.swaggerJson = fs.readFileSync(bodyObj.swaggerJson, "utf-8");
            console.log("Swagger JSON file loaded");
        }
    }
    if (!bodyObj["output"]) {
        bodyObj["output"] = bodyObj["lang"] || "output";
    }
    if (bodyObj["server"]) {
        return useRemote(bodyObj);
    }
    else {
        return useLocal(bodyObj);
    }
}
function useRemote(bodyObj) {
    const swaggerCodegenAPI = bodyObj["server"];
    if (!swaggerCodegenAPI)
        return console.error("缺少 server 参数");
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
        }
        else {
            console.error("Unexpected response status:", response.status);
        }
    })
        .catch((error) => {
        if (error.response) {
            // 如果响应中包含错误码（> 399），处理失败
            if (error.response.status > 399) {
                console.error(`Error: ${error.response.status} - ${error.response.data}`);
            }
        }
        else {
            // 如果请求本身失败（例如网络问题），处理网络错误
            console.error("Request failed:", error.message);
        }
    });
}
function useLocal(bodyObj) {
    const { swaggerVersion, swaggerJson, swaggerUrl, ...args } = bodyObj;
    const javaCommand = /3/.test(String(swaggerVersion))
        ? "java -jar ./jar/swagger-codegen-cli-v3.jar"
        : "java -jar ./jar/swagger-codegen-cli-v2.jar";
    // 生成命令
    const paramArr = [];
    commandMapping.forEach((item) => {
        const value = bodyObj[item.key];
        if (value) {
            paramArr.push(`${item.args} ${value}`);
        }
    });
    let command = `${javaCommand} generate`;
    if (swaggerJson) {
        command += ` -i ${swaggerJson}`;
    }
    else if (swaggerUrl) {
        command += ` -i ${swaggerUrl}`;
    }
    command += " " + paramArr.join(" ");
    console.log(command);
    //执行命令，inherit
    child_process.spawnSync(command, { stdio: "inherit", shell: true });
}
process.on("uncaughtException", (err) => {
    console.error(err);
});
main();
