import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Gaps from "../utils/gaps";

export default async (req: Request, res: Response) => {
    try {
        const data = await Gaps.get_user_infos(
            req.body.username,
            req.body.password,
            req.body.gapsId
        );
        return res.status(StatusCodes.OK).send(data);
    } catch (e) {
        console.log(e);
        return res.status(StatusCodes.UNAUTHORIZED).send({ id: -1 });
    }
};
