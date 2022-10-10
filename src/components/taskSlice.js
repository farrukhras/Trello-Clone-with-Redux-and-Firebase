// Import Firebase
import {db} from '../firebase'
import {doc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove} from 'firebase/firestore'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: {},
  columns: {},
  columnOrder: [],
  currTaskIdToEdit: "",
  currColIdToEdit: "",
  isDialogOpen: false,
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    dragColumns: (state, action) => {
      const columnOrderDocRef = doc(db, 'columnOrder', 'col-order')
      updateDoc(columnOrderDocRef, {
        columnOrder: action.payload
      })

      state.columnOrder = action.payload;
    },
    dragTasksDifferentColumn: (state, action) => {
      let { srcColId, srcTaskIds, dstColId, dstTaskIds } = action.payload;

      const srcColDocRef = doc(db, 'columns', srcColId)
      updateDoc(srcColDocRef, {
        taskIds: srcTaskIds
      })

      const dstColDocRef = doc(db, 'columns', dstColId)
      updateDoc(dstColDocRef, {
        taskIds: dstTaskIds
      })

      state.columns[srcColId].taskIds = srcTaskIds
      state.columns[dstColId].taskIds = dstTaskIds
    },
    dragTasksSameColumn: (state, action) => {
      const colId = action.payload.id
      const taskIds = action.payload.taskIds
      
      const colDocRef = doc(db, 'columns', colId)
      updateDoc(colDocRef, {
        taskIds: taskIds
      })

      state.columns[colId].taskIds = taskIds
    },
    setCurrTaskIdToEdit: (state, action) => {
      state.currTaskIdToEdit = action.payload.taskId
    },
    setCurrColIdToEdit: (state, action) => {
      state.currColIdToEdit = action.payload.currTaskColId
    },
    setAllTasks: (state, action) => {
      let finalTasks = {}
      action.payload.map(task => (
        finalTasks[task["id"]] = task
      ))

      state.tasks = finalTasks
    },
    setAllColumns: (state, action) => {
      let finalColumns = {}
      action.payload.map(column => (
        finalColumns[column["id"]] = column
      ))

      state.columns = finalColumns
    },
    setColumnOrder: (state, action) => {
      state.columnOrder = action.payload['columnOrder']
    },
    addNewTask: (state, action) => {
      let colId = action.payload.colId
      
      // get the keys of the tasks object
      let keys = Object.keys(state.tasks).sort()
      
      // Get the id of the task present at the end of the tasks object 
      let lastId = "task-0"
      if(keys.length !== 0) {
        lastId = keys[keys.length - 1]
      }

      // get the integer id of the currently last task
      let currNum = parseInt(lastId.split("-")[1]) + 1
      let newTaskId = "task-" + currNum.toString()

      try {
        setDoc(doc(db, 'tasks', newTaskId), {
          id: newTaskId,
          taskTitle: "New Task",
          taskDescription: ""
        })

        const colDocRef = doc(db, 'columns', colId)
        updateDoc(colDocRef, {
          taskIds: arrayUnion(newTaskId)
        })
      } catch (err) {
        alert(err)
      }
      
      state.tasks[newTaskId] = {
        id: newTaskId,
        taskTitle: newTaskId,
        taskDescription: ""
      }
      state.columns[colId].taskIds.push(newTaskId)
    },
    updateTaskDetails: (state, action) => {
      const {id, taskTitle, taskDescription} = action.payload

      const updatedTask = {
        id: id,
        taskTitle: taskTitle,
        taskDescription: taskDescription
      }
      
      // update the data base only if the task title or task description changes
      if (state.tasks[id].taskTitle !== taskTitle || state.tasks[id].taskDescription !== taskDescription) {
        const taskDocRef = doc(db, 'tasks', id)
        updateDoc(taskDocRef, {
          taskTitle: taskTitle,
          taskDescription: taskDescription
        })
      }
      state.tasks[id] = updatedTask
    },
    deleteTask: (state, action) => {
      const taskId = action.payload.taskId;
      const colId = state.currColIdToEdit;

      // update the database
      // -- delete the task from the "tasks" collection of the databse
      const taskDocRef = doc(db, 'tasks', taskId)
      deleteDoc(taskDocRef)

      // -- update the taskIds array in the "columns" collection of the databse
      const colDocRef = doc(db, 'columns', colId)
      updateDoc(colDocRef, {
        taskIds: arrayRemove(taskId)
      })

      // update the redux state
      state.columns[colId].taskIds = state.columns[colId].taskIds.filter(item => item !== taskId)
      delete state.tasks[taskId];
    },
    setDialogStatus: (state, action) => {
      state.isDialogOpen = action.payload
    },
  },
});

export const { 
  dragColumns,
  dragTasksSameColumn,
  dragTasksDifferentColumn,
  setCurrTaskIdToEdit,
  setCurrColIdToEdit,
  addNewTask,
  setAllTasks,
  setAllColumns,
  setColumnOrder,
  updateTaskDetails,
  deleteTask,
  setDialogStatus
} = taskSlice.actions;

export default taskSlice.reducer;
