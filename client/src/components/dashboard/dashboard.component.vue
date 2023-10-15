<template>
  <div class="ml-4">
    <v-row>
      <v-col cols="12"><h2>CRM dashboard</h2></v-col>
      <v-col cols="12">
        <v-card height="100%">
          <v-container fluid>
            <lines-chart :Deals="FilteredList" :height="300"></lines-chart>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" sm="6" md="3" lg="3">
        <v-card
          max-height="150px"
          height="150px"
          style="
            border-left: 6px solid #90a4ae;
            border-bottom: 6px solid #90a4ae;
          "
        >
          <v-list-item three-line>
            <div class="mt-6">
              <v-progress-circular
                :rotate="360"
                :size="90"
                :width="14"
                :value="ReturnPercentage"
                color="teal lighten-1"
              >
                {{ ReturnPercentage }} %
              </v-progress-circular>
            </div>
            <v-spacer></v-spacer>
            <v-list-item-content center>
              <div class="display-1 mb-3">{{ ReturnPercentage }}%</div>
              <span>Gain</span>
            </v-list-item-content>
            <!-- <v-icon dark size="50"
              >mdi-chart-timeline-variant</v-icon
            > -->
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="3" sm="6" md="3" lg="3">
        <v-card
          max-height="150px"
          height="150px"
          style="
            border-left: 6px solid #90a4ae;
            border-bottom: 6px solid #90a4ae;
          "
        >
          <v-list-item three-line>
            <v-list-item-avatar
              size="90"
              color="deep-purple lighten-1
"
              ><v-icon dark size="60"
                >mdi-currency-usd</v-icon
              ></v-list-item-avatar
            >
            <v-spacer></v-spacer>
            <v-list-item-content center>
              <div class="display-1 mb-4">
                {{ nFormatter(Gains + Loses, 1) }}
              </div>
              <span>Profit</span>
            </v-list-item-content>
          </v-list-item>

          <!-- <v-card-text>
            <div class="mb-4" style="text-align: left">
              <v-icon>mdi-account</v-icon>
            </div>
            <div class="display-1 mb-4" style="text-align: left">
              {{ nFormatter(Gains + Loses, 1) }}
            </div>
            Profit
          </v-card-text> -->
        </v-card>
      </v-col>
      <v-col cols="3" sm="6" md="3" lg="3">
        <v-card
          max-height="150px"
          height="150px"
          style="
            border-left: 6px solid #90a4ae;
            border-bottom: 6px solid #90a4ae;
          "
        >
          <v-list-item three-line>
            <v-list-item-avatar size="90" color="deep-orange lighten-1"
              ><v-icon dark size="60">mdi-account</v-icon></v-list-item-avatar
            >
            <v-spacer></v-spacer>
            <v-list-item-content center>
              <div class="display-1 mb-4">
                {{ NumbreOfusers }}
              </div>
              <span>Users</span>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <!-- <v-col cols="4" sm="6" md="4" lg="4">
        <v-card
          max-height="150px"
          height="150px"
          style="
            border-left: 6px solid #90a4ae;
            border-bottom: 6px solid #90a4ae;
          "
          class="text-center"
        >
          <v-card-text>
            <div class="display-1 mb-4">{{ NumbreOfusers }}</div>
            Users
          </v-card-text>
        </v-card>
      </v-col> -->
      <!-- <v-col cols="4" sm="6" md="4" lg="4">
        <v-card
          max-height="150px"
          height="150px"
          class="text-center"
          style="
            border-left: 6px solid #90a4ae;
            border-bottom: 6px solid #90a4ae;
          "
        >
          <v-card-text>
            <div class="display-1 mb-4">{{ Contacts }}</div>
            Contacts
          </v-card-text>
        </v-card>
      </v-col> -->
      <v-col cols="3" sm="6" md="3" lg="3">
        <v-card
          max-height="150px"
          height="150px"
          style="
            border-left: 6px solid #90a4ae;
            border-bottom: 6px solid #90a4ae;
          "
        >
          <v-list-item three-line>
            <v-list-item-avatar
              size="90"
              color="teal lighten-1
