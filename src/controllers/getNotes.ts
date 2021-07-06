import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import puppeteer, { Browser, Page } from "puppeteer";

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
  const username: string = process.env.HEIG_USERNAME;
  const password: string = process.env.HEIG_PASSWORD;

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
    let notes: Bulletin = {};
    let branche: string;
    let type: "cours" | "laboratoire";
    rows.forEach((row) => {
      switch (row.childElementCount) {
        case 1:
          branche = row.firstElementChild.textContent;
          const splitted = branche.split(" ");
          branche = splitted[0];
          console.log(branche);
          notes[branche] = {
            cours: [],
            laboratoire: [],
            moyenne: parseFloat(splitted[splitted.length - 1]),
          };
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
          notes[branche][type].push(grade);
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

  // Exemple d'objet contenant les notes
  res.send(resultats);
};
