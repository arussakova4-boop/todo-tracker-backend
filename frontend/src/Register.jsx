import { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Загрузка...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMessage('Успешная регистрация! 🎉');
      } else {
        setMessage('Ошибка: Пользователь уже существует или неверные данные');
      }
    } catch (error) {
      setMessage('Ошибка сети. Сервер не отвечает.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Регистрация в To-Do Tracker</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input}
              placeholder="Введите ваш email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
              placeholder="Придумайте пароль"
            />
          </div>

          <button type="submit" style={styles.button}>
            Зарегистрироваться
          </button>
        </form>
        
        {message && <p style={{ textAlign: 'center', marginTop: '15px', color: message.includes('Ошибка') || message.includes('не отвечает') ? 'red' : 'green' }}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', color: '#555' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
};

export default Register;