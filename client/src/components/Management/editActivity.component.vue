<template>
  <v-dialog v-model="dialogEdit" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark outlined color="teal lighten-1" v-bind="attrs" text v-on="on">
        Edit {{ index }}
      </v-btn>
    </template>
    <!-- {{ this.index }} -->
    <v-card>
      <v-card-title>
        <span class="headline">Edit An Activity</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-label>Name</v-label>
              <v-text-field solo label="Name" v-model="name" outlined>
                {{ activityName }}
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>Creator</v-label>
              <v-text-field solo label="Creator" v-model="creator" outlined>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>Start Date</v-label>
              <v-text-field
                solo
                label="Start Date"
                v-model="startDate"
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>End Date</v-label>
              <v-text-field solo label="End Date" v-model="endDate" outlined>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>Start Time</v-label>
              <v-text-field
                solo
                label="Start Time"
                v-model="startTime"
                outlined
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>End Time</v-label>
              <v-text-field solo label="End Time" v-model="endTime" outlined>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>Type</v-label>
              <v-text-field solo label="Type" v-model="type" outlined>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-label>People</v-label>
              <v-text-field
                solo
                label="People"
                v-model="activityPeople"
                outlined
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogEdit = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: [
    "index",
    "activityName",
    "activityCreator",
    "activityStartDate",
    "activityEndDate",
    "activityStartTime",
    "activityEndTime",
    "activityType",
    "people",
  ],
  data() {
    return {
      name: this.activityName,
      creator: this.activityCreator,
      startDate: this.activityStartDate,
      endDate: this.activityEndDate,
      startTime: this.activityStartTime,
      endTime: this.activityEndTime,
      type: this.activityType,
      activityPeople: this.people,
      dialogEdit: false,
    };
  },

  methods: {
    save() {
      this.$emit("click", {
        index: this.index,
        name: this.name,
        creator: this.creator,
        startDate: this.startDate,
        endDate: this.endDate,
        startTime: this.startTime,
        endTime: this.endTime,
        type: this.type,
        activityPeople: this.people,
      });
      console.log("aaaaaaaa", this.people);
      this.dialogEdit = false;
    },
  },
};
</script>