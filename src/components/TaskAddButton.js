import React from 'react'
import { useDispatch } from 'react-redux';

// Import Material UI icon
import AddIcon from '@mui/icons-material/Add';

// Import reducer
import { addNewTask } from './taskSlice';

function TaskAddButton({colId}) {
  const dispatch = useDispatch();

  function handleNewTask() {
    dispatch(addNewTask({colId: colId}));
  }

  return (
    <div>
      <button className='add-task-button' onClick={handleNewTask}>
        <div className='edit-task-title'>
          <AddIcon />
          {"Add a card"}
        </div>
      </button>
    </div>
  )
}

export default TaskAddButton