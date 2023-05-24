"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const googleOauth_1 = require("./controllers/googleOauth");
const googleOauthRedirect_1 = require("./controllers/googleOauthRedirect");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(process.env.CONNECTION_STRING)
    .then(() => {
    app.listen(process.env.PORT);
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})
    .catch((err) => console.error(err));
app.get('/googleOauth', googleOauth_1.googleOauth);
app.get('/googleOauth/redirect', googleOauthRedirect_1.googleOauthRedirect);
app.use((req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});
