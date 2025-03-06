import express from "express";
import environment from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import os from "os";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import routes from "./routes/routes.js";
import admin from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

environment.config();
const app = express();
const server = createServer(app);
const port = process.env.PORT || 5000;
connectDB();

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("Socket connected");
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://localhost:8080",
//       "http://localhost:8081",
//       "exp://192.168.1.101:8081",
//       "exp://192.168.1.101:8080",
//       "192.168.1.101:8080",
//       "192.168.1.101:8081",
//       "https://json-converter-pro.vercel.app",
//       "https://web-app-6mfew.ondigitalocean.app",
//       "https://app.multigympremium.com",
//       "https://gymwebsite-pearl.vercel.app",
//       "https://multigympremium.com",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:8081",
      "exp://192.168.1.101:8081", // Expo Go local URL
      "http://192.168.1.101:8081", // Your LAN IP
      "http://192.168.1.101:19000", // Metro bundler
      "http://192.168.1.101:19001", // Debugging mode
      "http://192.168.1.101:19002", // Expo DevTools
      "http://192.168.1.101", // General LAN access
      "https://json-converter-pro.vercel.app",
      "https://web-app-6mfew.ondigitalocean.app",
      "https://app.multigympremium.com",
      "https://gymwebsite-pearl.vercel.app",
      "https://multigympremium.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  })
);

app.use(express.static("public"));
app.use("/api", routes);

app.get("/", (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  const ipAddress = Object.values(networkInterfaces)
    .flat()
    .find((details) => details.family === "IPv4" && !details.internal)?.address;

  res.status(200).json({
    message: `Server is Working. IP address: ${ipAddress}`,
  });
});

function sendEmail() {
  const socket = net.createConnection(smtpPort, smtpHost, () => {
    console.log("Connected to SMTP server");

    socket.write(`EHLO ${smtpHost}\r\n`);
  });

  let step = 0;

  socket.on("data", (data) => {
    console.log("Server response:", data.toString());

    // Handle each SMTP response and send the next command
    if (data.toString().includes("220") && step === 0) {
      // Start TLS if required by server
      step++;
      socket.write(`STARTTLS\r\n`);
    } else if (data.toString().includes("220") && step === 1) {
      // Upgrade to a secure TLS connection
      const secureSocket = tls.connect(
        {
          socket: socket,
          host: smtpHost,
          port: smtpPort,
          rejectUnauthorized: false,
        },
        () => {
          console.log("TLS connection established");
          secureSocket.write(`EHLO ${smtpHost}\r\n`);
        }
      );

      // Handle the secure connection responses
      secureSocket.on("data", (data) => {
        console.log("TLS Server response:", data.toString());

        if (data.toString().includes("250-AUTH") && step === 1) {
          step++;
          secureSocket.write("AUTH LOGIN\r\n");
        } else if (data.toString().includes("334") && step === 2) {
          step++;
          secureSocket.write(
            Buffer.from(smtpUsername).toString("base64") + "\r\n"
          );
        } else if (data.toString().includes("334") && step === 3) {
          step++;
          secureSocket.write(
            Buffer.from(smtpPassword).toString("base64") + "\r\n"
          );
        } else if (data.toString().includes("235") && step === 4) {
          // Authentication successful; now send the email
          step++;
          secureSocket.write(`MAIL FROM:<${from}>\r\n`);
        } else if (data.toString().includes("250") && step === 5) {
          step++;
          secureSocket.write(`RCPT TO:<${to}>\r\n`);
        } else if (data.toString().includes("250") && step === 6) {
          step++;
          secureSocket.write(`DATA\r\n`);
        } else if (data.toString().includes("354") && step === 7) {
          // Send email content
          secureSocket.write(`Subject: ${subject}\r\n`);
          secureSocket.write(`From: ${from}\r\n`);
          secureSocket.write(`To: ${to}\r\n`);
          secureSocket.write(`\r\n${message}\r\n.\r\n`);
          step++;
        } else if (data.toString().includes("250") && step === 8) {
          // Email sent successfully, close the connection
          secureSocket.write("QUIT\r\n");
          console.log("Email sent successfully!");
          secureSocket.end();
        }
      });

      secureSocket.on("end", () => {
        console.log("Disconnected from SMTP server");
      });

      secureSocket.on("error", (err) => {
        console.error("TLS connection error:", err);
      });
    }
  });

  socket.on("error", (err) => {
    console.error("SMTP connection error:", err);
  });

  socket.on("end", () => {
    console.log("Disconnected from SMTP server");
  });
}

app.get("/test-firebase", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(1);

    res.status(200).json({
      message: "Firebase Admin SDK connected!",
      users: listUsersResult.users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to connect to Firebase Admin SDK",
      error: error.message,
    });
  }
});

app.post("/createFirebaseUser", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({
      email: email,
      password: password,
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    // console.log(error);
    switch (error.code) {
      case "auth/invalid-email":
        return res.status(400).json({ message: "Invalid email format", error });

      case "auth/email-already-exists":
        return res.status(409).json({ message: "Email already in use", error });

      default:
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
    }
  }
});

app.use(errorHandler);

server.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ipAddress = Object.values(networkInterfaces)
    .flat()
    .find((details) => details.family === "IPv4" && !details.internal)?.address;

  console.log(`Server started on port ${port} at ${new Date()}.`);
  console.log(`Server IP address: ${ipAddress}`);
});
