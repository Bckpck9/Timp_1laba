import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

const Home = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    async function loadSensors() {
      try {
        const response = await axios.get(`${API}/sensors`);
        setSensors(response.data);
      } catch (error) {
        console.error('Ошибка запроса:', error);
      }
    }
    loadSensors();
  }, []);

  async function deleteSensor(id) {
    try {
      await axios.delete(`${API}/sensors/${id}`);
      setSensors(prev => prev.filter(s => String(s.id) !== String(id)));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  }

  return (
    <div>
      <h1>Список датчиков</h1>

      <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: '10px' }}>
        <div style={{ width: '220px' }}>Название</div>
        <div style={{ width: '260px' }}>Место</div>
        <div style={{ width: '90px' }}>Значение</div>
        <div style={{ width: '110px' }}>Статус</div>
        <div>Действия</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sensors.map(sensor => (
          <div key={sensor.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '220px' }}>{sensor.name || '(без названия)'}</div>
            <div style={{ width: '260px' }}>{sensor.place || '(без места)'}</div>
            <div style={{ width: '90px' }}>{sensor.value ?? '-'}</div>
            <div style={{ width: '110px' }}>
              {sensor.alarm ? 'ТРЕВОГА' : 'норма'}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link to={`/detail/${sensor.id}`}>Посмотреть</Link>
              <button onClick={() => deleteSensor(sensor.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <Link to="/add">Добавить датчик</Link>
      </div>
    </div>
  );
};

export default Home;
