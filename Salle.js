class Salle {
    constructor(nom){
        this.nomSalle = nom;
        this.agenda = Array.apply(null, new Array(7)).map(function(){ return Array.apply(null,new Array(48)); });
        // voir pour Object.seal(agenda)
    }
}

export default Salle;