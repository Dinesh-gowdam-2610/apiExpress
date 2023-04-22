const Pool = require("pg").Pool;
const moment = require("moment");

require("dotenv").config();
const {
  API_USER,
  API_PASSWORD,
  API_HOST,
  API_DB,
  API_PORT,
  API_DEILECT,
  API_DB_NAME,
} = process.env;
console.log;
const pool = new Pool({
  user: API_USER,
  host: API_HOST,
  database: API_DB,
  password: API_PASSWORD,
  dialect: API_DEILECT,
  port: API_PORT,
  // ssl: true,
});

async function getAllTasks() {
  try {
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    if (getAllTasks && getAllTasks.rows) {
      return getAllTasks.rows;
    } else {
      return "Record Not Found";
    }
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: err.message, // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}

async function getAllAssigned() {
  let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
  let getAssignedTask = getAllTasks.rows.filter(
    (assign) => assign.status === "Assigned"
  );
  if (getAssignedTask.length > 0 && getAllTasks.rows.length > 0) {
    return getAssignedTask;
  } else {
    return "Record Not Found";
  }
}

async function createTask(
  title,
  description,
  dateCompleted,
  dateClosed,
  status,
  createdBy,
  assignedTo
) {
  let task_id = moment().format("YYHHMMSS");
  let createdDate = moment().format("DD/MM/YYYY");
  console.log(
    task_id,
    title,
    description,
    dateCompleted,
    dateClosed,
    status,
    createdBy,
    assignedTo
  );
  if (
    title &&
    title !== "" &&
    description &&
    description !== "" &&
    dateCompleted !== "" &&
    dateClosed !== "" &&
    status !== "" &&
    createdBy !== "" &&
    assignedTo !== ""
  ) {
    const insertQuery = `INSERT INTO ${API_DB_NAME} 
    (task_id,title, description, datecompleted, dateclosed, status, createdby, assignedto, createddate) 
    VALUES(${task_id.replace(
      /,/g,
      ""
    )},'${title}','${description}','${dateCompleted}','${dateClosed}','${status}','${createdBy}','${assignedTo}','${createdDate}')`;
    let getTaskData = await pool.query(insertQuery);
    if (getTaskData && getTaskData.rowCount === 1) {
      return {
        status: "Success",
        message: "The Task has been Created Successfully - " + task_id,
      };
    } else {
      return { status: "Failed", message: "Please Fill all the Details" };
    }
  } else {
    res.send({ status: "Failed", message: "Please Fill all the Details" });
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
  if (task_id == undefined || task_id == null || task_id == "" || !task_id) {
    return { message: "Please provide the task_id to update" };
  }
  if (
    title &&
    title !== "" &&
    description &&
    description !== "" &&
    dateCompleted !== "" &&
    dateClosed !== "" &&
    status !== "" &&
    createdBy !== "" &&
    assignedTo !== ""
  ) {
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    let getTaskByTaskId = getAllTasks.rows.find(
      (task) => task.task_id === task_id
    );
    console.log("getTaskByTaskId", getTaskByTaskId);
    if (Object.keys(getTaskByTaskId).length > 0) {
      await pool.query(`UPDATE ${API_DB_NAME} SET title = '${title}', description = '${description}', 
        datecompleted = '${dateCompleted}', dateclosed = '${dateClosed}',
        status = '${status}', createdby = '${createdBy}', assignedto = '${assignedTo}',
        task_id = '${getTaskByTaskId.task_id}'
        WHERE task_id = '${getTaskByTaskId.task_id}'`);
      return {
        status: true,
        message: `Details Updated for ID - ${getTaskByTaskId.task_id}`,
      };
    } else {
      return { status: "Failed", message: "Please Fill all the Details" };
    }
  } else {
    return { status: "Failed", message: "Please Fill all the Details" };
  }
};
const getTaskById = async (uid) => {
  let getTaskDetails = await pool.query(
    `SELECT * FROM ${API_DB_NAME} where task_id= '${uid}'`
  );
  if (getTaskDetails && getTaskDetails.rows.length > 0) {
    return getTaskDetails.rows;
  } else {
    return { status: false, message: "Record Not Found" };
  }
};

const updateTaskStatus = async (status, uid) => {
  if (uid && uid !== "" && status && status !== "") {
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    let getTaskByTaskId = getAllTasks.rows.find(
      (task) => Number(task.task_id) === Number(uid)
    );
    if (Object.keys(getTaskByTaskId).length > 0) {
      await pool.query(`UPDATE ${API_DB_NAME} SET status = '${status.toUpperCase()}' 
      WHERE task_id = '${getTaskByTaskId.task_id}'`);
      return {
        status: true,
        message: `Status has been Updated from ${getTaskByTaskId.status} to  ${status}`,
      };
    } else {
      return { status: "Failed", message: "Please Fill all the Details" };
    }
  } else {
    return { status: "Failed", message: "Please Fill all the Details" };
  }
};

const updateTaskStatusComplete = async (uid, status) => {
  if (
    (uid && uid !== "" && status && status === "Completed") ||
    status === "completed"
  ) {
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    let getTaskByTaskId = getAllTasks.rows.find(
      (task) => Number(task.task_id) === Number(uid)
    );
    // let getTaskByTaskStatus = getAllTasks.rows.find(task => task.task_id === task_id);
    if (Object.keys(getTaskByTaskId).length > 0) {
      let updateTaskDetails =
        await pool.query(`UPDATE ${API_DB_NAME} SET status = '${status.toUpperCase()}' 
          WHERE task_id = ${getTaskByTaskId.task_id}`);
      return {
        status: true,
        message: `Status has been Updated from ${getTaskByTaskId.status} to ${status}`,
      };
    } else {
      return { status: "Failed", message: "Please Fill all the Details" };
    }
  } else {
    return {
      status: "Failed",
      message: "Please Fill all the Details or Mentioned Status is Wrong",
    };
  }
};

const taskAssignedToIndividual = async (uid, mid) => {
  if (uid && uid !== "" && mid && mid !== "") {
    console.log(uid, mid);
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    let getTaskByTaskId = getAllTasks.rows.find(
      (task) => task.task_id === Number(uid)
    );
    if (Object.keys(getTaskByTaskId).length > 0) {
      let updateTaskDetails =
        await pool.query(`UPDATE ${API_DB_NAME} SET assignedto = '${mid.toUpperCase()}' 
          WHERE task_id = ${getTaskByTaskId.task_id}`);
      return {
        status: true,
        message: `Task has been Assigned to ${
          getTaskByTaskId.assignedto
        } to ${mid.toUpperCase()}`,
      };
    } else {
      return { status: "Failed", message: "Required Member ID or Task ID" };
    }
  } else {
    return { status: "Failed", message: "Required Member ID or Task ID" };
  }
};

const updateTaskStatusClose = async (uid, status) => {
  if ((uid && uid !== "" && status && status == "Close") || status == "close") {
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    let getTaskByTaskId = getAllTasks.rows.find(
      (task) => task.task_id === Number(uid)
    );
    // let getTaskByTaskStatus = getAllTasks.rows.find(task => task.task_id === task_id);
    if (Object.keys(getTaskByTaskId).length > 0) {
      let updateTaskDetails =
        await pool.query(`UPDATE ${API_DB_NAME} SET status = '${status.toUpperCase()}' 
          WHERE task_id = ${getTaskByTaskId.task_id}`);
      return {
        status: true,
        message: `Status has been Updated from ${getTaskByTaskId.status} to ${status}`,
      };
    } else {
      return { status: "Failed", message: "Please Fill all the Details" };
    }
  } else {
    return {
      status: "Failed",
      message: "Please Fill all the Details or the Mentioned Status is Wrong",
    };
  }
};

const deleteTaskById = async (task_id) => {
  if (task_id) {
    let getAllTasks = await pool.query(`SELECT * FROM ${API_DB_NAME}`);
    let getTaskByTaskId = getAllTasks.rows.find(
      (task) => Number(task.task_id) === Number(task_id)
    );
    if (
      getAllTasks &&
      getTaskByTaskId != undefined &&
      Object.keys(getTaskByTaskId).length > 0
    ) {
      let rowResult = await pool.query(
        `DELETE FROM ${API_DB_NAME} where task_id = '${task_id}'`
      );
      return rowResult.rowCount;
    } else {
      return {
        status: true,
        message: `Record not found for - ${task_id}`,
      };
    }
  } else {
    return {
      status: true,
      message: "Please Provide the ID in the Params for Delete",
    };
  }
};
module.exports = {
  getAllTasks,
  getAllAssigned,
  createTask,
  updateTask,
  getTaskById,
  updateTaskStatus,
  updateTaskStatusComplete,
  taskAssignedToIndividual,
  updateTaskStatusClose,
  deleteTaskById,
};
exports.handler = {
  getAllTasks,
};
