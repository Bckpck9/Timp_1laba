import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5001';

const Home = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const loadSensors = async () => {
      try {
        const { data } = await axios.get(`${API}/sensors`);
        setSensors(data);
      } catch (error) {
        console.error('Ошибка запроса:', error);
      }
    };
    loadSensors();
  }, []);

  const deleteSensor = async (id) => {
    try {
      await axios.delete(`${API}/sensors/${id}`);
      setSensors((prev) => prev.filter((s) => String(s.id) !== String(id)));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <div>
      <b>Список датчиков</b>
      <br />
      <br />

      <table cellPadding="10" cellSpacing="0">
        <colgroup>
          <col width="320" />
          <col width="120" />
          <col width="220" />
        </colgroup>

        <thead>
          <tr>
            <th align="left">Название</th>
            <th align="left">Статус</th>
            <th align="left">Действия</th>
          </tr>
        </thead>

        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.id}>
              <td>{sensor.name || '(без названия)'}</td>

              <td>{sensor.alarm ? 'ТРЕВОГА' : 'норма'}</td>

              <td nowrap="nowrap">
                <Link to={`/detail/${sensor.id}`}>Посмотреть</Link>
                &nbsp;&nbsp;&nbsp;
                <button type="button" onClick={() => deleteSensor(sensor.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <Link to="/add">Добавить датчик</Link>
    </div>
  );
};

export default Home;
