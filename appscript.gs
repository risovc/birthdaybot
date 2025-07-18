// ==================================================================
// Birthday SMS Sender using Twilio (Fixed and Improved)
// ==================================================================

// --- INSTRUCTIONS ---
// 1. Go to "Project Settings" (the gear icon ⚙️ on the left).
// 2. Under "Script Properties", click "Add script property".
// 3. Add the following three properties:
//    - Property Name: TWILIO_ACCOUNT_SID   | Value: Your Account SID (e.g., AC...)
//    - Property Name: TWILIO_AUTH_TOKEN    | Value: Your Auth Token
//    - Property Name: TWILIO_PHONE_NUMBER  | Value: Your Twilio Phone Number (e.g., +1659...)

// --- MAIN FUNCTION ---
function sendBirthdayWishes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Best to specify sheet name
  if (!sheet) {
    Logger.log("Sheet not found!");
    return;
  }
  
  var startRow = 2; // Start at the second row to skip the header
  var numRows = sheet.getLastRow() - 1;
  
  // If there's no data, exit
  if (numRows <= 0) {
    Logger.log("No data found in the sheet.");
    return;
  }
  
  var dataRange = sheet.getRange(startRow, 1, numRows, 3);
  var data = dataRange.getValues();

  // Use a consistent format for date comparison to avoid timezone issues
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM-dd");

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var name = row[0];
    var birthdayDate = new Date(row[1]);
    var mobileNumber = String(row[2]).trim(); // Read as string and trim whitespace

    // Check for invalid rows
    if (!name || !birthdayDate.getTime() || !mobileNumber) {
      Logger.log("Skipping invalid row: " + (i + startRow));
      continue;
    }
    
    // Ensure the phone number is in E.164 format (e.g., +919876543210)
    // This is a simple check; more complex validation may be needed.
    if (!mobileNumber.startsWith('+')) {
      // Assuming Indian numbers if no country code is present. Adjust if needed.
      mobileNumber = '+91' + mobileNumber;
    }

    var birthday = Utilities.formatDate(birthdayDate, Session.getScriptTimeZone(), "MM-dd");

    if (today == birthday) {
      var message = "Happy Birthday, " + name + "! Wishing you a fantastic day from your app!";
      Logger.log("It's " + name + "'s birthday! Sending SMS to " + mobileNumber);
      sendSms(mobileNumber, message);
    }
  }
}

// --- TWILIO SMS FUNCTION (with Error Handling) ---
function sendSms(to, body) {
  // Get credentials from Script Properties for security
  var scriptProperties = PropertiesService.getScriptProperties();
  var TWILIO_ACCOUNT_SID = scriptProperties.getProperty("TWILIO_ACCOUNT_SID");
  var TWILIO_AUTH_TOKEN = scriptProperties.getProperty("TWILIO_AUTH_TOKEN");
  var TWILIO_PHONE_NUMBER = scriptProperties.getProperty("TWILIO_PHONE_NUMBER");

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    Logger.log("ERROR: Twilio credentials are not set in Script Properties.");
    return;
  }

  var messages_url = "https://api.twilio.com/2010-04-01/Accounts/" + TWILIO_ACCOUNT_SID + "/Messages.json";

  var payload = {
    "To": to,
    "From": TWILIO_PHONE_NUMBER,
    "Body": body
  };

  var options = {
    "method": "post",
    "payload": payload,
    "headers": {
      "Authorization": "Basic " + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN)
    },
    "muteHttpExceptions": true // This is the key to capturing errors
  };

  try {
    var response = UrlFetchApp.fetch(messages_url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    if (responseCode === 201) { // 201 Created is the success code for new messages
      Logger.log("SMS sent successfully to " + to + ". SID: " + JSON.parse(responseBody).sid);
    } else {
      Logger.log("Error sending SMS. Status: " + responseCode + ". Response: " + responseBody);
    }
  } catch (e) {
    Logger.log("Fatal error trying to send SMS: " + e.toString());
  }
}
