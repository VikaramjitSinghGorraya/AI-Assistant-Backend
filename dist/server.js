"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const askRoutes_1 = __importDefault(require("./routes/askRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const conversationsRoutes_1 = __importDefault(require("./routes/conversationsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [
    "http://localhost:3000",
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/ask", askRoutes_1.default);
app.use("/api/search", searchRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/conversations", conversationsRoutes_1.default);
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        throw new Error("MONGO_URI environment variable is not defined");
    }
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
