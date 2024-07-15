import { parseUserId } from '../auth/utils.mjs';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('lambdaUtils');

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  logger.info(`parseUserId: ${jwtToken} ${authorization}`);
  return parseUserId(jwtToken)
}
