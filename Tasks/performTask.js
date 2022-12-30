const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const Pool = require('pg').Pool;
const moment = require('moment');
const router = express.Router();
// const tasks = require('./Tasks/performTask')

const pool = new Pool({
    user: 'apiexpress',
    host: 'dpg-cem2eg5a4991ihktm650-a.singapore-postgres.render.com',
    database: 'apiexpress',
    password: 'MwthgagVBBOrDn6pOvJLNqiEB9HfNq2D',
    dialect: 'postgres',
    port: 5432,
    ssl: true
});
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

async function getAllTasks() {
    let getAllTasks = await pool.query('SELECT * FROM createTasks')
    if (getAllTasks && getAllTasks.rows) {
        return getAllTasks.rows
    } else {
        return "Record Not Found"
    }
}

async function getAllAssigned() {
    let getAllTasks = await pool.query('SELECT * FROM createTasks')
    let getAssignedTask = getAllTasks.rows.filter(assign => assign.status === "Assigned")
    if (getAssignedTask.length > 0 && getAllTasks.rows.length > 0) {
        return getAssignedTask
    } else {
        return "Record Not Found"
    }
}


async function createTask(title,
    description,
    dateCompleted,
    dateClosed,
    status,
    createdBy,
    assignedTo) {
    let task_id = moment().format("YYHHMMSS")
    let createdDate = moment().format('DD/MM/YYYY');
    console.log(
        task_id,
        title,
        description,
        dateCompleted,
        dateClosed,
        status,
        createdBy,
        assignedTo)
    if (title
        && title !== ""
        && description
        && description !== ""
        && dateCompleted !== ""
        && dateClosed !== ""
        && status !== ""
        && createdBy !== ""
        && assignedTo !== ""
    ) {
        let getTaskData = await pool.query(`INSERT INTO createtasks VALUES(${task_id.replace(/,/g, '')},'${title}','${description}','${createdDate}','${createdDate}','${dateCompleted}','${dateClosed}','${status}','${createdBy}','${assignedTo}')`)
        console.log("getTaskData  DB ", getTaskData)
        if (getTaskData && getTaskData.rowCount === 1) {
            return { status: "Success", message: "The Task has been Created Successfully" }

        } else {
            return { status: "Failed", message: "Please Fill all the Details" }
        }
    } else {
        res.send({ status: "Failed", message: "Please Fill all the Details" })
    }
}

const updateTask = async (
    task_id,
    title,
    description,
    dateCompleted,
    dateClosed,
    status,
    createdBy,
    assignedTo
) => {
    if (task_id
        && task_id != ""
        && title
        && title !== ""
        && description
        && description !== ""
        && dateCompleted !== ""
        && dateClosed !== ""
        && status !== ""
        && createdBy !== ""
        && assignedTo !== ""
    ) {
        let getAllTasks = await pool.query('SELECT * FROM createTasks')
        let getTaskByTaskId = getAllTasks.rows.find(task => task.task_id === task_id);
        if (Object.keys(getTaskByTaskId).length > 0) {
            let updateTaskDetails = await pool.query(`UPDATE createtasks SET title = '${title}', description = '${description}', 
        datecompleted = '${dateCompleted}', dateclosed = '${dateClosed}',
        status = '${status}', createdby = '${createdBy}', assignedto = '${assignedTo}' 
        WHERE task_id = ${getTaskByTaskId.task_id}`)
            return { status: true, message: `Details Updated for ID - ${getTaskByTaskId.task_id}` }
        } else {
            return { status: "Failed", message: "Please Fill all the Details" }
        }
    } else {
        return { status: "Failed", message: "Please Fill all the Details" }
    }
}
const getTaskById = async (uid) => {
    let getTaskDetails = await pool.query(`SELECT * FROM createTasks where task_id=${uid}`)
    if (getTaskDetails && getTaskDetails.rows.length > 0) {
        return getTaskDetails.rows
    } else {
        return ({ status: false, message: "Record Not Found" })

    }
}

