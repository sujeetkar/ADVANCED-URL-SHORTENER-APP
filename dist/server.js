"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const DBConnection_1 = require("./config/DBConnection");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "30mb" }));
app.use((0, cors_1.default)({
    origin: [
        "*"
    ],
}));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
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
}));
// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ health: "Ok" });
});
// Listen to port
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DBConnection_1.connectToMongoDB)();
        const port = Number(process.env.PORT);
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB: ", error.message);
    }
}))();
