const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' }); // Set the region for your tests
const { handler } = require('./index'); // Adjust the path as necessary

describe('Post Request Test', () => {
  beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, { statusCode: 200 });
    });
  });

  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should display a success message upon creating an appointment', async () => {
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

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Appointment created successfully",
        AppointmentID: expect.any(String)
      })
    };

    const result = await handler(event);
    expect(result).toEqual(expectedResponse);
  });
});
