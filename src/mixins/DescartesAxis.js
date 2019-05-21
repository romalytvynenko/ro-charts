export default {
  props: {
    orientation: {
      type: String,
      default: 'horizontal',
    },
    position: {
      type: String,
      default: 'start',
    },
    axisName: {
      type: String,
      default: 'x',
    },
    /**
     * Expected amount of ticks (may be lower than this number).
     */
    ticks: {
      type: Number,
      default: 5
    },
    label: {
      type: String,
    },
    everyTicks: {
      type: Number,
      default: 5
    },
  },
  computed: {
    domainPath () {
      let tickSizeOuter = 6,
        k = this.orientation === 'horizontal' ? 1 : -1,
        range0 = 0,
        range1 = this.orientation === 'horizontal' ? this.$parent.w : this.$parent.h

      if (this.orientation === 'horizontal') {
        return (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1)
      }

      return "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
    },

    /**
     * Indexes of ticks that should be rendered.
     *
     * @return {number[]}
     */
    renderedTicksIndexes () {
      const labels = this.getLabels()

      let everyIndex = Math.floor(labels.length / this.ticks)

      if (everyIndex === 0) {
        return []
      }

      let result = []
      let lastNum = 0

      while (lastNum < labels.length) {
        result.push(lastNum)
        lastNum += everyIndex
      }

      return result
    },
  },

  methods: {
    tickFormat (d) {
      if ((d > 500 && d <= 499999) || (d < -500 && d >= -499999)) {
        return (d / 1000).toFixed(1).replace(/\.0+$/, '') + 'k'
      }
      else if (d >= 500000) {
        return (d / 1000000).toFixed(1).replace(/\.0+$/, '') + 'M'
      }
      return d
    },

    getLabels () {
      return this.labels
    }
  },

  render (h) {
    if (!this.getLabels().length) {
      return
    }

    const axisTranslateX = this.position === 'start' ? 0 : this.$parent.w
    const axisTranslateY = this.orientation === 'horizontal' ? this.$parent.h : 0

    let label = null

    if (this.orientation === 'vertical') {
      label = h('text', {
        class: `${this.axisName}-axis-title`,
        attrs: {
          'text-anchor': this.position === 'start' ? 'left' : 'end',
          'transform': this.position === 'start' ? 'translate(-55,-30)' : `translate(40,-30)`,
        }
      }, [this.label])
    }

    return h('g', {
      class: `${this.axisName} axis`,
      attrs: {
        transform: `translate(${axisTranslateX},${axisTranslateY})`
      }
    }, [
      h('path', {
        class: 'domain',
        attrs: {
          d: this.domainPath
        }
      }),
      label,
      h('g', this.ticksObjects.map((tick) => {
        return h('g', {
          attrs: {
            transform: `translate(${tick.x},${tick.y})`
          }
        }, [
          h('line', {
            attrs: {
              stroke: 'rgba(0,0,0,1)',
              ...this.tickLine(),
            }
          }),
          h('text', {
            attrs: {
              ...this.tickText(),
            },
          }, [
            tick.label
          ])
        ])
      }))
    ])
  }
}
