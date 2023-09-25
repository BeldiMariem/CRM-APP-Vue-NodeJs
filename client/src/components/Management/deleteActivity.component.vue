<template>
  <v-dialog v-model="dialogDelete" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark outlined color="teal lighten-1" v-bind="attrs" text v-on="on">
        Delete
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Delete An Activity</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col> Are you sure you want to delete {{ activityName }} ?</v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="save"> Delete </v-btn>
        <v-btn color="blue darken-1" text @click="dialogDelete = false">
          Close
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["index", "activityName"],
  data() {
    return {
      dialogDelete: false,
    };
  },

  methods: {
    save() {
      this.$emit("click", {
        index: this.index,
      });
      this.dialogDelete = false;
    },
  },
};
</script>