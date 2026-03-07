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
        setSensors(data);
        if (!isEdit && data.length > 0) setSensorId(String(data[0].id));
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
    if (isEdit) delete payload.createdAt;

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
    <div>
      <h1>{isEdit ? 'Редактирование инцидента' : 'Добавление инцидента'}</h1>

      <form onSubmit={handleSubmit}>
        <table cellPadding="8" cellSpacing="0">
          <colgroup>
            <col width="160" />
            <col width="520" />
          </colgroup>

          <tbody>
            <tr>
              <td><b>Датчик</b></td>
              <td>
                <select value={sensorId} onChange={(e) => setSensorId(e.target.value)} required>
                  {sensors.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name} — {s.place} (id: {s.id})
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td><b>Тип</b></td>
              <td>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="ALARM_ON">ALARM_ON</option>
                  <option value="ALARM_OFF">ALARM_OFF</option>
                </select>
              </td>
            </tr>

            <tr>
              <td><b>Сообщение</b></td>
              <td>
                <input value={message} onChange={(e) => setMessage(e.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <button type="submit">Сохранить</button>
        &nbsp;&nbsp;&nbsp;
        <Link to="/incidents">Назад</Link>
      </form>
    </div>
  );
};

export default IncidentForm;
