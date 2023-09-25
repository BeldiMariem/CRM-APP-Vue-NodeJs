<template>
  <v-container fluid>
    <v-row justify="center">
      <v-subheader>Today</v-subheader>

      <v-expansion-panels popout>
        <v-expansion-panel
          v-for="(message, i) in messages"
          :key="i"
          hide-actions
        >
          <v-expansion-panel-header>
            <v-row align="center" class="spacer" no-gutters>
              <v-col cols="4" sm="2" md="1">
                <v-avatar size="36px">
                  <img
                    v-if="message.avatar"
                    alt="Avatar"
                    src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
                  />
                  <v-icon
                    v-else
                    :color="message.color"
                    v-text="message.icon"
                  ></v-icon>
                </v-avatar>
              </v-col>

              <v-col class="hidden-xs-only" sm="5" md="3">
                <strong v-html="message.name"></strong> aaaaaaaaaa
                <span v-if="message.total" class="grey--text">
                  &nbsp;({{ message.total }})
                </span>
              </v-col>

              <v-col class="text-no-wrap" cols="5" sm="3">
                <v-chip
                  v-if="message.new"
                  :color="`${message.color} lighten-4`"
                  class="ml-0 mr-2 black--text"
                  label
                  small
                >
                  {{ message.new }} new
                </v-chip>
                <strong v-html="message.title"></strong>
              </v-col>

              <v-col
                v-if="message.excerpt"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                &mdash;
                {{ message.excerpt }}
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text v-text="lorem"></v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    messages: [
      {
        avatar: "https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",
        name: "John Leider",
        title: "Welcome to Vuetify!",
        excerpt: "Thank you for joining our community...",
      },
      {
        color: "red",
        icon: "mdi-account-multiple",
        name: "Social",
        new: 1,
        total: 3,
        title: "Twitter",
      },
      {
        color: "teal",
        icon: "mdi-tag",
        name: "Promos",
        new: 2,
        total: 4,
        title: "Shop your way",
        exceprt: "New deals available, Join Today",
      },
    ],
    lorem:
      "Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.",
  }),
};
</script>


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
      <v-avatar color="red">
        <span class="white--text headline">
          {{ nameAvatar(item) }}</span
        >
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="subheading font-weight-bold">
        <span style="font-size: 20px">
          {{ item.contactFirstName }}
          {{ item.contactLastName }}</span
        >
        <!-- <v-btn
          style="float: right"
          dark
          outlined
          color="red accent-3"
          v-bind="attrs"
          text
          v-on="on"
        >
          <v-icon dark> mdi-eye </v-icon>
        </v-btn> -->
      </v-list-item-title>
      <v-list-item-subtitle style="font-size: 16px">
        <p>{{ item.email }}</p></v-list-item-subtitle
      >
    </v-list-item-content>
  </v-list-item>
  <v-divider></v-divider>
  <v-list-item>
    <v-list-item-content>
      <b>Type:</b>
    </v-list-item-content>
    <v-list-item-content class="align-end">{{
      item.contactType
    }}</v-list-item-content>
  </v-list-item>
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















