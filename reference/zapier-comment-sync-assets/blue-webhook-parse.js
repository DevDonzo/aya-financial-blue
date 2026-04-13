const rawBody = inputData.raw_body || inputData.body || '{}';

function parseJson(value) {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Unable to parse Blue webhook body: ${error.message}`);
  }
}

function readFirst(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && `${value}` !== '') {
      return `${value}`;
    }
  }
  return '';
}

function classifyEvent(eventType) {
  switch (eventType) {
    case 'COMMENT_CREATED':
      return 'create';
    case 'COMMENT_UPDATED':
      return 'update';
    case 'COMMENT_DELETED':
      return 'delete';
    default:
      return 'ignore';
  }
}

const payload = parseJson(rawBody);
const eventType = readFirst(payload.eventType, payload.type, payload.event);
const action = classifyEvent(eventType);

const comment =
  payload.comment ||
  payload.data?.comment ||
  payload.payload?.comment ||
  payload.data ||
  payload.payload ||
  {};

return {
  action,
  eventType,
  commentId: readFirst(comment.id, payload.commentId, payload.data?.commentId),
  blueRecordId: readFirst(
    comment.categoryId,
    comment.todoId,
    comment.todo?.id,
    payload.todoId,
    payload.recordId
  ),
  text: readFirst(comment.text, payload.text),
  html: readFirst(comment.html, payload.html),
  createdAt: readFirst(comment.createdAt, payload.createdAt),
  updatedAt: readFirst(comment.updatedAt, payload.updatedAt),
  raw: payload,
};
