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
exports.UserApplicationService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AuthService_1 = require("./AuthService");
class UserApplicationService {
    //2. Constructor
    constructor(port) {
        this.port = port;
    }
    //3. Métodos -> Casos de uso -> Lógica de negocio
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.port.getUserByEmail(email);
            if (!existingUser) {
                throw new Error("Credenciales inválidas");
            }
            const passwordMatch = yield bcryptjs_1.default.compare(password, existingUser.password);
            if (!passwordMatch) {
                throw new Error("Credenciales inválidas");
            }
            const token = AuthService_1.AuthService.generateToken({
                id: existingUser.id,
                email: existingUser.email,
            });
            return token;
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.port.getUserByEmail(user.email);
            if (!existingUser) {
                const hashePassword = yield bcryptjs_1.default.hash(user.password, 10);
                user.password = hashePassword;
                return yield this.port.createUser(user);
            }
            throw new Error("User with this email already exists");
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.port.getUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }
            if (user.email) {
                const emailTaken = yield this.port.getUserByEmail(user.email);
                if (emailTaken && emailTaken.id !== id) {
                    throw new Error('Email is already taken by another user');
                }
            }
            return yield this.port.updateUser(id, user);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.deleteUser(id);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.getAllUsers();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.getUserById(id);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.getUserByEmail(email);
        });
    }
}
exports.UserApplicationService = UserApplicationService;
//# sourceMappingURL=UserApplicationService.js.map