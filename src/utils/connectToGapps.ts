import { Page } from "puppeteer";

export default async (page: Page, username: string, password: string, url: string) => {
    const drop_down_value: string = "https://aai-logon.hes-so.ch/idp/shibboleth";

    //Va a la page des notes
    await page.goto(url);
    await page.waitForSelector("#user_idp");
    //Si GAPSSESSION est vide c'est le formulaire de connexion qui devrait apparaître
    // on selectionne HES-SO (OUI la valeur c'est vraiment l'url de "drop_down_value")
    await page.select("#user_idp", drop_down_value);
    await page.click("#wayf_submit_button");
    //On attend que la navigation et que la page se load corréctement (sinon des erreurs peuvent survenir)
    await page.waitForNavigation();
    await page.waitForSelector("#username");
    // On remplit username/password pour se connecter

    await page.type("#username", username);
    await page.type("#password", password);
    await page.click(".aai_login_button");
};
