import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export default (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    // Se connecter avec nom d'utilisateur et mdp si cookie non valide
    // sauvegarder le cookie
    // utiliser le cookie pour les requêtes

    /*
    les vérification suivante doivent être fait dans le <table>[0]

    if count(<td>) == 1 --> titre branche
    else if count(<td>) == 6 --> sous titre
    else <td> contient les notes
    */

    // Exemple d'objet contenant les notes
    res.send({
        prg: {
            cours: [2.5, 4.2, 3.5],
            labo: [3.5, 4.1, 3.8],
        },
    });
};
