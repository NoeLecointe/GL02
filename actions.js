const fs = require('fs');
const parserUeSalle = require('./parserUeSalle.js');
class Actions{
    static actionUeSalle = function({logger, args}){
        logger.info("The list of rooms of %s is", args.ue);
        //const pathdata;
        //if (String(args.ue).charAt(0)==="A" || String(args.ue).charAt(0)==="B"){
        //    pathdata = "AB";
        //};
        fs.readFile('./SujetA_data/GH/edt.cru','utf8', function (err,data){

            if (err){
                return logger.warn(err);
            }
            var analyzer = new parserUeSalle();
            analyzer.parse(data,String(args.ue));
            //const ueselected = analyzer.selectue(String(args.ue));
            //const expressionsalle = new RegExp("S=[A-Z][0-9]{3}/g");
            const expressionsalle = /S=[A-Z][0-9]{3}/g;
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

