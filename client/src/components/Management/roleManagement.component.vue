<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="functionnalities"
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
          <v-toolbar-title>Role Management</v-toolbar-title>
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
                New Role
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        :disabled="editedIndex > -1"
                        outlined
                        dense
                        v-model="editedItem.department"
                        label="Department"
                        solo
                        append-icon="mdi-account-details-outline"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="editedItem.roleManagemnent"
                        label="Role Managemnent"
                      ></v-checkbox>
                    </v-col> -->
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="editedItem.userManagemnent"
                        label="User Managemnent"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="editedItem.activityManagemnent"
                        label="Activity Managemnent"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="editedItem.contactManagemnent"
                        label="Contact Managemnent"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="editedItem.dealsManagemnent"
                        label="Deals Managemnent"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
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
            <span>{{ item.department }}</span>
          </td>
          <td>
            <v-icon
              dense
              v-if="item.roleManagemnent != true"
              color="red accent-3"
              aria-hidden="true"
              >mdi-minus-circle-outline</v-icon
            >
            <v-icon dense v-else aria-hidden="true" color="success"
              >mdi-check-circle-outline</v-icon
            >
          </td>
          <td>
            <v-icon
              dense
              v-if="item.userManagemnent != true"
              color="red accent-3"
              aria-hidden="true"
              >mdi mdi-minus-circle-outline</v-icon
            >
            <v-icon dense v-else aria-hidden="true" color="success"
              >mdi mdi-check-circle-outline</v-icon
            >
          </td>
          <td>
            <v-icon
              dense
              v-if="item.activityManagemnent != true"
              color="red accent-3"
              aria-hidden="true"
              >mdi mdi-minus-circle-outline</v-icon
            >
            <v-icon dense v-else aria-hidden="true" color="success"
              >mdi mdi-check-circle-outline</v-icon
            >
          </td>
          <td>
            <v-icon
              dense
              v-if="item.contactManagemnent != true"
              color="red accent-3"
              aria-hidden="true"
              >mdi mdi-minus-circle-outline</v-icon
            >
            <v-icon dense v-else aria-hidden="true" color="success"
              >mdi mdi-check-circle-outline</v-icon
            >
          </td>
          <td>
            <v-icon
              dense
              v-if="item.dealsManagemnent != true"
              color="red accent-3"
              aria-hidden="true"
              >mdi mdi-minus-circle-outline</v-icon
            >
            <v-icon dense v-else aria-hidden="true" color="success"
              >mdi mdi-check-circle-outline</v-icon
            >
          </td>
          <td>
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
              v-if="item.department != 'Owner'"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
              v-if="item.department != 'Owner'"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr></template
      >
    </v-data-table>
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
export default {
  data: () => ({
    color: "success",
    snackbar: false,
    icon: "",
    snackbarText: "",
    select: ["Vue"],
    items: ["Programming", "Vue", "Vuetify"],
    newItem: null,
    myloadingvariable: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Department",
        align: "start",
        sortable: false,
        value: "department",
      },
      { text: "Role managemnent", value: "roleManagemnent" },
      { text: "User managemnent", value: "userManagemnent" },
      { text: "Activity managemnent", value: "activityManagemnent" },
      { text: "Contact managemnent", value: "contactManagemnent" },
      { text: "Deals managemnent", value: "dealsManagemnent" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    functionnalities: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      department: "",
      roleManagemnent: "",
      userManagemnent: "",
      activityManagemnent: "",
      contactManagemnent: "",
      dealsManagemnent: "",
    },
    defaultItem: {
      id: "",
      department: "",
      roleManagemnent: "",
      userManagemnent: "",
      activityManagemnent: "",
      contactManagemnent: "",
      dealsManagemnent: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Role" : "Edit Role";
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

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/role/getRoles")
          .then((res) => {
            resolve(res.data);
            //console.log("aa", res.data);
            res.data.data.forEach((element) => {
              this.functionnalities.push({
                id: element._id,
                department: element.department,
                roleManagemnent: element.roleFunctionalities.roleManagemnent,
                userManagemnent: element.roleFunctionalities.userManagemnent,
                activityManagemnent:
                  element.roleFunctionalities.activityManagemnent,
                contactManagemnent:
                  element.roleFunctionalities.contactManagemnent,
                dealsManagemnent: element.roleFunctionalities.dealsManagemnent,
              });
            });
            this.myloadingvariable = false;
          })
          .catch((err) => {
            //console.log("test err", err.response.data.errors);
            reject(err);
          });
      });
    },

    editItem(item) {
      this.editedIndex = this.functionnalities.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      axios
        .get("http://localhost:3000/api/v1/role/deleteRole/" + item.id)
        .then((res) => {
          if (res) {
            this.editedIndex = this.functionnalities.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
          }
        });
    },
    deleteItemConfirm() {
      this.functionnalities.splice(this.editedIndex, 1);
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

        axios
          .post(
            "http://localhost:3000/api/v1/role/updateRole/" +
              this.editedItem.id,
            {
              id: this.editedItem.id,
              department: this.editedItem.department,
              roleFunctionalities: {
                roleManagemnent: this.editedItem.roleManagemnent,
                userManagemnent: this.editedItem.userManagemnent,
                activityManagemnent: this.editedItem.activityManagemnent,
                contactManagemnent: this.editedItem.contactManagemnent,
                dealsManagemnent: this.editedItem.dealsManagemnent,
              },
            }
          )
          .then((res) => {
            Object.assign(
              this.functionnalities[this.editedIndex],
              this.editedItem
            );
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "Role updated!";
            this.color = "success";
            this.snackbar = true;
            this.close();
          })
          .catch((error) => {
            this.icon = "mdi-alert";
            this.snackbarText = "Error while updating role!";
            this.color = "red";
            this.snackbar = true;
          });
      } else {
        // Add
        axios
          .post("http://localhost:3000/api/v1/role/roleAdd", {
            department: this.editedItem.department,
            roleFunctionalities: {
              roleManagemnent: this.editedItem.roleManagemnent,
              userManagemnent: this.editedItem.userManagemnent,
              activityManagemnent: this.editedItem.activityManagemnent,
              contactManagemnent: this.editedItem.contactManagemnent,
              dealsManagemnent: this.editedItem.dealsManagemnent,
            },
          })
          .then((res) => {
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "Role added!";
            this.color = "success";
            this.snackbar = true;
            this.functionnalities.splice(0, 0, {
              id: res.data.data._id,
              department: this.editedItem.department,
              roleManagemnent: this.editedItem.roleManagemnent,
              userManagemnent: this.editedItem.userManagemnent,
              activityManagemnent: this.editedItem.activityManagemnent,
              contactManagemnent: this.editedItem.contactManagemnent,
              dealsManagemnent: this.editedItem.dealsManagemnent,
            });

            this.close();
          });
      }
    },
  },
};
</script>