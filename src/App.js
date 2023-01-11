import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
	const [tasks, setTasks] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [button1Hover, setButton1Hover] = useState(false);
	const [button2Hover, setButton2Hover] = useState(false);

	useEffect(() => {
		const getTasks = async () => {
			axios.get('http://localhost:3001/tasks')
			.then((response) => {
				setTasks(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
		}
		getTasks();
	}, []);

	if (!tasks) return null;

	const todo = tasks.filter(task => task.isInProgress === false && task.completed === false);
	const inProgress = tasks.filter(task => task.isInProgress === true);
	const done = tasks.filter(task => task.completed === true);

	const handleCreate = (e) => {
		e.preventDefault();
		axios.post('http://localhost:3001/tasks', {
			title: title,
			description: description,
			completed: false,
			isInProgress: false
		}).then((response) => {
			setTasks([...tasks, response.data]);
		})
		.catch((error) => {
			console.log(error);
		});
	}


	const handleToInProgress = (e) => {
		e.preventDefault();
		axios.put(`http://localhost:3001/tasks/${selectedTask.id}`, {
			title: selectedTask.title,
			description: selectedTask.description,
			completed: false,
			isInProgress: true
		}).then((response) => {
			// Remove the selected task from array
			setTasks([...tasks.filter(task => task.id !== selectedTask.id), response.data]);
			
		})
		.catch((error) => {
			console.log(error);
		});
	}

	const handleToDone = (e) => {
		e.preventDefault();
		axios.put(`http://localhost:3001/tasks/${selectedTask.id}`, {
			title: selectedTask.title,
			description: selectedTask.description,
			completed: true,
			isInProgress: false
		}).then((response) => {
			// Remove the selected task from array
			setTasks([...tasks.filter(task => task.id !== selectedTask.id), response.data]);
		})
		.catch((error) => {
			console.log(error);
		});
		//window.location.reload();
	}

	const isSelected = (task) => {
		if(task === null || selectedTask === null)
		{
			return false;
		}
		if (selectedTask.id === task.id) {
			return true;
		}
		return false;
	}

	const isButton1Hovered = () => {
		if (button1Hover === true) {
			return true;
		}
		return false;
	}

	const isButton2Hovered = () => {
		if (button2Hover === true) {
			return true;
		}
		return false;
	}

  return (
    <div>
      <Navbar className='navbar-custom'>
        <Container>
          <span className='nav-text1'>Simple Task board</span>
        </Container>
      </Navbar>

      <main className="main">
        <div className="form1">
          <form className="todo__header">
            <input
            	className='todo_title'
				type="text"
				placeholder="Task title" 
				onChange={(e) => setTitle(e.target.value)}	
			/>
            <input 
            	className="description1"
				type="text"
				placeholder="Description" 
				onChange={(e) => setDescription(e.target.value)}
			/>
            <button className="todo__create" onClick={handleCreate}>Create</button>
          </form>
        </div>

        <div className='todo'>
        	<h5 className='task-header'>TODO</h5>
        	<div className='todo-box'>
				{todo.map(task => (
					<div className={isSelected(task) ? 'item-l1-selected' : 'item-l1'} key={task.id} type='button' onClick={() => setSelectedTask(task)}>
						<header> {task.title} </header>
						<p> {task.description} </p>
					</div>
				))}
          	</div>
        </div>

		<div 
			className={isButton1Hovered() ? 'but1-hovered' : 'but1'} 
			type="button" 
			onMouseEnter={() => setButton1Hover(true)}
			onMouseLeave={() => setButton1Hover(false)} 
			onClick={handleToInProgress}
		>
			>
		</div>

        <div className='in-progress'>
          <h5 className='task-header'>In progress</h5>
		  <div className='todo-box'>
		  	{inProgress.map(task => (
				<div 
					className={isSelected(task) ? 'item-l1-selected' : 'item-l1'} 
					key={task.id} 
					type="button" 
					onClick={() => setSelectedTask(task)}
				>
					<header> {task.title} </header>
					<p> {task.description} </p>
				</div>
			))}
		  </div>
        </div>

		<div 
			className={isButton2Hovered() ? 'but2-hovered' : 'but2'} 
			type="button" 
			onMouseEnter={() => setButton2Hover(true)}
			onMouseLeave={() => setButton2Hover(false)} 
			onClick={handleToDone}
		>
			>
		</div>

        <div className='done'>
          <h5 className='task-header'>Done</h5>
			<div className='todo-box'>
				{done.map(task => (
					<div className='item-done' key={task.id}>
						<header> {task.title} </header>
						<p> {task.description} </p>
					</div>
				))}
			</div>
        </div>

      </main>      
    </div>
  );
}

export default App;
