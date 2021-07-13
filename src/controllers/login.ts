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
    const browser: Browser = await puppeteer.launch({
        headless: true,
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page: Page = await browser.newPage();

    const username: string = req.body.username as string;
    const password: string = req.body.password as string;
    console.log(username, password);
    try {
        if (!(await connectToGapps(page, username, password)))
            throw Error("wrong username or passsword");
    } catch (e) {
        browser.close();
        return res.status(StatusCodes.UNAUTHORIZED).send({ error: e.message });
    }
    browser.close();
    return res.status(StatusCodes.OK).send();
};
