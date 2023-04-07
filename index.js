// Entry Point of the API Server
const express = require("express");
const app = express();
const Pool = require("pg").Pool;
const tasks = require("./Tasks/performTask");
require("dotenv").config();
const { API_USER, API_PASSWORD, API_HOST, API_DB, API_PORT, API_DEILECT } =
  process.env;

const pool = new Pool({
  user: API_USER,
  host: API_HOST,
  database: API_DB,
  password: API_PASSWORD,
  dialect: API_DEILECT,
  port: API_PORT,
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});

//GET ALL TASKS FROM DB
const getAll = async () => {
  app.get("/getAllTasks", async (req, res) => {
    let getAllTask = await tasks.getAllTasks();
    res.send(getAllTask);
  });
};
getAll();

//GET ALL ASSIGNED TASK
const getAllAssignedTasks = () => {
  app.get("/getAllAssignedTasks", async (req, res) => {
    let assignedTasks = await tasks.getAllAssigned();
    if (assignedTasks) {
      res.send(assignedTasks);
    } else {
      res.send({ status: false, message: "record Not Found" });
    }
  });
};
getAllAssignedTasks();

//CREATE TASK TO THE DB
async function createTask() {
  app.post("/createTask", async (req, res) => {
    let {
      title,
      description,
      dateCompleted,
      dateClosed,
      status,
      createdBy,
      assignedTo,
    } = req.body;
    let getCreatedTask = await tasks.createTask(
      title,
      description,
      dateCompleted,
      dateClosed,
      status,
      createdBy,
      assignedTo
    );
    if (getCreatedTask && getCreatedTask) {
      res.send(getCreatedTask);
    } else {
      res.send({ status: "Failed", message: "Please Fill all the Details" });
    }
  });
}
createTask();

//UPDATE TASK BY USER ID
const getUpdateTask = async () => {
  app.put("/updateTask", async (req, res) => {
    let {
      task_id,
      title,
      description,
      dateCompleted,
      dateClosed,
      status,
      createdBy,
      assignedTo,
    } = req.body;
    let getUpdatedTaskResp = await tasks.updateTask(
      task_id,
      title,
      description,
      dateCompleted,
      dateClosed,
      status,
      createdBy,
      assignedTo
    );
    res.send(getUpdatedTaskResp);
  });
};
getUpdateTask();

//GET TASK BY ID
const getTaskById = async () => {
  app.get("/task/:uid", async (req, res) => {
    let { uid } = req.params;
    let getTaskByIdDetails = await tasks.getTaskById(uid);
    // console.log(getTaskByIdDetails)
    res.send(getTaskByIdDetails);
  });
};
getTaskById();

//DELETE TASK WITH SPECIFIC TASK ID
async function deleteuserTask() {
  app.delete("/deleteTask/:uid", (req, res) => {
    let { uid } = req.params;
    if (uid) {
      pool.query(
        `DELETE FROM createTasks where task_id=${uid}`,
        (err, result) => {
          if (err) {
            res.statusCode = 404;
            res.send({ status: false, message: "Record Not Found" });
          } else {
            if (uid) {
              res.send({
                status: true,
                message: `Successfully Deleted - ${uid}`,
              });
              return result.rows;
            } else {
              res.send({
                status: true,
                message: "Please Provide the ID in the Params for Delete",
              });
            }
          }
        }
      );
    } else {
      res.send({
        status: true,
        message: "Please Provide the ID in the Params for Delete",
      });
    }
  });
}
deleteuserTask();

//UPDATE THE TASK
async function updateTaskStatus() {
  app.put("/task/:uid/accept", async (req, res) => {
    let { task_id, status } = req.body;
    let { uid } = req.params;
    let getUpdateTaskData = await tasks.updateTaskStatus(status, uid);
    res.send(getUpdateTaskData);
  });
}
updateTaskStatus();

//COMPLETE THE TASK
async function updateTaskStatusComplete() {
  app.put("/task/:uid/complete", async (req, res) => {
    let { status } = req.body;
    let { uid } = req.params;
    let getCompletionDetails = await tasks.updateTaskStatusComplete(
      uid,
      status
    );
    res.send(getCompletionDetails);
  });
}
updateTaskStatusComplete();

//CLOSE THE TASK
async function updateTaskStatusClose() {
  app.put("/task/:uid/close", async (req, res) => {
    let { task_id, status } = req.body;
    let { uid } = req.params;
    console.log(req.params.uid);
    let getUpdatedDetails = await tasks.updateTaskStatusClose(uid, status);
    res.send(getUpdatedDetails);
  });
}
updateTaskStatusClose();

async function taskAssingedToIndvidual() {
  app.put("/task/:uid/assign/:mid", async (req, res) => {
    let { uid, mid } = req.params;
    console.log(req.params);
    let getIndividualData = await tasks.taskAssignedToIndividual(uid, mid);
    res.send(getIndividualData);
  });
}
taskAssingedToIndvidual();

const server = app.listen(3000);
