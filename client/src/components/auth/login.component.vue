<template>
  <v-app>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
      
          <v-container>
            <br />
            <div style="text-align: center">
              <v-icon color="teal" size="48" outlined>mdi-account</v-icon>
              <h4>Sign In</h4>
            </div>
            <br />
            <v-divider></v-divider>
            <br />
      
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  label=" Email"
                  prepend-inner-icon="mdi-email"
                  v-model="dataUser.email"
                  outlined
                  :rules="emailRules"
                  required
                />
                <v-text-field
                  v-model="dataUser.password"
                  :type="showPassword ? 'text' : 'password'"
                  label=" Password"
                  prepend-inner-icon="mdi-lock"
                  outlined
                  :rules="[(v) => !!v || 'Password is required']"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                />
              </v-form>
              <v-btn
                color="teal"
                class="mr-4"
                @click="Login"
                style="height: 45px;color:white"
                block
                
              >
                <v-icon left>mdi-login</v-icon>Sign In
              </v-btn>
           
                <v-flex justify-center>
                  <v-btn color="teal" to="/forgetPassword" text>
                    Forgot password?
                  </v-btn>
                </v-flex>
           
              <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Update Password</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form v-model="isFormValid">
                        <!-- all input elements go here -->
                        <v-row>
                          <v-col cols="12" md="12">
                            <v-label>Password *</v-label>
                            <v-text-field
                              outlined
                              :type="showPasswordUpdate1 ? 'text' : 'password'"
                              v-model="dataUser.password"
                              :rules="passwordRules"
                              :append-icon="
                                showPasswordUpdate1 ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              @click:append="
                                showPasswordUpdate1 = !showPasswordUpdate1
                              "
                              required
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" md="12">
                            <v-label>Confirm Password *</v-label>
                            <v-text-field
                              outlined
                              v-model="dataUser.confirmPassword"
                              :append-icon="
                                showPasswordUpdate2 ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              @click:append="
                                showPasswordUpdate2 = !showPasswordUpdate2
                              "
                              :rules="
                                (passwordRules,
                                [rules.confirmPasswordRules],
                                confirmPasswordRules)
                              "
                              @update:error="checkPassword"
                              :type="showPasswordUpdate2 ? 'text' : 'password'"
                              required
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                    <small class="ml-3">*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- disable if form is not valid -->
                    <v-btn
                      :disabled="!isFormValid"
                      color="teal lighten-1"
                      text
                      @click="resetPassword"
                      >Change Password</v-btn
                    >
                    <v-btn color="teal lighten-1" text @click="dialog = false">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <br />
         
          </v-container>
      
      </v-col>
      <v-snackbar
        v-model="snackbar"
        timeout="1500"
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
import jwt_decode from "jwt-decode";
import forgetPassword from "../../components/auth/forgetPassword.component";

import forgetPasswordComponent from "./forgetPassword.component.vue";

export default {
  components: { forgetPasswordComponent },
  name: "Login",
  data() {
    return {
      dataUser: {},
      color: "success",
      snackbar: false,
      icon: "",
      snackbarText: "",
      isFormValid: false,
      password: "",
      confirmPassword: "",
      validPassword: "",
      rules: {
        confirmPasswordRules: (v) => !!v || "Password is required",
      },
      confirmPasswordRules: [
        (value) => !!value || "type confirm password",
        (value) =>
          value === this.dataUser.password ||
          "The password confirmation does not match.",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 5) || "Password must have 5+ characters",
        (v) => /(?=.*[A-Z])/.test(v) || "Must have one uppercase character",
        (v) => /(?=.*\d)/.test(v) || "Must have one number",
        (v) =>
          /([!@$%+])/.test(v) || "Must have one special character [!@#$%+]",
      ],
      dialog: false,
      pass: "",
      pass2: "",
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail is invalid",
      ],
      lazy: false,
      valid: true,
      showPassword: false,
      showPasswordUpdate1: false,
      showPasswordUpdate2: false,
      users: [],
      v: false,
      role: "",
      resetPasswordBtn: false,
    };
  },

  methods: {

    resetPassword() {
      let token = localStorage.token;
      let newPassword = this.dataUser.password;
      let confirmPassword = this.dataUser.confirmPassword;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("token");
      axios
        .put("http://localhost:3000/api/v1/auth/resetPasswordFirst", {
          newPassword,
          confirmPassword,
        })
        .then((res) => {
          this.dialog = false;
        })
        .catch((error) => {
          // console.log("full resp", error.response);
          // console.log("status", error.response.status);
          // console.log("only data", error.response.data);
          // //  console.log("#### other", error.response  .data[0]);
          if (error.response.status === 400) {
            this.error = "Error";
          }
          if (error.response.status === 403) {
            this.error = error.response.data;
            this.snackbarText = error.response.data;
            this.icon = "mdi-alert";
            this.color = "red";
            this.snackbar = true;
          }
          this.icon = "mdi-alert";
          this.snackbarText = "Error";
          this.color = "red";
          this.snackbar = true;
        });
    },
    checkPassword(invalid) {
      // correct: false
      if (true == invalid) {
        this.validPassword = false;
      } else {
        this.validPassword = true;
      }
    },

   
    Login() {
      this.$store
        .dispatch("loginAction", this.dataUser)
        .then((response) => {
          if (response) {
            // console.log("response", response);
            if (this.dataUser.password == "Azerty123") {
              this.dialog = true;
              this.resetPasswordBtn = false;
            } else {
              this.dialog = false;
              this.resetPasswordBtn = true;
              this.$router.push({ path: "/dashboard" });
            }
          }
        })
        .catch((error) => {
          if (error) {
            this.dialog = false;
            if (error.response.status === 400) {
              this.error = "Error";
            }
            this.icon = "mdi-alert";
            this.snackbarText = "Email or password incorrect!";
            this.color = "red";
            this.snackbar = true;
          }
        }); 
    },
    
  },
};
</script>
