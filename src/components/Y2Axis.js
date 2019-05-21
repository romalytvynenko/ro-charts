import DescartesAxisMixin from '../mixins/DescartesAxis'

export default {
  mixins: [
    DescartesAxisMixin,
  ],

  props: {
    axisName: {
      type: String,
      default: 'y2',
    },
    orientation: {
      type: String,
      default: 'vertical',
    },
    position: {
      type: String,
      default: 'end',
    },
  },

  computed: {
    ticksObjects () {
      const { y2 } = this.$parent.scales

      return this.getLabels()
        .map((value, i) => {
          if (this.renderedTicksIndexes.indexOf(i) === -1) {
            return null
          }
          return {
            label: this.tickFormat(value),
            x: 0,
            y: y2(value),
          }
        })
        .filter(Boolean)
    },
  },

  methods: {
    getLabels () {
      return this.$parent.scales.y2.ticks()
    },

    tickLine () {
      return {
        y2: 0,
        x2: 0//this.$parent.w,
      }
    },

    tickText () {
      return {
        dy: '.32em',
        x: 20,
        y: 0,
        'text-anchor': 'start'
      }
    }
  }
}
