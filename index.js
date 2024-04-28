const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'AppointmentsTable';

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const appointmentId = generateRandomId(10);
        
        // Directly use the plaintext data
        const item = {
            AppointmentID: appointmentId,
            UserID: data.UserID,
            PsychologistID: data.PsychologistID,
            Date: data.Date,
            Time: data.Time,
            Location: data.Location,
            Status: data.Status,
            ReminderSetting: data.ReminderSetting,
            SpecialNotes: data.SpecialNotes, // Store data in plaintext
            Timezone: "EU", // Added timezone associated with "US"
            PatientName: data.PatientName, // Store plaintext patient name
            PsychologistName: data.PsychologistName, // Store plaintext psychologist name
            PatientAge: data.PatientAge, // Store plaintext patient age
            PatientGender: data.PatientGender // Store plaintext patient gender
        };
        
        await dynamoDb.put({
            TableName: tableName,
            Item: item
        }).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Appointment created successfully", AppointmentID: appointmentId }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
