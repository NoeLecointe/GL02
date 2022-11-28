const fs = require('fs');
const parserUeSalle = require('./parserUeSalle.js');
class Actions{
    static actionUeSalle = function({logger, args}){
        logger.info("The list of rooms of %s is", args.ue);
        let pathdata;
        //if (String(args.ue).substring(0,1)==="A" || String(args.ue).substring(0,1)==="B"){
        //    pathdata = "AB";
        //};

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
                return logger.warn(err);
            }
            var analyzer = new parserUeSalle();
            analyzer.parse(data,String(args.ue));
            //const ueselected = analyzer.selectue(String(args.ue));
            //const expressionsalle = new RegExp("S=[A-Z][0-9]{3}/g");
            const expressionsalle = /S=[A-Z][0-9]{3}|S=[A-Z]{3}[0-9]|S=[A-Z]{4}/g;
            let listesalle = analyzer.uesearched.match(expressionsalle);
            //for(let salle of listesalle){
            //    console.log(salle);
            //};
            var listesalleunique = new Set();
            listesalle.forEach(element => {
                listesalleunique.add(element.substring(2));
            });
            console.log(listesalleunique);
            //console.log(listesalle);
            //console.log(listesalle[0]);
            //console.log(analyzer.listroom[1]);
            //console.log(data);
           //a venir
        })
    }
}

module.exports = Actions;

