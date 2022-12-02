const Salle = require("./Salle");
const Creneau = require('./Creneau.js');



class Parser{
    constructor(){
        this.listeSalle = [];
        this.cptErreur;
    }


    splitAndFilter = function(data){
        
        // const regexCours = /(^([A-Z]{2,10}\d{0,2}[A-Z]?\d?)$)|(^1,.*\/\/$)+/gm;
        const regexCours = /(^\+([A-Z]{2,10}\d{0,2}[A-Z]?\d?)$)|(^1,.*\/\/$)/;
        const separator = /\r\n/;
        data = data.split(separator);
        data = data.filter((val,idx) => val.match(regexCours));
        data = this.supUVUV(data);
        return data;
    }

    supUVUV = function(data){
        const regex = /\+UVUV/;
        data = data.filter((val,idx) => !val.match(regex));
        return data;
    }

    parse = function(data){
        
        const regexUE = /^\+([A-Z]{2,10}\d{0,2}[A-Z]?\d?)$/;
        const regexvaleur = /^1,(T|C|D)\d{1,2},P=\d{1,3},H=((L|MA|ME|J|V|S) ((\d|1\d|2[0-4]):(00|30)-(0|1\d|2[0-4]):(00|30)),([A-Z][A-Z0-9]),S=([A-Z](\d{3}|[A-Z]{2}(\d|[A-Z])))\/)+\/$/
        data = this.splitAndFilter(data);
        let valeurUE = "";
        while(true){
            let valeur = data.shift();
            if(valeur.match(regexUE)){
                valeurUE =  valeur.replace("+", "")
            }
            else if(valeur.match(regexvaleur)){
                this.createCreneau(valeur,valeurUE);
            }
            else{
                console.log("error");
            }
            if(data.length <= 0){
                break; 
            }
        }  
    }

    createCreneau = function(valeurCreneau,nomUE){
        const regexSplit = /(,|\/)/
        valeurCreneau = valeurCreneau.split(regexSplit);
        valeurCreneau = valeurCreneau.filter((val, idx) => !val.match(regexSplit)); 
        valeurCreneau = valeurCreneau.filter((val, idx) => !(val == '')); 
        valeurCreneau.shift();
        let typeCours = valeurCreneau.shift();
        let place = valeurCreneau.shift();
        place = place.replace("P=",'');
        let date = valeurCreneau.shift();
        date = date.split(" ");
        let jour = date[0].replace("H=",'');
        let heure = date[1].split("-");
        let debut = heure[0];
        let fin = heure[1];
        let sousGroupe = valeurCreneau.shift();
        let creneau = new Creneau(nomUE,typeCours,place,sousGroupe);
        let nomSalle = valeurCreneau.shift();
        nomSalle = nomSalle.replace("S=","");
        let salle;
        salle = this.listeSalle.find((val) => val.nomSalle == nomSalle);
        if(salle == undefined){
            salle = new Salle(nomSalle);
            this.listeSalle.push(salle);
        }
        salle.addCreneau(jour,debut,fin,creneau);
        while(valeurCreneau.length > 0){
            date = valeurCreneau.shift();
            date = date.split(" ");
            jour = date[0];
            heure = date[1].split("-");
            debut = heure[0];
            fin = heure[1];
            sousGroupe = valeurCreneau.shift();
            creneau = new Creneau(nomUE,typeCours,place,sousGroupe);
            let nomSalle = valeurCreneau.shift();
            nomSalle = nomSalle.replace("S=","");
            salle = this.listeSalle.find((val) => val.nomSalle == nomSalle);
            if(salle == undefined){
                salle = new Salle(nomSalle);
                this.listeSalle.push(salle);
            }
            salle.addCreneau(jour,debut,fin,creneau);
        }
    }
}

module.exports = Parser;




