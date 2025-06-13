"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Application routes - coming soon' });
});
exports.default = router;
//# sourceMappingURL=application.js.map