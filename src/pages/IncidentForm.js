import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API = '/api';

const IncidentForm = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit' || Boolean(id);

  const [sensors, setSensors] = useState([]);
  const [sensorId, setSensorId] = useState('');
  const [type, setType] = useState('ALARM_ON');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSensors = async () => {
      try {
        const { data } = await axios.get(`${API}/sensors`);
        const arr = Array.isArray(data) ? data : [];
        setSensors(arr);
        if (!isEdit && arr.length > 0) {
          setSensorId(String(arr[0].id));
        }
      } catch (error) {
        console.error('Ошибка загрузки датчиков:', error);
      }
    };

    loadSensors();
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;

    const loadIncident = async () => {
      try {
        const { data } = await axios.get(`${API}/incidents/${id}`);
        setSensorId(String(data?.sensorId ?? ''));
        setType(data?.type ?? 'ALARM_ON');
        setMessage(data?.message ?? '');
      } catch (error) {
        console.error('Ошибка загрузки инцидента для редактирования:', error);
      }
    };

    loadIncident();
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sensorId: String(sensorId),
      type,
      message,
      createdAt: isEdit ? undefined : new Date().toISOString(),
    };

    if (isEdit) {
      delete payload.createdAt;
    }

    try {
      if (isEdit) {
        await axios.put(`${API}/incidents/${id}`, payload);
      } else {
        await axios.post(`${API}/incidents`, payload);
      }
      navigate('/incidents');
    } catch (error) {
      console.error('Ошибка сохранения инцидента:', error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-card">
          <h1 className="page-title">
            {isEdit ? 'Редактирование инцидента' : 'Добавление инцидента'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="sensorId">Датчик</label>
                <select
                  id="sensorId"
                  className="select"
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  required
                >
                  {sensors.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name} — {s.place} (id: {s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type">Тип</label>
                <select
                  id="type"
                  className="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="ALARM_ON">ALARM_ON</option>
                  <option value="ALARM_OFF">ALARM_OFF</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Сообщение</label>
                <input
                  id="message"
                  className="input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn" type="submit">
                Сохранить
              </button>

              <Link className="btn-link" to="/incidents">
                Назад
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;
