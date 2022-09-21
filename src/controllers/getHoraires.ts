import { Request, Response } from 'express';
import Gaps from '../utils/gaps';

enum Trimestre {
  ETE = 1,
  UN,
  DEUX,
}

export default async (req: Request, res: Response) => {
    let annee: number = 2021;
    let trimestre: Trimestre = 1;
    let type: number = 2; // 2 pour horaire étudiant
    const gapsId = req.body.gapsId;
  const username: string = req.body.username as string;
  const password: string = req.body.password as string;

  try {
    const resultats = await Gaps.get_horaires(
      username,
      password,
      annee,
      trimestre,
      gapsId,
      type,
    );
    return res.send(resultats);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
