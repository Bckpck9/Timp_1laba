import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'api;

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

  if (!sensor) {
    return (
      <div className="page">
        <div className="container">
          <div className="detail-card">
            <h1 className="page-title">Информация о датчике</h1>
            <p className="helper-text">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="detail-card">
          <h1 className="page-title">Информация о датчике</h1>

          <table className="info-table">
            <tbody>
              <tr>
                <td>ID</td>
                <td>{sensor.id}</td>
              </tr>
              <tr>
                <td>Название</td>
                <td>{sensor.name}</td>
              </tr>
              <tr>
                <td>Место</td>
                <td>{sensor.place}</td>
              </tr>
              <tr>
                <td>Значение</td>
                <td>{sensor.value}</td>
              </tr>
              <tr>
                <td>Статус</td>
                <td>
                  <span className={`badge ${sensor.alarm ? 'badge-alarm' : 'badge-normal'}`}>
                    {sensor.alarm ? 'Тревога' : 'Норма'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bottom-actions">
            <button className="btn" type="button" onClick={() => navigate(-1)}>
              Назад
            </button>

            <Link className="btn-link" to={`/edit/${sensor.id}`}>
              Изменить
            </Link>

            <Link className="btn-link" to={`/incidents?sensorId=${sensor.id}`}>
              Инциденты этого датчика
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
