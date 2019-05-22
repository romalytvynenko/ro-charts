import {
  stack
} from 'd3-shape'
import {
  sum
} from 'd3-array'
import CoordinateGraph from '../mixins/CoordinateGraph'

export default {
  mixins: [
    CoordinateGraph
  ],
  props: {
    labels: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    on: {
      type: String,
      default: 'y'
    },
    barClass: {
      type: String,
      default: 'vue-bar'
    },
    radius: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      default: 'stacked bar'
    },
    id: {
      type: String,
    }
  },

  computed: {
    stacks () {
      const layers = stack()
        .keys(Object.keys(this.labels))
        (this.data.reverse())

      const {x, y} = this.getScales()

      return layers.map((layer, i) => {
        return layer.map((d, j) => {
          return {
            i: d.i,
            'clip-path': `url(#stacked-bar-clip-${this.id}-${j})`,
            x: x(j),
            y: y(d[1]),
            height: y(d[0]) - y(d[1]),
            width: x.bandwidth(),
            fill: this.getColor(i)
          }
        })
      })
    },

    masks () {
      if (!this.radius) {
        return []
      }

      const {x, y} = this.getScales()
      const h = this.$parent.h

      const data = this.sumData

      return data.map((d, i) => {
        let yv = y(Math.max(0, d)),
          height = Math.abs(y(d) - y(0));

        height = yv + height > h ? h - yv : height

        return {
          rx: this.radius,
          ry: this.radius,
          x: x(i),
          y: d === 0 ? y(0) : y(Math.max(0, d)),
          width: x.bandwidth(),
          height,
        }
      })
    },

    sumData () {
      return this.data.map(datum => sum(Object.values(datum)))
    }
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
      ...this.stacks.map((rects, i) => {
        return rects.map((rect, j) => {
          return h('rect', {
            class: [this.barClass, 'stacked-bar', `eventable-${rect.i}`],
            attrs: rect,
          })
        })
      }),
      ...this.masks.map((mask, i) => {
        return h('clipPath', {
          attrs: {
            id: `stacked-bar-clip-${this.id}-${i}`
          }
        }, [
          h('rect', {
            class: ['stacked-bar-overflow-holder'],
            attrs: mask,
          })
        ])
      }),
    ])
  }
}
