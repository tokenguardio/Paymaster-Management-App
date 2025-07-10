export const getValidationErrorMessage = (data: string) => {
  return `We apologize, but we're having trouble displaying ${data} data right now. If the problem persists,
    please contact our support team for further assistance. Thank you for your patience!`
}

export const determineChartDataFormat = (data: any) => {
  const keys = Object.keys(data[0])
  if (keys.includes('differential')) {
    const mainMeasure = keys.filter(
      (item) => item !== 'dimension' && item !== 'differential'
    )[0]

    const prepareData = (arr: Array<any>, property: string) => {
      let uniqueKeys = new Set()

      arr.forEach((obj) => {
        if (property in obj) {
          uniqueKeys.add(obj[property])
        }
      })

      return Array.from(uniqueKeys)
    }

    const preparedDimension = prepareData(data, 'dimension').sort()
    const preparedDifferential = prepareData(data, 'differential')
    let result = []

    preparedDimension.forEach((dimension) => {
      let point = {
        dimension: dimension,
      }

      preparedDifferential.forEach((measure: any) => {
        point[measure] = data.filter(
          (item: any) =>
            item.dimension === dimension && item.differential === measure
        )[0]?.[mainMeasure]
      })

      result.push(point)
    })

    return result
  } else {
    const mainMeasure = keys.filter((item) => item !== 'dimension')[0]
    return convertDataToSingleLineFormat(data, mainMeasure)
  }
}

export const convertDataToSingleLineFormat = (
  data: any,
  metric: string
) => {
  if (!metric) {
    return null
  }

  const chartData = data.map((item) => {
    return {
      dimension: item.dimension,
      [metric]: item[metric],
    }
  })

  return chartData
}