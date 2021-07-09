import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import puppeteer, { Browser, Page } from "puppeteer";
import connectToGapps from "../utils/connectToGapps";

export default async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    ///GET PARAMETERE USER, SELECT * FROM SESSION WHERE USER = REQ.USER
    // si ya déjà une session ouverte
    // COOKIE SET -> LA SESSION
    const browser: Browser = await puppeteer.launch({
        headless: false,
    });
    const page: Page = await browser.newPage();

    const url: string = process.env.GAPS_GRADE_URL;
    const drop_down_value: string = "https://aai-logon.hes-so.ch/idp/shibboleth";
    const username: string = req.query.username as string;
    const password: string = req.query.password as string;

    await connectToGapps(page, username, password, url);

    await page.waitForSelector(".displayArray");

    // Se connecter avec nom d'utilisateur et mdp si cookie non valide
    // sauvegarder le cookie dans une table MYSQL avec les info de l'user -> https://stackoverflow.com/questions/11252704/mysql-delete-records-older-than-x-minutes
    // et supprimer X temps (il faut détérminer combien de temps dure la session gaps)
    // utiliser le cookie pour les requêtes -> en verifiant si l'user à recemment exécuté une requête et que le cookie se trouve dans notre tableau
    //   await page.evaluate(`(async () => {
    //     var table = document.getElementsByClassName("displayArray");
    //     console.log(table);
    //   })()`);
    //   const tr = await page.$eval(
    //     "table.displayArray > tbody",
    //     (el) => el.childNodes
    //   );
    const resultats = await page.$$eval(".displayArray tr", (rows) => {
        let notes: Array<Branche> = [];
        let nomBranche: string;
        let type: "cours" | "laboratoire";
        rows.forEach((row) => {
            switch (row.childElementCount) {
                case 1:
                    nomBranche = row.firstElementChild.textContent;
                    const splitted = nomBranche.split(" ");
                    nomBranche = splitted[0];
                    console.log(nomBranche);
                    notes.push({
                        nom: nomBranche,
                        cours: [],
                        laboratoire: [],
                        moyenne: parseFloat(splitted[splitted.length - 1]),
                    });
                    break;
                case 6:
                    const text: any = row.firstElementChild.textContent;

                    console.log(text);

                    if (text.includes("Cours")) {
                        type = "cours";
                    } else {
                        type = "laboratoire";
                    }
                    break;
                default:
                    const grade: any = row.lastElementChild.textContent;
                    console.log(type);
                    notes[notes.length - 1][type].push(grade);
            }
        });
        return notes;
    });
    console.log(resultats);
    /*
      les vérification suivante doivent être fait dans le <table>[0]
  
      if count(<td>) == 1 --> titre branche
      else if count(<td>) == 6 --> sous titre
      else <td> contient les notes
      */

    browser.close();
    res.send(resultats);
};
