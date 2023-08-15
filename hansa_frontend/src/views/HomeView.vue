<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },

  data(){
    return {
      test: process.env.VUE_APP_REQUEST_URL,
    }
  },

  methods: {
    async hello(){
      try {
        const response = await this.axios.get("/");
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    }
  },

  mounted() {
    this.hello();
  }
}
</script>
