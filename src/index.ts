#!/usr/bin/env node
import os from "os";
import process from "process";
import axios from "axios";
import fs from "fs";
import child_process from "child_process";
import { commandMapping } from "./commandMapping.js";
import { t, locale } from "./locales/index.js";

import type { bodyObjLike } from "./type.js";

function main() {
    const args = process.argv.slice(2);
    console.log(args);
    // 发起请求到后端的 swagger-codegen API
    const bodyObj: bodyObjLike = { swaggerJson: "" };
    args.forEach((arg) => {
        const [key, value] = arg.split("=");
        bodyObj[key] = value;
    });
    if (Object.keys(bodyObj).length === 0) {
        console.error(t("missingParams"));
        console.table(commandMapping);
        console.error(t("provideParams"));
        console.log(t("referReadme"));
        throw new Error("No parameters provided");
    }
    if (!bodyObj["output"]) {
        bodyObj["output"] = bodyObj["lang"] || "output";
    }
    if (bodyObj["server"]) {
        return useRemote(bodyObj);
    } else {
        return useLocal(bodyObj);
    }
}

function useRemote(bodyObj: bodyObjLike) {
    const swaggerCodegenAPI = bodyObj["server"];
    if (bodyObj.swaggerJson) {
        if (fs.existsSync(bodyObj.swaggerJson)) {
            bodyObj.swaggerJson = fs.readFileSync(bodyObj.swaggerJson, "utf-8");
            console.log(t("jsonFileLoaded"));
        }
    }
    if (!swaggerCodegenAPI) return console.error(t("noServerParam"));
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
                console.log(`${t("generatedCodeSaved")} ${zipFileName}`);
            } else {
                console.error(t("unexpectedResponse"), response.status);
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
                console.error(t("requestFailed"), error.message);
            }
        });
}

async function useLocal(bodyObj: bodyObjLike) {
    const { swaggerVersion, swaggerJson, swaggerUrl, ...args } = bodyObj;
    const fileArr = [
        {
            version: "2",
            file: "swagger-codegen-cli-v2.jar",
            urlCN: "https://maven.aliyun.com/repository/public/io/swagger/swagger-codegen-cli/2.4.44/swagger-codegen-cli-2.4.44.jar",
            urlEN: "https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.44/swagger-codegen-cli-2.4.44.jar",
        },
        {
            version: "3",
            file: "swagger-codegen-cli-v3.jar",
            urlCN: "https://maven.aliyun.com/repository/public/io/swagger/codegen/v3/swagger-codegen-cli/3.0.66/swagger-codegen-cli-3.0.66.jar",
            urlEN: "https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.66/swagger-codegen-cli-3.0.66.jar",
        },
    ];
    //使用系统临时文件夹，并检查权限。如果不行，就放在当前目录的jar文件夹下
    const tempDir = os.tmpdir();
    let finalJarDir;
    try {
        fs.accessSync(tempDir, fs.constants.W_OK);
        finalJarDir = tempDir + "/swagger-codegen-helper/jar";
    } catch (e) {
        console.error(t("cannotCreateFile"));
        finalJarDir = "./jar";
    }
    if (!fs.existsSync(finalJarDir)) fs.mkdirSync(finalJarDir, { recursive: true });
    for (const item of fileArr) {
        if (!fs.existsSync(finalJarDir + `/${item.file}`)) {
            console.log(t("initializing"));
            console.log(`${t("downloading")} ${item.file}...`);
            const writer = fs.createWriteStream(finalJarDir + `/${item.file}`);
            const url = /en/i.test(String(locale)) ? item.urlEN : item.urlCN;
            const response = await axios({
                url,
                method: "GET",
                responseType: "stream",
            });
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
        }
    }
    const javaCommand = /3/.test(String(swaggerVersion))
        ? "java -jar ./jar/swagger-codegen-cli-v3.jar"
        : "java -jar ./jar/swagger-codegen-cli-v2.jar";
    // 生成命令
    const paramArr: string[] = [];
    commandMapping.forEach((item) => {
        const value = bodyObj[item.key];
        if (value) {
            paramArr.push(`${item.args} ${value}`);
        }
    });

    let command = `${javaCommand} generate`;
    if (swaggerJson) {
        command += ` -i ${swaggerJson}`;
    } else if (swaggerUrl) {
        command += ` -i ${swaggerUrl}`;
    }
    command += " " + paramArr.join(" ");
    console.log(command);
    //执行前检查是否有java运行环境
    try {
        child_process.execSync("java -version", { stdio: "ignore" });
    } catch (e) {
        console.error(t("noJavaEnv"));
        return;
    }
    //执行命令，inherit
    child_process.spawnSync(command, { stdio: "inherit", shell: true });
}

process.on("uncaughtException", (err) => {
    console.error(t("uncaughtException"), err);
});

main();