"
              ><v-icon dark size="60"
                >mdi-account-group-outline</v-icon
              ></v-list-item-avatar
            >
            <v-spacer></v-spacer>
            <v-list-item-content>
              <div class="display-1 mb-4" center>
                {{ Contacts }}
              </div>
              Contacts
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat color="#90A4AE">
            <v-toolbar-title class="white--text">Tasks</v-toolbar-title>
          </v-toolbar>
          <v-card-text style="height: 200px; overflow-y: auto">
            <div v-if="TaskLength < 0">
              <v-row align-content="center" justify="center">
                <v-col cols="auto">
                  <v-icon size="50px"> mdi-close-box-outline </v-icon>
                </v-col>
              </v-row>

              <v-row align-content="center" justify="center">
                <v-col cols="8" style="text-align: center">
                  <h4 style="color: gray">
                    Pas de taches à faire pour le moment.
                  </h4>
                </v-col>
              </v-row>
            </div>
            <v-list v-else>
              <v-slide-y-transition class="py-0" group>
                <template v-for="(task, i) in tasks">
                  <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>

                  <v-list-item :key="`${i}-${task.text}`">
                    <v-list-item-action>
                      <v-checkbox
                        disabled
                        v-model="task.done"
                        :color="(task.done && 'grey') || 'primary'"
                      >
                        <template v-slot:label>
                          <div
                            :class="
                              (task.done && 'grey--text') || 'primary--text'
                            "
                            class="ml-4"
                            v-text="task.title"
                          ></div>
                        </template>
                      </v-checkbox>
                    </v-list-item-action>

                    <v-spacer></v-spacer>

                    <v-scroll-x-transition>
                      <v-icon v-if="task.done" color="success">
                        mdi-check
                      </v-icon>
                    </v-scroll-x-transition>
                  </v-list-item>
                </template>
              </v-slide-y-transition>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="6">
        <v-card>
          <v-toolbar flat color="green lighten-1">
            <v-toolbar-title class="white--text">Gain </v-toolbar-title>
          </v-toolbar>
          <v-card-text style="height: 200px; text-align: center">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="display-1 mb-4" center>
                  <v-progress-circular
                    :rotate="360"
                    :size="150"
                    :width="20"
                    :value="ReturnPercentage"
                    color="teal lighten-1"
                  >
                    {{ ReturnPercentage }} %
                  </v-progress-circular>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
  </div>
</template>


