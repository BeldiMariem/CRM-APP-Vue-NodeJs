<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="startDate"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <!-- The header of v iterator contains ->>> the search toolbar and 2 V-Dialogs; Add Activity and Delete Activity -->
      <template v-slot:header>
        <br />
        <v-toolbar flat color="white" class="mb-1" height="50">
          <v-col cols="7"><h2>Contacts</h2></v-col>
          <v-col cols="3">
            <v-text-field
              v-model="search"
              clearable
              outlined
              dense
              flat
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field
          ></v-col>
          <v-col cols="2">
            <!-- Add/Edit Activity V-Dialog to Add/Edit new activity -->
            <v-dialog scrollable v-model="dialog" max-width="1100px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="teal"
                  outlined
                  dark
                  v-bind="attrs"
                  v-on="on"
                  large
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add contact
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container>
                      <v-row>
                   
                        <v-col
                          cols="4"
                        >
                          <v-label>Last Name</v-label>
                          <v-text-field
                            :rules="[rules.required]"
                            solo
                            append-icon="mdi-account"
                            dense
                            v-model="editedItem.lastName"
                            outlined
                          >
                          </v-text-field>
                        </v-col>
            
                        <v-col cols="4">
                          <v-label>Email</v-label>
                          <v-text-field
                            :rules="[rules.emailRules]"
                            solo
                            dense
                            append-icon="mdi-gmail"
                            v-model="editedItem.email"
                            outlined
                          >
                          </v-text-field>
                        </v-col>

                        <v-col cols="4">
                          <v-label>Address</v-label>
                          <v-text-field
                            :rules="[rules.required]"
                            solo
                            append-icon="mdi-google-maps"
                            dense
                            v-model="editedItem.address"
                            outlined
                          >
                          </v-text-field>
                        </v-col>

                        <v-col cols="4">
                          <v-label>Phone Number</v-label>
                          <!-- There is an error in updating the number : the country number is not being read -->
                          <vue-tel-input-vuetify
                            solo
                            :rules="[rules.PhoneRules]"
                            dense
                            append-icon="mdi-phone"
                            v-model="editedItem.phoneNumber"
                            outlined
                          ></vue-tel-input-vuetify>
                        </v-col>
                        <v-col cols="4">
                          <v-label>Gender</v-label>
                          <v-select
                            outlined
                            :rules="[rules.required]"
                            append-icon="mdi-gender-male-female"
                            dense
                            v-model="editedItem.gender"
                            :items="genderSelect"
                          >
                          </v-select>
                        </v-col>
                        <v-col cols="4">
                          <v-menu
                            :rules="[rules.required]"
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                        
                            </template>
                            <v-date-picker
                              ref="picker"
                              :rules="[rules.required]"
                              v-model="editedItem.dateOfBirth"
                              :max="new Date().toISOString().substr(0, 10)"
                              min="1950-01-01"
                              @change="saveDate"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
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
          <!-- Delete Activity V-Dialog to delete any activity after click -->
          <v-dialog scrollable v-model="dialogDelete" max-width="500px">
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
      <!-- The body of v iterator contains ->>> the v cards to show the activities that already exist in a row and the actions which are the edit and delete -->
      <template v-slot:default="props">
        <br />
        <v-divider></v-divider>
        <br />
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="item in props.items"
            :key="item.idActivity"
          >
            <v-card
              height="100%"
              style="
                border-left: 4px solid #b0bec5;
                border-radius: 30px;
                border-bottom: 4px solid #b0bec5;
              "
            >
              <v-list-item three-line>
                <v-list-item-avatar size="48">
                  <v-avatar color="teal lighten-1">
                    <span class="white--text headline">
                      {{ nameAvatar(item) }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="subheading font-weight-bold">
                    <span style="font-size: 20px">
                      {{ item.firstName }}
                      {{ item.lastName }}</span
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle style="font-size: 16px">
                    <p>{{ item.email }}</p></v-list-item-subtitle
                  >
                </v-list-item-content>
                <showContact :item="item"></showContact>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <b>Phone Number:</b>
                </v-list-item-content>
                <v-list-item-content class="align-end">{{
                  item.phoneNumber
                }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Address:</b>
                </v-list-item-content>
                <v-list-item-content class="align-end">{{
                  item.address
                }}</v-list-item-content>
              </v-list-item>

              <v-spacer></v-spacer>
              <!-- The two main buttons of every card : the edit and delete -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  small
                  class="mr-2"
                  color="teal"
                  @click="editItem(item)"
                >
                  Edit
                </v-btn>
                <v-btn
                  text
                  small
                  class="mr-2"
                  color="teal"
                  @click="deleteItem(item)"
                >
                  Delete
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- The footer of v iterator contains ->>> Pagination -->
      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                outlined
                text
                small
                color="teal lighten-1"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            small
            outlined
            color="teal lighten-1"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            outlined
            color="teal lighten-1"
            small
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template></v-data-iterator></v-container>
</template>

<script>
import VueTelInput from "vue-tel-input";
import axios from "axios";
import showContact from "./showContact.component";
import "vue-tel-input/dist/vue-tel-input.css";

export default {
  data() {
    return {
      snackbarText: "",
      icon: "",
      color: "success",
      phone: null,
      value: "",
      menu: false,
      tabs: [{ text: "Deals", icon: "mdi-currency-usd-circle" }],

      EnterpriseRates: [],
      stages: [
        { text: "Nouvelle", value: "New" },
        { text: "Contactée", value: "Contacted" },
        { text: "Qualifiée", value: "Qualified" },
        { text: "En négociation", value: "Negociation" },
      ],
      status: [
        { text: "Ouverte", value: "Open" },
        { text: "Gagné", value: "Won" },
        { text: "Perdue", value: "Lost" },
      ],
      tab: null,
      valid: true,
      isEditing: false,
      dialog: false,
      DeleteDialog: false,
      SnackbarText: "",
      loading: false,
      RoleLoading: false,
      snackbarColor: "",
      snackbar: false,
      error: null,
      ContactData: [],
      editedItem: {
        id: "",
        name: "",
        lastName: "",
        type: "",
        phoneNumber: null,
        email: "",
      },
      defaultItem: {
        id: "",
        name: "",
        lastName: "",
        type: "",
        phoneNumber: null,
        email: "",
      },
      rules: {
        PhoneRules: (v) => !!v || "Phone number is required.",
        // (v) => /^[0-9]{8}$/.test(v) || "Phone number is required."),
        min: (v) => v.length >= 2 || "Min 2 characters",
        max: (v) => v.length < 14 || "max 14 characters",
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        emailRules:
          ((v) => !!v || "E-mail is required.",
          (v) => /.+@.+\..+/.test(v) || "E-mail is required."),
      },
      idUser: "",
      type: [],
      typeSelect: ["Client", "Community Leader", "Agency"],
      genderSelect: ["Female", "Male"],
      dialog: false,
      dialogDelete: false,
      start: null,
      end: null,
      date: null,
      menuStartDate: false,
      menuEndDate: false,
      dialogShow: false,
      name: "",
      creator: "",
      startDate: null,
      endDate: null,
      startTime: "",
      endTime: "",
      dialogAdd: false,
      dialogEdit: false,
      itemsPerPageArray: [8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
      editedIndex: -1,
      editedItem: {
        _id: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
        gender: "",
        dateOfBirth: "",
      },
      defaultItem: {
        _id: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        address: "",
        gender: "",
        dateOfBirth: "",
      },
      items: [],

      contacts: [],
    };
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  components: {
    VueTelInput,
    showContact,
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Contact" : "Edit Contact";
    },
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.items.filter(
        (key) => key !== "activityName" && key !== "activityType"
      );
    },
  },
  created() {
    this.initialize();
  },

  methods: {
    saveDate(date) {
      this.$refs.menu.saveDate(date);
    },
    nameAvatar(item) {
        return item.firstName[0].toUpperCase();
    },
  initialize() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/contact/getContacts")
          .then((res) => {
            //this.items = res.data.data;
            let listContacts = [];
            res.data.data.forEach((element) => {
              listContacts.push({
                _id: element._id,
                firstName: element.firstName,
                lastName: element.lastName,
                phoneNumber: element.phoneNumber,
                email: element.email,
                address: element.address,
                gender: element.gender,
                dateOfBirth: new Date(element.dateOfBirth)
                  .toISOString()
                  .substr(0, 10),  
              });
              
              console.log("######3", this.contacts);
              this.items = listContacts;
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },

    clickDelete(value) {
      this.items.splice(value, 1);
      this.dialogDelete = false;
    },
    clickShow(value) {
      this.items.splice(value, 1);
      this.dialogShow = false;
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      axios
        .get("http://localhost:3000/api/v1/contact/deleteContact/" + item._id)
        .then((res) => {
          if (res) {
            this.editedIndex = this.items.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
          }
        });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          // Edit
          axios
            .post(
              "http://localhost:3000/api/v1/contact/updateContact/" +
                this.editedItem._id,
              this.editedItem
            )
            .then((res) => {
              Object.assign(this.items[this.editedIndex], this.editedItem);
              this.close();
              this.icon = "mdi-check-circle-outline";
              this.snackbarText = "Contact modified!";
              this.color = "success";
              this.snackbar = true;
            });
        } else {
          // Add
          axios
            .post(
              "http://localhost:3000/api/v1/contact/addContact",
              this.editedItem
            )
            .then((res) => {
              this.close();
              this.icon = "mdi-check-circle-outline";
              this.snackbarText = "Contact added!";
              this.color = "success";
              this.snackbar = true;
              this.initialize();
            });
        }
      }
    },
  },
};
</script>
<style scoped>
.v-text-field--outlined fieldset {
  color: teal !important;
}

.v-input__icon--append .v-icon {
  color: teal;
}
</style>