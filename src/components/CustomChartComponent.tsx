// noinspection TypeScriptValidateTypes

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const CustomChart = ({ data }) => {
  const theme = {
    labels: {
      text: '#ffffff',
    },
    tooltip: {
      container: {
        background: '#333333',
      },
    },
    axis: {
      ticks: {
        text: {
          fill: '#ffffff',
        },
      },
      legend: {
        text: {
          fill: '#ffffff',
        },
      },
    },
  };

  const colorMap = {
    ifood: '#d20707',
    casa: 'rgb(84,56,56)',
    academia: '#d7ba29',
    educacao: '#6f6fb2',
  };

  const defaultColor = '#808080';

  return (
    <div style={{ width: '48%', height: '80%' }}>
      <ResponsiveBar
        data={data}
        colors={(bar) => colorMap[bar.indexValue] || defaultColor}
        theme={theme}
        indexBy="tag"
        margin={{ top: 10, right: 10, bottom: 20, left: 50 }}
        padding={0.1}
        borderColor={{ from: 'color', modifiers: [['brighter', 1.6]] }}
        labelSkipWidth={10}
        labelSkipHeight={10}
        labelTextColor={{ from: 'color', modifiers: [['brighter', 1.6]] }}
      />
    </div>
  );
};

export default CustomChart;
