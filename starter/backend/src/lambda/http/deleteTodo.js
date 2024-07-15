import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { deleteTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('deleteTodo');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing DeleteTodo event...');
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      await deleteTodo(userId, todoId);
      logger.info(`Successfully deleted todo item: ${todoId}`);
      return {
        statusCode: 204,
        headers,
        body: undefined
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
