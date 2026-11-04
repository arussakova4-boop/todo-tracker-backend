import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Состояние для токена (пока просто вводим вручную для теста)
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // 1. Загрузка задач при старте (GET)
  useEffect(() => {
    if (!token) return; // Если нет токена, не грузим

    fetch('http://127.0.0.1:8000/api/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, [token]);

  // 2. Создание задачи (POST)
  const addTask = async () => {
    if (title.trim() === '') return;
    
    const newTask = {
      title: title,
      description: description,
      due_date: dueDate ? `${dueDate}T12:00:00` : null, // Формат даты для бэка
      priority: 1
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]); // Добавляем в список
        setTitle('');
        setDescription('');
        setDueDate('');
        setIsModalOpen(false);
      } else {
        alert('Ошибка при создании задачи. Проверь токен.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Удаление задачи (DELETE)
  const deleteTask = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Вспомогательная кнопка для ввода токена (для теста)
  const handleLogin = () => {
    const newToken = prompt("Вставь сюда access_token из Swagger:");
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Главная страница со списком задач
      </h1>

      {/* Кнопка для ввода токена (в будущем заменим на экран логина) */}
      {!token && (
        <button onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 rounded mb-4">
          Войти (ввести токен)
        </button>
      )}
      
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
              <span className="text-lg font-semibold block text-gray-800">
                {task.title}
              </span>
              {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
              {task.due_date && <p className="text-gray-500 text-xs mt-2 font-medium">📅 Дедлайн: {task.due_date.split('T')[0]}</p>}
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

      {/* Модальное окно (оставил как было у Леры) */}
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