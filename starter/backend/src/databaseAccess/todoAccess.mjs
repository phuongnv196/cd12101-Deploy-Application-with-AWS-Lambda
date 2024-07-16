import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import awsXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs';
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';

const { captureAWSv3Client } = awsXRay;
const logger = createLogger('todoAccess');
const attachmentUtils = new AttachmentUtils();

class TodoAccess {
  constructor(
    docClient = captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    s3Client = new S3Client()
  ) {
    this.docClient = docClient;
    this.todosTable = todosTable;
    this.s3Client = s3Client;
    this.dynamoDbClient = DynamoDBDocument.from(this.docClient);
  }

  async getTodos(userId) {
    logger.info(`Getting all todo items userId: ${userId}`);
    const result = await this.dynamoDbClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      });
      result.Items.map(item => {
        item.attachmentUrl = attachmentUtils.getAttachmentUrl(item.todoId);
        return item;
      })
    return result.Items;
  }

  async getTodo(userId, todoId) {
    logger.info(`Getting todo item: ${todoId} ${userId}`);
    const result = await this.dynamoDbClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      });
    const todoItem = result.Items[0];
    return todoItem;
  }

  async createTodo(newTodo) {
    logger.info(`Creating new todo item: ${newTodo.todoId}`);
    await this.dynamoDbClient
      .put({
        TableName: this.todosTable,
        Item: newTodo
      });
    return newTodo;
  }

  async updateTodo(userId, todoId, updateData) {
    logger.info(`Updating a todo item: ${todoId} ${userId} `);
    await this.dynamoDbClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updateData.name,
          ':due': updateData.dueDate,
          ':dn': updateData.done
        }
      });
  }

  async deleteTodo(userId, todoId) {
    await this.dynamoDbClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId }
      });
  }

  async saveImgUrl(userId, todoId) {
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId);
    await this.dynamoDbClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      });
  }
}

export default TodoAccess;