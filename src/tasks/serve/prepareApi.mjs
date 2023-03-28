import is from '@magic/types'
import log from '@magic/log'

export const prepareApi = async (rawLambdas = {}) => {
  const lambdaPromises = await Promise.all(
    Object.entries(rawLambdas).map(async ([key, lambda]) => {
      try {
        const result = await lambda()

        if (is.fn(result)) {
          return [key, result]
        } else {
          log.error('E_NOT_A_FUNCTION', 'result is not a function', result)
        }
      } catch (e) {
        // lambda does not return a creator function,
        // use as is by returning it below
        log.error('E_BUILDING_LAMBDA', e)
      }

      return [key, lambda]
    }),
  )

  const lambdas = Object.fromEntries(lambdaPromises)
  return lambdas
}
