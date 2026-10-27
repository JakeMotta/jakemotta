// The real server's response envelope (src/helpers/index.js sendResponse + src/configs/messages.js).
// Clients put `message` into toasts, so the strings are reproduced exactly.

// type: [HTTP status, success, raw message]
export var MESSAGES = {
  SUCCESSFUL: [200, true, 'Successful'],
  DATA_FOUND: [200, true, 'Data found'],
  NO_DATA_FOUND: [200, false, 'Data not found'],
  SUCCESSFUL_CREATE: [200, true, 'Successfully created'],
  UNSUCCESSFUL_CREATE: [200, false, 'Creation not successful'],
  SUCCESSFUL_UPDATE: [200, true, 'Successfully updated'],
  UNSUCCESSFUL_UPDATE: [200, false, 'Updating not successful'],
  SUCCESSFUL_DELETE: [200, true, 'Successfully deleted'],
  UNSUCCESSFUL_DELETE: [200, false, 'Deleting not successful'],
  SUCCESSFUL_UPLOAD: [200, true, 'Upload was successful'],
  UNSUCCESSFUL_UPLOAD: [400, false, 'Upload was unsuccessful'],
  UPLOAD_FAILURE: [400, false, 'Failed to upload file'],
  SUCCESSFUL_PAIRED: [200, true, 'Successfully paired'],
  SUCCESSFUL_DISCONNECT: [200, true, 'Successfully disconnected'],
  DEVICE_ALREADY_PAIRED: [200, true, 'Another device is already paired'],
  NO_UPDATE_AVAILABLE: [200, true, 'Already up-to-date'],
  STATION_ASSIGN_SUCCESSFUL: [200, true, 'Station successfully assigned'],
  NO_USERS_FOUND: [200, false, 'No users were found matching that criteria'],
  NO_LOCATIONS_FOUND: [200, false, 'No locations were found matching that criteria'],
  REQUIRED_DATA_NOT_FOUND: [404, false, 'Cannot find required data'],
  BAD_REQUEST: [400, false, 'Invalid request'],
  INCOMPLETE_REQUEST: [422, false, 'Required parameters missing'],
  INSUFFICIENT_PRIVILEGES: [400, false, 'You do not have privileges to perform this action'],
  INVALID_CODE: [400, false, 'Invalid store code'],
  INACTIVE_LOCATION: [400, false, 'The requested location is inactive'],
  LOCATION_DOES_NOT_EXIST: [400, false, 'The requested location does not exist'],
  TOKEN_INVALID: [401, false, 'You have been logged out, please login again'],
  FORBIDDEN: [403, false, 'Unauthorized'],
  INTERNAL_SERVER_ERROR: [500, false, 'Internal server error'],
  ALREADY_SUBSCRIBED: [200, false, 'You are already subscribed'],
  CARD_NOT_CONFIGURED: [200, false, 'Please add a card'],
  STRIPE_USER_UPDATE_SUBSCRIPTION_SUCCESS: [200, true, 'Subscription success'],
  STRIPE_USER_CANCEL_SUBSCRIPTION_SUCCESS: [200, true, 'Cancel Subscription success'],
  STRIPE_USER_SUBSCRIPTION_NOT_FOUND: [400, false, 'No Subscription found for this user, create one'],
  PRODUCT_LIMIT_REACHED_LOCATION: [200, false, 'You have already availed free tier for location, please upgrade for unlimited options'],
  PRODUCT_LIMIT_REACHED_SCHEDULE: [200, false, 'You have already availed free tier for schedule, please upgrade for unlimited options'],
  PRODUCT_LIMIT_REACHED_ANNOUNCEMENT: [200, false, 'You have already availed free tier for announcement, please upgrade for unlimited options'],
};

// sendResponse(res, message, data, module): `message` is "<module> <text>" lower-cased with the first
// letter upper-cased; `data` is left out when it is falsy (null, undefined, "", 0), kept when {} or [].
export function send(type, data, module) {
  var m = MESSAGES[type];
  if (!m) throw new Error('unknown message type ' + type);
  var text = ((module ? module : '') + ' ' + m[2]).toLowerCase().trim();
  var body = { success: m[1], message: text.charAt(0).toUpperCase() + text.slice(1), type: type };
  if (data) body.data = data;
  return { status: m[0], body: body };
}

// Errors that did not go through sendResponse (Joi validators, the 404 handler, custom validator errors).
export function rawError(status, message) {
  var body = { statusCode: status, error: true, data: {} };
  if (message !== undefined) body.message = message;
  return { status: status, body: body };
}

export function notFound() {
  return rawError(404);
}
