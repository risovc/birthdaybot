# Birthdaybot
Send Birthday reminders using the google appscript and twillio API

# Setup

1. Get your [twillio account](https://www.twilio.com/en-us/pricing)

2. Create a Google Sheet you can copy this [template](https://docs.google.com/spreadsheets/d/1RTt0oHD70RjzzAXwoWVAKz2EjElI4bNg6GQ9hb3WnrI/edit?usp=sharing)

3. Put the appscript in the sheet With your Google Sheet open, go to Extensions > Apps Script. This will open a new tab with the script editor.

4. Go to "Project Settings" (the gear icon ⚙️ on the left) >> Under "Script Properties", click "Add script property" >> Add the following three properties:
   
    - Property Name: TWILIO_ACCOUNT_SID   | Value: Your Account SID 

    - Property Name: TWILIO_AUTH_TOKEN    | Value: Your Auth Token

    - Property Name: TWILIO_PHONE_NUMBER  | Value: Your Twilio Phone Number 

5. Set Up a Daily Trigger


   To have the script run automatically every day, you need to set up a trigger:

   In the Apps Script editor, click on the Triggers icon (it looks like a clock).

   Click the + Add Trigger button. Configure the trigger as follows:

      Function to run: sendBirthdayWishes

      Deployment: Head

      Event source: Time-driven

      Type of time-based trigger: Day timer

      Time of day: Select a time that works for you (e.g., 9am to 10am).

Click Save.
