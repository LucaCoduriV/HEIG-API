import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import puppeteer, { Browser, Page } from "puppeteer";
import connectToGapps from "../utils/connectToGapps";
import { browserOptions } from "../settings";
import Gaps from "../utils/gaps";

export default async (req: Request, res: Response) => {
    const gaps = new Gaps();

    try {
        return res
            .status(StatusCodes.OK)
            .send({ id: await gaps.set_credentials(req.body.username, req.body.password) });
    } catch (e) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ id: -1 });
    }
};
