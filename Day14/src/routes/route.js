const crud=require("../controllers/control")

const express=require("express");
const router=express.Router();
;
router.get("/notes/:id",crud.find);
module.exports = router;