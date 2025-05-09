const express =require("express");
const {protect,adminOnly}=require("../middlewares/authmiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTasksById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChickList } = require("../controllers/taskController");

const router=express.Router();

router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/getTasks",protect,getTasks);
router.get("/getTasks/:id",protect,getTasksById);
router.post("/createTasks",protect,adminOnly,createTask);
router.put("/updateTask/:id",protect,updateTask);
router.delete("/deleteTask/:id",protect,adminOnly,deleteTask);
router.put("/task/:id/status",protect,updateTaskStatus);
router.put("/task/:id/todo",protect,updateTaskChickList);

module.exports = router;
