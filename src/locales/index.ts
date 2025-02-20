import lang from "./lang.js";

const locale = (
    process.env.LANG ||
    process.env.LANGUAGE ||
    process.env.LC_ALL ||
    process.env.LC_MESSAGES
)
    ?.split(".")[0]
    .includes("zh")
    ? "zh-CN"
    : "en-US";

const t = (key: keyof (typeof lang)["zh-CN"] | keyof (typeof lang)["en-US"]) =>
    (lang[locale] as Record<string, string>)[key];
console.log(t("currentLocale"), locale);
export { locale, t };
export default t;
