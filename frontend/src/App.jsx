import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const addTask = () => {
    if (title.trim() === '') return;
    const newTaskObj = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsModalOpen(false);
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
    <div className="max-w-2xl mx-auto mt-10 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Главная страница со списком задач
      </h1>
      
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mb-6 shadow-md"
      >
        + Добавить задачу
      </button>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-start bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex-1">
              <span 
                onClick={() => toggleTask(task.id)} 
                className={`cursor-pointer text-lg font-semibold block ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {task.title}
              </span>
              {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
              {task.dueDate && <p className="text-gray-500 text-xs mt-2 font-medium">📅 Дедлайн: {task.dueDate}</p>}
            </div>
            <button 
              onClick={() => deleteTask(task.id)} 
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Новая задача</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Название:</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Что нужно сделать?"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Описание:</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Подробности задачи..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Дедлайн:</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Отмена
              </button>
              <button 
                onClick={addTask} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;