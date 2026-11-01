import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return;
    const newTaskObj = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Главная страница со списком задач</h1>
      
      <div style={styles.inputContainer}>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Введите новую задачу" 
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addButton}>+</button>
      </div>

      <ul style={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.listItem}>
            <span 
              onClick={() => toggleTask(task.id)} 
              style={{ 
                ...styles.taskText, 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#888' : '#333'
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '0 20px' },
  
  // 👇 ИСПРАВЛЕННЫЙ СТИЛЬ ЗАГОЛОВКА (уменьшен шрифт, добавлены отступы)
  title: { 
    textAlign: 'center', 
    color: '#333', 
    fontSize: '24px', 
    marginBottom: '30px', 
    wordWrap: 'break-word' 
  },
  
  inputContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' },
  addButton: { padding: '10px 20px', fontSize: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' },
  taskText: { cursor: 'pointer', fontSize: '18px' },
  deleteButton: { padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }
};

export default App;