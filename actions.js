const fs = require('fs');
const parserUeSalle = require('./parserUeSalle.js');
const parserGeneral = require('./Parser.js');
const path = require('path');

const prompts = require('prompts');
const ical = require('ical-generator');
const http = require('http');
const open = require('open');



class Actions{

    static parseAll = function(parser) {
        const directoryPath = path.join('.','SujetA_data');
        let listpath;
        let allData;

        listpath = fs.readdirSync(directoryPath, function (err, listpath) {
            if (err) {
                return console.log("Unable to find path : "+ err);
            } 
        })
        listpath.forEach(function (data) {
            allData += fs.readFileSync('./SujetA_data/'+data+'/edt.cru','utf8');
        })
        parser.parse(allData);
    }

    static actionIcalendar = function({logger, args}){
        (async () => {
            let parser = new parserGeneral();
            Actions.parseAll(parser);

            //Regex pour vérifier si la date est conforme
            const verifDate = /(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[012])\/202[2-9]{1}/;
            //Regex qui vérifie si l'ue rentrée est conforme
            const verifUE = /[A-Z]{2,10}[0-9]{0,2}[A-Z]{0,1}[0-9]{0,1}/;
            //Demande à l'utilisateur de rentrer la date de début, de fin et les UE auxquels il participe.
            const response = await prompts ([
                {
                    type : 'text',
                    name : 'dateDebut',
                    message : "rentrer la date de début (DD/MM/YYYY)",
                    validate : dateDebut => !dateDebut.match(verifDate) ? "date pas bonne" : true
                },
                {
                    type : 'text',
                    name : 'dateFin',
                    message : "rentrer la date de fin (DD/MM/YYY)",
                    validate : dateFin => !dateFin.match(verifDate) ? "date pas bonne" : true
                },
                {
                    type : 'list',
                    name : 'UE',
                    message : 'entrer vos UE (en majuscule) séparées par une ","',
                    separator : ','
                }
            ]);

            let tabUE = [];
            let creneau = [];
            let objCreneau;
            let horaire;
            let indice;
            let nomUE;
            let typeCours;
            let nomSalle;
            let jour;
            let heureD;
            let heureF;
            //Récupère les informations dont on a besoin en fonction des UE rentrés par l'utilisateur.
            parser.listeSalle.forEach(salle => {
                //Stoque le nom de la salle
                nomSalle = salle.nomSalle;

                salle.agenda.forEach((day, j)  => {
                    //Permet de récupérer le jour en fonction de l'indice du tableau
                    switch (j) {
                        case 0 : 
                            jour = "Lundi";
                            break;
                        case 1 : 
                            jour = "Mardi";
                            break;
                        case 2 : 
                            jour = "Mercredi";
                            break;
                        case 3 : 
                            jour = "Jeudi";
                            break;
                        case 4 : 
                            jour = "Vendredi";
                            break;
                        case 5 : 
                            jour = "Samedi";
                            break;
                        case 6 : 
                            jour = "Dimanche";
                            break;
                    }

                    day.forEach((c, h) => {
                        //Stocke les heures de début et de fin
                        heureD = h;
                        heureF = h+1;
                        if(c !== undefined) {
                            if (response.UE.includes(c.nomUE)) {
                                typeCours = c.type;
                                if (typeCours.includes("C")) {
                                    typeCours = "CM";
                                } else if (typeCours.includes("T")) {
                                    typeCours = "TP";
                                } else {
                                    typeCours = "TD";
                                }
                                nomUE = c.nomUE;
                                creneau = [];
                                //création d'un objet avec le nom de la salle, le jour, heure de début et de fin
                                objCreneau = {nomSalle, jour, heureD, heureF, typeCours};
                                //Object horaire qui stock le nom de l'ue et un tableau de créneau.
                                horaire = {nomUE, creneau};

                                //test qui vérifie si l'UE est déjà présent l'object horaire.
                                const exist = (e) => e.nomUE === horaire.nomUE;
                                //Récupère l'indice où l'UE est stocké si jamais ce dernier est retrouvé.
                                indice = tabUE.findIndex(exist);
                                // console.log(indice);
                                
                                //Initialisation, si tabUE est vide, remplie automatiquement avec les premières données.
                                if (tabUE.length === 0) {
                                    tabUE.push(horaire);
                                    tabUE[0].creneau.push(objCreneau); 
                                //Vérifie si l'ue qu'on est en train de traiter existe déjà dans le tableau tabUE
                                } else if (tabUE.some(exist)) {
                                    // console.log('exist');
                                    //test afin de voir si le créneau correspond
                                    const verifCreneau = (e) => e.nomSalle === objCreneau.nomSalle && e.jour === objCreneau.jour && e.heureF === objCreneau.heureD;
                                    //récupère l'indice du créneau correspondant si ce dernier existe.
                                    let indiceCreneau = tabUE[indice].creneau.findIndex(verifCreneau);
                                    
                                    //si le créneau existe
                                    if (tabUE[indice].creneau.some(verifCreneau)) {
                                        //ajoute une demi heure à l'heure de fin (les heures étant en 1/2 heure)
                                        tabUE[indice].creneau[indiceCreneau].heureF++;
                                    } else {
                                        //Sinon, push le nouveau créneau dans l'UE
                                        tabUE[indice].creneau.push(objCreneau);
                                    }
                                //Si l'UE recherché n'existe pas
                                } else {
                                    //Push les nouvelles données.
                                    tabUE.push(horaire);
                                    indice = tabUE.length - 1;
                                    tabUE[indice].creneau.push(objCreneau);
                                }
                            }
                        }
                    })
                });
            })
            //passage des heures de début et de fin de 1/2h à des heures.
            tabUE.forEach(ue => {
                ue.creneau.forEach(c => {
                    c.heureD = c.heureD/2;
                    if (c.heureD%1 === 0.5) {
                        c.heureD -= 0.20;
                    }
                    c.heureF = c.heureF/2;
                    if (c.heureF%1 === 0.5) {
                        c.heureF -= 0.20;
                    }
                });
            });

            //Récupère les dates rentrées par l'utilisateur et les mets au format Date de javascript
            const splitDate = /\//;
            response.dateDebut = response.dateDebut.split(splitDate);
            let jourD = response.dateDebut.shift();
            let moisD = response.dateDebut.shift()-1;
            let anneeD = response.dateDebut.shift();
            let dateDebut = new Date(anneeD, moisD, jourD);
            response.dateFin = response.dateFin.split(splitDate);
            let jourF = response.dateFin.shift();
            let moisF = response.dateFin.shift()-1;
            let anneeF = response.dateFin.shift();
            let dateFin = new Date(anneeF, moisF, jourF);
            let jourFin = dateFin.getDate()
            dateFin.setDate(jourFin+1);


            let arrayChoice = [];
            let arrayNom = [];
            tabUE.forEach(e => {
                let arrayUE = [];
                arrayNom.push(e.nomUE);
                e.creneau.forEach((c, i) => {
                    let title = c.typeCours+ " en salle : "+c.nomSalle+" le "+c.jour+" de "+c.heureD+"h a "+c.heureF+"h";
                    let value = i;
                    let objChoice = {title, value};
                    arrayUE.push(objChoice);
                });
                arrayChoice.push(arrayUE);
            });

            askCreneau(arrayChoice, arrayNom);

            //Demande à l'utilisateur de choisir les créneaux auxquels il participe.
            async function askCreneau(arrayChoice, nom) {
                let multi = [];
                let type = 'multiselect';
                let name;
                let message = "Choisir les créneaux auxquels vous participez pour le cours ";
                let choices;
                arrayChoice.forEach((e, i) => {
                    let select = {type, name, message, choices};
                    select.name = nom[i];
                    select.message += nom[i];
                    select.choices = e;
                    multi.push(select);
                });
                const response2 = await prompts (multi);            
                

                //Fait le trie dans les créneaux des UE en gardant seulement ceux sélectionner par l'utilisateur
                let cre = Object.values(response2); 
                let tabIcalendar = tabUE;
                tabUE.forEach((e, i) => {
                    let tabSelect = [];
                    e.creneau.forEach((c, y) => {
                        if(cre[i].includes(y)) {
                            let heureD = new Date(dateDebut);
                            heureD.setHours(c.heureD);
                            if (c.heureD%1 > 0) {
                                heureD.setMinutes(30);
                            }
                            c.heureD = heureD;
                            
                            let heureF = new Date(dateDebut);
                            heureF.setHours(c.heureF);
                            if (c.heureF%1 > 0) {
                                heureF.setMinutes(30);
                            }
                            c.heureF = heureF;
                            tabSelect.push(c);
                        };
                    });
                    tabIcalendar[i].creneau = tabSelect;
                });

                
                let nomJourDebut = getDayOfWeek(dateDebut);
                const calendar = ical({name : 'agenda UE'});


                tabIcalendar.forEach(ical => {
                    let nomUE = ical.nomUE;

                    ical.creneau.forEach(c => {                      
                        while (dateDebut < c.heureD && c.heureD < dateFin) {
                            switch (c.jour) {
                                case "Lundi":
                                    if (nomJourDebut === 'lundi') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                                case "Mardi":
                                    if (nomJourDebut === 'mardi') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                                case "Mercredi":
                                    if (nomJourDebut === 'mercredi') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                                case "Jeudi":
                                    if (nomJourDebut === 'jeudi') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                                case "Vendredi":
                                    if (nomJourDebut === 'vendredi') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                                case "Samedi":
                                    if (nomJourDebut === 'vendredi') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                                case "Dimanche":
                                    if (nomJourDebut === 'dimanche') {
                                        nomJourDebut = "";
                                        creationEvent(c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    } else {
                                        let j = c.jour.toLowerCase();
                                        caseJour(j, c.heureD, c.heureF, c.typeCours, nomUE, c.nomSalle);
                                    }
                                    break;
                            }
                        };
                    });
                });  

                function getDayOfWeek(d) {
                    d = new Date(d).toLocaleDateString('default', {weekday : 'long'});
                    return d;
                }

                function creationEvent(depart, fin, type, nom, salle) {
                    calendar.createEvent({
                        start : depart,
                        end : fin,
                        summary : type+' de '+nom,
                        desciption : type+" de "+nom+" le Lundi",
                        localisation : salle
                    })
                }

                function caseJour(jour, depart, fin, type, nom, salle) {
                    let dDebut = new Date(depart.toString());
                    let dFin = new Date(fin.toString());
                    let d;
                    while (getDayOfWeek(depart) !== jour) {
                        d = dDebut.getDate();
                        dDebut.setDate(d + 1);
                        dFin.setDate(d + 1);
                        depart.setDate(d + 1);
                        fin.setDate(d + 1);
                    }
                    d = dDebut.getDate();
                    
                    if (dDebut < dateFin) {
                        creationEvent(dDebut, dFin, type, nom, salle);
                    }


                    depart.setDate(d + 7);
                    fin.setDate(d + 7);
                }

                http.createServer((req, res) => calendar.serve(res))
                    .listen(3000, '127.0.0.1', () => {
                        console.log('Server running at http://127.0.0.1:3000/');
                        open('http://127.0.0.1:3000/');
                    });
            }
        })();
    }

    static actionUeSalle = function({logger, args}){
        let pathdata;
        const firstLetter = String(args.ue).substring(0,1);
        switch(firstLetter){
            case "A": case "B":
                pathdata = "AB";
                break;
            case "C": case "D":
                pathdata = "CD";
                break;
            case "E": case "F":
                pathdata = "EF";
                break;
            case "G": case "H":
                pathdata = "GH";
                break;
            case "I": case "J":
                pathdata = "IJ";
                break;
            case "K": case "L":
                pathdata = "KL";
                break;
            case "M": case "N":
                pathdata = "MN";
                break;
            case "O": case "P":
                pathdata = "OP";
                break;
            case "Q": case "R":
                pathdata = "QR";
                break;
            case "S": case "T":
                pathdata = "ST";
                break;
        };
        fs.readFile('./SujetA_data/'+pathdata+'/edt.cru','utf8', function (err,data){
            if (err){
                return logger.warn("UE not found or not exist, please write the ue name with uppercase");
            }
            const expressionue = /[A-Z]{2,10}[0-9]{0,2}[A-Z]{0,1}[0-9]{0,1}/;
            if (String(args.ue).match(expressionue)){
                var analyzer = new parserUeSalle();
                analyzer.parse(data,String(args.ue),2);
                const expressionsalle = /S=[A-Z][0-9]{3}|S=[A-Z]{3}[0-9]|S=[A-Z]{4}/g;
                if (typeof analyzer.searched === 'undefined'){ 
                    console.log("UE not found on the data base or wrong syntax for the name of the UE");
                } else {
                    let listesalle = analyzer.searched.match(expressionsalle);
                    var listesalleunique = new Set();
                    listesalle.forEach(element => {
                        listesalleunique.add(element.substring(2));
                    });
                    logger.info("The list of rooms of %s is", args.ue);
                    console.log(listesalleunique);
                }
            } else {
                console.log("UE not found because of wrong syntax for the name of the UE");
            }
        })
    }

    static actionCapacity = function({logger, args}){
        let allData;
        const directoryPath = path.join('.','SujetA_data');

        fs.readdir(directoryPath, function (err, listpath) {
            if (err) {
                return console.log("Unable to find capacity "+ err);
            } 
            listpath.forEach(function (letterpath) {
                allData += fs.readFileSync('./SujetA_data/'+letterpath+'/edt.cru','utf8');
            })
            const expressionsalle2 = /[A-Z][0-9]{3}|[A-Z]{3}[0-9]|[A-Z]{4}/;
            if (String(args.room).match(expressionsalle2)){
                var analyzer2 = new parserUeSalle();
                analyzer2.parse(allData,String(args.room),3);
                const expressioncapacity = /P=[0-9]{1,3}/;
                let capacity = 0;
                let stringcap;
                if (typeof analyzer2.searched[0] === 'undefined'){ 
                    console.log("Room not found on the data base or wrong syntax for the name of the room, please write the room name with uppercase");
                } else {
                    analyzer2.searched.forEach(function(cap) {
                        stringcap = cap.match(expressioncapacity);
                        capacity = Math.max(capacity,parseInt(String(stringcap).substring(2)));
                
                    })
                    logger.info("The max capacity of the room %s is %s", args.room, String(capacity));
                }
            } else {
                console.log("Room not found because of wrong syntax for the name of the room, please write the room name with uppercase");
            }
        });
    }

    static actionManual = function({logger, args}){
        fs.readFile("./README.txt", 'utf8', function(err, data){
			if(err){
				return logger.warn("Unable to find manual : "+ err);
			}
			
			logger.info(data);
		});
    }
}

module.exports = Actions;

