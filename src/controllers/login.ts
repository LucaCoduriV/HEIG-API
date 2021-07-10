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
        headless: false,
    });
    const page: Page = await browser.newPage();

    const username: string = req.query.username as string;
    const password: string = req.query.password as string;
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
