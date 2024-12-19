"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const dotenv = __importStar(require("dotenv"));
const qrcode_1 = __importDefault(require("qrcode"));
dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function random(len) {
    let options = "mnbvcguioqwertyuiopqadlksjhcv09876543145vhsda9382";
    let length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)];
    }
    return ans;
}
app.post("/api/shorten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl } = req.body;
        const urlHash = random(9);
        const url = new db_1.UrlModel({
            originalUrl,
            urlHash,
            visits: 0,
        });
        const newUrl = `${BACKEND_URL}/${urlHash}`;
        const qrCode = yield qrcode_1.default.toDataURL(newUrl);
        yield url.save();
        res.status(200).json({
            message: "URL generated.",
            urlHash,
            qrCode,
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
app.get("/:urlHash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlHash = req.params.urlHash;
        const url = yield db_1.UrlModel.findOne({ urlHash });
        if (url) {
            url.visits++;
            yield url.save();
            res.redirect(url.originalUrl);
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
app.get("/stats/:urlHash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlHash = req.params.urlHash;
        const url = yield db_1.UrlModel.findOne({ urlHash });
        res.status(200).json({
            message: "Link found",
            visits: url === null || url === void 0 ? void 0 : url.visits,
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
app.listen(3000);
