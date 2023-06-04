// noinspection TypeScriptValidateTypes

import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import moment from 'moment';
import 'moment/locale/pt-br.js';
moment.locale('pt-br');

interface DateFilterProps {
  selectedMonth: number;
  selectedYear: number;
  onChangeMonth: (event: SelectChangeEvent<number>) => void;
  onChangeYear: (event: SelectChangeEvent<number>) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedMonth,
  selectedYear,
  onChangeMonth,
  onChangeYear,
}) => {
  const translatedMonths = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const currentYear = moment().year();
  const startYear = currentYear - 10;
  return (
    <div style={{ display: 'flex' }}>
      <Select
        value={selectedMonth}
        onChange={onChangeMonth}
        style={{ marginRight: '1vh', height: '4vh' }}
      >
        {translatedMonths.map((mes, index) => (
          <MenuItem key={index + 1} value={index + 1}>
            {mes}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={selectedYear}
        onChange={onChangeYear}
        style={{ marginRight: '1vh', height: '4vh' }}
      >
        {Array.from({ length: 11 }, (_, i) => startYear + i).map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default DateFilter;
