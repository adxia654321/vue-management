<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { queryDegreeApi, queryStuCountApi } from '@/api/report'

// DOM 參考
const pieChartRef = ref(null)
const barChartRef = ref(null)

// ECharts 實例變數
let pieChart = null
let barChart = null

// 載入學歷分佈資料並更新圓餅圖
const loadDegreeData = async () => {
  try {
    const res = await queryDegreeApi()
    if (res.code === 1 && Array.isArray(res.data)) {
      const data = res.data  // 形如 [{ name: '國中', value: 1 }, ...]
      const option = {
        title: { text: '學生學歷分佈', left: 'center' },
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
      console.error('學歷統計 API 回傳錯誤:', res.msg)
    }
  } catch (error) {
    console.error('取得學歷統計失敗', error)
  }
}

// 載入班級人數資料並更新長條圖
const loadStuCountData = async () => {
  try {
    const res = await queryStuCountApi()
    if (res.code === 1 && res.data && Array.isArray(res.data.clazzList) && Array.isArray(res.data.dataList)) {
      const names = res.data.clazzList
      const counts = res.data.dataList
      const option = {
        title: { text: '班級人數統計' },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: names
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '人數',
            type: 'bar',
            data: counts
          }
        ]
      }
      barChart.setOption(option)
    } else {
      console.error('班級人數統計 API 回傳錯誤:', res.msg)
    }
  } catch (error) {
    console.error('取得班級人數統計失敗', error)
  }
}

let resizeHandler = null

onMounted(() => {
  // 初始化 ECharts 實例
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.showLoading()
  }
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.showLoading()
  }

  // 載入資料後隱藏 Loading 並 setOption
  loadDegreeData().finally(() => pieChart && pieChart.hideLoading())
  loadStuCountData().finally(() => barChart && barChart.hideLoading())

  // 設定 resize listener
  resizeHandler = () => {
    pieChart && pieChart.resize()
    barChart && barChart.resize()
  }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  // 移除 listener 並 dispose ECharts 實例
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  pieChart && pieChart.dispose()
  barChart && barChart.dispose()
})
</script>

<template>
  <h1>學生數據統計</h1> 
  <div class="chart-container">
    <!-- 左：長條圖 -->
    <div ref="barChartRef" class="chart-box"></div>
    <!-- 右：圓餅圖 -->
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
  /* 可依需求調整高度 */
  height: 550px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>