const updateTaskStatus = async (status, uid) => {
    if (uid && uid !== ""
        && status
        && status !== ""
    ) {
        let getAllTasks = await pool.query('SELECT * FROM createTasks')
        let getTaskByTaskId = getAllTasks.rows.find(task => task.task_id === Number(uid));
        if (Object.keys(getTaskByTaskId).length > 0) {
            let updateTaskDetails = await pool.query(`UPDATE createtasks SET status = '${status.toUpperCase()}' 
      WHERE task_id = ${getTaskByTaskId.task_id}`)
            return ({ status: true, message: `Status has been Updated from ${getTaskByTaskId.status} to  ${status}` })
        } else {
            return ({ status: "Failed", message: "Please Fill all the Details" })
        }
    } else {
        return ({ status: "Failed", message: "Please Fill all the Details" })
    }
}

const updateTaskStatusComplete = async (uid, status) => {
    if (uid
        && uid !== ""
        && status
        && status === "Completed" || status === "completed"
    ) {
        let getAllTasks = await pool.query('SELECT * FROM createTasks')
        let getTaskByTaskId = getAllTasks.rows.find(task => task.task_id === Number(uid));
        // let getTaskByTaskStatus = getAllTasks.rows.find(task => task.task_id === task_id);
        if (Object.keys(getTaskByTaskId).length > 0) {
            let updateTaskDetails = await pool.query(`UPDATE createtasks SET status = '${status.toUpperCase()}' 
          WHERE task_id = ${getTaskByTaskId.task_id}`)
            return ({ status: true, message: `Status has been Updated from ${getTaskByTaskId.status} to ${status}` })
        } else {
            return ({ status: "Failed", message: "Please Fill all the Details" })
        }
    } else {
        return ({ status: "Failed", message: "Please Fill all the Details or Mentioned Status is Wrong" })
    }
}

const taskAssignedToIndividual = async (uid, mid) => {
    if (uid
        && uid !== ""
        && mid
        && mid !== ""
    ) {
        console.log(uid, mid)
        let getAllTasks = await pool.query('SELECT * FROM createTasks')
        let getTaskByTaskId = getAllTasks.rows.find(task => task.task_id === Number(uid));
        if (Object.keys(getTaskByTaskId).length > 0) {
            let updateTaskDetails = await pool.query(`UPDATE createtasks SET assignedto = '${mid.toUpperCase()}' 
          WHERE task_id = ${getTaskByTaskId.task_id}`)
            return ({ status: true, message: `Task has been Assigned to ${getTaskByTaskId.assignedto} to ${mid.toUpperCase()}` })
        } else {
            return ({ status: "Failed", message: "Required Member ID or Task ID" })
        }
    } else {
        return ({ status: "Failed", message: "Required Member ID or Task ID" })
    }
}


const updateTaskStatusClose = async (uid, status) => {
    if (uid
        && uid !== ""
        && status
        && status == "Close" || status == "close"
    ) {
        let getAllTasks = await pool.query('SELECT * FROM createTasks')
        let getTaskByTaskId = getAllTasks.rows.find(task => task.task_id === Number(uid));
        // let getTaskByTaskStatus = getAllTasks.rows.find(task => task.task_id === task_id);
        if (Object.keys(getTaskByTaskId).length > 0) {
            let updateTaskDetails = await pool.query(`UPDATE createtasks SET status = '${status.toUpperCase()}' 
          WHERE task_id = ${getTaskByTaskId.task_id}`)
            return ({ status: true, message: `Status has been Updated from ${getTaskByTaskId.status} to ${status}` })
        } else {
            return ({ status: "Failed", message: "Please Fill all the Details" })
        }
    } else {
        return ({ status: "Failed", message: "Please Fill all the Details or the Mentioned Status is Wrong" })
    }
}
module.exports = {
    getAllTasks,
    getAllAssigned,
    createTask,
    updateTask,
    getTaskById,
    updateTaskStatus,
    updateTaskStatusComplete,
    taskAssignedToIndividual,
    updateTaskStatusClose
};
