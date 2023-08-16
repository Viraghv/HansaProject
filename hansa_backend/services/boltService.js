const {checkRequiredParameters, checkParamValues} = require('../validators/listingValidators');
const boltRepository = require('../repositories/boltRepository');
const BadRequest = require("../exceptions/BadRequest");

const tableColumns = ["id", "nev", "partnerid"];

module.exports.list = async (filterData) => {
    checkRequiredParameters(filterData);
    checkParamValues(filterData, tableColumns);

    return await boltRepository.list(filterData);
}

module.exports.add = async (boltData) => {
    checkAddParams(boltData);
    return await boltRepository.add(boltData);
}

function checkAddParams(boltData) {
    if(!boltData.hasOwnProperty("nev") || !boltData.hasOwnProperty("partnerid")){
        throw new BadRequest("Request body does not have the required parameters.");
    }

    if(typeof boltData.nev !== "string" || !Number.isInteger(boltData.partnerid)){
        throw new BadRequest("The type of a parameter is incorrect.");
    }

    if(boltData.nev === ""){
        throw new BadRequest("Please provide a value for every parameter.");
    }

    if(boltData.nev.length > 255){
        throw new BadRequest("One of the parameters is longer than 255 characters");
    }
}