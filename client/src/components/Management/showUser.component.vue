<template>
  <v-dialog v-model="dialog" width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined small color="red accent-3" v-bind="attrs" v-on="on">
        Profile
      </v-btn>
      <!-- <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
        </v-btn> -->
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-label>Email</v-label>
              <v-text-field
                :label="item.email ? item.email : ''"
                readonly
                solo
                v-model="item.email"
                outlined
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>First Name</v-label>
              <v-text-field
                :label="item.firstName ? item.firstName : ''"
                solo
                readonly
                v-model="item.firstName"
                outlined
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>Last Name</v-label>
              <v-text-field
                readonly
                solo
                :label="item.lastName ? item.lastName : ''"
                v-model="item.lastName"
                outlined
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>BirthDate</v-label>
              <v-text-field
                :label="item.birthDate ? item.birthDate : ''"
                readonly
                solo
                v-model="item.birthDate"
                outlined
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>Role </v-label>
              <span>{{ getRole(item.role) }}</span>
              <v-text-field
                :label="this.department ? this.department : ''"
                readonly
                solo
                disabled
                v-model="this.department"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogProfile = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
export default {
  props: ["item"],
  
  data() {
    return {
      dialog: false,
      department:"",
    };
  },
  methods:{
    getRole(id) {
     
     axios
       .get("http://localhost:3000/api/v1/role/getRoleById/"+id)
       .then((res) => {
        console.log(id)
         res.data.data.forEach(element => {
          this.department =element.department;
         });
       })
       .catch((err) => {
         reject(err);
      
       });
      
 },
  }
};
</script>