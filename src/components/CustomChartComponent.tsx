// noinspection TypeScriptValidateTypes

import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const CustomChart = ({ data }) => {
  const theme = {
    labels: {
      text: {
        fill: '#fff',
      },
    },
    tooltip: {
      container: {
        background: '#333333',
      },
    },
  };

  const colorMap = {
    contas: '#3232d7',
    ifood: '#ff0000',
    casa: '#4e9a1c',
    academia: '#FFBE0F',
    educacao: '#d6a735',
    saude: '#fff',
    mercado: '#af9b61',
    padaria: '#ffa222',
    role: '#E0CCF1',
    uber: '#000000',
    carro: '#595e5e',
    bike: '#2a2727',
    vestuario: '#6c3b88',
    faxina: '#e5b8b8',
    terapia: '#69e5c5',
    marmita: '#2c591f',
  };

  const defaultColor = '#B3BDC3';

  return (
    <div style={{ width: '48rem', height: '50rem' }}>
      <ResponsivePie
        data={data.map((item) => ({
          id: item.tag,
          value: parseFloat(item.value.toFixed(2)),
        }))}
        colors={({ id }) => colorMap[id] || defaultColor}
        theme={theme}
        margin={{ top: 10, right: 70, bottom: 20, left: 100 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
      />
    </div>
  );
};

export default CustomChart;
