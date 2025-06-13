"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Basic placeholder routes
router.get('/', (req, res) => {
    res.json({ message: 'User routes - coming soon' });
});
exports.default = router;
//# sourceMappingURL=user.js.map