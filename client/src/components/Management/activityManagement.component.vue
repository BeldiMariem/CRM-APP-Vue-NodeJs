<template>
  <v-app class="fill-height ml-3" style="background-color: white">
    <v-row v-if="!loading" class="fill-height" align="start">
      <v-col cols="12">
        <v-data-iterator
          :items="FilteredList"
          :items-per-page="itemsPerPage"
          :page="page"
          :search="search"
          hide-default-footer
          ><template v-slot:no-data>
            <v-row align-content="center" justify="center">
              <v-col cols="auto">
                <v-icon size="128px"> mdi-close-box-outline </v-icon>
              </v-col>
            </v-row>

            <v-row align-content="center" justify="center">
              <v-col cols="8" style="text-align: center">
                <h1 style="color: gray">No activity yet. Create one!</h1>
              </v-col>
            </v-row>
          </template>
          <template v-slot:header>
            <v-toolbar flat color="White" class="mb-1">
              <h1>Activities</h1>
              <v-spacer></v-spacer>
              <v-btn depressed @click="toggle_exclusive = undefined"
                ><v-icon>mdi-reload</v-icon></v-btn
              >
              <v-col cols="auto">
                <v-btn-toggle dense rou v-model="toggle_exclusive">
                  <v-btn
                    v-for="(item, index) in ActivityTypes"
                    :value="item.value"
                    :key="item.value"
                  >
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  dense
                  outlined
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                ></v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-dialog scrollable v-model="dialog" max-width="550px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      depressed
                      color="teal lighten-1"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon left>mdi-plus-circle</v-icon>
                      Add Activity
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                      <v-spacer></v-spacer>
                      <v-switch
                        color="success"
                        v-model="editedItem.done"
                        label="Done"
                        class="mr-4"
                      ></v-switch>
                      <v-dialog
                        v-if="editedIndex > -1"
                        v-model="DeleteDialog"
                        width="500"
                        overlay-color="rgba(23,39,77,.85)"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on" dark outlined color="grey">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>

                        <v-card>
                          <v-card-title>
                            <span
                              class="font-regular text-subtitle-1"
                              style="color: #f53636; padding: 10px 0px 10px"
                              >Are you sure ?</span
                            >
                          </v-card-title>
                          <v-card-text>
                            <v-form ref="form1" v-model="valid" lazy-validation>
                              <v-row>
                                <v-col cols="12">
                                  Are you sure you want to delete this activity

                                  <span class="heading 3 font-weight-black">
                                    {{ editedItem.email }}</span
                                  >
                                  ?
                                </v-col>
                              </v-row>
                            </v-form>
                          </v-card-text>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              dark
                              depressed
                              :loading="DeleteLoading"
                              color="#f53636"
                              @click="DeleteActivity()"
                            >
                              Yes
                            </v-btn>
                            <v-btn
                              outlined
                              depressed
                              @click="DeleteDialog = false"
                            >
                              No
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-container>
                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <span class="label">Type</span>
                              <v-select
                                :rules="[rules.required]"
                                dense
                                :items="ActivityTypes"
                                outlined
                                v-model="editedItem.activityType"
                              >
                                <template v-slot:selection="props">
                                  <v-icon class="mr-2">{{
                                    props.item.icon
                                  }}</v-icon>
                                  <span class="text-body-2">{{
                                    props.item.text
                                  }}</span>
                                </template>
                                <template v-slot:item="props">
                                  <v-icon class="mr-2">{{
                                    props.item.icon
                                  }}</v-icon>
                                  <span>{{ props.item.text }}</span>
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <span class="label">Time</span>
                              <v-text-field
                                :rules="[rules.required]"
                                outlined
                                dense
                                v-model="editedItem.time"
                                type="time"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <span class="label">Start Date</span>
                              <v-menu
                                ref="menu1"
                                v-model="menu1"
                                :close-on-content-click="false"
                                :return-value.sync="editedItem.startDate"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    outlined
                                    dense
                                    :rules="[rules.required]"
                                    v-model="editedItem.startDate"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.startDate"
                                  no-title
                                  scrollable
                                  @input="
                                    $refs.menu1.save(editedItem.startDate)
                                  "
                                >
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <span class="label">End Date</span>
                              <v-menu
                                ref="menu2"
                                v-model="menu2"
                                :close-on-content-click="false"
                                :return-value.sync="editedItem.endDate"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    outlined
                                    dense
                                    :rules="[rules.required]"
                                    v-model="editedItem.endDate"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.endDate"
                                  no-title
                                  scrollable
                                  @input="$refs.menu2.save(editedItem.endDate)"
                                >
                                </v-date-picker>
                              </v-menu>
                            </v-col>

                            <v-col cols="12" sm="12">
                              <span class="label">People</span>
                              <v-combobox
                                multiple
                                v-model="editedItem.activityUsers"
                                :items="Users"
                                item-value="_id"
                                dense
                                chips
                                outlined
                              >
                                <template slot="selection" slot-scope="data">
                                  <v-chip>
                                    {{ data.item.email }}
                                  </v-chip>
                                </template>
                                <template v-slot:item="data">
                                  <template>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        v-html="data.item.email"
                                      ></v-list-item-title>
                                    </v-list-item-content>
                                  </template>
                                </template>
                              </v-combobox>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                              <span class="label">Title</span>
                              <v-text-field
                                :rules="[rules.required]"
                                dense
                                outlined
                                v-model="editedItem.title"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                              <span class="label">Description</span>
                              <v-textarea
                                height="100"
                                :rules="[rules.required]"
                                item-value="value"
                                dense
                                outlined
                                v-model="editedItem.description"
                              >
                              </v-textarea>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close()"
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="AddActivity()"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-toolbar>
            <v-divider></v-divider>
          </template>
          <template v-slot:default="props">
            <br />
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  :style="
                    item.done == true
                      ? 'border: 2px solid #7cb342 ;'
                      : item.done == false
                      ? 'border: 2px solid #ef5350 ;'
                      : ''
                  "
                  :ripple="false"
                  @click="editItem(item)"
                  height="100%"
                  style="
                    border-left: 4px solid #b0bec5;
                    border-radius: 20px;
                    border-bottom: 4px solid #b0bec5;
                  "
                >
                  <v-list-item two-line class="mb-2">
                    <v-list-item-avatar>
                      <v-avatar>
                        <v-icon color="#7cb342" large v-if="item.done">{{
                          returnIcon(item.activityType)
                        }}</v-icon>
                        <v-icon color="#ef5350" large v-else>{{
                          returnIcon(item.activityType)
                        }}</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        class="headline mb-1"
                        style="font-size: 0.8em"
                      >
                        {{ item.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.activityType }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <b>Start Date :</b>
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.startDate }}
                        <!-- <v-text-field
                          readonly
                          dense
                          v-model="item.startDate"
                        ></v-text-field> -->
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <b>End Date :</b>
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.endDate }}
                        <!-- <v-text-field
                          readonly
                          dense
                          v-model="item.endDate"
                        ></v-text-field> -->
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <b>Time :</b>
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-text-field
                          dense
                          width
                          v-model="item.time"
                          type="time"
                        ></v-text-field>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <br />
                </v-card>
              </v-col>
            </v-row>
          </template>

          <template v-slot:footer>
            <v-row class="mt-2" align="center" justify="center">
              <div class="text-center">
                <v-pagination
                  color="teal lighten-1"
                  circle
                  v-model="page"
                  :length="numberOfPages"
                ></v-pagination>
              </div>
            </v-row> </template></v-data-iterator></v-col></v-row
  ></v-app>
