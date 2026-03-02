import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API = '/api';
const THRESHOLD = 70;

const Form = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit' || Boolean(id);

  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    async function loadSensor() {
      try {
        const response = await axios.get(`${API}/sensors/${id}`);
        setName(response.data?.name ?? '');
        setPlace(response.data?.place ?? '');
        setValue(String(response.data?.value ?? ''));
      } catch (error) {
        console.error('Ошибка загрузки для редактирования:', error);
      }
    }

    loadSensor();
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valueNumber = Number(value);
    const alarm = valueNumber >= THRESHOLD;

    const payload = {
      name,
      place,
      value: valueNumber,
      alarm
    };

    try {
      if (isEdit) {
        await axios.put(
          `${API}/sensors/${id}`,
          JSON.stringify(payload),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        await axios.post(
          `${API}/sensors`,
          JSON.stringify(payload),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      navigate('/');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const alarmPreview = Number(value) >= THRESHOLD;

  return (
    <div>
      <h1>{isEdit ? 'Редактирование датчика' : 'Добавление датчика'}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Название:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>
            Место:
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </label>
        </div>
                                        
        <div style={{ marginTop: '10px' }}>
          <label>
            Значение:
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </label>
        </div>

        <p style={{ marginTop: '10px' }}>
          Статус (авто): <b>{alarmPreview ? 'ТРЕВОГА' : 'норма'}</b> (порог {THRESHOLD})
        </p>

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default Form;
