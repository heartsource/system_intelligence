const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Require the 'fs' module for file system operations
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

// Add CORS middleware
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost', /^https:\/\/.*\.vercel\.app$/], // Regex pattern to match any subdomain of vercel.app
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Define the directory for uploads
const UPLOADS_DIR = './uploads';

// Create the directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File upload middleware for multiple files
const upload = multer({ storage }).array('files', 10); // 'files' is the field name for multiple files, 10 is the maximum number of files

// Route for handling file upload
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err });
    }
    const files = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));
    setTimeout(() => {
      // Process the request and send the response
      res
        .status(200)
        .json({ message: 'Files uploaded successfully', files: files });
    }, 2000);
  });
});
//talk to hearty api
app.use(bodyParser.json());

app.post('/talk-to-heartie', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await axios.post(
      `http://4.255.69.143/heartie-be/talk_to_heartie/?question=${encodeURIComponent(
        question
      )}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching data from the Heartie API.',
    });
  }
});

// ai-prompts api
app.get('/get-ai-prompts', async (req, res) => {
  try {
    const response = await axios.get(
      'http://4.255.69.143/heartie-be/get_ai_prompts/'
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching data from the AI prompts API.',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
