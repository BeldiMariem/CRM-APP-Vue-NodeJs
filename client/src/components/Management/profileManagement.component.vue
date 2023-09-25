<template>
  <div style="margin-top: 10%">
    <!-- <br /><br /><br /> -->
    <v-row class="pa-4">
      <v-col cols="12" md="4" class="d-flex text-center">
        <v-card class="pt-6 mx-auto" flat>
          <v-card-text style="position: sticky; top: 35%">
            <v-avatar size="100" color="info" class="white--text headline">
              {{ nameAvatar(currentUser.email) }}
            </v-avatar>
            <v-spacer></v-spacer>
            <br />
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Profile</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-label>Please enter your password to edit!</v-label>
                        <v-text-field
                          outlined
                          :type="showPasswordUpdate1 ? 'text' : 'password'"
                          v-model="pass"
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
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="savePassword">
                    Ok
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn outlined class="mr-2" @click="dialog = true"> Edit </v-btn>
            <v-btn class="ma-2" outlined @click="expand = !expand">
              Change password
            </v-btn>
            <v-expand-transition>
              <v-card flat color="white" v-show="expand" width="400">
                <v-card-text>
                  <v-form
                    ref="formPassword"
                    v-model="validPassword"
                    :lazy-validation="lazy"
                  >
                    <v-progress-circular
                      :width="3"
                      color="red"
                      v-show="load"
                      indeterminate
                    ></v-progress-circular>
                    <v-col cols="12" md="12">
                      <v-label class="mb-2"
                        >Please enter your current password</v-label
                      >
                      <v-text-field
                        class="mt-1"
                        type="password"
                        color="teal lighten-1"
                        label="Current password"
                        outlined
                        :rules="[(v) => !!v || 'Password is required']"
                        v-model="dataUser.currentPassword"
                        required
                      >
                      </v-text-field>
                      <v-label>Please enter your new password</v-label>
                      <v-text-field
                        class="mt-1"
                        type="password"
                        color="teal lighten-1"
                        :rules="[(v) => !!v || 'Password is required']"
                        label="New password"
                        outlined
                        v-model="dataUser.newPassword"
                        required
                      >
                      </v-text-field>
                    </v-col>
                    <v-btn
                      outlined
                      :disabled="!validPassword"
                      color="primary"
                      @click="updatePasswordCurrentUser"
                      >Save new password</v-btn
                    >
                  </v-form>
                </v-card-text>
              </v-card>
            </v-expand-transition>
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
                <v-btn
                  color="black"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="auto">
        <v-divider
          :vertical="$vuetify.breakpoint.mdAndUp ? true : false"
        ></v-divider>
      </v-col>
      <v-col cols="12" md="7" class="ml-md-6">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            :disabled="v == false"
            outlined
            v-model="dataUser.firstName"
            append-icon="mdi-account"
            :label="
              currentUser.firstName ? currentUser.firstName : 'First Name'
            "
          ></v-text-field>
          <v-text-field
            :disabled="v == false"
            outlined
            v-model="dataUser.lastName"
            append-icon="mdi-account"
            :label="currentUser.lastName ? currentUser.lastName : 'Last Name'"
          ></v-text-field>
          <template>
            <div>
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
                    :disabled="v == false"
                    outlined
                    v-model="dataUser.birthDate"
                    :label="
                      currentUser.birthDate
                        ? currentUser.birthDate.substr(0, 10)
                        : 'Birthday'
                    "
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dataUser.birthDate"
                  :active-picker.sync="activePicker"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                  @change="save"
                ></v-date-picker>
              </v-menu>
            </div>
          </template>
          <v-text-field
            outlined
            :disabled="v == false"
            v-model="dataUser.email"
            append-icon="mdi-gmail"
            type="email"
            :label="currentUser.email ? currentUser.email : 'Email'"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="v == false"
            color="success"
            class="mr-4"
            @click="updateProfileUser"
          >
            Save
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from "axios";
import userMixin from "../../mixins/user.mixin";
import { updatePassword, checkPassword } from "../../api/auth.service";

