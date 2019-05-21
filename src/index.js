import ChartRoot from './components/ChartRoot.js'
import Line from './components/Line.js'
import Bar from './components/Bar.js'
import StackedArea from './components/StackedArea.js'
import StackedBar from './components/StackedBar.js'
import XAxis from './components/XAxis.js'
import YAxis from './components/YAxis.js'
import Y2Axis from './components/Y2Axis.js'

let RoCharts = {}

RoCharts.install = (Vue, options) => {
  Vue.component('chart-exp', ChartRoot)
  Vue.component('line-exp', Line)
  Vue.component('bar-exp', Bar)
  Vue.component('stacked-area-exp', StackedArea)
  Vue.component('stacked-bar-exp', StackedBar)
  Vue.component('x-axis-exp', XAxis)
  Vue.component('y-axis-exp', YAxis)
  Vue.component('y2-axis-exp', Y2Axis)
}

export default RoCharts
