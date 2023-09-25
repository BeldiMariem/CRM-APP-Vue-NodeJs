<script>
import { Line } from "vue-chartjs";
import _ from "lodash";
export default {
  extends: Line,
  props: {
    Deals: Array,
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Deals",
            backgroundColor: ["#FFA726"],
            data: [],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Deals Won / Lost",
        },
        subtitles: {
          text: "text",
          verticalAlign: "center",
        },
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {},
  methods: {
    initialize() {
      if (this.Deals) {
        this.chartData.datasets[0].data = this.Deals.map((x) => x.value);
        this.chartData.labels = this.Deals.map((x) => x.text);
        this.renderChart(this.chartData, this.options);
      }
    },
  },
  watch: {
    Deals() {
      this.initialize();
    },
  },
  mounted() {
    this.initialize();
  },
};
</script>

