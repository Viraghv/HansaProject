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
import Toast from 'vue-toastification';
import "vue-toastification/dist/index.css";

axios.defaults.baseURL = process.env.VUE_APP_REQUEST_URL;

const toastOptions = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true,
    position: "bottom-left",
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    bodyClassName: "fixed-width",
}

createApp(App)
    .use(router)
    .use(VueAxios, axios)
    .use(VueAwesomePaginate)
    .use(Toast, toastOptions)
    .mount('#app')
