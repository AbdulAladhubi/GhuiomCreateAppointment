// lambda.test.js
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const { handler } = require('./index');

// Mock DynamoDB DocumentClient
AWSMock.setSDKInstance(AWS);
AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    callback(null, { statusCode: 200 }); // Simulating successful insertion
});

describe('Lambda Function Test', () => {
  it('should create an appointment successfully', async () => {
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

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.message).toBe("Appointment created successfully");
    expect(typeof body.AppointmentID).toBe('string'); // Checking if AppointmentID is a string
  });

  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });
});
