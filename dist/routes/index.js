"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getNotes_1 = __importDefault(require("../controllers/getNotes"));
const router = express_1.default.Router();
// define the home page route
router.get("/", getNotes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map