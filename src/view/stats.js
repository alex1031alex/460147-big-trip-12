import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractView from "./abstract.js";
import {activityTypes} from "../const.js";
import {getTimeInterval, formatTimeInterval} from "../utils/common.js";

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, events) => {
  const eventTypeCost = {};
  events.forEach((event) => {
    if (!eventTypeCost[event.type]) {
      eventTypeCost[event.type] = event.cost;
    } else {
      eventTypeCost[event.type] = eventTypeCost[event.type] + event.cost;
    }
  });

  const sortedTypesByCost = Object.entries(eventTypeCost).slice().sort((a, b) => b[1] - a[1]);
  moneyCtx.height = BAR_HEIGHT * sortedTypesByCost.length;

  const chartDataLabels = sortedTypesByCost.map((type) => type[0].toUpperCase());
  const chartDataValues = sortedTypesByCost.map((type) => type[1]);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartDataLabels,
      datasets: [{
        data: chartDataValues,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, events) => {
  const transferEventsCount = {};

  events.forEach((event) => {
    const isActivityEvent = activityTypes.some((type) => type === event.type);

    if (isActivityEvent) {
      return;
    }

    if (!transferEventsCount[event.type]) {
      transferEventsCount[event.type] = 1;
    } else {
      transferEventsCount[event.type]++;
    }
  });

  const sortedTransferTypes = Object
    .entries(transferEventsCount)
    .slice()
    .sort((a, b) => b[1] - a[1]);

  transportCtx.height = BAR_HEIGHT * sortedTransferTypes.length;

  const chartDataLabels = sortedTransferTypes.map((type) => type[0].toUpperCase());
  const chartDataValues = sortedTransferTypes.map((type) => type[1]);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartDataLabels,
      datasets: [{
        data: chartDataValues,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, events) => {
  const timeByEventTypes = {};
  events.forEach((event) => {
    const eventDuration = getTimeInterval(event.date.start, event.date.end);

    if (!timeByEventTypes[event.type]) {
      timeByEventTypes[event.type] = eventDuration;
    } else {
      timeByEventTypes[event.type] += eventDuration;
    }
  });

  const sortedEventTypesByDuration = Object
    .entries(timeByEventTypes)
    .slice()
    .sort((a, b) => b[1] - a[1]);

  timeSpendCtx.height = BAR_HEIGHT * sortedEventTypesByDuration.length;

  const chartDataLabels = sortedEventTypesByDuration.map((type) => type[0].toUpperCase());
  const chartDataValues = sortedEventTypesByDuration.map((type) => type[1]);

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartDataLabels,
      datasets: [{
        data: chartDataValues,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${formatTimeInterval(val)}`
        }
      },
      title: {
        display: true,
        text: `SPENT TIME`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Stats extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    if (this._moneyChart !== null || this._transportChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._transportChart = renderTransportChart(transportCtx, this._events);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._events);
  }
}
