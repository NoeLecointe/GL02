const fs = require('fs');
const parserUeSalle = require('./parserUeSalle.js');
const parserGeneral = require('./Parser.js');
const path = require('path');

const prompts = require('prompts');



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

            const verifDate = /(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[012])\/202[2-9]{1}/;
            const verifUE = /[A-Z]{2,10}[0-9]{0,2}[A-Z]{0,1}[0-9]{0,1}/;
            const response = await prompts ([
                {
                    type : 'text',
                    name : 'dateD',
                    message : "rentrer la date de début (DD/MM/YYYY)",
                    validate : dateD => !dateD.match(verifDate) ? "date pas bonne" : true
                },
                {
                    type : 'text',
                    name : 'dateF',
                    message : "rentrer la date de fin (DD/MM/YYY)",
                    validate : dateD => !dateD.match(verifDate) ? "date pas bonne" : true
                },
                {
                    type : 'list',
                    name : 'UE',
                    message : 'entrer vos UE séparé par une ","',
                    separator : ','
                }
            ]);

            let tabUE = [];
            let creneau = [];
            let objCreneau;
            let horaire;
            let indice;
            let nomUE;
            let nomSalle;
            let jour;
            let heureD;
            let heureF;
            parser.listeSalle.forEach(salle => {
                nomSalle = salle.nomSalle;

                salle.agenda.forEach((day, j)  => {
                    jour = j;

                    day.forEach((c, h) => {
                        heureD = h;
                        heureF = h+1;
                        if(c !== undefined) {
                            if (response.UE.includes(c.nomUE)) {
                                nomUE = c.nomUE;
                                creneau = [];
                                objCreneau = {nomSalle, jour, heureD, heureF};
                                let objCreneauValue = Object.values(objCreneau);
                                horaire = {nomUE, creneau};

                                const exist = (e) => e.nomUE === horaire.nomUE;
                                indice = tabUE.findIndex(exist);
                                // console.log(indice);

                                if (tabUE.length === 0) {
                                    tabUE.push(horaire);
                                    tabUE[0].creneau.push(objCreneau); 
                                } else if (tabUE.some(exist)) {
                                    // console.log('exist');
                                    const verifCreneau = (e) => e.nomSalle === objCreneauValue[0] && e.jour === objCreneauValue[1] && e.heureF === objCreneauValue[2];
                                    let indiceCreneau = tabUE[indice].creneau.findIndex(verifCreneau);

                                    if (tabUE[indice].creneau.some(verifCreneau)) {
                                        tabUE[indice].creneau[indiceCreneau].heureF++;
                                    } else {
                                        tabUE[indice].creneau.push(objCreneau);
                                    }

                                } else {
                                    tabUE.push(horaire);
                                    indice = tabUE.length - 1;
                                    tabUE[indice].creneau.push(objCreneau);
                                }
                            }
                        }
                    })
                });
            })

            keep(tabUE, response.dateD, response.dateF);


            async function keep(tabUE, dateD, dateF) {
                // console.log(response);
                console.log(dateD + " " + dateF);
                tabUE.forEach(UE => {
                    console.log(UE);
                });
            //     const response2 = await prompts ([
            //         {
            //             type : 'text',
            //             name : 'test',
            //             message : "rentrer la date de début (DD/MM/YYYY)",
            //         }
            //     ]);
            };
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

