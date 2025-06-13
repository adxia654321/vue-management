<script setup>
import { ref, computed, onMounted } from 'vue'
import { queryLogApi } from '@/api/log'
import { queryAllEmpApi } from '@/api/emp'

const allData = ref([])         // 所有日誌資料
const currentPage = ref(1)      // 當前頁碼
const pageSize = ref(5)         // 每頁顯示筆數

const empMap = ref({})          // 員工 ID 對應名稱表

// 建立員工 ID 對名稱的對應表，例如 { 1: '小王', 2: '小美' }
const fetchEmpMap = async () => {
  const res = await queryAllEmpApi()
  if (res.code === 1 && Array.isArray(res.data)) {
    const map = {}
    res.data.forEach(emp => {
      map[emp.id] = emp.name
    })
    empMap.value = map
  }
}

// 取得日誌資料，並加上操作者名稱
const fetchLogs = async () => {
  const res = await queryLogApi()
  if (res.code === 1 && Array.isArray(res.data)) {
    allData.value = res.data.map(item => ({
      ...item,
      operator: empMap.value[item.operateEmpId] || '未知'
    }))
  }
}

// 計算顯示在表格中的資料（分頁）
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allData.value.slice(start, end)
})

// 每頁筆數改變時重設頁碼
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

// 初始化：先抓員工，再抓日誌
onMounted(async () => {
  await fetchEmpMap()
  await fetchLogs()
})
</script>

<template>
  <h1>操作日誌</h1>

  <el-table :data="pagedData" border style="width: 100%">
    <el-table-column prop="operateTime" label="操作時間" width="180" />
    <el-table-column prop="operator" label="操作者" width="120" />
    <el-table-column prop="className" label="類別名稱" width="160"/>
    <el-table-column prop="methodName" label="方法名稱" width="140" />
    <el-table-column prop="methodParams" label="方法參數" />
    <el-table-column prop="costTime" label="耗時 (ms)" width="100" />
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :page-sizes="[5, 10, 20, 50]"
    :total="allData.length"
    layout="total, sizes, prev, pager, next"
    background
    class="mt-4"
    @size-change="handleSizeChange"
  />
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
  text-align: right;
}
</style>
