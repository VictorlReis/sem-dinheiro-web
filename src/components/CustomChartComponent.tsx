// noinspection TypeScriptValidateTypes
import { ResponsivePie } from '@nivo/pie'

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
  }

  return (
    <div style={{ width: '50em', height: '100%' }}>
      <ResponsivePie
        data={data.map((item) => ({
          id: item.tag,
          value: parseFloat(item.value.toFixed(2)),
        }))}
        colors={{ scheme: 'category10' }}
        theme={theme}
        margin={{ top: 10, right: 70, bottom: 20, left: 100 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
      />
    </div>
  )
}

export default CustomChart
