<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { queryJobApi, queryGenderApi } from '@/api/report'

const barChartRef = ref(null)
const pieChartRef = ref(null)

let barChart = null
let pieChart = null

const loadBarChartData = async () => {
  const result = await queryJobApi()
  if (result.code === 1) {
    const jobList = result.data.jobList
    const dataList = result.data.dataList

    const option = {
      title: { text: '職位人數統計' },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: jobList
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '人數',
          type: 'bar',
          data: dataList
        }
      ]
    }
    barChart.setOption(option)
  } else {
    console.error('職位統計 API 回傳錯誤:', result.msg)
  }
}

const loadPieChartData = async () => {
  const result = await queryGenderApi()
  if (result.code === 1) {
    const data = result.data // 形如 [{name: '男性員工', value: 17}, ...]

    const option = {
      title: { text: '性別分佈', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%', left: 'center' },
      series: [
        {
          name: '人數',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold'
            }
          },
          labelLine: { show: false },
          data: data
        }
      ]
    }
    pieChart.setOption(option)
  } else {
    console.error('性別統計 API 回傳錯誤:', result.msg)
  }
}

onMounted(() => {
  barChart = echarts.init(barChartRef.value)
  pieChart = echarts.init(pieChartRef.value)

  // 讀取兩個圖表資料
  loadBarChartData()
  loadPieChartData()

  // 視窗縮放時重繪
  window.addEventListener('resize', () => {
    barChart.resize()
    pieChart.resize()
  })
})
</script>

<template>
  <h1>員工數據統計</h1>
  <div class="chart-container">
    <div ref="barChartRef" class="chart-box"></div>
    <div ref="pieChartRef" class="chart-box"></div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.chart-box {
  flex: 1;
  width: 100%;
  /* 將高度從 400px 改為 500px，讓圖更長 */
  height: 550px;
  /* 如果不想白底就移除下面兩行 */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

</style>
