import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

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

    const loadSensor = async () => {
      try {
        const { data } = await axios.get(`${API}/sensors/${id}`);
        setName(data?.name ?? '');
        setPlace(data?.place ?? '');
        setValue(String(data?.value ?? ''));
      } catch (error) {
        console.error('Ошибка загрузки для редактирования:', error);
      }
    };

    loadSensor();
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valueNumber = Number(value);
    const alarm = valueNumber >= THRESHOLD;
    const payload = { name, place, value: valueNumber, alarm };

    try {
      if (isEdit) {
        await axios.put(`${API}/sensors/${id}`, payload);
      } else {
        await axios.post(`${API}/sensors`, payload);
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

      <div>Статус (авто): <b>{alarmPreview ? 'ТРЕВОГА' : 'норма'}</b> (порог {THRESHOLD})</div>
      <br />

      <form onSubmit={handleSubmit}>
        <table cellPadding="8" cellSpacing="0">
          <colgroup>
            <col width="160" />
            <col width="520" />
          </colgroup>
          <tbody>
            <tr>
              <td><b>Название</b></td>
              <td><input value={name} onChange={(e) => setName(e.target.value)} required /></td>
            </tr>
            <tr>
              <td><b>Место</b></td>
              <td><input value={place} onChange={(e) => setPlace(e.target.value)} required /></td>
            </tr>
            <tr>
              <td><b>Значение</b></td>
              <td>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <button type="submit">Сохранить</button>
        &nbsp;&nbsp;&nbsp;
        <Link to="/">Назад</Link>
      </form>
    </div>
  );
};

export default Form;
