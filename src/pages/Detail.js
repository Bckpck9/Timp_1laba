import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    async function loadSensor() {
      try {
        const response = await axios.get(`${API}/sensors/${id}`);
        setSensor(response.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    }
    loadSensor();
  }, [id]);

  if (!sensor) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Информация о датчике</h1>

      <p><b>ID:</b> {sensor.id}</p>
      <p><b>Название:</b> {sensor.name}</p>
      <p><b>Место:</b> {sensor.place}</p>
      <p><b>Значение:</b> {sensor.value}</p>
      <p><b>Статус:</b> {sensor.alarm ? 'ТРЕВОГА' : 'норма'}</p>

      <div style={{ marginTop: '12px' }}>
        <button onClick={() => navigate(-1)}>Назад</button>
        <Link to={`/edit/${sensor.id}`} style={{ marginLeft: '10px' }}>
          Изменить
        </Link>
      </div>
    </div>
  );
};

export default Detail;
