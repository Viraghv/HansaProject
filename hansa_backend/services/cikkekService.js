const {checkRequiredParameters, checkParamValues} = require('../validators/listingValidators')
const cikkekRepository = require('../repositories/cikkekRepository')
const BadRequest = require("../exceptions/BadRequest");

const tableColumns = ["id", "cikkszam", "vonalkod", "nev", "mennyisegiegyseg", "nettoegysegar", "verzio", "partnerid"];

module.exports.list = async (filterData) => {
    checkRequiredParameters(filterData);
    checkParamValues(filterData, tableColumns);

    return await cikkekRepository.list(filterData);
}

module.exports.add = async (cikkData) => {
    checkAddParams(cikkData);
    return await cikkekRepository.add(cikkData);
}

function checkAddParams(cikkData) {
    if(!cikkData.hasOwnProperty("cikkszam") || !cikkData.hasOwnProperty("vonalkod") ||
       !cikkData.hasOwnProperty("nev") || !cikkData.hasOwnProperty("mennyisegiegyseg") ||
       !cikkData.hasOwnProperty("nettoegysegar") || !cikkData.hasOwnProperty("verzio") ||
       !cikkData.hasOwnProperty("partnerid")){

        throw new BadRequest("Request body does not have the required parameters.");
    }

    if(typeof cikkData.cikkszam !== "string" || typeof cikkData.vonalkod !== "string" ||
       typeof cikkData.nev !== "string" || typeof cikkData.mennyisegiegyseg !== "string" ||
       typeof cikkData.nettoegysegar !== "number" || !Number.isInteger(cikkData.verzio) ||
       !Number.isInteger(cikkData.partnerid)) {

        throw new BadRequest("The type of a parameter is incorrect.");
    }

    if(cikkData.cikkszam === "" || cikkData.vonalkod === "" ||
       cikkData.nev === "" || cikkData.mennyisegiegyseg === "") {

        throw new BadRequest("Please provide a value for every parameter.");
    }

    if(cikkData.cikkszam.length > 255 || cikkData.vonalkod.length > 255 ||
        cikkData.nev.length > 255 || cikkData.mennyisegiegyseg.length > 255) {

        throw new BadRequest("One of the parameters is longer than 255 characters");
    }
}