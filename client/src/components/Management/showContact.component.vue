<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        dark
        outlined
        color="orange darken-1"
        v-bind="attrs"
        text
        v-on="on"
      >
        <v-icon dark> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="ma-0 pa-0"> </v-card-title>
      <v-card-text>
        <v-row class="pa-4">
          <v-col cols="12" md="4" class="d-flex text-center">
            <v-scroll-y-transition mode="out-in">
              <v-card class="pt-6 mx-auto" flat>
                <v-card-text style="position: sticky; top: 20%">
                  <v-avatar color="teal lighten-1">
                    <span class="white--text headline">
                      {{ nameAvatar(item) }}</span
                    >
                  </v-avatar>
                  <h3 class="headline text-capitalize mb-2">
                    {{ item.firstName }} {{ item.lastName }}
                  </h3>
                  <div class="blue--text mb-2">
                    {{ item.email }}
                  </div>
                  <v-divider></v-divider>
                  <v-row no-gutters class="text-left" tag="v-card-text">
                  
               
                    <v-col class="text-left mb-2" tag="strong" cols="6"
                      >First Name:
                    </v-col>
                    <v-col cols="6" class="text-capitalize">{{
                      item.firstName
                    }}</v-col>
                    <v-col class="text-left mb-2" tag="strong" cols="6"
                      >Last name:
                    </v-col>
                    <v-col cols="6" class="text-capitalize">
                      {{ item.lastName }}
                    </v-col>
                    <v-col class="text-left mb-2" tag="strong" cols="6"
                      >Gender:
                    </v-col>
                    <v-col cols="6">{{ item.gender }}</v-col>
                    <v-col class="text-left mb-2" tag="strong" cols="6"
                      >Phone Number:
                    </v-col>
                    <v-col cols="6">{{ item.phoneNumber }}</v-col>
                    <v-col class="text-left mb-2" tag="strong" cols="6"
                      >Date of birth:
                    </v-col>
                    <v-col cols="6">{{ item.dateOfBirth.slice(0, 10) }}</v-col>

                  
                  </v-row>
                </v-card-text>
              </v-card>
            </v-scroll-y-transition>
          </v-col>
          <v-col cols="12" md="auto">
            <v-divider
              :vertical="$vuetify.breakpoint.mdAndUp ? true : false"
            ></v-divider>
          </v-col>
          <v-col cols="12" md="7" class="ml-md-6">
            <v-row>
              <v-col cols="12">
                <v-tabs v-model="tab" centered icons-and-text>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab v-for="(i, index) in tabs" :key="index">
                    {{ i.text }}
                    <v-icon> {{ i.icon }}</v-icon>
                  </v-tab>
                </v-tabs>
                <v-divider></v-divider>
              </v-col>
              <v-col style="height: 400px; overflow-y: scroll" cols="12">
                <v-tabs-items v-model="tab">
                  <v-tab-item style="">
                    <v-row
                      v-for="(element, index) in ContactData"
                      :key="element._id"
                      align-content="center"
                      justify="center"
                    >
                      <v-card
                        width="95%"
                        :style="
                          element.element.stage === 'New'
                            ? 'border-left: 8px solid #0288D1;'
                            : element.element.stage == 'Contacted'
                            ? 'border-left: 8px solid #FFA000;'
                            : element.element.stage == 'Qualified'
                            ? 'border-left: 8px solid #558B2F;'
                            : element.element.stage == 'Negociation'
                            ? 'border-left: 8px solid #F4511E;'
                            : ''
                        "
                        elevation="2"
                        :ripple="false"
                        class="mb-2 mt-2 text-left"
                      >
                        <v-card-title
                          >{{ element.element.title }} <v-spacer></v-spacer
                          ><span class="text-body-2">
                            Offer : {{ index + 1 }}
                          </span></v-card-title
                        >
                        <v-card-text
                          class="d-flex flex-no-wrap justify-space-between"
                        >
                          <div>
                            <div>{{ element.element.value }} TND</div>
                          </div>
                          <div>
                            <div class="font-weight-bold">
                              State :
                              <span class="font-weight-regular">{{
                                element.element.status == "Won"
                                  ? "Won"
                                  : element.element.status == "Lost"
                                  ? "Lost"
                                  : "In progress"
                              }}</span>
                            </div>
                            <div class="font-weight-bold">
                              Stage :
                              <span
                                class="font-weight-regular"
                                :style="
                                  element.element.stage == 'New'
                                    ? 'color: #0288D1;'
                                    : element.element.stage == 'Contacted'
                                    ? 'color: #FFA000;'
                                    : element.element.stage == 'Qualified'
                                    ? 'color: #558B2F;'
                                    : element.element.stage == 'Negociation'
                                    ? 'color:#F4511E;'
                                    : ''
                                "
                                >{{
                                  element.element.stage == "New"
                                    ? "New"
                                    : element.element.stage == "Contacted"
                                    ? "Contacted"
                                    : element.element.stage == "Qualified"
                                    ? "Qualified"
                                    : element.element.stage == "Negociation"
                                    ? "In Negociation"
                                    : ""
                                }}</span
                              >
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-row>
                  </v-tab-item>
                </v-tabs-items></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn outlined depressed @click="dialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: ["item"],
  data() {
    return {
      tabs: [{ text: "Deals", icon: "mdi-currency-usd-circle" }],
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
      tab: null,
      dialog: false,
      ContactData: [],
    };
  },

  created() {
    this.getDeals();
  },

  methods: {
    getDeals() {
      axios
        .get(
          "http://localhost:3000/api/v1/deal/getDealsByContact?dealsContactId=" +
            this.item._id
        )
        .then((res) => {
          console.log("##############", res.data.data);
          this.ContactData = res.data.data;
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    nameAvatar(item) {
      if (item) {
  
            item.firstName[0].toUpperCase() + item.lastName[0].toUpperCase()
          
      } else {
        return " ";
      }
    },
  },
};
</script>