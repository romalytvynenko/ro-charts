export default {
  props: {
    id: {
      type: String
    },
    on: {
      type: String,
      default: 'y'
    },
  },
  methods: {
    getScales () {
      const { x, y, y2 } = this.$parent.scales
      const scales = { x, y, y2 }
      return {
        x,
        y: scales[this.on],
      }
    },
  }
}
