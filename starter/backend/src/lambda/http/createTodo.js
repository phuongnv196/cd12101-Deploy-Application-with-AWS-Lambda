import { createTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { getUserId } from '../utils.mjs';

const logger = createLogger('createTodo');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing CreateTodo event...');
    const userId = getUserId(event);
    const newTodoData = JSON.parse(event.body);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const newTodo = await createTodo(userId, newTodoData);
      logger.info('Successfully created a new todo item.');
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ newTodo })
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
