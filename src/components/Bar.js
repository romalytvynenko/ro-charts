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
    /*
     * define scale y relative to bar start or
     * to lowest bar
     */
    absolute: {
      type: Boolean,
      default: true
    },
    barClass: {
      type: String,
      default: 'vue-bar'
    },
    radius: {
      type: Number,
      default: 2
    },
    color: {
      default: '#3498db'
    },
    barClassPrefix: {
      default: ''
    },
    title: {
      type: String,
      default: 'bar'
    },
  },
  computed: {
    bars () {
      const {x, y} = this.getScales()

      return this.data.map((datum, i) => {
        return {
          className: this.getClassName(datum, i),
          x: x(i),
          y: y(Math.max(0, datum)),
          width: x.rangeBand(),
          height: this.getHeight(datum, y),
          fill: this.getColor(i)
        }
      })
    }
  },

  methods: {
    getClassName (datum, i) {
      let className = this.barClass + ' bar'
      className += ' eventable-' + i

      let valueClassName = this.barClassPrefix + 'bar-greater'

      if (datum < 0) {
        valueClassName = this.barClassPrefix + 'bar-lower'
      }

      if (datum === 0) {
        valueClassName = this.barClassPrefix + 'bar-zero'
      }

      return className + ' ' + valueClassName
    },

    getHeight (datum, y) {
      const h = this.$parent.h

      let yv = y(Math.max(0, datum)),
        height = Math.abs(y(datum) - y(0))

      return yv + height > h ? h - yv : height
    },

    getColor (i) {
      if(this.color instanceof Function) {
        return this.color(i)
      }
      return this.color
    }
  },

  render (h) {
    return h('g', {
      class: ['chart-element', `chart-element-${this.id}`]
    }, this.bars.map((bar, i) => {
      return h('rect', {
        class: bar.className,
        attrs: {
          fill: bar.fill,
          rx: this.radius,
          ry: this.radius,
          x: bar.x,
          y: bar.y,
          width: bar.width,
          height: bar.height,
        }
      })
    }))
  },
}
