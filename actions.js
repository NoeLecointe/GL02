const fs = require('fs');
const parserUeSalle = require('./parserUeSalle.js');
const parserGeneral = require('./Parser.js');
const path = require('path');



class Actions{
/**
 * This function read every files and give the content of every files as argument on the parser for parsing
 * @param {parserGeneral} parser the general parser as argument on the ./Parser.js file
 */
    static parseAll = function(parser) {
        const directoryPath = path.join('.','SujetA_data');
        let listpath;
        let allData;

        //searching all the directory on the directory SujetA_data
        listpath = fs.readdirSync(directoryPath, function (err, listpath) {
            if (err) {
                return console.log("Unable to find path : "+ err);
            } 
        })
        //read every files on the directory SujetA_data and put the content of each file together on allData
        listpath.forEach(function (data) {
            allData += fs.readFileSync('./SujetA_data/'+data+'/edt.cru','utf8');
        })
        parser.parse(allData);
    }


    static actionUeSalle = function({logger, args}){
        let pathdata;
        //Take the first letter of the arugment of the command which is the first letter of the ue name 
        const firstLetter = String(args.ue).substring(0,1);
        //each ue is on the directory depending of the alphabet of the ue name, the switch case give the good directory depending of the first letter of the ue searched for the path
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
        //Read the files with the path found, so we don't need read every files but just the file searched
        fs.readFile('./SujetA_data/'+pathdata+'/edt.cru','utf8', function (err,data){

            if (err){
                return logger.warn("UE not found or not exist, please write the ue name with uppercase");
            }
            //need check if the user give a good syntax for the ue name as argument
            const expressionue = /[A-Z]{2,10}[0-9]{0,2}[A-Z]{0,1}[0-9]{0,1}/;
            if (String(args.ue).match(expressionue)){
            //instance of the parser, to get the block of data needed for spec 2
            var analyzer = new parserUeSalle();
            analyzer.parse(data,String(args.ue),2);
            const expressionsalle = /S=[A-Z][0-9]{3}|S=[A-Z]{3}[0-9]|S=[A-Z]{4}/g;
            //if the parser didn't find any information about the ue
            if (typeof analyzer.searched === 'undefined'){ 
                console.log("UE not found on the data base or wrong syntax for the name of the UE");
            } else {
            //selecting each room linked with the ue
            let listesalle = analyzer.searched.match(expressionsalle);
            var listesalleunique = new Set();
            //remove duplicate rooms and the "S="
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

        //searching all the directory on the directory SujetA_data
        fs.readdir(directoryPath, function (err, listpath) {
            if (err) {
                return console.log("Unable to find capacity "+ err);
            } 
            //read every files on the directory SujetA_data and put the content of each file together on allData
            listpath.forEach(function (letterpath) {
                allData += fs.readFileSync('./SujetA_data/'+letterpath+'/edt.cru','utf8');
            })
            //need check if the user give a good syntax for the room name as argument
            const expressionsalle2 = /[A-Z][0-9]{3}|[A-Z]{3}[0-9]|[A-Z]{4}/;
            if (String(args.room).match(expressionsalle2)){
            //instance of the parser, to get the block of data needed for spec 3
            var analyzer2 = new parserUeSalle();
            analyzer2.parse(allData,String(args.room),3);
            const expressioncapacity = /P=[0-9]{1,3}/;
            let capacity = 0;
            let stringcap;
            //if the parser didn't find any information about the room
            if (typeof analyzer2.searched[0] === 'undefined'){ 
                console.log("Room not found on the data base or wrong syntax for the name of the room, please write the room name with uppercase");
            } else {
                //selecting each number of place linked with the room
                analyzer2.searched.forEach(function(cap) {
                    stringcap = cap.match(expressioncapacity);
                    //keeping only the biggest number of place on the variable capacity after removing the "P=" on the string of the capacity and then convert on int to use the math.max which keep the bigger number
                    capacity = Math.max(capacity,parseInt(String(stringcap).substring(2)));
                
            })
                logger.info("The max capacity of the room %s is %s", args.room, String(capacity));
            }
    } else {
        console.log("Room not found because of wrong syntax for the name of the room, please write the room name with uppercase");
    }});
    }

    static actionManual = function({logger, args}){
        //read readme file and log the content on the terminal
        fs.readFile("./README.txt", 'utf8', function(err, data){
			if(err){
				return logger.warn("Unable to find manual : "+ err);
			}
			
			logger.info(data);
		});
    }
}

module.exports = Actions;

