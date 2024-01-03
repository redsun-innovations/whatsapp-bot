const db = require('./db');
const wppconnect = require('@wppconnect-team/wppconnect');
const { v4: uuidv4 } = require('uuid');

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  console.log("Server start");

  // Listen for incoming messages
  client.onMessage((message) => {
    console.log('Received message:', message.body);

    // Check the received message and respond accordingly
    handleIncomingMessage(client, message);
  });
}

async function handleIncomingMessage(client, message) {
  // Get user's phone number
  const userPhoneNumber = message.from.split('@')[0];
  const userName = message.notifyName;
  // Generate a random UUID
  const userId = uuidv4();

  // Check the content of the message
  switch (message.body.toLowerCase()) {
    case 'find mechanic':
      console.log('User name:', userName);
      console.log('Messages ph:', userPhoneNumber);
      try {
        await db.saveCustomerToDatabase(userId, userName, userPhoneNumber);
      } catch (error) {
        console.log('Error handling "find mechanic" request:', error);
        sendErrorMessage(client, userPhoneNumber);
      }
      findMechanic(client, userPhoneNumber);
      break;
    case 'list services':
      listServices(client, userPhoneNumber);
      break;
    default:
      // Handle other messages or provide instructions
      sendDefaultReply(client, userPhoneNumber);
      break;
  }
}


function findMechanic(client, userPhoneNumber) {
  // Implement logic to find a car mechanic
  const mechanicInfo = "We found a nearby mechanic for you. Contact: +123456789";

  // Send the mechanic information to the user
  client.sendText(userPhoneNumber, mechanicInfo)
    .then((result) => {
      console.log('Mechanic information sent successfully:', result);
    })
    .catch((error) => {
      console.log('Error sending mechanic information:', error);
    });
}

function listServices(client, userPhoneNumber) {
  // Implement logic to list available services
  const serviceList = "Our services:\n1. Oil Change\n2. Brake Inspection\n3. Tire Rotation";

  // Send the list of services to the user
  client.sendText(userPhoneNumber, serviceList)
    .then((result) => {
      console.log('Service list sent successfully:', result);
    })
    .catch((error) => {
      console.log('Error sending service list:', error);
    });
}

function sendDefaultReply(client, userPhoneNumber) {
  // Send a default reply for unrecognized messages
  const defaultReply = "Sorry, I didn't understand that. Please type 'Find Mechanic' or 'List Services'.";

  // Send the default reply to the user
  client.sendText(userPhoneNumber, defaultReply)
    .then((result) => {
      console.log('Default reply sent successfully:', result);
    })
    .catch((error) => {
      console.log('Error sending default reply:', error);
    });
}

function sendErrorMessage(client, userPhoneNumber) {
  const errorMessage = "An error occurred while processing your request. Please try again later.";
  // Send the error message to the user
  client.sendText(userPhoneNumber, errorMessage)
    .then((result) => {
      console.log('Error message sent successfully:', result);
    })
    .catch((error) => {
      console.log('Error sending error message:', error);
    });
}