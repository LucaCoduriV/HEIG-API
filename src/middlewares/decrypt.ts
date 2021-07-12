import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { RsaManager } from "../utils/rsaUtils";

export default (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    console.log(req.query.decrypt);
    if (req.query?.decrypt == "true") {
        const encryptedPassword: string = req.body.password as string;
        req.body.password = RsaManager.getInstance().decrypt(encryptedPassword);
        console.log(req.body.password);
        return next();
    }

    return next();
};
