var express = require('express');
var router = express.Router();
let Group = require("../models/userGroup")
let User=require("../models/userModel")
router.post("/create", async (req, res) => {
    let group = new Group(req.body)
    await group.save()
    res.json({ status: "success", data: group })
})
router.get("/getAll", async (req, res) => {
    let group = await Group.find()
    let groupUser=[]
    for (let element of group) {
        let users = [];
        for (let data of element.group) {
          let user = await User.findById(data);
          users.push(user);
        }
        groupUser.push({"group":users,"_id":element._id});
      }
    res.json({ status: "success", data: groupUser })
})

module.exports = router;