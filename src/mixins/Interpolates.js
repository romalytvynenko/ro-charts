import {
  curveCardinal,
  curveBasis
} from 'd3-shape'

export default {
  props: {
    interpolate: {
      type: String,
      default: 'cardinal'
    },
  },
  methods: {
    interpolateFunction (fn) {
      const interpolateFn = this.getInterpolateFunction()
      if (!interpolateFn) {
        return fn
      }
      return fn.curve(interpolateFn)
    },

    getInterpolateFunction () {
      return {
        cardinal: curveCardinal,
        basis: curveBasis
      }[this.interpolate]
    }
  }
}
