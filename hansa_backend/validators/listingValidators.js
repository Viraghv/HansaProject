const BadRequest = require("../exceptions/BadRequest");

function checkRequiredParameters(filterData) {
    if(!filterData.hasOwnProperty("orderBy") || !filterData.hasOwnProperty("orderType") ||
        !filterData.hasOwnProperty("searchColumn") || !filterData.hasOwnProperty("searchTerm") ||
        !filterData.hasOwnProperty("page")){

        throw new BadRequest("Request body does not have the required parameters.")
    }
}

function checkParamValues(filterData, tableColumns) {
    if((!tableColumns.includes(filterData.orderBy) && filterData.orderBy !== "") ||
        !["", "asc", "desc"].includes(filterData.orderType) ||
        (!tableColumns.includes(filterData.searchColumn) && filterData.searchColumn !== "") ||
        (filterData.page !== null && (typeof filterData.page !== 'number' || filterData.page <= 0))){

        throw new BadRequest("The parameter values are incorrect.")
    }
}

module.exports = {
    checkRequiredParameters,
    checkParamValues,
}
