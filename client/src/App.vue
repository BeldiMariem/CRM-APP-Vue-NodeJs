<template>
  <!-- <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app> -->
  <v-app>
    <!-- <router-view name="AppBar"></router-view> -->
    <v-layout fill-height>
      <router-view name="NavBar"></router-view>
      <v-main>
        <v-container fluid>
          <router-view> </router-view>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  // created() {
  //   if (sessionStorage.getItem("store")) {
  //     this.$store.replaceState(
  //       Object.assign(
  //         {},
  //         this.$store.state,
  //         JSON.parse(sessionStorage.getItem("store"))
  //       )
  //     );
  //   }
  //   window.addEventListener("beforeunload", () => {
  //     sessionStorage.setItem("store", JSON.stringify(this.$store.state));
  //   });
  // },
};
</script>
