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
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOauth = exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];
const googleOauth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUrl = exports.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    return res.status(300).redirect(authUrl);
});
exports.googleOauth = googleOauth;
