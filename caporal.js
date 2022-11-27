const { program }= require("@caporal/core");
// const fs = require('fs');
// const parserUeSalle = require('./parserUeSalle.js');
// const Parser = require('./Parser.js');
var Actions = require("./actions.js");


program
.command("getroom", "Get a list of rooms of a UE")
.argument("<ue>","Name of the UE")
.action(Actions.actionUeSalle);
program.run();