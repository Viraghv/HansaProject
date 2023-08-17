import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import VueAxios from "vue-axios";
import '/style.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css'
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

axios.defaults.baseURL = process.env.VUE_APP_REQUEST_URL;

createApp(App)
    .use(router)
    .use(VueAxios, axios)
    .use(VueAwesomePaginate)
    .mount('#app')
