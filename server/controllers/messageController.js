const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        file:msg.file.file
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  let data={};
  try {
    const { from, to, message,file } = req.body;
    if (to.group) {
      const data1=[]
      data1.push(from)
      data1.push(to._id)
      to.group.forEach((element)=>{
        data1.push(element._id)
      })
      data = await Messages.create({
        message: { text: message },
        file:{file},
        users: data1,
        sender: from,
      });
    }else{
      data = await Messages.create({
        message: { text: message },
        file:{file},
        users: [from, to],
        sender: from,
      });
    }
    

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