</template>
        </v-data-iterator>
      </v-col>
    </v-row>
    <v-col class="text-center" v-if="loading" cols="12">
      <div>
        <v-progress-circular
          color="teal lighten-1"
          circle
          :size="50"
          :width="5"
          :active="loading"
          :indeterminate="loading"
        ></v-progress-circular>
        <br />Loading...
      </div>
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
  </v-app>
</template>

<script>
import axios from "axios";
import userMixin from "../../mixins/user.mixin";

export default {
  mixins: [userMixin],
  data() {
    return {
      switchView: false,
      DeleteLoading: false,
      editedIndex: -1,
      search: "",
      menu1: false,
      menu2: false,
      toggle_exclusive: undefined,
      page: 1,
      DeleteDialog: false,
      valid: true,
      dialog: false,
      itemsPerPage: 8,
      color: "success",
      snackbar: false,
      icon: "",
      snackbarText: "",
      ActivityTypes: [
        { text: "Phone Call", icon: "mdi-phone-outline", value: "Call" },
        { text: "Task", icon: "mdi-clipboard-check-outline", value: "Task" },
        {
          text: "Meeting",
          icon: "mdi-account-group-outline",
          value: "Meeting",
        },
        {
          text: "Presentation",
          icon: "mdi-desktop-mac-dashboard",
          value: "Demo",
        },
      ],
      ContactTypes: [
        { text: "Aucun type", value: "NoType", color: "" },
        { text: "Client", value: "Customer", color: "bluee" },
        { text: "Lead", value: "Lead", color: "greenn" },
        { text: "Vendeur", value: "Vendor", color: "purplee" },
        { text: "Partenaire", value: "Partner", color: "cyann" },
        { text: "Concurrent", value: "Competitor", color: "redd" },
        { text: "Revendeur", value: "Reseller", color: "yelloww" },
        { text: "Autre", value: "Other", color: "greyy" },
      ],
      Contacts: [],
      Users: [],
      Activities: [],
      editedItem: {
        _id: "",
        title: "",
        activityType: "",
        startDate: "",
        endDate: "",
        time: "",
        description: "",
        activityUsers: [],
        assignedUser: "",
        done: false,
      },
      defaultItem: {
        _id: "",
        title: "",
        activityType: "",
        startDate: "",
        endDate: "",
        time: "",
        description: "",
        activityUsers: [],
        assignedUser: "",
        done: false,
      },
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 2 || "Min 2 characters.",
        max: (v) => v.length < 25 || "max 25 characters.",
        emailRules:
          ((v) => !!v || "E-mail is required.",
          (v) => /.+@.+\..+/.test(v) || "E-mail is required."),
        PhoneRules:
          ((v) => !!v || "Phone number is required.",
          (v) => /^[0-9]{8}$/.test(v) || "Phone number is required."),
        number: (v) =>
          (!isNaN(parseFloat(v)) && v > 0 && v <= 999999) || "Value not valid.",
      },

      loading: false,
    };
  },
  methods: {
    format_date(value) {
      if (value) {
        return moment(String(value)).format("YYYYMMDD");
      }
    },
    returnType(item) {
      let x = this.ActivityTypes.find((x) => x.value == item);
      if (x) return x.text;
    },
    returnContact(item) {
      let x = this.Contacts.find((x) => x.id == item);
      if (x) return `${x.name} ${x.lastName}`;
    },
    returnUser(item) {
      let x = this.Users.find((x) => x._id == item);
      if (x) return `${x.firstName} ${x.lastName}`;
    },
    returnIcon(item) {
      let x = this.ActivityTypes.find((x) => x.value == item);
      if (x) return x.icon;
    },
    filterObject(item, queryText, itemText) {
      return (
        item.email.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
        item.firstName.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
        item.lastName.toLowerCase().indexOf(queryText.toLowerCase()) > -1
      );
    },
    DeleteActivity() {
      this.DeleteLoading = true;
      axios
        .get(
          "http://localhost:3000/api/v1/activity/deleteActivity/" +
            this.editedItem._id
        )
        .then((res) => {
          this.DeleteLoading = false;
          this.icon = "mdi-check-circle-outline";
          this.snackbarText = "Activity deleted!";
          this.color = "success";
          this.snackbar = true;
          this.initializeActivities();
          this.close();
        })
        .catch((error) => {
          this.DeleteLoading = false;
          console.log(error);
          this.icon = "mdi-alert";
          this.snackbarText = "Error";
          this.color = "red";
          this.snackbar = true;
        });
    },
    initializeActivities() {
      axios
        .get(
          "http://localhost:3000/api/v1/activity/getActivities/" +
            this.currentUser._id
        )
        .then((res) => {
          this.loading = false;
          let acts = [];
          res.data.data.forEach((ele) => {
            acts.push({
              _id: ele.element._id,
              title: ele.element.title,
              activityType: ele.element.activityType,
              startDate: new Date(ele.element.startDate)
                .toISOString()
                .substr(0, 10),
              endDate: new Date(ele.element.endDate)
                .toISOString()
                .substr(0, 10),
              // startDate: ele.element.startDate,
              // endDate: ele.element.endDate,
              time: ele.element.time,
              description: ele.element.description,
              activityUsers: ele.element.activityUsers,
              assignedUser: this.currentUser._id,
              done: ele.element.done,
            });
            this.Activities = acts;
          });
        })
        .catch((err) => console.log(err));
    },

    GetUsers() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/auth/getUsers")
          .then((res) => {
            if (res.data.length > 0) {
              resolve(res.data);
              res.data.forEach((element) => {
                if (element._id != this.currentUser._id) {
                  this.Users.push(element);
                }
              });
            } else {
              console.log("nnn");
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    AddActivity() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          axios
            .post(
              "http://localhost:3000/api/v1/activity/updateActivity/" +
                this.editedItem._id,
              {
                _id: this.editedItem._id,
                title: this.editedItem.title,
                activityType: this.editedItem.activityType,
                startDate: new Date(this.editedItem.startDate)
                  .toISOString()
                  .substr(0, 10),
                endDate: new Date(this.editedItem.endDate)
                  .toISOString()
                  .substr(0, 10),
                time: this.editedItem.time,
                description: this.editedItem.description,
                activityUsers: this.editedItem.activityUsers,
                assignedUser: this.currentUser._id,
                done: this.editedItem.done,
              },
              {
                /*   headers: {
                Authorization: "Bearer " + this.$store.state.Token,
              }, */
              }
            )
            .then((res) => {
              this.initializeActivities();
              this.icon = "mdi-check-circle-outline";
              this.snackbarText = "Activity modified!";
              this.color = "success";
              this.snackbar = true;
              console.log(res);
              this.close();
            })
            .catch((error) => {
              console.log(error);
              this.icon = "mdi-alert";
              this.snackbarText = "Erreur";
              this.color = "red";
              this.snackbar = true;
            });
        } else {
          axios
            .post("http://localhost:3000/api/v1/activity/activityAdd", {
              _id: this.editedItem._id,
              title: this.editedItem.title,
              activityType: this.editedItem.activityType,
              startDate: new Date(this.editedItem.startDate)
                .toISOString()
                .substr(0, 10),
              endDate: new Date(this.editedItem.endDate)
                .toISOString()
                .substr(0, 10),
              time: this.editedItem.time,
              description: this.editedItem.description,
              activityUsers: this.editedItem.activityUsers,
              assignedUser: this.currentUser._id,
              done: this.editedItem.done,
            })
            .then((res) => {
              this.initializeActivities();
              this.icon = "mdi-check-circle-outline";
              this.snackbarText = "Activity added!";
              this.color = "success";
              this.snackbar = true;
              this.close();
            })
            .catch((err) => {
              console.log(err);
              this.icon = "mdi-alert";
              this.snackbarText = "Error";
              this.color = "red";
              this.snackbar = true;
            });
        }
      }
    },
    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    getStyle(x) {
      var Value = this.ContactTypes.find((y) => y.value == x);
      if (x) {
        return Value;
      }
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
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    FilteredList() {
      return this.toggle_exclusive
        ? this.Activities.filter(
            (x) => x.activityType == this.toggle_exclusive
          ).reverse()
        : this.Activities.reverse();
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Activity" : "Edit Activity";
    },
    numberOfPages() {
      return Math.ceil(this.Activities.length / this.itemsPerPage);
    },
  },
  created() {
    this.loading = true;
    this.initializeActivities();
    this.GetUsers();
  },
};
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
.contact-type.greenn {
  background: #e6fff0;
  color: #00ac7c;
  border: 1px solid #00ac7c;
}
.contact-type.yelloww {
  background: #fffcf2;
  color: #ff8e01;
  border: 1px solid #ff8e01;
}
.contact-type.bluee {
  background: #edf6ff;
  color: #1f62ff;
  border: 1px solid #1f62ff;
}
.contact-type.redd {
  background: #fff2f5;
  border-color: #f04b50;
  color: #f53636;
}
.contact-type.purplee {
  background: #f4f2ff;
  border-color: #6236ff;
  color: #6236ff;
}
.contact-type.cyann {
  background: #ebfafc;
  border-color: #00bbd4;
  color: #00bbd4;
}
.contact-type.pinkk {
  background: #ffd0e0;
  border-color: #e91e63;
  color: #e91e63;
}
.contact-type.orangee {
  background: #fff4f2;
  border-color: #ff5622;
  color: #ff5622;
}
.contact-type.greyy {
  background: #e6eaf2;
  border-color: #c1c7d6;
  color: #606d8a;
}
.contact-type.greenlightt {
  background: #f6ffec;
  border-color: #8bc34a;
  color: #8bc34a;
}
</style>
