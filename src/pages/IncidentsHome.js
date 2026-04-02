import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

const IncidentsHome = () => {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const sensorId = searchParams.get('sensorId');

  useEffect(() => {
    const loadIncidents = async () => {
      setError('');
      try {
        const url = sensorId
          ? `${API}/incidents?sensorId=${encodeURIComponent(sensorId)}`
          : `${API}/incidents`;

        const { data } = await axios.get(url);
        const arr = Array.isArray(data) ? data : [];
        setIncidents(arr);
      } catch (e) {
        console.error('Ошибка запроса инцидентов:', e);
        setError('Не удалось загрузить инциденты');
        setIncidents([]);
      }
    };

    loadIncidents();
  }, [sensorId]);

  const deleteIncident = async (id) => {
    try {
      await axios.delete(`${API}/incidents/${id}`);
      setIncidents((prev) => prev.filter((x) => String(x.id) !== String(id)));
    } catch (e) {
      console.error('Ошибка удаления инцидента:', e);
      setError('Не удалось удалить инцидент');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1 className="page-title">
            Инциденты{sensorId ? ` (датчик #${sensorId})` : ''}
          </h1>

          {error && <div className="error-text">{error}</div>}

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor ID</th>
                <th>Тип</th>
                <th>Сообщение</th>
                <th>Время</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {incidents.length > 0 ? (
                incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td>{inc.id}</td>
                    <td>{inc.sensorId}</td>
                    <td>{inc.type || '-'}</td>
                    <td>{inc.message || '-'}</td>
                    <td>{inc.createdAt || '-'}</td>
                    <td className="actions">
                      <div className="actions-inline">
                        <Link className="btn-link" to={`/incidents/${inc.id}`}>
                          Посмотреть
                        </Link>

                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => deleteIncident(inc.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-text">
                    Нет инцидентов
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bottom-actions">
            <Link className="btn-link" to="/">
              Назад
            </Link>

            <Link className="btn-link" to="/incidents/add">
              Добавить инцидент
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentsHome;
