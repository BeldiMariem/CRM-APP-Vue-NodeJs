<template>
  <v-dialog scrollable v-model="dialogShow" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark outlined color="red accent-3" v-bind="attrs" text v-on="on">
        <v-icon dark> mdi-eye </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Activity</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-label>Name</v-label>
              <v-text-field
                solo
                dense
                readonly
                label="Name"
                v-model="item.activityName"
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>Creator Name</v-label>
              <v-text-field
                dense
                solo
                readonly
                label="Creator Name"
                v-model="item.creatorName"
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox
                outlined
                readonly
                v-model="item.activityUsers"
                :items="users"
                label="people"
                multiple
                chips
              >
              </v-combobox>
            </v-col>

            <!-- Start Date Picked -->
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                dense
                v-model="item.activityStartDate"
                label="Start Date"
                append-icon="mdi-calendar"
                readonly
              ></v-text-field>
            </v-col>
            <!-- End Date Picked -->
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                dense
                v-model="item.activityEndDate"
                label="End Date"
                append-icon="mdi-calendar"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>Start Time</v-label>
              <v-text-field
                solo
                dense
                readonly
                label="Start Time"
                v-model="item.activityStartTime"
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label>End Time</v-label>
              <v-text-field
                solo
                dense
                readonly
                label="End Time"
                v-model="item.activityEndTime"
                outlined
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                outlined
                readonly
                dense
                v-model="item.activityType"
                :items="typeSelect"
                label="Type"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                name="input-7-1"
                label="Activity Description"
                v-model="item.activityDescription"
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
        <v-btn color="blue darken-1" text @click="dialogShow = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      dialogShow: false,
      // select: ["Vuetify", "Programming"],
      //selectType: [],
      users: [],
      // people: ["Programming", "Design", "Vue", "Vuetify"],
      typeSelect: ["Meeting", "Task", "Activity"],
    };
  },

  methods: {
    // save() {
    //   this.$emit("click", {
    //     index: this.index,
    //   });
    //   this.dialogShows = false;
    // },
  },
};
</script>