import { Request, Response } from "express";
import Gaps from "../utils/gaps";

enum Trimestre {
    ETE = 1,
    UN,
    DEUX,
}

export default async (req: Request, res: Response) => {
    let annee: number = 2020;
    let trimestre: Trimestre = Trimestre.DEUX;
    let type: number = 2; // 2 pour horaire étudiant
    const gapsId = req.body.gapsId;

    const username: string = req.body.username as string;
    const password: string = req.body.password as string;

    const gaps = new Gaps();
    try {
        const resultats = await gaps.get_horaires(
            username,
            password,
            annee,
            trimestre,
            gapsId,
            type
        );
        return res.send(resultats);
    } catch (e) {
        return res.status(500).send(e.message);
    }
};
