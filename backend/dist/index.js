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
require("./infraestructure/config/environment-vars");
const app_1 = __importDefault(require("./infraestructure/web/app"));
const server_bootstrap_1 = require("./infraestructure/bootstrap/server.bootstrap");
const data_base_1 = require("./infraestructure/config/data-base");
const server = new server_bootstrap_1.ServerBootstrap(app_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, data_base_1.connectDB)();
        const instances = [server.init()];
        yield Promise.all(instances);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}))();
//# sourceMappingURL=index.js.map