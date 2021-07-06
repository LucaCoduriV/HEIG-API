enum JourSemaine {
    LUNDI = 0,
    MARDI,
    MERCREDI,
    JEUDI,
    VENDREDI,
}

interface HeureCours {
    nom: string;
    salle?: string;
    periodes?: number;
    debut?: number;
    jour?: JourSemaine;
    prof?: string;
}
