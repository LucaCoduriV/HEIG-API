import { Request, Response } from 'express';
import Gaps from '../utils/gaps';

enum Trimestre {
  ETE = 3,
  UN = 1,
  DEUX = 0,
}

export default async (req: Request, res: Response) => {
  let annee: number = 2022;
  let trimestre: Trimestre = 1;
  let type: number = 2; // 2 pour horaire étudiant
  const gapsId = req.body.gapsId;
  const username: string = req.body.username as string;
  const password: string = req.body.password as string;

  try {
    let resultats: any = await Gaps.get_horaires(
      username,
      password,
      annee,
      trimestre,
      gapsId,
      type,
    );

    const data = (resultats['VEVENT'] as Array<any>).filter(
      (r) => r['DTSTART;TZID=Europe/Zurich'] != null,
    );

    resultats['VEVENT'] = data;

    return res.send(resultats);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
