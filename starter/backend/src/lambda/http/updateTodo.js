import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { updateTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('updateTodo');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing UpdateTodo event...');
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;
    const updateData = JSON.parse(event.body);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      await updateTodo(userId, todoId, updateData);
      logger.info(`Successfully updated the todo item: ${todoId}`);
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
