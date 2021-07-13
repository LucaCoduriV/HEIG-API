export const browserOptions = () => {
    const options: any = {
        headless: true, //`${process.env.NODE_ENV}` == "production",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    if (process.env.CHROME_PATH) options["executablePath"] = `${process.env.CHROME_PATH}`;
    console.log(options);
    return options;
};
