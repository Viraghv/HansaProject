<template>
    <div class="table-container col-8">
        <div class="header-container">
            <div class="left-align">
                <h1 class="display-5">Vásárlások</h1>
            </div>
            <div class="right-align">
                <SearchWithSelect :columns="vasarlasokColumns" @search="onSearch"/>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle export-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Export
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li class="dropdown-item" @click="onExportToExcel">Excel</li>
                        <li class="dropdown-item" @click="onExportToCSV">CSV</li>
                    </ul>
                </div>
            </div>
        </div>
        <table class="table table-hover outside-table">
            <thead class="outside-table-head">
                <tr>
                    <th v-for="column in vasarlasokColumns" @click="onSortTable(column.columnName)">
                        {{column.displayedName}}
                        <i class="bi bi-arrow-up"
                           v-show="doesArrowShow(column.columnName, 'asc')"></i>
                        <i class="bi bi-arrow-down"
                           v-show="doesArrowShow(column.columnName, 'desc')"></i>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(vasarlas, index) in vasarlasok" :key="index" >
                    <tr @click="contentVisible[index] = !contentVisible[index]" class="outside-table-rows">
                        <td v-for="column in vasarlasokColumns">
                            {{column.columnName === 'esemenydatumido' ?
                            formatDate(new Date(vasarlas[column.columnName])) :
                            vasarlas[column.columnName]}}
                        </td>
                    </tr>
                    <tr v-if="contentVisible[index]" class="hidden-row">
                        <td :colspan="vasarlasokColumns.length" class="hidden-td">
                            <div class="hidden-table-container">
                                <table class="table hidden-table">
                                    <thead class="hidden-table-head">
                                        <tr>
                                            <th v-for="column in tetelekColumns">{{ column.displayedName }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="hidden-table-body">
                                        <tr v-for="(tetel, index) in vasarlas.vasarlastetelek" :key="index">
                                            <td v-for="column in tetelekColumns">{{ getNestedObject(tetel, column.columnName) }}</td>
                                        </tr>
                                        <tr class="add-row">
                                           <td :colspan="tetelekColumns.length">
                                               + Tétel hozzáadása
                                           </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div class="pagination-div">
            <vue-awesome-paginate
                :total-items="totalItems"
                :items-per-page="itemsPerPage"
                :max-pages-shown="5"
                v-model="currentPage"
                :on-click="onPagination"
            />
        </div>

    </div>
</template>

<script>

import {ref} from "vue";
import {VueAwesomePaginate} from "vue-awesome-paginate";
import SearchWithSelect from "@/components/SearchWithSelect.vue";

export default {
    name: 'Vasarlasok',
    components: {
        SearchWithSelect,
        VueAwesomePaginate

    },

    data(){
        return {
            vasarlasok: [],
            contentVisible: Array(25).fill(false),
            currentPage: ref(1),
            totalItems: 0,
            itemsPerPage: 25,

            filterObj: {
                orderBy: "id",
                orderType: "asc",
                searchColumn: "",
                searchTerm: "",
            },

            vasarlasokColumns: [
                {
                    displayedName: "ID",
                    columnName: "id",
                },
                {
                    displayedName: "Időpont",
                    columnName: "esemenydatumido",
                },
                {
                    displayedName: "Összeg",
                    columnName: "vasarlasosszeg",
                },
                {
                    displayedName: "Pénztárgép azonosító",
                    columnName: "penztargepazonosito",
                },
                {
                    displayedName: "Partner ID",
                    columnName: "partnerid",
                },
                {
                    displayedName: "Bolt",
                    columnName: "boltnev",
                },
            ],

            tetelekColumns: [
                {
                    displayedName: "Tétel ID",
                    columnName: ["id"],
                },
                {
                    displayedName: "Mennyiség",
                    columnName: ["mennyiseg"],
                },
                {
                    displayedName: "Egység",
                    columnName: ["cikk", "mennyisegiegyseg"],
                },
                {
                    displayedName: "Cikknév",
                    columnName: ["cikk", "nev"],
                },
                {
                    displayedName: "Cikkszám",
                    columnName: ["cikk", "cikkszam"],
                },
                {
                    displayedName: "Vonalkód",
                    columnName: ["cikk", "vonalkod"],
                },
                {
                    displayedName: "Cikkverzió",
                    columnName: ["cikk", "verzio"],
                },
                {
                    displayedName: "Nettó egységár",
                    columnName: ["cikk", "nettoegysegar"],
                },
                {
                    displayedName: "Bruttó",
                    columnName: ["brutto"],
                },
                {
                    displayedName: "Tétel Partner ID",
                    columnName: ["partnerid"],
                },
                {
                    displayedName: "Cikk Partner ID",
                    columnName: ["cikk", "partnerid"],
                },
            ]

        }
    },

    methods: {
        async initVasarlasok() {
            try {
                const response = await this.axios.post('/vasarlas/list', {
                    page: this.currentPage,
                    ...this.filterObj
                });
                this.vasarlasok = response.data.result;
                this.totalItems = response.data.count;
            } catch (error) {
                console.log(error.response.data);
            }
        },

        onPagination(page){
            this.initVasarlasok()
        },

        onSortTable(column) {
            if(this.filterObj.orderBy === column) {
                this.filterObj.orderType = this.filterObj.orderType === 'asc' ? 'desc' : 'asc';
            } else {
                this.filterObj.orderBy = column;
                this.filterObj.orderType = 'asc'
            }

            this.initVasarlasok();
        },

        onSearch(searchObj){
            this.filterObj.searchColumn = searchObj.searchColumn;
            this.filterObj.searchTerm = searchObj.searchTerm;
            this.currentPage = 1;

            this.initVasarlasok();
        },

        onExportToExcel(){

        },

        onExportToCSV(){

        },

        padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        },

        formatDate(date) {
            return (
                [
                    date.getFullYear(),
                    this.padTo2Digits(date.getMonth() + 1),
                    this.padTo2Digits(date.getDate()),
                ].join('-') +
                ' ' +
                [
                    this.padTo2Digits(date.getHours()),
                    this.padTo2Digits(date.getMinutes()),
                    this.padTo2Digits(date.getSeconds()),
                ].join(':')
            );
        },

        getNestedObject(nestedObj, pathArr){
            return pathArr.reduce((obj, key) =>
                (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
        },

        doesArrowShow(column, type) {
            let otherType = type === 'asc' ? 'desc' : 'asc';
            return (this.filterObj.orderBy === column && this.filterObj.orderType === otherType) ||
                   (this.filterObj.orderBy !== column && type === 'asc');
        }
    },

    mounted() {
        this.initVasarlasok();
    }
}
</script>

<style lang="scss">

    .table-container {
        margin-left: auto;
        margin-right: auto;

        .header-container {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            margin-bottom: 30px;

            .right-align {
                display: flex;
                align-items: center;
                gap: 15px;

                .export-btn {
                    background-color: var(--mainblue);
                    height: 2.5rem;
                }

                li:hover {
                    cursor: pointer;
                }
            }
        }

        .outside-table {
            th {
                i {
                    visibility: hidden;
                }
            }

            th:hover {
                cursor: pointer;

                i {
                    visibility: visible;
                }
            }

            .outside-table-rows {
                :hover {
                    cursor: pointer;
                }
            }
        }

        .hidden-td {
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        .hidden-row {
            pointer-events: none;
        }

        .hidden-table {
            margin-bottom: 0;
        }

        .hidden-table-head > tr {
            & > th {
                background-color: var(--lightblue);
            }
        }

        .hidden-table-body > tr {
            & > td {
                background-color: var(--lightblue);
            }
        }

        .add-row > td {
            background-color: var(--lightblue) !important;
        }

        .pagination-div {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            margin-top: 30px;
        }
    }

</style>
