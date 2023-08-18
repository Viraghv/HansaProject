<template>
    <div class="table-container col-8">
        <div class="header-container">
            <div class="left-align">
                <h1 class="display-5">Vásárlások</h1>
            </div>
            <div class="right-align">
                <SearchWithSelect :columns="vasarlasokColumns" @search="onSearch"/>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle export-btn"
                            type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                        <span v-show="!exportSpinner">Exportálás</span>
                        <span v-show="exportSpinner"
                              class="spinner-border spinner-border-sm export-spinner"
                              role="status"
                              aria-hidden="true"></span>
                        <span class="visually-hidden">Loading...</span>
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
                <tr>
                    <td v-show="!vasarlasok.length" :colspan="vasarlasokColumns.length">
                        <span class="no-result-text">Nincs találat</span>
                    </td>
                </tr>
                <template v-for="(vasarlas, index) in vasarlasok" :key="index" v-show="vasarlasok.length">
                    <tr @click="onClickRow(index)" class="outside-table-rows">
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
                                        <tr v-for="(tetel, index2) in vasarlas.vasarlastetelek" :key="index2">
                                            <td v-for="column in tetelekColumns">{{ getNestedObject(tetel, column.columnName) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="d-grid gap-2" v-if="!addInputsVisible[index]">
                                    <button type="button" class="btn btn-primary add-btn" @click="addInputsVisible[index] = true">
                                        + Tétel hozzáadása
                                    </button>
                                </div>
                                <div class="add-inputs" v-show="addInputsVisible[index]">
                                    <input v-model="addInputs[index].mennyiseg"
                                           class="form-control"
                                           :class="{invalid: inputInvalid[index].mennyiseg}"
                                           @focus="inputInvalid[index].mennyiseg = false"
                                           type="number"
                                           placeholder="Mennyiség"
                                           aria-label="default input example">
                                    <select v-model="addInputs[index].partnerctid"
                                            class="form-select cikk-select"
                                            :class="{nothing_selected: !addInputs[index].partnerctid,
                                                     invalid: inputInvalid[index].partnerctid}"
                                            @focus="inputInvalid[index].partnerctid = false"
                                            aria-label="Default select example">
                                        <option selected disabled :value="null">Cikk</option>
                                        <option v-for="cikk in cikkek" :value="cikk.id">{{cikk.cikkszam}} - {{cikk.nev}}</option>
                                    </select>
                                    <input v-model="addInputs[index].brutto"
                                           class="form-control"
                                           :class="{invalid: inputInvalid[index].brutto}"
                                           @focus="inputInvalid[index].brutto = false"
                                           type="number"
                                           placeholder="Bruttó"
                                           aria-label="default input example">
                                    <input v-model="addInputs[index].partnerid"
                                           class="form-control"
                                           :class="{invalid: inputInvalid[index].partnerid}"
                                           @focus="inputInvalid[index].partnerid = false"
                                           type="number"
                                           placeholder="PartnerID"
                                           aria-label="default input example">
                                    <button type="button"
                                            class="btn btn-primary add-submit-btn"
                                            @click="addTetel(index, vasarlas.id)">
                                        Hozzáad
                                    </button>
                                </div>
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
import {useToast} from "vue-toastification";

export default {
    name: 'Vasarlasok',
    components: {
        SearchWithSelect,
        VueAwesomePaginate

    },

    setup() {
        const toast = useToast();
        return{ toast }
    },

    data(){
        return {
            vasarlasok: [],
            cikkek: [],
            contentVisible: Array(25).fill(false),
            addInputsVisible: Array(25).fill(false),
            addInputs: Array(25).fill({
                mennyiseg: null,
                brutto: null,
                partnerid: null,
                partnerctid: null,
            }),
            inputInvalid: Array(25).fill({
                mennyiseg: false,
                partnerctid: false,
                brutto: false,
                partnerid: false,
            }),
            currentPage: ref(1),
            totalItems: 0,
            itemsPerPage: 25,

            filterObj: {
                orderBy: "id",
                orderType: "asc",
                searchColumn: "",
                searchTerm: "",
            },

            currentFilters: {
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
            ],

            exportSpinner: false,

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
                this.toast.error("Hiba történt!")
            }
        },

        async initCikkek(){
            try {
                const response = await this.axios.post('/cikkek/list', {
                    page: null,
                    orderBy: "nev",
                    orderType: "asc",
                    searchColumn: "",
                    searchTerm: "",
                });

                this.cikkek = response.data;
            } catch (error) {
                console.log(error.response.data);
                this.toast.error("Hiba történt!")
            }
        },

        async addTetel(index, vasarlasid) {
            try {
                this.inputInvalid[index] = {
                    mennyiseg: false,
                    partnerctid: false,
                    brutto: false,
                    partnerid: false,
                }

                if(this.validateTetelInputs(index)){
                    await this.axios.post('/tetel/add', {
                        partnerctid: this.addInputs[index].partnerctid,
                        vasarlasid: vasarlasid,
                        mennyiseg: this.addInputs[index].mennyiseg,
                        brutto: this.addInputs[index].brutto,
                        partnerid: this.addInputs[index].partnerid,
                    });

                    this.addInputsVisible[index] = false;
                    this.addInputs[index] = {
                        mennyiseg: null,
                        brutto: null,
                        partnerid: null,
                        partnerctid: null,
                    }

                    await this.initVasarlasok();
                    this.inputInvalid[index] = {
                        mennyiseg: false,
                        partnerctid: false,
                        brutto: false,
                        partnerid: false,
                    }
                }
            } catch (error) {
                console.log(error.response.data);
                this.toast.error("Hiba történt!")
            }
        },

        onPagination(page){
            this.initVasarlasok()
            this.contentVisible.fill(false);
            this.addInputsVisible.fill(false);
            this.addInputs.fill({
                mennyiseg: null,
                brutto: null,
                partnerid: null,
                partnerctid: null,
            });
            this.inputInvalid.fill({
                mennyiseg: false,
                partnerctid: false,
                brutto: false,
                partnerid: false,
            })
        },

        onSortTable(column) {
            if(this.filterObj.orderBy === column) {
                this.filterObj.orderType = this.filterObj.orderType === 'asc' ? 'desc' : 'asc';
            } else {
                this.filterObj.orderBy = column;
                this.filterObj.orderType = 'asc'
            }

            this.initVasarlasok();
            this.currentFilters = this.filterObj;
        },

        onSearch(searchObj){
            this.filterObj.searchColumn = searchObj.searchColumn;
            this.filterObj.searchTerm = searchObj.searchTerm;
            this.currentPage = 1;

            this.initVasarlasok();
            this.currentFilters = this.filterObj;
        },

        onExportToExcel(){
            this.vasarlasokExport("xlsx");
        },

        onExportToCSV(){
            this.vasarlasokExport("csv");
        },

        onClickRow(index){
            this.contentVisible[index] = !this.contentVisible[index]
            this.addInputsVisible[index] = false;
            this.addInputs[index] = {
                mennyiseg: null,
                brutto: null,
                partnerid: null,
                partnerctid: null,
            };
            this.inputInvalid[index] = {
                mennyiseg: false,
                partnerctid: false,
                brutto: false,
                partnerid: false,
            }
        },

        async vasarlasokExport(format){
            try {
                this.exportSpinner = true;

                let response = await this.axios.post(`/vasarlas/export/${format}`, this.currentFilters, {
                    responseType: 'blob',
                });

                let filename = `vasarlasok_${this.getLocalTime()}.${format}`
                const href = URL.createObjectURL(response.data);

                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();

                this.exportSpinner = false;

                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            } catch (error) {
                console.log(error.response.data);
                this.toast.error("Hiba történt!")
                this.exportSpinner = false;
            }
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
        },

        getLocalTime(){
            let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        },

        validateTetelInputs(index){
            let valid = true;

            if(!this.addInputs[index].mennyiseg || !this.addInputs[index].partnerctid ||
               !this.addInputs[index].brutto || !this.addInputs[index].partnerid){
                this.toast.error("Minden mező megadása kötelező!")
                valid = false;
            }

            if(this.addInputs[index].mennyiseg < 0 || this.addInputs[index].brutto < 0 ||
               this.addInputs[index].partnerid < 0) {
                this.toast.error("Nem adhatók meg negatív értékek!")
                valid = false;
            }

            if(this.addInputs[index].partnerid && !Number.isInteger(this.addInputs[index].partnerid)){
                this.toast.error("A Partner ID-nek egész számnak kell lennie!")
                this.inputInvalid[index].partnerid = true;
                valid = false;
            }

            for(let key in this.addInputs[index]){
                if(!this.addInputs[index][key] || this.addInputs[index][key] < 0){
                    this.inputInvalid[index][key] = true;
                }
            }

            return valid;
        },

    },

    mounted() {
        this.initVasarlasok();
        this.initCikkek();
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

        .no-result-text {
            color: var(--lightgrey);
            display: block;
            text-align: center;
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

        .hidden-row {
            .hidden-td {
                pointer-events: none;
                padding-left: 0 !important;
                padding-right: 0 !important;

                &:hover {
                    box-shadow: none;
                }

                .hidden-table {
                    margin-bottom: 0;
                }

                .add-btn {
                    pointer-events: auto;
                    background-color: var(--mainblue);

                    &:hover {
                        background-color: var(--hovermainblue)
                    }
                }

                .add-inputs {
                    pointer-events: auto;
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                    margin-bottom: 5px;

                    .cikk-select {
                        option {
                            color: black;

                            &:first-child {
                                color: grey;
                            }
                        }

                        option[disabled]:first-child {
                            display: none;
                        }
                    }

                    .nothing_selected {
                        color: grey;
                    }

                    .invalid {
                        border-color: red !important;
                    }

                    .add-submit-btn {
                        background-color: var(--mainblue);

                        &:hover {
                            background-color: var(--hovermainblue)
                        }
                    }
                }
            }
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