export default {
  mixins: [userMixin],
  data: () => ({
    load: false,
    lazy: false,
    color: "success",
    snackbar: false,
    icon: "",
    snackbarText: "",
    dataUser: {},
    validPassword: false,
    passCurrent: "",
    newPassword: "",
    dialog: false,
    v: false,
    pass: "",
    expand: false,
    showPassword: false,
    activePicker: null,
    showPasswordUpdate1: false,
    menu: false,
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    date: null,
    valid: true,
    name: "",
    //nameRules: [(v) => !!v || "Name is required"],
    // birthdayRules: [(v) => !!v || "Birthday is required"],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length >= 8) || "Password must be greater than 8 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),
  watch: {
    onSnackbarClose() {
      if (this.snackbar == false) {
        this.$emit("snackbar", false);
      }
    },
  },
  methods: {
    updatePasswordCurrentUser() {
      this.load = true;
      updatePassword(this.dataUser.currentPassword, this.dataUser.newPassword)
        .then((response) => {
          if (response) {
            console.log("Password updated waiting for response: ", response);
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "Your password got updated.";
            this.color = "success";
            this.snackbar = true;
            this.expand = !this.expand;
            this.load = false;
            this.dataUser.newPassword = "";
            this.dataUser.currentPassword = "";
          }
        })
        .catch((error) => {
          console.log("error in profile : ", error);
          if (error) {
            // this.dialog = false;
            if (error.status === 400) {
              this.error = "Error";
            }
            this.icon = "mdi-alert";
            this.snackbarText = "Please enter the correct current password.";
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          }
        });
    },

    updateProfileUser() {
      this.$store
        .dispatch("updateProfileUserAction", this.dataUser)
        .then((response) => {
          if (response) {
            this.v = false;
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "Your data got updated.";
            this.color = "success";
            this.snackbar = true;
          }
        })
        .catch((error) => {
          console.log("error in profile : ", error);
          if (error) {
            if (error.status === 400) {
              this.error = "Error";
            }
            this.icon = "mdi-alert";
            this.snackbarText = error.errors;
            this.color = "red";
            this.snackbar = true;
          }
        });
    },
    nameAvatar(currentUserData) {
      if (currentUserData) {
        let scurrentUserData = currentUserData.charAt(0);
        return scurrentUserData.toUpperCase();
      }
    },
    savePassword() {
      checkPassword(this.pass)
        .then((res) => {
          console.log("res again", res);
          this.dialog = false;
          this.v = true;
        })
        .catch((err) => {
          //console.log("error", err);
          this.icon = "mdi-alert";
          this.snackbarText = "Password is incorrect!";
          this.color = "red";
          this.snackbar = true;
          this.dialog = false;
        });
      // console.log("this.pass", this.pass);
      // axios
      //   .get("http://localhost:3000/api/v1/auth/verifyPassword/" + this.pass)
      //   .then((res) => {
      //     if (res) {
      //       console.log("Res", res);
      //       this.dialog = false;
      //       this.v = true;
      //     }
      //   });
    },

    // savePassword() {
    //   axios
    //     .get(
    //       "http://localhost:3000/api/v1/user/findUsersByEmail/" +
    //         localStorage.email +
    //         "/" +
    //         this.pass
    //     )
    //     .then((res) => {
    //       if (res) {
    //         this.dialog = false;
    //         this.v = true;
    //       }
    //     });
    // },
    save(date) {
      this.$refs.menu.save(date);
    },
    validate() {
      this.$refs.form.validate();
    },
    validatePassword() {
      this.$refs.formPassword.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
/* .v-card > *:first-child:not(.v-btn):not(.v-chip),
.v-card > .v-card__progress + *:not(.v-btn):not(.v-chip) {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  background-color: white;
  color: black;
} */

/* .v-input input:invalid,
.v-input textarea:invalid {
  box-shadow: none;
  color: pink;
} */
/* .theme--dark.v-input input,
.theme--dark.v-input textarea {
  color: pink; 
}*/
</style>
