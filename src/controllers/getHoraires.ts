import { Request, Response } from "express";
import puppeteer, { Browser, Page } from "puppeteer";
import connectToGapps from "../utils/connectToGapps";

enum Trimestre {
    ETE = 1,
    UN,
    DEUX,
}

export default async (req: Request, res: Response) => {
    let annee: number = 2020;
    let trimestre: Trimestre = Trimestre.DEUX;
    let type: number = 2; // 2 pour horaire étudiant

    let url: string = `https://gaps.heig-vd.ch/consultation/horaires/?annee=${annee}&trimestre=${trimestre}&type=${type}}`;

    const browser: Browser = await puppeteer.launch({
        headless: false,
    });
    const page: Page = await browser.newPage();

    const username: string = process.env.HEIG_USERNAME;
    const password: string = process.env.HEIG_PASSWORD;

    await connectToGapps(page, username, password, url);

    await page.waitForSelector(".horaire");

    const resultats = await page.$$eval(".horaire tr", (rows) => {
        enum JourSemaine {
            LUNDI = 0,
            MARDI,
            MERCREDI,
            JEUDI,
            VENDREDI,
        }

        function getDayFromPos(position: number): JourSemaine {
            switch (position) {
                case 75:
                    return JourSemaine.LUNDI;
                case 223:
                    return JourSemaine.MARDI;
                case 371:
                    return JourSemaine.MERCREDI;
                case 519:
                    return JourSemaine.JEUDI;
                case 667:
                    return JourSemaine.VENDREDI;
                default:
                    return JourSemaine.LUNDI;
            }
        }

        let horaires: Array<HeureCours> = [];
        let count = 0;
        rows.forEach((row, index) => {
            for (let i = 0; i < row.childElementCount; i++) {
                if (row.children[i].querySelector(".teaching") != null) {
                    horaires.push({
                        nom: row.children[i].querySelector(".teaching").innerHTML,
                        debut: count++,
                        periodes: parseInt(row.children[i].getAttribute("rowspan")),
                        jour: getDayFromPos(row.children[i].getBoundingClientRect().left),
                        prof: row.children[i].querySelector(".teacherAcronym")?.innerHTML,
                        salle: row.children[i].querySelector("span a")?.innerHTML,
                    });
                }
            }
        });
        return horaires;
    });
    browser.close();
    res.send(resultats);
};
