const express = require('express');
const protectRoute = require('../middleware/protect-route');
const { getUsers, getMessages, sendMessage } = require('../controllers/message-controller');

const router = express.Router();

router.use(protectRoute);
router.get('/users', getUsers);
router.get('/:id', getMessages);
router.post('/:id', sendMessage);

module.exports = router;