const { PrismaClient } = require('@prisma/client');
const InternalServerError = require("../exceptions/InternalServerError");
const BadRequest = require("../exceptions/BadRequest");

const prisma = new PrismaClient();
const pageSize = 25;

module.exports.list = async (filterData) => {
    let whereObject, orderByObject;

    if (filterData.searchColumn !== "" && filterData.searchTerm !== "") {
        whereObject = {
            [filterData.searchColumn]: {
                equals: Number(filterData.searchTerm) ? Number(filterData.searchTerm) : undefined,
            }
        }
    }

    if(filterData.orderBy !== "" && filterData.orderType !== ""){
        orderByObject = {
            [filterData.orderBy]: filterData.orderType,
        }
    }

    try {
        if(filterData.page === null){
            return await prisma.vasarlas_tetel.findMany({
                where: whereObject,
                orderBy: orderByObject,
            });
        } else {
            let response = {};
            response.result = await prisma.vasarlas_tetel.findMany({
                skip: (filterData.page - 1) * pageSize,
                take: pageSize,
                where: whereObject,
                orderBy: orderByObject,
            });

            response.count = await prisma.vasarlas_tetel.count({
                where: whereObject,
            })

            return response;
        }
    } catch (error) {
        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}

module.exports.listByVasarlas = async (vasarlasid) => {
    try {
        return prisma.vasarlas_tetel.findMany({
            where: {
                vasarlasid: vasarlasid
            }
        })
    } catch (error) {
        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}

module.exports.add = async (tetelData) => {
    try {
        await prisma.vasarlas_tetel.create({
            data: {
                ...tetelData
            }
        });
    } catch (error) {
        if(error.meta.field_name === 'Vasarlas_tetel_partnerctid_fkey (index)') {
            throw new BadRequest("'partnerctid' doesn't match any existing record.");
        }

        if(error.meta.field_name === 'Vasarlas_tetel_vasarlasid_fkey (index)') {
            throw new BadRequest("'vasarlasid' doesn't match any existing record.");
        }

        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}