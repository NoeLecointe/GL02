const { program }= require("@caporal/core");
// const fs = require('fs');
// const parserUeSalle = require('./parserUeSalle.js');
// const Parser = require('./Parser.js');
var Actions = require("./actions.js");


program
.command("getroom", "Get a list of rooms of a UE")
.argument("<ue>","Name of the UE")
.action(Actions.actionUeSalle)
.command("getcap", "Get the max capacity of a room")
.argument("<room>","Name of the room")
.action(Actions.actionCapacity)
.command("getman", "Get acces on the manual of command")
.action(Actions.actionManual)
.command("makeiCalendar","Return a iCalendar file")
.action(Actions.actionIcalendar);
program.run();