<script>
// import ActiveUsersChart from "./ActiveUsersChart.vue";
// import NotActiveUsersChart from "./NotActiveUsersChart.vue";
import axios from "axios";
import _ from "lodash";
import userMixin from "../../mixins/user.mixin";
import LinesChart from "./LinesChart.component.vue";
import { GetActivities } from "../../api/dashboard.service";
export default {
  mixins: [userMixin],
  components: {
    //     ActiveUsersChart,
    //     NotActiveUsersChart,
    LinesChart,
  },
  data() {
    return {
      interval: {},
      value: 0,
      Users: [],
      Roles: [],
      resultDeals: [],
      tasks: [],
      task: null,
      //task: null,
      numberOfContacts: "",
    };
  },
  mounted() {
    this.initialize();
    this.Deals();
    this.GetActivitiesDashboard();
  },
  computed: {
    Contacts() {
      Promise.all([this.GetContacts()]).then((results) => {
        if (results) {
          this.numberOfContacts = results[0].data.data.length;
        }
      });
      return this.numberOfContacts;
    },
    // SelectedEnterpriseId() {
    //   return this.$store.state.SelectedEnterpriseId;
    // },
    // SelectedEnterprise() {
    //   return this.$store.state.Enterprises.find(
    //     (x) => x.id == this.SelectedEnterpriseId
    //   );
    // },
    NumbreOfusers() {
      if (this.Users) return this.Users.data.length;
    },
    TaskLength() {
      if (this.tasks) return this.tasks.length;
    },
    FilteredList() {
      if (this.resultDeals) {
        let x = this.resultDeals.filter((y) => {
          if (y.status != "Open") {
            return y;
          }
        });
        return _.map(x, (val, key) => {
          if (val.status === "Lost") {
            val.value = -Math.abs(val.value);
            return { text: "Lost", value: val.value };
          } else return { text: "Won", value: val.value };
        });
      }
    },
    Gains() {
      return _.sumBy(this.FilteredList, (x) => {
        // console.log("x.value", x);
        if (x.value > 0) return x.value;
      });
    },
    Loses() {
      return _.sumBy(this.FilteredList, (x) => {
        // console.log("the loses ", x.value);
        if (x.value < 0) {
          console.log("x.value", x.value);
          return x.value;
        }
      });
    },
    ReturnPercentage() {
      let x = (((this.Gains + this.Loses) / this.Gains) * 100).toFixed(0);
      if (isNaN(x)) return 0;
      if (x <= 0) return 0;
      else return x;
    },
    ReturnLostPercentage() {
      let x = (((this.Gains + this.Loses) / this.Loses) * 100).toFixed(0);
      if (isNaN(x)) return 0;
      else return x;
    },

    // tasks() {
    //   Promise.all([this.GetActivities()]).then((results) => {
    //     if (results) {
    //       console.log(
    //         "= results[0].data.data.length",
    //         results[0].data.data.length
    //       );
    //       this.activitiesList = results[0].data.data.length;
    //     }
    //   });
    //   return this.activitiesList;
    // },
    // tasks() {
    //   if (this.SelectedEnterprise) {
    //     let userId = this.$store.getters.getUserId;
    //     return this.SelectedEnterprise.activities.filter(
    //       (x) => x.assignedUser == userId
    //     );
    //   }
    // },
  },

  methods: {
    nFormatter(num, digits) {
      var si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (Math.abs(num) >= si[i].value) {
          break;
        }
      }
      return (
        (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
      );
    },
    returnEmail(index) {
      if (this.Users.length > 0) return this.Users[index].email;
    },
    returnSum(status) {
      return _.sumBy(this.SelectedEnterprise.deals, (x) => {
        if ((x.status = status)) return;
      });
    },

    GetUsers() {
      return axios.get("http://localhost:3000/api/v1/auth/getUsers");
    },
    GetContacts() {
      return axios.get("http://localhost:3000/api/v1/contact/getContacts");
    },
    // GetActivities() {
    //   axios
    //     .get(
    //       "http://localhost:3000/api/v1/activity/getActivities/" +
    //         this.currentUser._id
    //     )
    //     .then((results) => {
    //       console.log(
    //         "#####################  results.data.data",
    //         results.data.data
    //       );
    //       results.data.data.forEach((ele) => {
    //         //   console.log("element", ele.element);
    //         this.tasks.push(ele.element);
    //       });
    //     });
    // },
    Deals() {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:3000/api/v1/deal/getDeals")
          .then((results) => {
            this.resultDeals = results.data.data;
          });
      });
    },
    GetActivitiesDashboard() {
      GetActivities(this.currentUser._id).then((res) => {
        res.forEach((ele) => {
          this.tasks.push(ele.element);
        });
        this.tasks = this.tasks.filter((x) => x.activityType == "Task");
      });
    },
    initialize() {
      Promise.all([this.GetUsers()])
        .then((results) => {
          this.Users = results[0].data;
          this.Users.forEach((element) => {
            this.Roles.push(element.role);
          });
        })
        .catch((error) => console.log(error));
    },
  },

  //   watch: {
  //     SelectedEnterpriseId() {
  //       this.initialize();
  //     },
  //   },
  //   created() {
  //     this.initialize();
  //   },
};
</script>
<style lang="scss" scoped>
.v-card {
  border-radius: 20px;
}
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>