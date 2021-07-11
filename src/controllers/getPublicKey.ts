import { Request, Response } from "express";
import { RsaManager } from "../utils/rsaUtils";

export default async (req: Request, res: Response) => {
    let rsa = RsaManager.getInstance();
    res.status(200).send({ publicKey: rsa.publicKey });
};
