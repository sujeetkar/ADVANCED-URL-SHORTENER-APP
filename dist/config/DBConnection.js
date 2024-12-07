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
exports.db = void 0;
exports.connectToMongoDB = connectToMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mongoURI = `${process.env.DB_URI}/${process.env.DB_NAME}`;
            yield mongoose_1.default.connect(mongoURI);
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.error("Error connecting to MongoDB: ", error);
        }
    });
}
const db = mongoose_1.default.connection;
exports.db = db;
db.on("error", (error) => {
    console.error("MongoDB connection error: ", error);
});
db.once("connected", () => {
    console.log("MongoDB connected successfully");
});
db.on("disconnected", () => {
    console.log("MongoDB disconnected");
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
    }
    catch (error) {
        console.error("Error closing MongoDB connection: ", error);
        process.exit(1);
    }
}));
