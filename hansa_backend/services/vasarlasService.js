const {checkRequiredParameters, checkParamValues} = require('../validators/listingValidators')
const vasarlasRepository = require('../repositories/vasarlasRepository')
const BadRequest = require("../exceptions/BadRequest");

const tableColumns = ["id", "esemenydatumido", "vasarlasosszeg", "penztargepazonosito", "partnerid", "boltnev"];

module.exports.list = async (filterData) => {
    checkRequiredParameters(filterData);
    checkParamValues(filterData, tableColumns);

    let list= await vasarlasRepository.list(filterData);

    list.result.map(item =>  {
        item.boltnev = item.bolt.nev;
        delete item.bolt;
    })

    return list;
}

module.exports.add = async (vasarlasData) => {
    checkAddParams(vasarlasData);
    vasarlasData.esemenydatumido = new Date(vasarlasData.esemenydatumido);

    return await vasarlasRepository.add(vasarlasData);
}

function checkAddParams(vasarlasData) {
    if(!vasarlasData.hasOwnProperty("esemenydatumido") || !vasarlasData.hasOwnProperty("vasarlasosszeg") ||
       !vasarlasData.hasOwnProperty("penztargepazonosito") || !vasarlasData.hasOwnProperty("partnerid") ||
       !vasarlasData.hasOwnProperty("boltid")){
        throw new BadRequest("Request body does not have the required parameters.");
    }

    if(!isIsoDate(vasarlasData.esemenydatumido) || typeof vasarlasData.vasarlasosszeg !== "number" ||
       !Number.isInteger(vasarlasData.penztargepazonosito) || !Number.isInteger(vasarlasData.partnerid) ||
       !Number.isInteger(vasarlasData.boltid)) {

        throw new BadRequest("The type of a parameter is incorrect.");
    }

}

function isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(d.getTime()) && d.toISOString()===str; // valid date
}