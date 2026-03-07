import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const loadIncident = async () => {
      try {
        const { data } = await axios.get(`${API}/incidents/${id}`);
        setIncident(data);
      } catch (error) {
        console.error('Ошибка загрузки инцидента:', error);
      }
    };

    loadIncident();
  }, [id]);

  if (!incident) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Инцидент</h1>

      <table cellPadding="8" cellSpacing="0">
        <colgroup>
          <col width="160" />
          <col width="520" />
        </colgroup>
        <tbody>
          <tr><td><b>ID</b></td><td>{incident.id}</td></tr>
          <tr><td><b>Sensor ID</b></td><td>{incident.sensorId}</td></tr>
          <tr><td><b>Тип</b></td><td>{incident.type}</td></tr>
          <tr><td><b>Сообщение</b></td><td>{incident.message}</td></tr>
          <tr><td><b>Время</b></td><td>{incident.createdAt}</td></tr>
        </tbody>
      </table>

      <br />
      <button type="button" onClick={() => navigate(-1)}>Назад</button>
      &nbsp;&nbsp;&nbsp;
      <Link to={`/incidents/edit/${incident.id}`}>Изменить</Link>
      <br />
      <br />
    </div>
  );
};

export default IncidentDetail;
