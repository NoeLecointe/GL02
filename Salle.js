class Salle {
    constructor(nom){
        this.nomSalle = nom,
        this.agenda = Array.apply(null, new Array(7)).map(function(){ return Array.apply(null,new Array(48)); });
        Object.seal(this.agenda);
    }
}

Salle.prototype.addCreneau = function(jour, debut, fin, creneau){
    let indiceJour;
    switch(jour){
        case "L":
            indiceJour = 0;
            break;
        case "MA":
            indiceJour = 1;
            break;
        case "ME":
            indiceJour = 2;
            break;
        case "J":
            indiceJour = 3;
            break;
        case "V":
            indiceJour = 4;
            break;
        case "S":
            indiceJour = 5;
            break;
        case "D":
            indiceJour = 6;
            break;
        default:
            indiceJour = -1;
            break;
    }
    let indiceDebut = this.calculIndiceHeure(debut);
    let indiceFin = this.calculIndiceHeure(fin);
    for(let i = indiceDebut; i<= indiceDebut; i++){
        this.agenda[indiceJour][i] = creneau;
    }
       
    


}

Salle.prototype.calculIndiceHeure = function(heure){
    let indiceheure;
    const tabHeureMinute = heure.split(":");
    indiceheure = Number(tabHeureMinute[0]) * 2;
    if(Number(tabHeureMinute[1]) >= 30){
        indiceheure++;
    }
    return indiceheure;
}


    


