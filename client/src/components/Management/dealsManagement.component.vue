<template>
  <v-app style="background-color: white" class="fill-height ml-3">
    <br />
    <v-row>
      <v-col>
        <h2>Deals</h2>
      </v-col>
      <v-col class="text-end" cols="6">
        <v-dialog v-model="LostDialog" scrollable max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="red"
              dark
              class="mb-2 mr-2"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>mdi-cash-remove</v-icon>Deals lost</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <p class="error--text">Deals lost</p>
              <v-spacer></v-spacer>
              <p class="text-body-1">
                {{ returnSum(LostDeals) }} TND &#8901;
                <span>{{ LostDeals.length }} Deals</span>
              </p>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-card
                outlined
                style="border-left: 8px solid red"
                height="120px"
                :ripple="false"
                class="mb-2 mt-2 text-left"
                v-for="(element, index) in LostDeals"
                :key="element._id"
                @click="editItem(element)"
              >
                <v-card-title>{{ element.title }} </v-card-title>
                <v-card-text>
                  <!-- <div>Contact : {{ element.contact }}</div> -->
                  <div>Valeur : {{ element.value }} TND</div>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="blue darken-1" text @click="LostDialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="WonDialog" scrollable max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="green"
              dark
              outlined
              class="mb-2 mr-2"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>mdi-cash-check</v-icon>Deals won</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <p class="success--text">Deals won</p>
              <v-spacer></v-spacer>
              <p class="text-body-1">
                {{ returnSum(WonDeals) }} TND &#8901;
                <span>{{ WonDeals.length }} Deals</span>
              </p>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-card
                outlined
                style="border-left: 8px solid #66bb6a"
                height="120px"
                :ripple="false"
                class="mb-2 mt-2 text-left"
                v-for="(element, index) in WonDeals"
                :key="element._id"
                @click="editItem(element)"
              >
                <v-card-title>{{ element.title }} </v-card-title>
                <v-card-text>
                  <!-- <div>Contact : {{ element.contact }}</div> -->
                  <div>Value : {{ element.value }} TND</div>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="blue darken-1" text @click="WonDialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog scrollable v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              color="teal lighten-1"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Deal
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <div v-if="editedIndex > -1">
                <v-dialog v-model="WonDeal" scrollable max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="stageType = 1"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      small
                      class="mr-2 green"
                    >
                      <v-icon left>mdi-thumb-up-outline</v-icon>
                      Won
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title> Deal won </v-card-title>
                    <v-card-text>
                      Would you like to mark this offer as

                      <span class="green--text font-weight-medium">Won</span>
                      ?
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn color="black" text @click="WonDeal = false"
                        >No</v-btn
                      >
                      <v-btn color="success" outlined @click="stageDeal()"
                        >Yes</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="LostDeal" scrollable max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="stageType = -1"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      small
                      class="mr-2 red"
                    >
                      <v-icon left>mdi-thumb-down-outline</v-icon>
                      Lost
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title> Lost offer </v-card-title>
                    <v-card-text>
                      Would you like to mark this deal as
                      <span class="red--text font-weight-medium">Lost</span> ?
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn color="black" text @click="LostDeal = false"
                        >No</v-btn
                      >
                      <v-btn color="red darken-1" outlined @click="stageDeal()"
                        >Yes</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" scrollable max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      class="mr-2 ml-2"
                      left
                    >
                      mdi-delete
                    </v-icon>

                    <!-- <v-btn
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      small
                      dark
                      text
                      class="mr-2 grey"
                      >Delete
                    </v-btn> -->
                  </template>
                  <v-card>
                    <v-card-title class="headline"
                      >Are you sure you want to delete this item?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="dialogDelete = false"
                        >Cancel</v-btn
                      >
                      <v-btn color="blue darken-1" text @click="deleteItem()"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-container>
                  <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                      <span class="label">Deal title</span>
                      <v-text-field
                        :rules="[rules.required]"
                        :error-messages="error"
                        dense
                        outlined
                        v-model="editedItem.title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
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
                          @input="$refs.menu1.save(editedItem.startDate)"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
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
                    <v-col cols="12" sm="12" md="12">
                      <span class="label">Contact</span>
                      <v-autocomplete
                        v-model="editedItem.contact"
                        :filter="filterObject"
                        :items="Contacts"
                        item-value="_id"
                        dense
                        outlined
                        :rules="[rules.required]"
                      >
                        <template slot="selection" slot-scope="data">
                          <span v-if="data.item.contactType == 'Agency'">
                            {{ data.item.agencyName }}
                          </span>
                          <span v-else>
                            {{ data.item.firstName }}
                            {{ data.item.lastName }}
                          </span>
                        </template>
                        <template v-slot:item="data">
                          <template v-if="typeof data.item !== 'object'">
                            <v-list-item-content
                              v-text="data.item"
                            ></v-list-item-content>
                          </template>
                          <template v-else>
                            <v-list-item-avatar class="teal">
                              <v-avatar color="red" size="50" class="teal">
                                <span class="white--text headline">
                                  {{ nameAvatar(data.item) }}</span
                                >
                              </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                v-html="
                                  data.item.firstName + ' ' + data.item.lastName
                                "
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                v-html="data.item.email"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <span class="label">Value</span>
                      <v-text-field
                        :rules="[rules.required, rules.number]"
                        dense
                        outlined
                        v-model="editedItem.value"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <span class="label">Stage</span>
                      <v-select
                        :rules="[rules.required]"
                        :items="stages"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                        v-model="editedItem.stage"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <span class="label">Status</span>
                      <v-select
                        :rules="[rules.required]"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                        v-model="editedItem.status"
                      ></v-select>
                    </v-col>
                    <br />
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="AddDeal">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row dense>
      <v-col cols="12"></v-col>
      <v-col cols="3">
        <v-card
          class="mr-3"
          outlined
          style="border-color: #00acc1; background-color: #00acc1"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subheading font-weight-bold">
                <span class="white--text font-weight-regular text-h6 mr-3"
                  >New Deal</span
                >
              </v-list-item-title>
              <v-list-item-subtitle style="font-size: 16px">
                <span class="white--text">
                  {{ returnSum(stagesMenu.New) }} TND &#8901;
                  <span>{{ stagesMenu.New.length }} Offers</span>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          class="mr-3"
          outlined
          style="border-color: #f9a825; background-color: #f9a825"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subheading font-weight-bold">
                <span class="white--text font-weight-regular text-h6 mr-3"
                  >Contacted</span
                >
              </v-list-item-title>
              <v-list-item-subtitle style="font-size: 16px">
                <span class="white--text">
                  {{ returnSum(stagesMenu.Contacted) }} TND &#8901;
                  <span>{{ stagesMenu.Contacted.length }} Offers</span>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          class="mr-3"
          outlined
          style="border-color: #7cb342; background-color: #7cb342"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subheading font-weight-bold">
                <span class="white--text font-weight-regular text-h6 mr-3"
                  >Qualified</span
                >
              </v-list-item-title>
              <v-list-item-subtitle style="font-size: 16px">
                <span class="white--text">
                  {{ returnSum(stagesMenu.Qualified) }} TND &#8901;
                  <span>{{ stagesMenu.Qualified.length }} Offers</span>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card
          class="mr-3"
          outlined
          style="border-color: #ef5350; background-color: #ef5350"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subheading font-weight-bold">
                <span class="white--text font-weight-regular text-h6 mr-3"
                  >Negociation</span
                >
              </v-list-item-title>
              <v-list-item-subtitle style="font-size: 16px">
                <span class="white--text">
                  {{ returnSum(stagesMenu.Negociation) }} TND &#8901;
                  <span>{{ stagesMenu.Negociation.length }} Offers</span>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense style="height: 70vh; overflow: scroll">
      <v-col
        :style="sheet ? 'border-right: 1px dashed #3180D6;' : ''"
        v-for="(item, indexx) in stagesMenu"
        :key="indexx"
        cols="3"
      >
        <draggable
          ref="draggable"
          :disabled="disabled"
          @choose="sheet = true"
          @unchoose="sheet = false"
          style="height: 100%"
          :list="item"
          group="StagesList"
          @change="log(indexx, $event)"
        >
          <v-card
            :style="
              indexx == 'New'
                ? 'border-left: 8px solid #00acc1 ;'
                : indexx == 'Contacted'
                ? 'border-left: 8px solid #f9a825 ;'
                : indexx == 'Qualified'
                ? 'border-left: 8px solid #7cb342 ;'
                : indexx == 'Negociation'
                ? 'border-left: 8px solid #ef5350;'
                : ''
            "
            elevation="2"
            :ripple="false"
            class="mb-2 mt-2 text-left"
            v-for="(element, index) in item"
            :key="element._id"
            @click="editItem(element)"
          >
            <v-card-title>{{ element.title }} </v-card-title>
            <v-card-text>
              <span>{{ element.startDate }} - {{ element.endDate }}</span>
              <v-spacer></v-spacer>
              <span>{{ element.value }} TND</span>
            </v-card-text>
          </v-card>
        </draggable>
      </v-col>
    </v-row>
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
    <v-col class="text-center" v-if="PageLoading" cols="12">
      <div>
        <v-progress-circular
          :size="50"
          :width="5"
          :active="PageLoading"
          color="amber"
          :indeterminate="PageLoading"
        ></v-progress-circular>
        <br />Chargement...
      </div>
    </v-col>
  </v-app>
