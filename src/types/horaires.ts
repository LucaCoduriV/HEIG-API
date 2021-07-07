enum JourSemaine {
    LUNDI = 0,
    MARDI,
    MERCREDI,
    JEUDI,
    VENDREDI,
}

interface HeureCours {
    nom: string; // Nom du cours
    salle?: string; // Salle de classe
    periodes?: number; // Nombre de période
    debut?: number; // Période de début ex: 1 -> 8h30
    jour?: JourSemaine; // Jour de la semaine
    prof?: string; // nom du prof
}
