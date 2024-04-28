const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const { handler } = require('./index');  // Make sure to adjust this path to where your Lambda function code is located

// Set the AWS Region if not set globally (this example assumes 'us-west-2')
AWS.config.update({ region: 'eu-west-1' });

describe('Post Request Test', () => {
  // Before all tests, set up the AWS SDK mock
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      // Simulate a successful insertion into DynamoDB
      callback(null, { statusCode: 200 });
    });
  });

  // After all tests, restore the AWS SDK so it is no longer mocked
  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should display a success message upon creating an appointment', async () => {
    // Define the event to mimic the API Gateway event structure
    const event = {
      body: JSON.stringify({
        UserID: "user000",
        PsychologistID: "psy5678",
        Date: "2023-04-27",
        Time: "14:00",
        Location: "123 Main St, YourCity, YS",
        Status: "complete",
        ReminderSetting: true,
        SpecialNotes: "Please bring all relevant medical documents.",
        PatientName: "John Doe",
        PsychologistName: "Dr. Jane Smith",
        PatientAge: 30,
        PatientGender: "Male"
      })
    };

    // Define the expected response object
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointment created successfully",
        AppointmentID: expect.any(String)  // Using Jest's expect.any() to match any string for the AppointmentID
      })
    };

    // Call the handler with the mock event
    const result = await handler(event);

    // Assert that the handler's response matches the expected response
    expect(result).toEqual(expectedResponse);
  });
});
