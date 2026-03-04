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
    <div className="container">
      <div className="card">
        <h1 className="title">Список датчиков</h1>

        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {sensors.map(sensor => (
              <tr key={sensor.id}>
                <td>{sensor.name || '(без названия)'}</td>

                <td>
                  <span className={`badge ${sensor.alarm ? 'badge-alarm' : 'badge-ok'}`}>
                    {sensor.alarm ? 'ТРЕВОГА' : 'норма'}
                  </span>
                </td>

                <td>
                  <div className="toolbar">
                    <Link className="btn" to={`/detail/${sensor.id}`}>Посмотреть</Link>
                    <button className="btn btn-danger" onClick={() => deleteSensor(sensor.id)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="toolbar" style={{ marginTop: 16 }}>
          <Link className="btn btn-primary" to="/add">Добавить датчик</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
