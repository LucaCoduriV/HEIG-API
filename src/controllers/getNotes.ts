import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import Gaps from "../utils/gaps";

export default async (req: Request, res: Response) => {
    const gaps = new Gaps();
    try {
        const response = await gaps.get_notes(
            req.body.username,
            req.body.password,
            req.body.gapsId,
            2020
        );
        return res.status(StatusCodes.OK).send(response);
    } catch (e) {
        console.log(e);
        return res.status(StatusCodes.UNAUTHORIZED).send({ gapsId: -1 });
    }
};
