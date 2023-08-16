const {checkRequiredParameters, checkParamValues} = require('../validators/listingValidators')
const tetelRepository = require('../repositories/tetelRepository')
const BadRequest = require("../exceptions/BadRequest");

const tableColumns = ["id", "mennyiseg", "brutto", "partnerid", "partnerctid", "vasarlasid"];

module.exports.list = async (filterData) => {
    checkRequiredParameters(filterData);
    checkParamValues(filterData, tableColumns);

    return await tetelRepository.list(filterData);
}

module.exports.listByVasarlas = async (vasarlasid) => {
    return await tetelRepository.listByVasarlas(Number(vasarlasid));
}

module.exports.add = async (tetelData) => {
    checkAddParams(tetelData);
    return await tetelRepository.add(tetelData);
}

function checkAddParams(tetelData) {
    if(!tetelData.hasOwnProperty("partnerctid") || !tetelData.hasOwnProperty("vasarlasid") ||
       !tetelData.hasOwnProperty("mennyiseg") || !tetelData.hasOwnProperty("brutto") ||
       !tetelData.hasOwnProperty("partnerid")){

        throw new BadRequest("Request body does not have the required parameters.");
    }

    if(!Number.isInteger(tetelData.partnerctid) || !Number.isInteger(tetelData.vasarlasid) ||
       typeof tetelData.mennyiseg !== "number" || typeof tetelData.brutto !== "number" ||
       !Number.isInteger(tetelData.partnerid)) {

        throw new BadRequest("The type of a parameter is incorrect.");
    }
}