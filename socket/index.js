const io = require("socket.io")(5000, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  const remove = users?.filter((u) => u.userId !== userId);
  remove.push({ userId, socketId })
  users = remove;
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("connection with user.");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected with user.");
    removeUser(socket.id);
  });
});