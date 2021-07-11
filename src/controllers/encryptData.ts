import { Request, Response } from "express";
import { RsaManager } from "../utils/rsaUtils";

export default async (req: Request, res: Response) => {
    const password: string = req.query.password as string;
    let rsa = RsaManager.getInstance();
    let data: any = {
        encrypted: rsa.encrypt(password),
    };
    console.log(data);
    res.status(200).send(data);
};
