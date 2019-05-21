const DASH_LENGTH = 5
const DASH_SEPARATOR_LENGTH = 3

// Dashing-related stuff begins here:

export function getDashArray(data, path, isDashed, xValue) {
  const dashedRanges = getDashedRanges(data, isDashed)
  if (dashedRanges.length === 0) return null

  const lengths = data.map((d, i) => getPathLengthAtX(path, xValue(i)))
  return buildDashArray(dashedRanges, lengths)
}

function getDashedRanges(data, isDashed) {
  const hasOpenRange = (arr) => _.last(arr) && !('end' in _.last(arr))
  const lastIndex = data.length - 1

  return _.reduce(data, (res, d, i) => {
    const isRangeStart = !hasOpenRange(res) && isDashed(d, i)
    if (isRangeStart) res.push({ start: Math.max(0, i - 1) })

    const isRangeEnd = hasOpenRange(res) && (!isDashed(d, i) || i === lastIndex)
    if (isRangeEnd) res[res.length - 1].end = i

    return res
  }, [])
}

function getPathLengthAtX(path, x) {
  const EPSILON = 1
  let point
  let target
  let start = 0
  let end = path.getTotalLength()

  // Mad binary search, yo
  while (true) {
    target = Math.floor((start + end) / 2)
    point = path.getPointAtLength(target)

    if (Math.abs(point.x - x) <= EPSILON) break

    if ((target >= end || target <= start) && point.x !== x) {
      break
    }

    if (point.x > x) {
      end = target
    } else if (point.x < x) {
      start = target
    } else {
      break
    }
  }

  return target
}

function buildDashArray(dashedRanges, lengths) {
  let lastVisitedIndex = 0

  let dashes = _.reduce(dashedRanges, (res, { start, end }, i) => {
    const prevEnd = i === 0 ? 0 : dashedRanges[i - 1].end

    const normalSegment = lengths[start] - lengths[prevEnd]
    const dashedSegment = getDashedSegment(lengths[end] - lengths[start])

    lastVisitedIndex = end

    return res.concat([normalSegment, dashedSegment])
  }, [])

  if (lastVisitedIndex < lengths.length - 1) {
    dashes.push(
      lengths[lengths.length - 1] + (lengths[lengths.length - 1] - (lengths[lengths.length - 2] || 0)) / 2
    )
  }

  return dashes
}

function getDashedSegment(length) {
  const totalDashLen = DASH_LENGTH + DASH_SEPARATOR_LENGTH
  const dashCount = Math.floor(length / totalDashLen)
  return _.range(dashCount)
    .map(() => DASH_SEPARATOR_LENGTH + ',' + DASH_LENGTH)
    .concat(length - dashCount * totalDashLen)
    .join(',')
}
