### MANUAL & README - Sujet A GL02

Description : Le logiciel a pour but de faciliter la gestion des locaux de l'université centrale de la république de Sealand ainsi que l'organisation de ses usagers qui sont les enseignants et les étudiants.

### Utilisation :

$ node caporal.js <command> <argument>

**************************************

<command> : getman          //(get manual)  

Donne accès au manuel d'utilisation contenant les informations de README et des commandes 

<argument> : Pas d'arguments

Exemple : node caporal.js getman

**************************************

<command> : getroom         //(get room) 

Donne une liste de toutes les salles en lien avec une UE donnée en argument

<argument> : <Nom_de_l'UE> Le nom de l'UE doit etre écrit en majuscule

Exemple : node caporal.js getroom GL02

**************************************

<command> : getcap          //(get capacity)

Donne la capacité maximale en terme de nombre de place d'une salle donnée en argument

<argument> : <Nom_de_la_salle> Le nom de la salle doit etre écrit en majuscule

Exemple : node caporal.js getcap B101
