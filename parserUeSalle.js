var parser = function(){
    this.uesearched;
};

parser.prototype.parse = function(data, uename){
	var tData = this.getlistue(data);
	var ue = tData.filter((val) => val.match(uename));
	//Si uename contient 2 lettres seulement (ex : BI), et qu'une autre ue contient ces 2 lettres ( ex : BI01), 
	//cela va match et afficher les salles de BI01 alors que BI n'existe pas mais BI est syntaxement correct.
	//  match.(uename+'$') ne marche pas ni ${uename}$ pourtant dans la BNF nom d'ue est suivi d'un CRLF mais ces deux cas ne trouvent aucun match après
	this.uesearched = ue[0];
};

parser.prototype.getlistue = function(data){
	var separator = /\+/;
	data = data.split(separator);					
	return data;
};

module.exports = parser;
