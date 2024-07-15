import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { generateUploadUrl } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('GenerateUploadUrl');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing GenerateUploadUrl event...');
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const signedUrl = await generateUploadUrl(userId, todoId);
      logger.info('Successfully created signed url.');
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ uploadUrl: signedUrl })
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }
  });
