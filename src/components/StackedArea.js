import {
  line as svgLine,
  area as svgArea,
  stack
} from 'd3'
import CoordinateGraph from '../mixins/CoordinateGraph'

export default {
  mixins: [
    CoordinateGraph
  ],
  props: {
    data: {
      type: Array,
      required: true
    },
    lineColor: {
      type: String,
      default: '#3498db'
    },
    color: {
      type: String,
      default: '#3498db'
    },
    opacity: {
      type: Number,
      default: .35,
    },
    width: {
      type: Number,
      default: 3
    },
    title: {
      type: String,
      default: 'area'
    },
    interpolate: {
      type: String,
      default: 'cardinal'
    },
    labels: {
      type: Object,
    },
  },

  computed: {
    layers () {
      const data = this.stackData

      const layers = stack()(data.reverse())
      const {x, y} = this.getScales()

      const area = svgArea()
        .x(d => x(d.x) + (x.rangeBand ? x.rangeBand() / 2 : 0))
        .y0(d => y(d.y0))
        .y1(d => y(d.y0 + d.y))
        .interpolate(this.interpolate)

      const line = svgLine()
        .x((d, i) => x(d.x) + (x.rangeBand ? x.rangeBand() / 2 : 0))
        .y(d => y(d.y))
        .interpolate(this.interpolate)

      return layers.map((layer, i) => {
        return {
          area: area(layer),
          line: line(layer)
        }
      })
    },

    stackData () {
      return Object.keys(this.labels).map(key => {
        return this.data.map((d, j) => {
          return {
            x: j,
            y: d[key]
          }
        })
      })
    },
  },

  methods: {
    getColor (i) {
      let colors = []
      let values = Object.values(this.labels)

      for (let i in values) {
        if (values[i]['color']) {
          colors.push(values[i]['color'])
        }
      }

      return colors[i % colors.length]
    },

    getLineColor (i) {
      let colors = []
      let values = Object.values(this.labels)

      for (let i in values) {
        if (values[i]['lineColor']) {
          colors.push(values[i]['lineColor'])
        }
      }

      return colors[i % colors.length]
    }
  },

  render (h) {
    return h('g', {
      class: ['chart-element', `chart-element-${this.id}`]
    }, [
      this.layers.map(({area, line}, i) => {
        return [
          h('path', {
            class: [this.areaClass, 'area', `eventable-${i}`],
            attrs: {
              d: area,
              fill: this.getColor(i),
              'fill-opacity': this.opacity,
            }
          }),
          h('path', {
            class: 'line',
            attrs: {
              d: line,
              stroke: this.getLineColor(i),
              'stroke-width': this.width,
            },
          }),
        ]
      })
    ])
  }
}
