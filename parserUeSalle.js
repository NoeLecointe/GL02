var parser = function(){
    this.searched;
};

parser.prototype.parse = function(data, name, spec){
	var tData = this.getlist(data, spec);
	var target = tData.filter((val) => val.match(name));
	if (spec === 2){
		this.searched = target[0];
	} else {
		this.searched = target;
	}
};

parser.prototype.getlist = function(data, spec){
	var separator;
	if (spec === 2){
		separator = /\+/;
	} else {
		separator = /\/\//;
	}
	data = data.split(separator);					
	return data;
};

module.exports = parser;
