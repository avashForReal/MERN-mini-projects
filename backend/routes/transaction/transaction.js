const router = require("express").Router();

const authenticate = require("../../middleware/authenticate");
const Transaction = require("../../models/transactionSchema");
const User = require("../../models/userSchema");

// GET Transaction
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // Get the family Id of the user
    const familyId = user.family;
    // Find all the users that belong to the given familyId
    const users = await User.find({ family: familyId });
    // Extract the user IDs from the user documents
    const userIds = users.map((user) => user._id);
    // Find all the todos that were created by the extracted user IDs
    let transactions = await Transaction.find({ createdBy: { $in: userIds } }).sort({ createdAt: -1 });
    transactions = transactions.map((e) => {
      return {
        id: e._id,
        text: e.text,
        amount: e.amount,
        createdAt: e.createdAt,
        createdBy: e.createdBy,
      };
    });
    for (let i = 0; i < transactions.length; i++) {
      const e = transactions[i];
      const userName = (await User.findById(e.createdBy)).name;
      transactions[i].createdById = e.createdBy;
      transactions[i].createdBy = userName;
    }
    return res.status(200).json(transactions);
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// Add a Transaction
router.post("/", authenticate, async (req, res) => {
  try {
    const { text, amount } = req.body;
    const newTransaction = new Transaction({
      text,
      amount,
      createdBy: req.userId,
    });
    await newTransaction.save();
    return res.status(201).json(newTransaction);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
});

// Delete a transaction
router.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { userId } = req;
  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "No transaction found",
      });
    }
    if (!((transaction.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only delete transactions created by you." })
    }

    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
