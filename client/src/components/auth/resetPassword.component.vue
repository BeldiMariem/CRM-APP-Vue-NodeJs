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
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label=" Password"
                  prepend-inner-icon="mdi-lock"
                  outlined
                  :rules="[(v) => !!v || 'Password is required']"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  required
                />
                <v-text-field
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  label="Confirm Password"
                  prepend-inner-icon="mdi-lock"
                  outlined
                  :rules="[(v) => !!v || 'Password is required']"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  required
                />
              </v-form>
              <v-btn
                color="info"
                class="mr-4"
                @click="resetPassword"
                style="height: 45px"
                block
                outlined
              >
                <v-icon left>mdi-login</v-icon> Reset Password
              </v-btn>
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

export default {
  name: "ResetPassword",
  data() {
    return {
      color: "success",
      snackbar: false,
      icon: "",
      snackbarText: "",
      email: "",
      password: "",
      confirmPassword: "",
      emailRules: [
        (v) => !!v || "E-mail est obligatoire",
        (v) => /.+@.+\..+/.test(v) || "E-mail incorrect",
      ],
      lazy: false,
      valid: true,
      showPassword: false,
      users: [],
      v: false,
      role: "",
    };
  },
  methods: {
    resetPassword() {
      axios.defaults.headers["Authorization"] =
        "Bearer " + this.$route.params.token;
      axios
        .put("http://localhost:3000/api/v1/auth/resetPassword", {
          newPassword: this.password,
          confirmPassword: this.confirmPassword,
        })
        .then((res) => {
          this.icon = "mdi-check-circle-outline";
          this.snackbarText = res.data.data;
          this.color = "success";
          this.snackbar = true;
          //this.$router.push("/Login");
        })
        .catch((error) => {
          // this.$router.push("/forgetPassword");
          //console.log("error while forgot password api", err);
          this.icon = "mdi-alert";
          this.snackbarText = error.response.data.errors;
          this.color = "red";
          this.snackbar = true;
        });
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>