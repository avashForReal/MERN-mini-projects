const router = require("express").Router();
const authenticate = require("../../middleware/authenticate");
const Todo = require("../../models/todoSchema");
const User = require("../../models/userSchema");

// add todo to database
router.post("/", authenticate, async (req, res) => {
  const { title } = req.body;
  try {
    const newTodo = new Todo({
      title: title,
      createdBy: req.userId,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get todos for a user's family
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
    let todos = await Todo.find({ createdBy: { $in: userIds } }).sort({ updatedAt: -1 });
    todos = todos.map((t) => {
      return {
        id: t._id,
        title: t.title,
        createdBy: t.createdBy,
      };
    });
    for (let i = 0; i < todos.length; i++) {
      const t = todos[i];
      const userName = (await User.findById(t.createdBy)).name;
      todos[i].createdById = t.createdBy;
      todos[i].createdBy = userName;
    }


    res.status(200).json({ data: todos, status: true });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get todo
// update todos
router.get("/:id", authenticate, async (req, res) => {
  const { userId } = req;
  try {
    const todo = await Todo.findOne({ _id: req.params.id })
    if (!todo) {
      return res.status(404).json({ message: "todo not found" })
    }
    res.send(todo);
  } catch (error) {
    res.send({ error: "an error occured" });
  }
});

// update todos
router.put("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { userId } = req;
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(401).json({ message: "title is required." })
    }
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "todo not found" })
    }
    if (!((todo.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only edit todos created by you." })
    }
    const data = await Todo.findByIdAndUpdate(id, { title: title }, { new: true });
    return res.send(data);
  } catch (error) {
    res.send(error);
  }
});

// delete todos
router.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { userId } = req;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "todo not found" })
    }
    if (!((todo.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only delete todos created by you." })
    }
    const data = await Todo.findByIdAndDelete(id);
    return res.status(202).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
