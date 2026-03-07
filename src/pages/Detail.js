import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    const loadSensor = async () => {
      try {
        const { data } = await axios.get(`${API}/sensors/${id}`);
        setSensor(data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    };

    loadSensor();
  }, [id]);

  if (!sensor) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Информация о датчике</h1>

      <table cellPadding="8" cellSpacing="0">
        <colgroup>
          <col width="160" />
          <col width="520" />
        </colgroup>
        <tbody>
          <tr><td><b>ID</b></td><td>{sensor.id}</td></tr>
          <tr><td><b>Название</b></td><td>{sensor.name}</td></tr>
          <tr><td><b>Место</b></td><td>{sensor.place}</td></tr>
          <tr><td><b>Значение</b></td><td>{sensor.value}</td></tr>
          <tr><td><b>Статус</b></td><td>{sensor.alarm ? 'ТРЕВОГА' : 'норма'}</td></tr>
        </tbody>
      </table>

      <br />
      <button type="button" onClick={() => navigate(-1)}>Назад</button>
      &nbsp;&nbsp;&nbsp;
      <Link to={`/edit/${sensor.id}`}>Изменить</Link>

      <br />
      <br />
      <Link to={`/incidents?sensorId=${sensor.id}`}>Инциденты этого датчика</Link>
    </div>
  );
};

export default Detail;
