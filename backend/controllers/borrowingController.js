const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const Member = require('../models/Member');

// Get all borrowings
const getBorrowings = async (req, res) => {
  try {
    // Auto-update overdue status
    await Borrowing.updateMany(
      { status: 'borrowed', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const filter = req.query.status ? { status: req.query.status } : {};
    const total = await Borrowing.countDocuments(filter);
    const borrowings = await Borrowing.find(filter)
      .populate('book', 'title author')
      .populate('member', 'name membershipID')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ borrowings, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Borrow a book
const borrowBook = async (req, res) => {
  const { bookId, memberId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1)
      return res.status(400).json({ message: 'No available copies of this book' });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.status === 'suspended')
      return res.status(400).json({ message: 'Member is suspended and cannot borrow books' });

    // Check if member already has this book borrowed
    const existing = await Borrowing.findOne({ book: bookId, member: memberId, status: { $in: ['borrowed', 'overdue'] } });
    if (existing) return res.status(400).json({ message: 'Member already has this book borrowed' });

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    const borrowing = await Borrowing.create({ book: bookId, member: memberId, borrowDate, dueDate });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    const populated = await Borrowing.findById(borrowing._id)
      .populate('book', 'title author')
      .populate('member', 'name membershipID');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    if (!borrowing) return res.status(404).json({ message: 'Borrowing record not found' });
    if (borrowing.status === 'returned')
      return res.status(400).json({ message: 'Book already returned' });

    borrowing.returnDate = new Date();
    borrowing.status = 'returned';
    await borrowing.save();

    // Increase available copies
    await Book.findByIdAndUpdate(borrowing.book, { $inc: { availableCopies: 1 } });

    res.json({ message: 'Book returned successfully', borrowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get borrowing history for a specific member
const getMemberBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ member: req.params.memberId })
      .populate('book', 'title author ISBN')
      .sort({ createdAt: -1 });
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBorrowings, borrowBook, returnBook, getMemberBorrowings };