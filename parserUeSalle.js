var parser = function(){
    this.uesearched;
    this.symb = ["+","P=","H=","S=","//"];
};



parser.prototype.parse = function(data, uename){
	var tData = this.getlistue(data);
	var ue = tData.filter((val) => val.match(uename));
	this.uesearched = ue[0];
};

parser.prototype.getlistue = function(data){
	var separator = /\+/;
	data = data.split(separator);
	//data = data.filter((val) => !val.match(separator)); 					
	return data;
};

//parser.prototype.selectue = function(uename){
//	var ue = this.listroom.filter((val) => val.match(uename)); 
//	return ue[0];
//};

module.exports = parser;
