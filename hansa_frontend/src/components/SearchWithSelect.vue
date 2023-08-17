<template>
    <div class="component-container">
        <select class="search-by-select" v-model="searchColumn" @input="clearSearchTerm">
            <option v-for="column in columns" :value = "column.columnName"> {{ column.displayedName }} </option>
        </select>
        <div class="searchbar-container">
            <input class="searchbar" type="text" v-model="searchTerm"  placeholder="Keresés" @keydown.enter="emitSearch">
            <button type="button" class="search-button" @click="emitSearch">
                <i class="bi bi-search search-icon"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchWithSelect",
    props: {
        columns: Array,
    },
    emits: ['search'],

    data() {
        return {
            searchColumn: "id",
            searchTerm: "",
        }
    },

    methods: {
        emitSearch(){
            this.$emit("search", {
                searchColumn: this.searchColumn,
                searchTerm: this.searchTerm,
            });
        },

        clearSearchTerm(){
            this.searchTerm = "";
        }
    }
}
</script>


<style scoped lang="scss">

.component-container {
    display: flex;
    gap: 10px;
    align-items: center;

    .search-by-select {
        width: 200px;
        border-radius: 0.375rem;
        border-color: var(--lightgrey);
        padding-left: 10px;
        height: 2.5rem;

        :active {
            border-color: var(--lightblue);
        }
    }

    .searchbar-container {
        display: flex;

        .searchbar {
            width: 300px;
            height: 2.5rem;
            border-left: solid 1px var(--lightgrey);
            border-top: solid 1px var(--lightgrey);
            border-bottom: solid 1px var(--lightgrey);
            border-right: none;
            border-top-left-radius: 0.375rem;
            border-bottom-left-radius: 0.375rem;
            padding-left: 20px;
            padding-right: 20px;

            &:focus {
                outline: none;
            }

        }

        .search-button {
            width: 50px;
            height: 2.5rem;
            border-left: none;
            border-radius: 0 0.375rem 0.375rem 0;
            border-right: solid 1px var(--mainblue);
            border-top: solid 1px var(--mainblue);
            border-bottom: solid 1px var(--mainblue);
            background-color: var(--mainblue);

            display: flex;
            align-items: center;
            justify-content: center;

            margin-left: -20px;

            &:hover {
                background-color: var(--hovermainblue);
            }

            .search-icon {
                width: 20px;
                color: white;
            }
        }
    }
}

</style>