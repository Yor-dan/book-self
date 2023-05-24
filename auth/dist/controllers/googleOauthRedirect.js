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
exports.googleOauthRedirect = void 0;
const googleapis_1 = require("googleapis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const googleOauth_1 = require("./googleOauth");
const user_1 = require("../models/user");
(0, dotenv_1.config)();
const googleOauthRedirect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { code } = req.query;
    try {
        const { tokens } = yield googleOauth_1.oauth2Client.getToken(code);
        googleOauth_1.oauth2Client.setCredentials(tokens);
        const { data } = yield googleapis_1.google.people({ version: 'v1', auth: googleOauth_1.oauth2Client }).people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses',
        });
        const { names, emailAddresses } = data;
        const name = (_a = names === null || names === void 0 ? void 0 : names[0]) === null || _a === void 0 ? void 0 : _a.displayName;
        const email = (_b = emailAddresses === null || emailAddresses === void 0 ? void 0 : emailAddresses[0]) === null || _b === void 0 ? void 0 : _b.value;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            const newUser = new user_1.User({ email, name });
            newUser.save();
        }
        const session = jsonwebtoken_1.default.sign({ email }, process.env.TOKEN_SECRET);
        return res.status(300).cookie('session', session, { httpOnly: true, maxAge: 604800000 })
            .redirect(process.env.RESOURCE_SERVER);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong, try again later!');
    }
});
exports.googleOauthRedirect = googleOauthRedirect;
