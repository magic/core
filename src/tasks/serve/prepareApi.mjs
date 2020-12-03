import is from '@magic/types'

export const prepareApi = async rawLambdas => {
  const lambdaPromises = await Promise.all(
    Object.entries(rawLambdas).map(async ([key, lambda]) => {
      try {
        const result = await lambda()

        if (is.fn(result)) {
          return [key, result]
        } else {
          console.log('result is not a function', typeof result)
        }
      } catch (e) {
        // lambda does not return a creator function,
        // use as is by returning it below
      }

      return [key, lambda]
    }),
  )

  const lambdas = Object.fromEntries(lambdaPromises)
  return lambdas
}
