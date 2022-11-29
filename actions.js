const fs = require('fs');
const parserUeSalle = require('./parserUeSalle.js');
class Actions{
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
            analyzer.parse(data,String(args.ue));
            const expressionsalle = /S=[A-Z][0-9]{3}|S=[A-Z]{3}[0-9]|S=[A-Z]{4}/g;
            if (typeof analyzer.uesearched === 'undefined'){ 
                console.log("UE not found on the data base");
            } else {
            let listesalle = analyzer.uesearched.match(expressionsalle);
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
}

module.exports = Actions;

