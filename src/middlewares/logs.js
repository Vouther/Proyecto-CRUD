const fs = require('fs');
const path = require('path');

module.exports = function(req, res, next) {

    //Documentar las rutas por donde pasa el usuario

    let time = new Date();
    let url = req.url;
    let message = `El usuario ingreso a la ruta ${url}, ${time}`;

    let pathLogs = path.join(__dirname, '../data/logs.txt');


    fs.appendFileSync(pathLogs, message);

    next();
}