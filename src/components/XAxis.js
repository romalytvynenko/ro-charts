import DescartesAxisMixin from '../mixins/DescartesAxis'

export default {
  mixins: [
    DescartesAxisMixin,
  ],

  props: {
    orientation: {
      type: String,
      default: 'horizontal',
    },
    position: {
      type: String,
      default: 'start',
    },
    labels: {
      type: Array,
      required: true
    },
    timeseries: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'MMMM'
    },
  },

  computed: {
    ticksObjects () {
      const { x } = this.$parent.scales

      const delta = this.$parent.isLinear() ? 0 : x.bandwidth() / 2

      return this.labels
        .map((label, i) => {
          if (this.renderedTicksIndexes.indexOf(i) === -1) {
            return null
          }
          return {
            label: this.tickFormat(i),
            x: x(i) + delta,
            y: 0,
          }
        })
        .filter(Boolean)
    },

    /**
     * Indexes of ticks that should be rendered.
     *
     * @return {number[]}
     */
    renderedTicksIndexes () {
      if (this.$parent.isLinear()) {
        let everyIndex = Math.floor(this.labels.length / this.ticks)

        if (everyIndex === 0) {
          return []
        }

        let result = []
        let lastNum = 0

        while (lastNum < this.labels.length) {
          result.push(lastNum)
          lastNum += everyIndex
        }

        return result
      }

      const { x } = this.$parent.scales

      return x.domain()
        .filter((d, i) => {
          if (x.domain().length === 24) {
            return (i + 1) % this.everyTicks === 0
          }
          return !((i + Math.floor(this.ticks / 2)) %
            Math.round(x.domain().length / this.ticks))
        })
    },
  },

  methods: {
    tickFormat (d) {
      if (!this.timeseries) {
        return this.label[d]
      }
      d = this.labels[d]
      return (new Date(d)).toLocaleString()
    },

    tickLine () {
      return {
        y2: 6,
        x2: 0,
      }
    },

    tickText () {
      return {
        dy: '.71em',
        y: 16,
        'text-anchor': 'middle',
      }
    }
  },
}
