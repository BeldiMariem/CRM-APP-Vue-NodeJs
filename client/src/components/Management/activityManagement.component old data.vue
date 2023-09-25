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
          <v-col cols="7"><h2>Activities</h2></v-col>
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
            <v-dialog scrollable v-model="dialog" max-width="600px">
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
                  Add activity
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-label>Name</v-label>
                        <v-text-field
                          solo
                          dense
                          label="Name"
                          v-model="editedItem.activityName"
                          outlined
                        >
                        </v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-combobox
                          outlined
                          v-model="editedItem.activityUsers"
                          :items="users"
                          label="people"
                          multiple
                          chips
                        >
                        </v-combobox>
                      </v-col>
                      <!-- Start Date Picked -->
                      <v-col cols="12" sm="6">
                        <v-menu
                          ref="menuStartDate"
                          v-model="menuStartDate"
                          :close-on-content-click="false"
                          :return-value.sync="editedItem.activityStartDate"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              outlined
                              dense
                              v-model="editedItem.activityStartDate"
                              label="Start Date"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.activityStartDate"
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="menuStartDate = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.menuStartDate.save(
                                  editedItem.activityStartDate
                                )
                              "
                            >
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <!-- End Date Picked -->
                      <v-col cols="12" sm="6">
                        <v-menu
                          ref="menuEndDate"
                          v-model="menuEndDate"
                          :close-on-content-click="false"
                          :return-value.sync="editedItem.activityEndDate"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              outlined
                              v-model="editedItem.activityEndDate"
                              label="End Date"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.activityEndDate"
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="menuEndDate = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.menuEndDate.save(
                                  editedItem.activityEndDate
                                )
                              "
                            >
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>

                      <!-- Start Time -->
                      <v-col cols="12" sm="6">
                        <v-dialog
                          ref="dialog1"
                          v-model="modal2"
                          :return-value.sync="editedItem.activityStartTime"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              outlined
                              dense
                              v-model="editedItem.activityStartTime"
                              label="Start Time"
                              append-icon="mdi-clock-time-four-outline"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="modal2"
                            v-model="editedItem.activityStartTime"
                            full-width
                          >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="modal2 = false">
                              Cancel
                            </v-btn>
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.dialog1.save(editedItem.activityStartTime)
                              "
                            >
                              OK
                            </v-btn>
                          </v-time-picker>
                        </v-dialog>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-dialog
                          ref="dialog2"
                          v-model="modalEnd"
                          :return-value.sync="editedItem.activityEndTime"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              outlined
                              dense
                              v-model="editedItem.activityEndTime"
                              label="End Time"
                              append-icon="mdi-clock-time-four-outline"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="modalEnd"
                            v-model="editedItem.activityEndTime"
                            full-width
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="primary"
                              @click="modalEnd = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              text
                              color="primary"
                              @click="
                                $refs.dialog2.save(editedItem.activityEndTime)
                              "
                            >
                              OK
                            </v-btn>
                          </v-time-picker>
                        </v-dialog>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          outlined
                          dense
                          v-model="editedItem.activityType"
                          :items="typeSelect"
                          label="Type"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          name="input-7-1"
                          label="Activity Description"
                          v-model="editedItem.activityDescription"
                          value=""
                          outlined
                          dense
                        ></v-textarea>
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
          </v-col>
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
                border-radius: 20px;
                border-bottom: 4px solid #b0bec5;
              "
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="subheading font-weight-bold">
                    <span style="font-size: 20px">{{ item.activityName }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle style="font-size: 16px">
                    <p>{{ item.creatorName }}</p></v-list-item-subtitle
                  >
                </v-list-item-content>

                <showActivity :item="item"></showActivity>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <b>Type:</b>
                </v-list-item-content>
                <v-list-item-content class="align-end">{{
                  item.activityType
                }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Start Date :</b>
                </v-list-item-content>
                <v-list-item-content class="align-end">{{
                  item.activityStartDate
                }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>End Date :</b>
                </v-list-item-content>
                <v-list-item-content class="align-end">{{
                  item.activityEndDate
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
                  v-if="item.creatorId == idUser"
                  @click="editItem(item)"
                >
                  Edit
                </v-btn>
                <v-btn
                  v-if="item.creatorId == idUser"
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
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>
import editActivity from "./editActivity.component";
import deleteActivity from "./deleteActivity.component";
import showActivity from "./showActivity.component";
import VueTimepicker from "vue2-timepicker";
import axios from "axios";

export default {
  data() {
    return {
      modalEnd: false,
      menu2: false,
      modal2: false,
      idUser: "",
      yourDaysArray: [
        {
          start_time: { HH: "08", mm: "00" },
          end_time: { HH: "09", mm: "00" },
        },
        { start_time: { HH: "15", mm: "00" }, end_time: { HH: "", mm: "" } },
        { start_time: { HH: "", mm: "" }, end_time: { HH: "13", mm: "30" } },
        { start_time: { HH: "", mm: "" }, end_time: { HH: "", mm: "" } },
      ],
      time: {
        HH: "02",
        mm: "01",
        ss: "02",
      },
      users: [],
      // people: ["Programming", "Design", "Vue", "Vuetify"],
      people: [
        { text: "email user 1", value: "user1" },
        { text: "email user 2", value: " user2" },
      ],
      type: [],
      typeSelect: ["Meeting", "Task", "Activity"],
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
        creatorId: "",
        idActivity: "",
        activityName: "",
        creatorName: "",
        activityStartDate: "",
        activityEndDate: "",
        activityStartTime: "",
        activityEndTime: "",
        activityType: "",
        activityUsers: [],
        activityDescription: "",
      },
      defaultItem: {
        creatorId: "",

        idActivity: "",
        activityName: "",
        creatorName: "",
        activityStartDate: "",
        activityEndDate: "",
        activityStartTime: "",
        activityEndTime: "",
        activityType: "",
        activityUsers: [],
        activityDescription: "",
      },
      items: [],
    };
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
    editActivity,
    deleteActivity,
    showActivity,
    VueTimepicker,
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Activity" : "Edit Activity";
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
    this.getPeople();
  },

  methods: {
    getPeople() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/auth/getUsers")
          .then((res) => {
            resolve(res.data.data);
            res.data.data.forEach((element) => {
              if (element._id != localStorage.id) {
                this.users.push({ text: element.email, value: element._id });
              }
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    initialize() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            "http://localhost:3000/api/v1/activity/getActivities?activityCreatorId=" +
              localStorage.id
          )
          .then((res) => {
            res.data.data.forEach((element) => {
              axios
                .get(
                  "http://localhost:3000/api/v1/user/findUsersById/" +
                    element.element.creatorId
                )
                .then((resultat) => {
                  let newListPeople = [];
                  element.element.activityUsers.forEach((ele) => {
                    if (ele.value != element.element.creatorId) {
                      newListPeople.push(ele);
                    }
                  });

                  this.items.push({
                    idActivity: element.element._id,
                    activityName: element.element.activityName,
                    creatorName: resultat.data.data,
                    creatorId: element.element.creatorId,
                    activityStartDate: element.element.activityStartDate,
                    activityEndDate: element.element.activityEndDate,
                    activityStartTime: element.element.activityStartTime,
                    activityEndTime: element.element.activityEndTime,
                    activityType: element.element.activityType,
                    activityUsers: newListPeople,
                    activityDescription: element.element.activityDescription,
                  });
                  this.idUser = localStorage.id;
                });
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
        .get(
          "http://localhost:3000/api/v1/activity/deleteActivity/" +
            item.idActivity
        )
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
    /** The function save contains two part. The first one is for the edit Activity.
     *  The second part of for add activity and this is how it works:
     *  first, our goal in add activity is to add both the email and id of the current user connected or also the creator in order to show all the later using the activityUsers
     *  second, the axios requires a verify token before excution
     *  third, we send the full object editedItem that contains all the data we want to save in our DB concerning the activity.
     */
    save() {
      if (this.editedIndex > -1) {
        // Edit
        let s = [{ text: localStorage.emailCreator, value: localStorage.id }];
        s.push(this.editedItem.activityUsers);

        axios
          .post(
            "http://localhost:3000/api/v1/activity/updateActivity/" +
              this.editedItem.idActivity,
            {
              activityName: this.editedItem.activityName,
              creatorId: localStorage.id,
              activityStartDate: this.editedItem.activityStartDate,
              activityEndDate: this.editedItem.activityEndDate,
              activityStartTime: this.editedItem.activityStartTime,
              activityEndTime: this.editedItem.activityEndTime,
              activityType: this.editedItem.activityType,
              activityUsers: s,
              activityDescription: this.editedItem.activityDescription,
            }
          )
          .then((res) => {
            Object.assign(this.items[this.editedIndex], this.editedItem);
            this.close();
          });
      } else {
        // Add new activity
        let s = [{ text: localStorage.emailCreator, value: localStorage.id }];
        this.editedItem.activityUsers.forEach((element) => {
          console.log("element belehy", element);
          s.push({ text: element.text, value: element.value });
        });
        //Object.assign(s[1], this.editedItem.activityUsers);
        console.log("############s ", s);
        var accessToken = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        if (s) {
          axios
            .post("http://localhost:3000/api/v1/activity/activityAdd", {
              activityName: this.editedItem.activityName,
              creatorId: localStorage.id,
              activityStartDate: this.editedItem.activityStartDate,
              activityEndDate: this.editedItem.activityEndDate,
              activityStartTime: this.editedItem.activityStartTime,
              activityEndTime: this.editedItem.activityEndTime,
              activityType: this.editedItem.activityType,
              activityUsers: s,
              activityDescription: this.editedItem.activityDescription,
            })
            .then((res) => {
              this.items.splice(0, 0, {
                idActivity: res.data.data[0]._id,
                activityName: this.editedItem.activityName,
                creatorId: localStorage.id,
                creatorName: localStorage.emailCreator,
                activityStartDate: this.editedItem.activityStartDate,
                activityEndDate: this.editedItem.activityEndDate,
                activityStartTime: this.editedItem.activityStartTime,
                activityEndTime: this.editedItem.activityEndTime,
                activityType: this.editedItem.activityType,
                activityUsers: this.editedItem.activityUsers,
                activityDescription: this.editedItem.activityDescription,
              });
              this.close();
            });
        }
      }
    },
  },
};
</script>