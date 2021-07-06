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
        rows.forEach((row, index) => {
            for (let i = 0; i < row.childElementCount; i++) {
                console.log(row.children[i].querySelector(".teaching")?.innerHTML);
                console.log(row.children[i].getAttribute("rowspan"));
            }
        });
    });

    res.send("coucou");
};
