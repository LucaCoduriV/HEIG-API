import { Request, Response } from "express";

export default (req: Request, res: Response) => {
    let annee: number = 2020;
    let id: number = 16746;
    let trimestre: Trimestre = Trimestre.UN;
    let type: number = 2;

    let url: string = `https://gaps.heig-vd.ch/consultation/horaires/?annee=${annee}&trimestre=${trimestre}&type=${type}&id=${id}`;

    res.send("coucou");
};
