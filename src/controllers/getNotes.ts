import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import Gaps from "../utils/gaps";

export default async (req: Request, res: Response) => {
    try {
        const response = await Gaps.get_notes(
            req.body.username,
            req.body.password,
            req.body.gapsId,
            req.body.year ?? 2020
        );
        console.log(response?.length);
        console.log(req.body.year);
        return res.status(StatusCodes.OK).send(response);
    } catch (e) {
        console.log(e);
        return res.status(StatusCodes.UNAUTHORIZED).send({ gapsId: -1 });
    }
};
