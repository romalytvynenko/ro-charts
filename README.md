# Ro Charts
Small Vue charting library powered by D3

## Usage
```
<chart :data="dataProperty"/>

const dataProperty = {
	datasets: {
		audience: {
			type: 'line',
			data: [1, 12, 45, 67],
			dashedValues: [true, true, false, false],
		},
		growth: {
			type: 'bar',
			data: [1, 3, 2, 1],
			on: 'y2',
		}
	},
	axis: {
		x: {
			labels: ['2018-02-01', '2018-02-02', '2018-02-03', '2018-02-04'],
			timeseries: true,
			format: 'D MMMM',
		},
		y: {
			label: 'Audience'
		},
		y2: {
			label: 'Audience Growth',
		}
	}
}
```
