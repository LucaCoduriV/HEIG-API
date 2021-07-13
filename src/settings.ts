export const browserOptions = () => {
    const options: any = {
        headless: process.env.NODE_ENV == "production",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    if (process.env.CHROME_PATH) options["executablePath"] = process.env.CHROME_PATH;
    return options;
};
