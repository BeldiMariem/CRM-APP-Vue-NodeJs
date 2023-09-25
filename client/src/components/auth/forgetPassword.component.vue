<template>
  <v-app>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card width="500" class="elevation-5">
          <v-container>
            <br />
            <div style="text-align: center">
              <h3>Reset Password</h3>
            </div>
            <br />
            <v-divider></v-divider>
            <br />
            <v-card-text>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  label=" Email"
                  prepend-inner-icon="mdi-email"
                  v-model="email"
                  outlined
                  :rules="emailRules"
                  required
                />
              </v-form>

              <v-btn
                color="info"
                class="mr-4"
                @click="forgotPassword"
                style="height: 45px"
                block
                dark
              >
                Validate
              </v-btn>

              <v-btn
                color="info"
                class="mr-4 mt-3"
                to="/"
                style="height: 45px"
                block
                outlined
              >
                Cancel
              </v-btn>
              <br />
              <br />
            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
      <v-snackbar
        v-model="snackbar"
        timeout="2000"
        color="white"
        transition="scroll-y-transition"
        top
      >
        <v-icon left class="mr-6" :color="color">{{ icon }}</v-icon>
        <span style="color: black">{{ snackbarText }}</span>
        <template v-slot:action="{ attrs }">
          <v-btn color="black" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-app>
</template>
<script>
import axios from "axios";
import { forgotPassword } from "../../api/auth.service";
export default {
  name: "forgotPassword",
  data() {
    return {
      color: "success",
      snackbar: false,
      icon: "",
      snackbarText: "",
      email: "",
      password: "",
      lazy: false,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail not correct",
      ],
      valid: true,
    };
  },
  methods: {
    forgotPassword() {
      forgotPassword(this.email)
        .then((res) => {
          this.icon = "mdi-check-circle-outline";
          this.snackbarText = res;
          this.color = "success";
          this.snackbar = true;
          this.$router.push("/");
        })
        .catch((error) => {
          this.icon = "mdi-alert";
          this.snackbarText = "This email does not exist!";
          this.color = "red";
          this.snackbar = true;
        });
    },
  },
};
</script>