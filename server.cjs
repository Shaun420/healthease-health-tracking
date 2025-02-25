require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-config.json"); // Ensure this file exists and contains valid Firebase credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const GEMINI_API_KEY = "AIzaSyA6OV7BVKIpQT9-8aSWjqiyvjR4_NgVTk4";

const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to fetch disease prediction from Gemini AI
// Function to fetch disease prediction from Gemaini AI
async function getDiseasePrediction(healthData) {
  const prompt = `
  A patient has the following health data:
  - Age: ${healthData.age},
  - Gender: ${healthData.gender},
  - BMI: ${healthData.bmi},
  - Weight: ${healthData.weight},
  - Blood Pressure: ${healthData.blood_pressure}
  - Heart Rate: ${healthData.heart_rate} BPM
  - Glucose Level: ${healthData.glucose_level} mg/dL
  - Temperature: ${healthData.temperature}°C

  Based on this data, predict the most accurate possible disease and suggest precautions.

  Response Format JSON):

  Possible Disease, Causes, Prevention Steps

  Return only the table in JSON format, and ensure that line breaks are maintained in the response.
  `;

  try {
    const result = await model.generateContent(prompt);
    
    let resultText = result.response.text();
    if (resultText.startsWith("```html")) {
      let length = resultText.length;
      resultText = resultText.substring(8, length - 3);
    }

    // Ensure that newlines are preserved when displaying the response
    return resultText;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Error fetching disease prediction.";
  }
} 

// POST route to save health data and get disease prediction
app.post("/add-health-data", async (req, res) => {
  const { name, age, gender, bmi, weight, height, bp, heartRate, glucose, temperature, predictionResult } = req.body;

  try {
    // Store data in Firestore
    const healthRef = db.collection("health_records");
    await healthRef.add({
      name: name,
      age: age,
      gender: gender,
      bmi: bmi,
      weight: weight,
      height: height,
      blood_pressure: bp,
      heart_rate: heartRate,
      glucose_level: glucose,
      temperature: temperature,
      record_date: new Date(),
      prediction: predictionResult,
    });

    res.status(200).json({ message: "Health data added successfully" });
  } catch (error) {
    console.error("Error saving health data:", error);
    res.status(500).send("Error saving health data");
  }
});

// POST route to get disease prediction
app.post("/predict-disease", async (req, res) => {
  const healthData = req.body;

  try {
    const prediction = await getDiseasePrediction(healthData);
    res.status(200).json({ prediction });
  } catch (error) {
    console.error("Error getting disease prediction:", error);
    res.status(500).send("Error fetching prediction");
  }
});

/*
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return res.json({ token: "mock-auth-token" }); // Ideally, use JWT
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});*/

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Reference to Firestore collection
  const patientsRef = db.collection('patients');

  try {
    // Query Firestore for a patient with the provided username
    const snapshot = await patientsRef.where('username', '==', username).get();

    if (snapshot.empty) {
      // If no matching username is found
      return res.status(404).send('User not found');
    }

    const patient = snapshot.docs[0].data();

    // Validate the password (in production, this should compare hashed passwords)
    if (patient.password !== password) {
      return res.status(401).send('Invalid password');
    }

    // If authentication is successful, return user data (without password)
    const { password: _, ...userData } = patient;
    res.status(200).send({ token: patient.username });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get('/get-patient-profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Reference to Firestore collection
    const patientsRef = db.collection('patients');
    
    // Query to get patient profile by username
    const snapshot = await patientsRef.where('username', '==', username).get();
    
    if (snapshot.empty) {
      return res.status(404).send('Patient profile not found');
    }
    
    // Assuming only one result is expected
    const patient = snapshot.docs[0].data();
    
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error retrieving patient profile:', error);
    res.status(500).send('Error retrieving patient profile');
  }
});

// Express server: Add route to get health records
app.get("/get-health-data", async (req, res) => {
  try {
    const snapshot = await db.collection("health_records").get();
    
    // Check if there are documents
    if (snapshot.empty) {
      return res.status(404).json({ message: "No health records found" });
    }

    // Extract data from documents and convert the Firestore Timestamp to a JavaScript Date object
    const records = snapshot.docs.map(doc => {
      const data = doc.data();
      let date = "";
      // Check if the record_date exists and is a valid Firestore timestamp
      if (data.record_date && data.record_date.toDate) {
        date = data.record_date.toDate();
      }
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to JavaScript Date object
        record_date: date,
      };
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to store health data
/*
app.post("/add-health-data", async (req, res) => {
  try {
    const { user_id, blood_pressure, heart_rate, glucose_level, temperature } = req.body;
    const record = {
      user_id,
      blood_pressure,
      heart_rate,
      glucose_level,
      temperature,
      record_date: new Date(),
    };

    await db.collection("health_records").add(record);
    res.status(200).json({ message: "Health data added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/

app.post('/add-patient-profile', async (req, res) => {
  const { username, password, name, age, gender, number, doctorName, diagnosis, prevCheckup } = req.body;

  // Reference to Firestore collection
  const patientsRef = db.collection('patients');

  try {
    // Add patient data to Firestore
    await patientsRef.add({
      username,
      password,
      name,
      age,
      gender,
      number,
      doctorName,
      diagnosis,
      prevCheckup,
      record_date: admin.firestore.FieldValue.serverTimestamp(), // Store the timestamp
    });
    res.status(200).send('Patient profile added successfully');
  } catch (error) {
    console.error('Error adding patient profile:', error);
    res.status(500).send('Error adding patient profile');
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
