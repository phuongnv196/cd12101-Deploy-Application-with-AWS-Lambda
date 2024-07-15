import * as uuid from 'uuid';
import TodoAccess from '../databaseAccess/todoAccess.mjs';
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';

const todoAccess = new TodoAccess();
const attachmentUrl = new AttachmentUtils();
export async function getTodos(userId) {
  return todoAccess.getTodos(userId);
}

export async function getTodo(userId, todoId) {
  return todoAccess.getTodo(userId, todoId);
}

export async function createTodo(userId, newTodoData) {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo = { todoId, userId, createdAt, done, ...newTodoData };
  return todoAccess.createTodo(newTodo);
}

export async function updateTodo(userId, todoId, updateData) {
  return todoAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(userId, todoId) {
  return todoAccess.deleteTodo(userId, todoId);
}

export async function generateUploadUrl(userId, todoId) {
  toDoAccess.generateUploadUrl(userId, todoId)
  const url = await attachmentUrl.getUploadUrl(todoId)
  return url
}