</template>
<script>
import draggable from "vuedraggable";
import axios from "axios";
import _ from "lodash";

export default {
  components: {
    draggable,
  },
  data() {
    return {
      menu1: false,
      menu2: false,
      dialogDelete: false,
      sheet: false,
      visible: true,
      editedIndex: -1,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 2 || "Min 2 characters",
        max: (v) => v.length < 25 || "max 25 characters",
        number: (v) =>
          (!isNaN(parseFloat(v)) && v > 0 && v <= 999999) ||
          "Montant incorrecte",
      },
      dialog: false,
      WonDialog: false,
      LostDialog: false,
      LostDeal: false,
      DeleteDeal: false,
      PageLoading: false,
      disabled: false,
      color: "success",
      snackbar: false,
      icon: "",
      snackbarText: "",
      WonDeal: false,
      error: null,
      valid: true,
      stageType: 0,
      loading: false,
      editedItem: {
        _id: "",
        title: "",
        contact: "",
        value: "",
        status: "",
        stage: "",
        startDate: "",
        endDate: "",
      },
      defaultItem: {
        _id: "",
        title: "",
        contact: "",
        value: "",
        status: "",
        stage: "",
        startDate: "",
        endDate: "",
      },
      stagesMenu: {
        New: [],
        Contacted: [],
        Qualified: [],
        Negociation: [],
      },
      Contacts: [],
      WonDeals: [],
      LostDeals: [],
      DeleteDeal: [],
      stages: [
        { text: "New", value: "New" },
        { text: "Contacted", value: "Contacted" },
        { text: "Qualified", value: "Qualified" },
        { text: "In Negociation", value: "Negociation" },
      ],
      status: [
        { text: "Open", value: "Open" },
        { text: "Won", value: "Won" },
        { text: "Lost", value: "Lost" },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Deal" : "Edit";
    },
  },
  methods: {
    deleteItem() {
      axios
        .get(
          "http://localhost:3000/api/v1/deal/deleteDeal/" + this.editedItem._id
        )
        .then((res) => {
          this.InitializeDeals();
          this.dialogDelete = false;
          this.dialog = false;
        });
    },
    nameAvatar(item) {
      if (item.contactType == "Agency") {
        return item.agencyName[0].toUpperCase();
      } else {
        return item.firstName[0].toUpperCase();
      }
    },

    filterObject(item, queryText, itemText) {
      return (
        item.email.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
        item.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
        item.lastName.toLowerCase().indexOf(queryText.toLowerCase()) > -1
      );
    },

    returnSum(item) {
      return _.sumBy(item, "value");
    },
    editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    stageDeal() {
      if (this.stageType === 1) {
        this.editedItem.status = "Won";
        this.updateDeal(this.editedItem)
          .then((res) => {
            this.InitializeDeals();
            this.close();
          })
          .catch((error) => console.log(error));
      } else if (this.stageType === -1) {
        this.editedItem.status = "Lost";
        this.updateDeal(this.editedItem)
          .then((res) => {
            this.InitializeDeals();
            this.close();
          })
          .catch((error) => console.log(error));
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
    InitializeDeals() {
      axios
        .get("http://localhost:3000/api/v1/deal/getDeals")
        .then((res) => {
          let y = [];
          console.log("res", res.data.data);
          res.data.data.forEach((element) => {
            y.push({
              _id: element._id,
              title: element.title,
              contact: element.contact,
              value: element.value,
              status: element.status,
              stage: element.stage,
              startDate: new Date(element.startDate)
                .toISOString()
                .substr(0, 10),
              endDate: new Date(element.endDate).toISOString().substr(0, 10),
            });
          });
          if (y != []) {
            this.stagesMenu.New = y.filter(
              (x) => x.stage == "New" && x.status == "Open"
            );
            this.stagesMenu.Qualified = y.filter(
              (x) => x.stage == "Qualified" && x.status == "Open"
            );
            this.stagesMenu.Negociation = y.filter(
              (x) => x.stage == "Negociation" && x.status == "Open"
            );
            this.stagesMenu.Contacted = y.filter(
              (x) => x.stage == "Contacted" && x.status == "Open"
            );
            this.WonDeals = y.filter((x) => x.status == "Won");
            this.LostDeals = y.filter((x) => x.status == "Lost");
          }
        })
        .catch((error) => console.log(error));
    },
    async updateDeal(item) {
      return axios
        .post("http://localhost:3000/api/v1/deal/updateDeal/" + item._id, {
          title: item.title,
          contact: item.contact,
          value: item.value,
          status: item.status,
          stage: item.stage,
          startDate: item.startDate,
          endDate: item.endDate,
          //mariem: "update",
        })
        .then((res) => {
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    AddDeal() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          this.updateDeal(this.editedItem)
            .then((res) => {
              this.InitializeDeals();
              this.icon = "mdi-check-circle-outline";
              this.snackbarText = "Deal modified!";
              this.color = "success";
              this.snackbar = true;
              console.log(res);
              this.close();
            })
        } else {
          this.loading = true;
          axios
            .post("http://localhost:3000/api/v1/deal/addDeal", {
              title: this.editedItem.title,
              contact: this.editedItem.contact,
              value: this.editedItem.value,
              status: this.editedItem.status,
              stage: this.editedItem.stage,
              startDate: this.editedItem.startDate,
              endDate: this.editedItem.endDate,
            })
            .then((res) => {
              this.icon = "mdi-check-circle-outline";
              this.snackbarText = "Deal added!";
              this.color = "success";
              this.snackbar = true;
              this.loading = false;
              this.InitializeDeals();
              this.close();
            })
        }
      }
    },
    IntializeContacts() {
      axios
        .get("http://localhost:3000/api/v1/contact/getContacts")
        .then((res) => {
          this.Contacts = res.data.data;
          this.loading = false;
        })
        .catch((error) => console.log(error));
    },

    log(type, evt) {
      if (evt.added) {
        this.disabled = true;
        evt.added.element.stage = type;
        this.updateDeal(evt.added.element)
          .then((res) => {
            this.icon = "mdi-check-circle-outline";
            this.snackbarText = "Deal modified!";
            this.color = "success";
            this.snackbar = true;
            this.InitializeDeals();
          })
          .catch((err) => {
            this.icon = "mdi-alert";
            this.snackbarText = "Error";
            this.color = "red";
            this.snackbar = true;
          })
          .finally(() => {
            this.disabled = false;
          });
      }
    },
  },

  created() {
    this.IntializeContacts();
    this.InitializeDeals();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
};
</script>
<style lang="scss" scoped>
.v-card {
  border-radius: 5px;
}
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
.ghost {
  opacity: 0;
}
</style>
