import {
  scaleBand,
  scaleLinear,
  extent,
  min,
  min,
  sum
} from 'd3'

export default {
  data () {
    return {
      w: 0,
      h: 0,

      width: 0,
      height: 0,
      marginX: 0,
      marginY: 0,

      animatedData: {}
    }
  },
  props: {
    /**
     * The primary data object.
     */
    data: {
      type: Object,
      default () {
        return {
          datasets: {},
          axis: {},
        }
      },
    },

    ratio: {
      type: Number,
      default: 16 / 7
    },

    margins: {
      type: Array,
      default () {
        return [13, 60, 32, 60]
      }
    },
  },
  mounted () {
    /*
    * Iterate through children and update current margins,
    * so this chart will be more dynamic
    */
    this.prepareMargins()

    /*
    * This will draw main canvas
    */
    this.createCanvas()

    // @todo implement selection remove on esc
    // EventBus.listen('global::on-escape-pressed', this.cancelSelection)
  },
  computed: {
    scales () {
      return {
        x: this.makeXScale(),
        y: this.makeYScale('y'),
        y2: this.makeYScale('y2'),
      }
    }
  },
  methods: {
    isLinear () {
      const hasBarChart = !!Object.values(this.data.datasets)
        .find(dataset => dataset.type === 'bar' || dataset.type === 'stacked-bar')
      return !hasBarChart
    },

    makeXScale () {
      const labels = this.data.axis.x.labels

      return !this.isLinear() ?
        scaleBand().domain(labels.map((d, i) => i)).rangeRound([0, this.w]).padding(.05)
        :
        scaleLinear().domain([0, labels.length - 1]).range([0, this.w])
    },

    makeYScale (on) {
      let ticks = this.data.axis ? (this.data.axis[on] ? this.data.axis[on].ticks : 6) : 6
      if (!ticks) {
        ticks = 6
      }

      return scaleLinear()
        .domain(extent(this.getDataForAxis(on)))
        .nice(ticks)
        .range([this.h, 0])
    },

    createCanvas () {
      const m = this.margins

      let w = this.$el.offsetWidth
      w = w - m[1] - m[3]

      const h = (this.$el.offsetWidth / this.ratio) - m[0] - m[2]

      this.w = w
      this.h = h

      this.width = w + m[1] + m[3]
      this.height = h + m[0] + m[2]
      this.marginX = m[3]
      this.marginY = m[0]
    },

    /**
     * Add some space if needed.
     */
    prepareMargins () {
      // let hasYLabel = (yAxis && yAxis.label) || (y2Axis && y2Axis.label)
      if (true) {
        this.margins[0] += 33
      }
    },

    getChartData (chart) {
      if (chart.type.indexOf('stacked') !== 0) {
        return chart.data
      }
      return chart.data.map(datum => sum(Object.values(datum)))
    },

    getDataForAxis (axis) {
      return Object.keys(this.data.datasets).reduce((res, id) => {
        const chart = this.data.datasets[id]
        if ((chart.on || 'y') === axis) {
          let data = this.getChartData(chart)

          res = res.concat(data || [])

          const absolute = !!chart.absolute
          if (absolute) {
            if (min(data) > 0) {
              res.push(0)
            }
          }
        }
        return res
      }, [])
    },

    cancelSelection () {
      this.$emit('cancel-selection')
    }
  },

  render (h) {
    const axis = Object.keys(this.data.axis)
      .reduce((res, id) => {
        const axis = this.data.axis[id]
        res[id] = h(`${id}-axis-exp`, {
          props: axis
        })
        return res
      }, {})

    const charts = Object.keys(this.data.datasets).reduce((res, id) => {
      const chart = this.data.datasets[id]
      res[id] = h(`${chart.type}-exp`, {
        props: chart
      })
      return res
    }, {})

    let children = {
      ...axis,
      ...charts,
    }

    const order = {
      'y': 0,
      'y2': 1,
      '*': 2,
      'x': 3,
    }

    children = Object.keys(children)
      .sort((a, b) => {
        return (order.hasOwnProperty(a) ? order[a] : 2)
          - (order.hasOwnProperty(b) ? order[b] : 2)
      })
      .map(key => children[key])

    return h('div', {
      class: 'vue-chart',
      directives: [
        {
          name: 'click-outside',
          value: this.cancelSelection,
        }
      ]
    }, [
      h('svg', {
        attrs: {
          width: this.width,
          height: this.height,
        }
      }, [
        h('g', {
          attrs: {
            transform: `translate(${this.marginX}, ${this.marginY})`
          }
        }, children),
        this.$slots.default
      ])
    ])
  },
}
