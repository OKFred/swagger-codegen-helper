import lang from "./lang.js";
const locale = (process.env.LANG ||
    process.env.LANGUAGE ||
    process.env.LC_ALL ||
    process.env.LC_MESSAGES)
    ?.split(".")[0]
    .includes("zh")
    ? "zh-CN"
    : "en-US";
const t = (key) => lang[locale][key];
console.log(t("currentLocale"), locale);
export { locale, t };
export default t;
