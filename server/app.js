const express = require("express");
const cors = require("cors");
const pool = require("./db/connection"); // Direct pool import
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const { ROUTES, BASE } = require("./routes/route");

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://delightful-liger-1f565f.netlify.app",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// // Database initialization
// app.use(async (req, res, next) => {
//   try {
//     req.pool = pool;
//     createTables();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [{ url: BASE }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use(`${BASE}/doc`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use(BASE, apiRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`API docs at http://localhost:${PORT}${BASE}/doc`);
});
