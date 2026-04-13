const rawBody = inputData.raw_body || inputData.body || '[]';

function parseJson(value) {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Unable to parse HubSpot webhook body: ${error.message}`);
  }
}

function classifyEvent(event) {
  const eventType = String(event.subscriptionType || event.eventType || '').toLowerCase();
  const propertyName = String(event.propertyName || '');

  if (eventType.includes('creation') || eventType.includes('created')) {
    return 'create';
  }

  if (eventType.includes('deletion') || eventType.includes('deleted')) {
    return 'delete';
  }

  if (
    (eventType.includes('propertychange') || eventType.includes('property_change')) &&
    propertyName === 'hs_note_body'
  ) {
    return 'update';
  }

  return 'ignore';
}

const payload = parseJson(rawBody);
const events = Array.isArray(payload) ? payload : [payload];

const parsedEvents = events
  .map((event) => {
    const action = classifyEvent(event);
    const noteId = String(event.objectId || event.objectIdStr || event.id || '');

    return {
      action,
      noteId,
      eventId: String(event.eventId || ''),
      appId: String(event.appId || ''),
      occurredAt: String(event.occurredAt || event.attemptNumber || ''),
      propertyName: String(event.propertyName || ''),
      subscriptionType: String(event.subscriptionType || event.eventType || ''),
      raw: event,
    };
  })
  .filter((event) => event.action !== 'ignore' && event.noteId);

return {
  count: parsedEvents.length,
  events: parsedEvents,
};
