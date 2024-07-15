import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { getTodos } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('getTodos');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing GetTodos event...');
    const userId = getUserId(event);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const todoList = await getTodos(userId);
      logger.info('Successfully retrieved todolist');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ todoList })
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
