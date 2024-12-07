import express, { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToMongoDB } from "./config/DBConnection";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Advanced URL Shortener app",
      version: "0.0.1",
      description: "Advanced URL Shortener app with Comprehensive Analytics, Custom Aliases, and Rate Limiting",
    },
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
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(
  cors({
    origin: [
      "*"
    ],
  })
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      authActions: {
        bearerAuth: {
          name: "Authorization",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "",
          },
          value: "Bearer <JWT token>",
        },
      },
    },
  })
);

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ health: "Ok" });
});

// Listen to port
(async () => {
  try {
    await connectToMongoDB();
    const port = Number(process.env.PORT);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error: any) {
    console.error("Error connecting to MongoDB: ", error.message);
  }
})();
