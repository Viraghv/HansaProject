const { PrismaClient } = require('@prisma/client');
const InternalServerError = require("../exceptions/InternalServerError");

const prisma = new PrismaClient();
const pageSize = 25;

module.exports.list = async (filterData) => {
    let whereObject, orderByObject;

    if(filterData.searchColumn !== "" && filterData.searchTerm !== "")
        if(["id", "nettoegysegar", "verzio", "partnerid"].includes(filterData.searchColumn)){
            whereObject = {
                [filterData.searchColumn]: {
                    equals: Number(filterData.searchTerm) ?  Number(filterData.searchTerm) : undefined,
                }
            }
        } else if(["cikkszam", "vonalkod", "nev", "mennyisegiegyseg"].includes(filterData.searchColumn)) {
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
            return await prisma.cikkek.findMany({
                where: whereObject,
                orderBy: orderByObject,
            });
        } else {
            let response = {};
            response.result = await prisma.cikkek.findMany({
                skip: (filterData.page - 1) * pageSize,
                take: pageSize,
                where: whereObject,
                orderBy: orderByObject,
            });

            response.count = await prisma.cikkek.count({
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

module.exports.add = async (cikkData) => {
    try {
        await prisma.cikkek.create({
            data: {
                ...cikkData
            }
        });
    } catch (error) {
        console.log(error);
        throw new InternalServerError("Something went wrong!");
    } finally {
        await prisma.$disconnect();
    }
}