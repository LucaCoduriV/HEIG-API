import { Page } from "puppeteer";
const { PendingXHR } = require("pending-xhr-puppeteer");

export default async (page: Page, username: string, password: string): Promise<boolean> => {
    // Va a la page de connexion
    await page.goto(process.env.GAPS_LOGIN_URL, { waitUntil: "networkidle0" });

    // On remplit username/password pour se connecter

    await page.type("#ident", username);
    await page.type("#mdp", password);
    await page.click(".bouton");
    await Promise.race([page.waitForSelector("#menu_root"), page.waitForSelector(".fauxLogin")]);

    let isConnected: boolean = (await page.$(".fauxLogin")) == null;
    return isConnected;
};
