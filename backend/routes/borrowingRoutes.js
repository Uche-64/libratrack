const express = require('express');
const router = express.Router();
const { getBorrowings, borrowBook, returnBook, getMemberBorrowings } = require('../controllers/borrowingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getBorrowings);
router.post('/borrow', protect, adminOnly, borrowBook);
router.put('/return/:id', protect, adminOnly, returnBook);
router.get('/member/:memberId', protect, getMemberBorrowings);

module.exports = router;