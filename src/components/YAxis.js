import DescartesAxisMixin from '../mixins/DescartesAxis'

export default {
  mixins: [
    DescartesAxisMixin,
  ],

  props: {
    axisName: {
      type: String,
      default: 'y',
    },
    orientation: {
      type: String,
      default: 'vertical',
    },
    position: {
      type: String,
      default: 'start',
    },
  },

  computed: {
    ticksObjects () {
      const { y } = this.$parent.scales

      return this.getLabels()
        .map((value, i) => {
          if (this.renderedTicksIndexes.indexOf(i) === -1) {
            return null
          }
          return {
            label: this.tickFormat(value),
            x: 0,
            y: y(value),
          }
        })
        .filter(Boolean)
    },
  },

  methods: {
    getLabels () {
      return this.$parent.scales.y.ticks()
    },

    tickLine () {
      return {
        y2: 0,
        x2: this.$parent.w,
      }
    },

    tickText () {
      return {
        dy: '.32em',
        x: -20,
        y: 0,
        'text-anchor': 'end'
      }
    }
  }
}
