<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      class="elevation-1"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
      :loading="myloadingvariable"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>User managemnent</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            outlined
            dense
            class="mr-6"
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <!-- The Add and Edit Dialog -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="teal"
                outlined
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New User
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-if="editedIndex <= -1"
                      outlined
                      dense
                      v-model="editedItem.email"
                      :rules="emailRules"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-select
                      outlined
                      :items="rolesItems"
                      item-text="department"
                      item-value="_id"
                      label="Role"
                      v-model="editedItem.role"
                    ></v-select>
                  </v-col>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                  :disabled="!valid"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-icon
              small
              class="mr-6"
              color="yellow darken-3
"
              >mdi-account</v-icon
            >
            <span>{{ item.email }}</span>
          </td>
          <td>
            <span>{{ item.role.department }}</span>
          </td>
          <!-- The Profile Dialog -->
          <td class="center">
            <showUser :item="item"></showUser>
          </td>
          <td>
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </td>
        </tr></template
      >
    </v-data-table>
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
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        color="teal lighten-1"
        circle
      ></v-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import showUser from "./showUser.component";
import userMixin from "../../mixins/user.mixin";
export default {
  mixins: [userMixin],
  data: () => ({
    valid: true,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail is invalid",
    ],
    color: "success",
    snackbar: false,
    icon: "",
    snackbarText: "",
    dialogProfile: false,
    roleNameEdit: "",
    roleFunctionalitiesEdit: {},
    rolesItems: [],
    myloadingvariable: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Email", value: "email" },
      { text: "Role", value: "role" },
      { text: "Profile", value: "" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      role: "",
    },
    defaultItem: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      role: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  components: {
    showUser,
  },
  created() {
    this.initialize();
    this.getRoles();
  },

  methods: {
    getRoles() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/role/getRoles")
          .then((res) => {
            //  console.log("##################", res.data.data);
            // const map = new Map(Object.entries(res.data.data));
            // console.log(map); // Map(2) {"foo" => "bar", "baz" => 42}
            res.data.data.forEach((element) => {
              if (element) {
                this.rolesItems.push(element);
              }
            });
            //  console.log("@@@", this.rolesItems);

            //  console.log("###########this.rolesItems", this.rolesItems);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    initialize() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/auth/getUsers")
          .then((res) => {
            res.data.forEach((element) => {
              if (element.birthDate) {
                this.users.push({
                  id: element._id,
                  firstName: element.firstName,
                  lastName: element.lastName,
                  email: element.email,
                  birthDate: element.birthDate.slice(0, 10),
                  // role: res.data[0].role.department,
                  role: element.role,
                });
              } else {
                this.users.push({
                  id: element._id,
                  firstName: element.firstName,
                  lastName: element.lastName,
                  email: element.email,
                  birthDate: element.birthDate,
                  role: element.role,
                });
              }
            });
            //  console.log("test the users ", this.users);
            this.myloadingvariable = false;
          })
          .catch((err) => {
            //   console.log("test err", err.response.data.errors);
            reject(err);
          });
      });
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      axios
        .get("http://localhost:3000/api/v1/user/deleteUser/" + item.id)
        .then((res) => {
          if (res) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
          }
        });
    },
    deleteItemConfirm() {
      this.users.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        // Edit
        axios.defaults.headers["Authorization"] =
          "Bearer " + localStorage.token;
        axios
          .post(
            "http://localhost:3000/api/v1/user/updateProfileUser/" +
              this.editedItem.id,
            {
              /**_id: this.editedItem.id,**/
              role: this.editedItem.role,
            }
          )
          .then((res) => {
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "User modified!";
            this.color = "success";
            this.snackbar = true;
            this.editedItem.role = res.data[0].role;
            Object.assign(this.users[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            console.log("error", error);
            if (error.response.status === 400) this.error = "Update error";
            this.icon = "mdi-alert";
            this.snackbarText = "User update error.";
            this.color = "red";
            this.snackbar = true;
            this.close();
          });
      } else {
        // Add new user with its department.
        axios
          .post("http://localhost:3000/api/v1/auth/addNewUser", {
            email: this.editedItem.email,
            role: this.editedItem.role,
          })
          .then((res) => {
            res.data.forEach((element) => {
              this.users.splice(0, 0, {
                id: element._id,
                firstName: element.firstName,
                lastName: element.lastName,
                email: element.email,
                //  birthDate: element.birthDate.substr(0, 10),
                birthDate: element.birthDate,
                role: element.role,
              });
            });
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "User added!";
            this.color = "success";
            this.snackbar = true;
            this.close();
          })
          .catch((error) => {
            if (error.response.status === 400)
              this.error = "Email already exist";
            this.icon = "mdi-alert";
            this.snackbarText = error.response.data.errors;
            this.color = "red";
            this.snackbar = true;
            this.$refs.form.validate();
            this.close();
          });
      }
    },
  },
};
</script>