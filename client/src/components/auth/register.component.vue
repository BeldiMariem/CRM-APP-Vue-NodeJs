<template>
  <v-app>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="px-4">
          <v-card-text>
            <div style="text-align: center">
              <h3>Register</h3>
            </div>
            <v-form ref="registerForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="firstName"
                    :rules="[rules.required]"
                    label="First Name"
                    maxlength="20"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="lastName"
                    :rules="[rules.required]"
                    label="Last Name"
                    maxlength="20"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Birthday date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="date"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                      @change="save"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="12">
                  <v-text-field
                    block
                    v-model="verify"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, passwordMatch]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm Password"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col> -->
                <v-spacer></v-spacer>
                <v-col class="d-flex justify-center" cols="12" sm="3" xsm="12">
                  <v-btn
                    x-large
                    block
                    :disabled="!valid"
                    color="success"
                    @click="register"
                    >Register</v-btn
                  >
                </v-col>
                <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                  <p class="text-center">
                    Already have an account?
                    <v-btn color="success" to="/" outlined> Log in </v-btn>
                  </p>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
        <!-- <v-card width="500" class="elevation-5">
          <v-container>
            <br />
            <div style="text-align: center">
              <h3>Login</h3>
            </div>
            <br />
            <v-divider></v-divider>
            <br />
            <v-card-text>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  label="First Name"
                  prepend-inner-icon="mdi-email"
                  v-model="firstName"
                  outlined
                  :rules="emailRules"
                  required
                />
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label=" Password"
                  prepend-inner-icon="mdi-lock"
                  outlined
                  :rules="[(v) => !!v || 'Password est obligatoire']"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  required
                />
              </v-form>

              <v-btn
                color="info"
                class="mr-4"
                @click="Login"
                style="height: 45px"
                block
              >
                <v-icon left>mdi-login</v-icon>Login
              </v-btn>
              <br />
              <v-btn
                color="info"
                class="mr-4"
                style="height: 45px"
                to="/"
                block
              >
                <v-icon left>mdi-login</v-icon>Cancel
              </v-btn>
              <br />
            </v-card-text>
          </v-container>
        </v-card> -->
      </v-col>
    </v-row>
  </v-app>
</template>
<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  data() {
    return {
      firstName: "",
      lastName: "",
      date: null,
      email: "",
      password: "",
      verify: "",
      menu: false,
      dialog: true,
      valid: true,
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
      },
    };
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    register() {
      // let addLink = this.$route.params.token;
      // console.log("add link token ", addLink);
      // let user = {
      //   firstName: "mariem",
      //   lastName: "mariem",
      //   password: "mariem",
      // };
      // console.log("userr", user);
      if (
        !this.isValidEmail &&
        this.email != "" &&
        this.firstName != "" &&
        this.lastName != "" &&
        this.password != ""
      ) {
        // let addLink = this.$route.params.token;
        //console.log("add link token ", addLink);
        let user = {
          firstName: "mariem",
          lastName: "mariem",
          password: "mariem",
        };
        axios
          .post("http://localhost:3000/api/v1/auth/register", {
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            birthDate: this.date.substr(0, 10),
            addLink: this.$route.params.token,
          })
          .then((res) => {
            this.$router.push("/");
            console.log("response from register api", res);
          })
          .catch((err) => {
            this.$router.push("/");
            this.error = err.response.data.errors;
            console.log("error while register api", err);
          });
      } else {
        console.log("HEY HOUMAIN STOP BEING STUPID");
      }
    },
    // validate() {
    //   if (this.$refs.loginForm.validate()) {
    //   }
    // },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>