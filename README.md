# MANUAL & README - Sujet A GL02

Description: The software is used to manage the classrooms and organize the users (teachers and students) of the Central University of the Republic of Sealand.


## Sommaire

1. [Requirements](#Requirements)
2. [Utilisation](#Utilisation)
3. [Functions](#Functions)


## Requirements

To ensure that the program is running on your computer, it is preferable to have installed [node.js](https://nodejs.org/fr/download/). Having used Vegalite and Vcards packages to implement this project, they can be reinstalled if they do not work. To use the parser, it is necessary to install its dependancies with the command ```npm install```.


## Utilisation:
$ node caporal.js <command> <argument>


##Functions

---

### `getman`

**Description:** This command displays the manual, which contains the information in the `README` file and information about the commands.

**Arguments:** No arguments are needed for this command.

**Example:** `node caporal.js getman`

---

### `getroom`

**Description:** This command displays a list of all the rooms associated with a given subject (UE in the original text).

**Arguments:** The name of the subject, which must be written in uppercase.

**Example:** `node caporal.js getroom GL02`

---

### `getcap`

**Description:** This command displays the maximum capacity (in terms of number of seats) of a given room.

**Arguments:** The name of the room, which must be written in uppercase.

**Example:** `node caporal.js getcap B101`

---

### `makeiCalendar`

**Description:** This command opens a local web server and allows you to download an `ics` file that is created based on the information you enter. You will be prompted to enter the following information: start date, end date, subject (UE), and choice of schedules for each subject.

**Arguments:** No arguments are needed for this command.

**Example:** `node caporal.js makeiCalendar`

---

### `occupancyRate`

**Description:** This command opens a graph showing the percentage of occupancy for each room. The display is done through a local server that is opened on port 3000. If nothing is displayed, check to make sure that your port 3000 is open.

**Arguments:** No arguments are needed for this command.

**Example:** `node caporal.js occupancyRate`

---

### `displaydispo`

**Description:** This command displays the availability of a room for a standard week, with 30-minute increments. A cross indicates that the room is occupied.

**Arguments:** The name of the room, which must be a letter in uppercase followed by three digits.

**Example:** `node caporal.js displaydispo B103`

---

### `viewfreeroom`

**Description:** This command displays all the rooms that are available during a given time slot on a given day (times rounded to the nearest half hour).

**Arguments:** The date (in the format DD/MM/YYYY) followed by two time slots (in the format HH:MM-HH:MM).

**Example:** `node caporal.js viewfreeroom 01/12/2022 10:25-18:47`


## Auteurs

The difference authors of this project are : Noé Lecointe, Kilian Froge, Théo Cecille, Tony Gong, Julian Marques, Valentin Cabot-Bouchentouf, Tristan Jogee et David Bounliane.

## Licence

Licence MIT
