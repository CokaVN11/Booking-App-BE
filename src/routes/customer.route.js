import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Customer route");
});

router.get("/get_all_rooms", (req, res) => {
  res.send("Get all rooms");
});

router.get("/get_room/:id", (req, res) => {
  var id = req.params.id;
  res.send(`Get room with id ${id}`);
});

export default router;