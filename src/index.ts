import * as fs from 'fs';
import * as path from 'path';
type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
    id: number;
    description: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}
// load task to file
const filePath = path.join(__dirname, '..', 'tasks.json');
function loadTasks(): Task[] {
    if (!fs.existsSync(filePath)){
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
    console.log("Saving to:", filePath);

}
//save task to file
function saveTasks (tasks: Task[]){
     fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

//add a task
function addTask(description: string){
    const tasks= loadTasks();
    const newTask: Task = {
        id: tasks.length ? tasks [tasks.length -1].id + 1 : 1,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added sucessfully(ID: ${newTask.id})`);
}

//list tasks
function listTasks(filter?: TaskStatus) {
    const tasks = loadTasks();
  
    const filtered = filter ? tasks.filter(task => task.status === filter) : tasks;
  
    if (filtered.length === 0) {
      console.log('No tasks found.');
      return;
    }
  
    filtered.forEach(task => {
      console.log(`ID: ${task.id}`);
      console.log(`Description: ${task.description}`);
      console.log(`Status: ${task.status}`);
      console.log(`Created At: ${task.createdAt}`);
      console.log(`Updated At: ${task.updatedAt}`);
      console.log('-------------------------------');
    });
  }
  
//updateTaskStatus
function updateTaskStatus(id: number, newStatus: TaskStatus) {
    const tasks = loadTasks();
    const task = tasks.find(T => T.id === id);

    if (!task) {
        console.log(`Task with ID ${id} not found.`);
        return;
    }

    task.status= newStatus;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);
    console.log(`Task ${id} marked as ${newStatus}.`);
}

//updateTaskDescription
function updateTaskDescription(id: number, newDescription: string){
  const tasks = loadTasks();
  const task = tasks.find(T=> T.id === id);
  if (!task) {
    console.log(`Task with ID ${id} not found.`);
    return;
}
task.description= newDescription;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);
    console.log(`Task ${id} updated sucessfully.`);
}
//deleteTasks
function deleteTask(id: number) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`Task ${id} deleted successfully.`);
}


//handle comands
const command = process.argv[2]
const args = process.argv.slice(3);

//run the add command
console.log('Command:', command);
console.log('Args:', args);
if (command === 'add') {
  const description = args.join(' ');
  if (!description) {
    console.log('Please provide a task description.');
  } else {
    addTask(description);
  }
} else if (command === 'list'){
    const statusArg = args[0] as TaskStatus | undefined;
    if(statusArg && !['todo','in-progress','done'].includes(statusArg)){
        console.log('invalid status. Use: todo, in-progress, done.');
    }else{
        listTasks(statusArg);
    }
} else if (command === 'mark-in-progress') {
    const id = parseInt(args[0]);
    if (isNaN(id)) {
      console.log('Please provide a valid task ID.');
    } else {
      updateTaskStatus(id, 'in-progress');
    }
  } else if (command === 'mark-done') {
    const id = parseInt(args[0]);
    if (isNaN(id)) {
      console.log('Please provide a valid task ID.');
    } else {
      updateTaskStatus(id, 'done');
    }
  }else if (command === 'update'){
    const id = parseInt(args[0]);
    const newDescription = args.slice(1).join(' ');
  
    if (isNaN(id) || !newDescription) {
      console.log('Usage: update <id> "<new description>"');
    } else {
      updateTaskDescription(id, newDescription);
    }
  } else if (command === 'delete') {
    const id = parseInt(args[0]);
    if (isNaN(id)) {
      console.log('Usage: delete <id>');
    } else {
      deleteTask(id);
    }
  

  } else {
  console.log('Unknown or missing command.');
}


