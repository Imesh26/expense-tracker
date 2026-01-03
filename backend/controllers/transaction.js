const Transaction = require('../models/Transaction');

// @desc    Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        return res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc    Add transaction
exports.addTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        return res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        return res.status(400).json({ success: false, error: 'Incorrect data included' });
    }
}

// @desc    Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'No transaction found' });
    }

    await transaction.deleteOne();

    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
}