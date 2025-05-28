const Task = require("../models/Task");
const User = require("../models/User");
const exceljs = require("exceljs");

const exportTasksReports = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];
        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned",
            });
        });
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.Header(
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );
        return workbook.xlsx, write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};
const exportUsersReports = async (req, res) => {
    try {
        const user = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};

        user.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    const stats = userTaskMap[assignedUser._id];
                    if (stats) {
                        stats.taskCount++;
                        if (task.status === 'Pending') stats.pendingTasks++;
                        else if (task.status === 'In progress') stats.inProgressTasks++;
                        else if (task.status === 'Completed') stats.completedTasks++;
                    }
                });
            }
        });

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="users.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};


module.exports = { exportTasksReports, exportUsersReports }