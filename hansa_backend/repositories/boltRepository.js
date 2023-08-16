const { PrismaClient } = require('@prisma/client');
const InternalServerError = require("../exceptions/InternalServerError");

const prisma = new PrismaClient();
const pageSize = 25;

module.exports.list = async (filterData) => {
    let whereObject, orderByObject;

    if(filterData.searchColumn !== "" && filterData.searchTerm !== "")
    if(["id", "partnerid"].includes(filterData.searchColumn)){
        whereObject = {
            [filterData.searchColumn]: {
                equals: Number(filterData.searchTerm) ?  Number(filterData.searchTerm) : undefined,
            }
        }
    } else if(["nev"].includes(filterData.searchColumn)) {
        whereObject = {
            [filterData.searchColumn]: {
                contains: String(filterData.searchTerm),
                mode: 'insensitive',
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
            return await prisma.bolt.findMany({
                where: whereObject,
                orderBy: orderByObject,
            });
        } else {
            let response = {};
            response.result = await prisma.bolt.findMany({
                skip: (filterData.page - 1) * pageSize,
                take: pageSize,
                where: whereObject,
                orderBy: orderByObject,
            });

            response.count = await prisma.bolt.count({
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

module.exports.add = async (boltData) => {
    try {
        await prisma.bolt.create({
            data: {
                ...boltData
            }
        });
    } catch (error) {
        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}