<v-card>
  <v-card-title class="ma-0 pa-0"> </v-card-title>
  <v-card-text>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="pa-4">
        <v-col cols="12" md="4" class="d-flex text-center">
          <v-scroll-y-transition mode="out-in">
            <v-card class="pt-6 mx-auto" flat>
              <v-card-text style="position: sticky; top: 20%">
                <v-avatar color="red">
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
                <v-row
                  no-gutters
                  class="text-left"
                  tag="v-card-text"
                >
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >Type :
                  </v-col>
                  <v-col cols="6" class="text-capitalize">
                    {{ item.contactType }}
                  </v-col>
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >First Name:
                  </v-col>
                  <v-col cols="6" class="text-capitalize">{{
                    item.firstName
                  }}</v-col>
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >Last name:
                  </v-col>
                  <v-col cols="6" class="text-capitalize">
                    {{ item.lastName }}
                  </v-col>
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >Phone Number:
                  </v-col>
                  <v-col cols="6">{{
                    item.phoneNumber
                  }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-scroll-y-transition>
        </v-col>
        <v-col cols="12" md="auto">
          <v-divider
            :vertical="
              $vuetify.breakpoint.mdAndUp ? true : false
            "
          ></v-divider>
        </v-col>
        <v-col cols="12" md="7" class="ml-md-6">
          <v-row>
            <v-col cols="12">
              <v-tabs v-model="tab" centered icons-and-text>
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                  v-for="(i, index) in tabs"
                  :key="index"
                >
                  {{ i.text }}
                  <v-icon> {{ i.icon }}</v-icon>
                </v-tab>
              </v-tabs>
              <v-divider></v-divider>
            </v-col>
            <v-col
              style="height: 400px; overflow-y: scroll"
              cols="12"
            >
              <v-tabs-items v-model="tab">
                <v-tab-item style="">
                  <v-row
                    v-for="(element, index) in getDeals(item)"
                    :key="element._id"
                    align-content="center"
                    justify="center"
                  >
                    <v-card
                      width="95%"
                      :style="
                        element.stage == 'New'
                          ? 'border-left: 8px solid #0288D1;'
                          : element.stage == 'Contacted'
                          ? 'border-left: 8px solid #FFA000;'
                          : element.stage == 'Qualified'
                          ? 'border-left: 8px solid #558B2F;'
                          : element.stage == 'Negociation'
                          ? 'border-left: 8px solid #F4511E;'
                          : ''
                      "
                      elevation="2"
                      :ripple="false"
                      class="mb-2 mt-2 text-left"
                    >
                      <v-card-title
                        >{{ element.title }}
                        <v-spacer></v-spacer
                        ><span class="text-body-2">
                          Offre : {{ index + 1 }}
                        </span></v-card-title
                      >
                      <v-card-text
                        class="d-flex flex-no-wrap justify-space-between"
                      >
                        <div>
                          {{ returnContact(element.contact) }}
                          <div>{{ element.value }} TND</div>
                        </div>
                        <div>
                          <div class="font-weight-bold">
                            Etat :
                            <span
                              class="font-weight-regular"
                              >{{
                                element.status == "Won"
                                  ? "Gagnée"
                                  : element.status == "Lost"
                                  ? "Perdue"
                                  : "En Cours"
                              }}</span
                            >
                          </div>
                          <div class="font-weight-bold">
                            Stage :
                            <span
                              class="font-weight-regular"
                              :style="
                                element.stage == 'New'
                                  ? 'color: #0288D1;'
                                  : element.stage ==
                                    'Contacted'
                                  ? 'color: #FFA000;'
                                  : element.stage ==
                                    'Qualified'
                                  ? 'color: #558B2F;'
                                  : element.stage ==
                                    'Negociation'
                                  ? 'color:#F4511E;'
                                  : ''
                              "
                              >{{
                                element.stage == "New"
                                  ? "Nouvelle"
                                  : element.stage ==
                                    "Contacted"
                                  ? "Contactée"
                                  : element.stage ==
                                    "Qualified"
                                  ? "Qualifié"
                                  : element.stage ==
                                    "Negociation"
                                  ? "En negociation"
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
    </v-form>
  </v-card-text>

  <v-divider></v-divider>

  <v-card-actions>
    <v-spacer></v-spacer>

    <v-btn outlined depressed @click="close()">
      Fermer
    </v-btn>
  </v-card-actions>
</v-card>















zak v card 
<v-card>
  <v-card-title class="ma-0 pa-0"> </v-card-title>
  <v-card-text>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="pa-4">
        <v-col cols="12" md="4" class="d-flex text-center">
          <v-scroll-y-transition mode="out-in">
            <v-card class="pt-6 mx-auto" flat>
              <v-card-text style="position: sticky; top: 20%">
                <v-avatar color="red">
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
                <v-row
                  no-gutters
                  class="text-left"
                  tag="v-card-text"
                >
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >Type :
                  </v-col>
                  <v-col cols="6" class="text-capitalize">
                    {{ item.contactType }}
                  </v-col>
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >First Name:
                  </v-col>
                  <v-col cols="6" class="text-capitalize">{{
                    item.firstName
                  }}</v-col>
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >Last name:
                  </v-col>
                  <v-col cols="6" class="text-capitalize">
                    {{ item.lastName }}
                  </v-col>
                  <v-col
                    class="text-left mb-2"
                    tag="strong"
                    cols="6"
                    >Phone Number:
                  </v-col>
                  <v-col cols="6">{{ item.phoneNumber }}</v-col>
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
            <v-col
              style="height: 400px; overflow-y: scroll"
              cols="12"
            >
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
                        element.stage == 'New'
                          ? 'border-left: 8px solid #0288D1;'
                          : element.stage == 'Contacted'
                          ? 'border-left: 8px solid #FFA000;'
                          : element.stage == 'Qualified'
                          ? 'border-left: 8px solid #558B2F;'
                          : element.stage == 'Negociation'
                          ? 'border-left: 8px solid #F4511E;'
                          : ''
                      "
                      elevation="2"
                      :ripple="false"
                      class="mb-2 mt-2 text-left"
                    >
                      <v-card-title
                        >{{ element.title }} <v-spacer></v-spacer
                        ><span class="text-body-2">
                          Offre : {{ index + 1 }}
                        </span></v-card-title
                      >
                      <v-card-text
                        class="d-flex flex-no-wrap justify-space-between"
                      >
                        <div>
                          <div>{{ element.value }} TND</div>
                        </div>
                        <div>
                          <div class="font-weight-bold">
                            Etat :
                            <span class="font-weight-regular">{{
                              element.status == "Won"
                                ? "Gagnée"
                                : element.status == "Lost"
                                ? "Perdue"
                                : "En Cours"
                            }}</span>
                          </div>
                          <div class="font-weight-bold">
                            Stage :
                            <span
                              class="font-weight-regular"
                              :style="
                                element.stage == 'New'
                                  ? 'color: #0288D1;'
                                  : element.stage == 'Contacted'
                                  ? 'color: #FFA000;'
                                  : element.stage == 'Qualified'
                                  ? 'color: #558B2F;'
                                  : element.stage == 'Negociation'
                                  ? 'color:#F4511E;'
                                  : ''
                              "
                              >{{
                                element.stage == "New"
                                  ? "Nouvelle"
                                  : element.stage == "Contacted"
                                  ? "Contactée"
                                  : element.stage == "Qualified"
                                  ? "Qualifié"
                                  : element.stage == "Negociation"
                                  ? "En negociation"
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
    </v-form>
  </v-card-text>

  <v-divider></v-divider>

  <v-card-actions>
    <v-spacer></v-spacer>

    <v-btn outlined depressed @click="close()"> Fermer </v-btn>
  </v-card-actions>
</v-card>