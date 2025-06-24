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
exports.UserAdapter = void 0;
const User_1 = require("../entities/User");
const data_base_1 = require("../config/data-base");
class UserAdapter {
    constructor() {
        this.userRepository = data_base_1.AppDataSource.getRepository(User_1.User);
    }
    //Transforma la entidad de infraestructura(entidad User.ts) al modelo de dominio (interface User.ts)
    toDomain(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status
        };
    }
    //Transforma el modelo de dominio a la entidad de infraestructura
    toEntity(user) {
        const userEntity = new User_1.User();
        userEntity.name = user.name;
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.role = user.role;
        userEntity.status = user.status;
        return userEntity;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = this.toEntity(user);
                const savedUser = yield this.userRepository.save(newUser);
                return savedUser.id;
            }
            catch (error) {
                console.error("error creating user: ", error);
                throw new Error("failed to create user");
            }
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const existingUser = yield this.userRepository.findOne({ where: { id: id } });
                if (!existingUser)
                    return false;
                //Actualizar solo los campos enviados
                Object.assign(existingUser, {
                    name: (_a = user.name) !== null && _a !== void 0 ? _a : existingUser.name,
                    email: (_b = user.email) !== null && _b !== void 0 ? _b : existingUser.email,
                    password: (_c = user.password) !== null && _c !== void 0 ? _c : existingUser.password
                });
                yield this.userRepository.save(existingUser);
                return true;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw new Error("Failed to update user");
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.delete(id);
                return result.affected ? result.affected > 0 : false;
            }
            catch (error) {
                console.error("Error deleting user:", error);
                throw new Error("Failed to delete user");
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.findOne({ where: { id: id } });
                return existingUser ? this.toDomain(existingUser) : null; // Return null if user not found
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                throw new Error("Failed to fetch user by ID");
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.find();
                return users.map(user => this.toDomain(user)); // Convert each user entity to domain
            }
            catch (error) {
                console.error("Error fetching all users:", error);
                throw new Error("Failed to fetch all users");
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.findOne({ where: { email: email } });
                return existingUser ? this.toDomain(existingUser) : null; // Return null if user not found
            }
            catch (error) {
                console.error("Error fetching user by mail:", error);
                throw new Error("Failed to fetch user by mail");
            }
        });
    }
}
exports.UserAdapter = UserAdapter;
//# sourceMappingURL=UserAdapter.js.map