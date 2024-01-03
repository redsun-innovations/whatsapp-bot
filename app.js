const wppconnect = require('@wppconnect-team/wppconnect');
const { log } = require('sharp/lib/libvips');

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

async function askForPincode(client, userPhoneNumber) {
  const pincodeMessage = "Great! Please share your pin code in the format 'Pincode: XXXXX'.";
  await client.sendText(userPhoneNumber, pincodeMessage);
}
async function askForVehicleModel(client, userPhoneNumber) {
  const vehicleModelMessage = "Thanks! What is the model of your vehicle?\nEnter in the format 'model:XXXX'.";
  await client.sendText(userPhoneNumber, vehicleModelMessage);
}
async function askForYearOfPurchase(client, userPhoneNumber) {
  const yearOfPurchaseMessage = "Got it! What is the year of purchase of your vehicle?\nEnter in the format 'purchase-year:XXXX'.";
  await client.sendText(userPhoneNumber, yearOfPurchaseMessage);
}
async function askForServiceDescription(client, userPhoneNumber) {
  const serviceDescriptionMessage = "Excellent! Please provide a brief description of the service you need\nEnter in the format 'description:XXXX'.";
  await client.sendText(userPhoneNumber, serviceDescriptionMessage);
}

async function handleIncomingMessage(client, message) {
  // Get user's phone number
  const userPhoneNumber = message.from;
  const lowerCaseBody = message.body.toLowerCase();
  console.log("lowercase body" ,lowerCaseBody)
  // Check the content of the message
  switch (message.body.toLowerCase()) {
    case 'hi':
    case 'hello':
      await sendWelcomeMessage(client, userPhoneNumber);
      break;
    case 'find mechanic':
      // User clicked "Find Mechanic"
      await askForPincode(client, userPhoneNumber);
      break;
    case 'other services':
      await otherServices(client, userPhoneNumber);
      break;
    default:
      if (lowerCaseBody.startsWith('pincode:')) {
        // await savePincode(userPhoneNumber, getPincode(lowerCaseBody));
        await askForVehicleModel(client, userPhoneNumber);
      } else if (lowerCaseBody.startsWith('model:')) {
        // await saveVehicleModel(userPhoneNumber, lowerCaseBody.replace('vehicle model:', '').trim());
        await askForYearOfPurchase(client, userPhoneNumber);
      } else if (lowerCaseBody.startsWith('purchase-year:')) {
        // await saveYearOfPurchase(userPhoneNumber, lowerCaseBody.replace('year of purchase:', '').trim());
        await askForServiceDescription(client, userPhoneNumber);
      } else if (lowerCaseBody.startsWith('description:')) {
        const confirmationMessage = "Thanks for the details. We will send mechanic details within 2 minutes.";
        await client.sendText(userPhoneNumber, confirmationMessage);
        // await saveServiceDescription(userPhoneNumber, lowerCaseBody.replace('description:', '').trim());
      } else {
        await sendDefaultReply(client, userPhoneNumber);
      }
      break;
  }
}

// async function sendWelcomeMessage(client, userPhoneNumber) {
//   const welcomeMessage = "Hi! Welcome to the WhatsApp bot. We provide services to find a mechanic and more. Choose an option below:";

//   // Send the welcome list message with buttons
//   await client.sendListMessage(userPhoneNumber , {
//     buttonText: 'Choose an option',
//     description: welcomeMessage,
//     sections: [
//       {
//         title: 'Options',
//         rows: [
//           {
//             rowId: 'find_mechanic', // Unique rowId for "Find Mechanic" option
//             title: 'Find Mechanic',
//             description: 'Click to find a mechanic',
//           },
//           {
//             rowId: 'other_services',
//             title: 'Other Services',
//             description: 'Explore other services',
//           },
//         ],
//       },
//     ],
//   });
// }

async function sendWelcomeMessage(client, userPhoneNumber) {
  const welcomeMessage = "Hi! Welcome to the WhatsApp bot. We provide services to find a mechanic and more. Choose an option below:";
  // Send the welcome message with buttons
  await client.sendText(userPhoneNumber , welcomeMessage, {
    useTemplateButtons: true,
    buttons: [
      { id: 'find_mechanic', text: 'Find Mechanic' },
      { id: 'other_services', text: 'Other Services' },
    ],
  });
}

async function sendDefaultReply(client, userPhoneNumber) {
  const defaultReply = "Sorry, I didn't understand that. How can I assist you today?\nClick 'Find Mechanic' to locate a nearby mechanic or 'List Services' to see available services.";
  // Send the welcome message with buttons
  await client.sendText(userPhoneNumber , defaultReply, {
    useTemplateButtons: true,
    buttons: [
      { id: 'find_mechanic', text: 'Find Mechanic' },
      { id: 'other_services', text: 'Other Services' },
    ],
  });
}

// async function askForPincode(client, userPhoneNumber) {
//   const pincodeMessage = "Great! Please share your pin code in the format 'Pincode: XXXXX'.";
//   await client.sendText(userPhoneNumber, pincodeMessage);
// }

async function otherServices(client, userPhoneNumber) {
  // Implement logic to list available services
  const serviceList = "Our services:\n1. Oil Change\n2. Brake Inspection\n3. Tire Rotation";
  await client.sendText(userPhoneNumber, serviceList);
}

// async function sendDefaultReply(client, userPhoneNumber) {
//   // Send a default reply for unrecognized messages
//   const defaultReply = "Sorry, I didn't understand that. How can I assist you today?\nType 'Find Mechanic' to locate a nearby mechanic or 'List Services' to see available services.";
//   await client.sendText(userPhoneNumber, defaultReply);
// }