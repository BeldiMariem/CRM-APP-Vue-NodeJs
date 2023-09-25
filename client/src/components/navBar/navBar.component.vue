<template>
  <v-navigation-drawer app v-model="drawer" permanent>
    <v-list-item two-line>
      <v-list-item-avatar
        color="#6EC59A
        "
      >
        <!-- <span class="white--text headline">{{
          nameAvatar(currentUser.email)
        }}</span> -->
      </v-list-item-avatar>

      <v-list-item-content>
        <!-- <v-list-item-title>{{
          currentUser.email.substring(0, currentUser.email.indexOf("@"))
        }}</v-list-item-title> -->
        <!-- <v-list-item-subtitle>{{
          currentUser.role.department
        }}</v-list-item-subtitle> -->
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item to="/dashboard" active-class="active">
        <v-list-item-action>
          <v-icon color="#6EC59A">mdi-chart-box-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/profileManagement" active-class="active">
        <v-list-item-action>
          <v-icon
            color="#6EC59A
              "
            >mdi-cog-outline</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Profile Management</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/activityManagement" active-class="active">
        <!-- <v-list-item
          to="/activityManagement"
          active-class="active"
          v-show="currentUser.role.roleFunctionalities.activityManagemnent"
        > -->
        <v-list-item-action>
          <v-icon
            color="#6EC59A
              "
            >mdi-calendar-outline</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Activity Management</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/calendar" active-class="active">
        <v-list-item-action>
          <v-icon
            color="#6EC59A
              "
            >mdi-calendar</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Calendar</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/roleManagement" active-class="active">
        <!---        v-show="currentUser.role.roleFunctionalities.roleManagemnent"
-->
        <v-list-item-action>
          <v-icon
            color="#6EC59A
              "
            >mdi-account-details</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Role Management</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/userManagement" active-class="active">
        <v-list-item-action>
          <v-icon
            color="#6EC59A
            "
            >mdi-account-cog</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>User Management</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/contactManagement" active-class="active">
        <v-list-item-action>
          <v-icon
            color="#6EC59A
              "
            >mdi-account-group</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Contact Management</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/dealsManagement" active-class="active">
        <v-list-item-action>
          <v-icon
            color="#6EC59A
              "
            >mdi-handshake</v-icon
          >
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Deals Management</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- {{ currentUser.role.roleFunctionalities }} -->
    <template v-slot:append>
      <div class="pa-2">
        <v-btn @click="logout" dark dense color="#6EC59A"
          >Logout <v-icon right> mdi-logout </v-icon></v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import userMixin from "../../mixins/user.mixin";

export default {
  mixins: [userMixin],
  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "mdi-home-city" },
        { title: "My Account", icon: "mdi-account" },
        { title: "Users", icon: "mdi-account-group-outline" },
      ],
      mini: true,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    nameAvatar(currentUserData) {
      if (currentUserData) {
        let s = currentUserData.charAt(0);
        return s.toUpperCase();
      }
    },
  },
};
</script>
<style scoped>
.v-application .pa-2 {
  text-align: center;
}
</style>
