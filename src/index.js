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
  Vue.component('chart', ChartRoot)
  Vue.component('line-chart', Line)
  Vue.component('bar', Bar)
  Vue.component('stacked-area', StackedArea)
  Vue.component('stacked-bar', StackedBar)
  Vue.component('x-axis', XAxis)
  Vue.component('y-axis', YAxis)
  Vue.component('y2-axis', Y2Axis)
}

export default RoCharts
