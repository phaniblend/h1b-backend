"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.config = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'h1bconnect',
};
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: exports.config.host,
    port: exports.config.port,
    username: exports.config.username,
    password: exports.config.password,
    database: exports.config.database,
    synchronize: true,
    logging: true,
    entities: [__dirname + '/../entities/*.{ts,js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    subscribers: [__dirname + '/../subscribers/*.{ts,js}'],
    ssl: false,
});
//# sourceMappingURL=database.js.map