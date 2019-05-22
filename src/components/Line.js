import {
  line
} from 'd3-shape'
import CoordinateGraph from '../mixins/CoordinateGraph'
import { getDashArray } from '../utils'
import Interpolates from '../mixins/Interpolates'

export default {
  mixins: [
    CoordinateGraph,
    Interpolates,
  ],
  data () {
    return {
      strokeDasharray: null,
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    dashedValues: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: '#3498db'
    },
    width: {
      type: Number,
      default: 3
    },
    title: {
      type: String,
      default: 'line'
    },
  },

  computed: {
    line () {
      const {x, y} = this.getScales()

      const chartLine = this.interpolateFunction(line()
        .x(function (d, i) {
          return x(i) + (x.bandwidth ? x.bandwidth() / 2 : 0)
        })
        .y(function (d) {
          return y(d)
        }))

      this.$nextTick(() => {
        this.prepareDashArray(x)
      })

      return chartLine(this.data)
    },

    /**
     * Points coordinates.
     */
    points () {
      const {x, y} = this.getScales()

      return this.data.map((datum, i) => {
        return {
          x: x(i) + (x.bandwidth ? x.bandwidth() / 2 : 0),
          y: y(datum),
        }
      })
    }
  },

  methods: {
    prepareDashArray (x) {
      this.strokeDasharray = getDashArray(
        this.data,
        this.$refs.path,
        (el, i) => {
          return (this.dashedValues[i] || false)
        },
        (i) => {
          return x(i)
        }
      )
    },
  },

  render (h) {
    return h('g', {
      class: ['line', 'chart-element', `chart-element-${this.id}`]
    }, [
      h('path', {
        attrs: {
          d: this.line,
          stroke: this.color,
          'stroke-width': this.width,
          'stroke-dasharray': this.strokeDasharray
        },
        ref: 'path'
      }),
      this.points.map((point, i) => {
        return h('circle', {
          class: ['line-dot', `eventable-${i}`],
          attrs: {
            fill: this.color,
            stroke: this.color,
            r: 2.5,
            cx: point.x,
            cy: point.y,
          }
        })
      })
    ])
  }
}
