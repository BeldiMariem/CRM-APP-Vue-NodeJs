<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-toolbar-title><h1>Calendar</h1></v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-btn outlined class="ml-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
        <br />
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="grey lighten-2"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import userMixin from "../../mixins/user.mixin";

export default {
  mixins: [userMixin],
  data: () => ({
    Activities: [],
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "purple darken-3",
      "green lighten-2",
      "orange darken-3",
      "blue darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    y: [],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.initializeActivities();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    switchview() {
      this.$emit("switch");
    },
    updateRange({ start, end }) {
      axios
        .get("http://localhost:3000/api/v1/activity/getActivities")
        .then((res) => {
          axios
            .get("http://localhost:3000/api/v1/deal/getDeals")
            .then((resultat) => {
              const events = [];
              const min = new Date(`${start.date}T00:00:00`);
              const max = new Date(`${end.date}T23:59:59`);
              const days = (max.getTime() - min.getTime()) / 86400000;
              const eventCount = this.rnd(days, days + 20);

              resultat.data.data.forEach((element) => {
                let c = [];
                c.push({
                  _id: element._id,
                  title: element.title,
                  contact: element.contact,
                  value: element.value,
                  status: element.status,
                  stage: element.stage,
                  startDate: new Date(element.startDate)
                    .toISOString()
                    .substr(0, 10),
                  endDate: new Date(element.endDate)
                    .toISOString()
                    .substr(0, 10),
                });
                this.y = c;
                for (let j = 0; j < this.y.length; j++) {
                  const allDay = this.rnd(0, 3) === 0;
                  const firstTimestamp = this.rnd(min.getTime(), max.getTime());
                  const first = new Date(
                    firstTimestamp - (firstTimestamp % 900000)
                  );
                  const secondTimestamp =
                    this.rnd(2, allDay ? 288 : 8) * 900000;
                  const second = new Date(first.getTime() + secondTimestamp);
                  events.push({
                    name: this.y[j].title,
                    start: this.y[j].startDate,
                    end: this.y[j].endDate,
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    timed: !allDay,
                  });
                  console.log("j", j);
                }
              });
              this.loading = false;
              //let acts = [];
              res.data.data.forEach((element) => {
                let d = [];
                d.push({
                  _id: element._id,
                  title: element.title,
                  activityType: element.activityType,
                  startDate: new Date(element.startDate)
                    .toISOString()
                    .substr(0, 10),
                  endDate: new Date(element.endDate)
                    .toISOString()
                    .substr(0, 10),
                  time: element.time,
                  description: element.description,
                  activityUsers: element.activityUsers,
                  assignedUser: element.assignedUser,
                  done: element.done,
                });
                this.Activities = d;
                //  this.Activities = acts;
                for (let i = 0; i < this.Activities.length; i++) {
                  const allDay = this.rnd(0, 3) === 0;
                  const firstTimestamp = this.rnd(min.getTime(), max.getTime());
                  const first = new Date(
                    firstTimestamp - (firstTimestamp % 900000)
                  );
                  const secondTimestamp =
                    this.rnd(2, allDay ? 288 : 8) * 900000;
                  const second = new Date(first.getTime() + secondTimestamp);
                  events.push({
                    name: this.Activities[i].title,
                    start:
                      this.Activities[i].startDate +
                      " " +
                      this.Activities[i].time,
                    end:
                      this.Activities[i].endDate +
                      " " +
                      this.Activities[i].time,
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    //timed: !allDay,
                  });
                  console.log("legth", this.Activities.length);
                  console.log("i", i);
                }
              });
              this.events = events;
            });
          console.log("aaaaaaaaaaaaa", this.y);
        })
        .catch((err) => console.log(err));
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
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
          res.data.data.forEach((element) => {
            acts.push({
              _id: element._id,
              title: element.title,
              activityType: element.activityType,
              startDate: new Date(element.startDate)
                .toISOString()
                .substr(0, 10),
              endDate: new Date(element.endDate).toISOString().substr(0, 10),
              time: element.time,
              description: element.description,
              activityUsers: element.activityUsers,
              assignedUser: element.assignedUser,
              done: element.done,
            });
            this.Activities = acts;
          });

          console.log("getActivities", res.data.data);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>