<script setup>
import { ref, watch } from "vue";
import { queryPageApi } from "@/api/emp";


// 搜索表單
const searchEmp = ref({
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: ''
})

// watch 監聽 date 屬性的變化
watch(() => searchEmp.value.date, (newVal, oldVal) => {
    if(newVal.length == 2){
        searchEmp.value.begin = newVal[0];
        searchEmp.value.end = newVal[1];
    }else{
        searchEmp.value.begin = '';
        searchEmp.value.end = '';
    }
})


// 查詢員工列表
const search = async () => {
    const result = await queryPageApi(searchEmp.value.name, searchEmp.value.gender,
                                      searchEmp.value.begin, searchEmp.value.end,
                                      currentPage.value, pageSize.value);
    if(result.code){
        empList.value = result.data.rows;
        total.value = result.data.totle;
    }
}

// 清空
const clear = () => {
    searchEmp.value = {name: '' ,gender: '', date: '', begin: '', end: ''};
    search();
}

// 員工列表數據
const empList = ref([
    
])


// 分頁
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0);

// 每頁展示的紀錄數變化
const handleSizeChange = (val) => {
  console.log(`每頁展示${val}條紀錄`)
}

// 頁面變化時觸發
const handleCurrentChange = (val) => {
  console.log(`當前頁碼: ${val}`)
}

</script>

<template>

 <h1>員工管理</h1>

<!-- 搜索欄 -->
 <div class="container">
<el-form :inline="true" :model="searchEmp" class="demo-form-inline">
    <el-form-item label="姓名">
      <el-input v-model="searchEmp.name" placeholder="請輸入員工姓名"/>

    </el-form-item>
    <el-form-item label="性別">
      <el-select v-model="searchEmp.gender" placeholder="請選擇">
        <el-option label="男" value="1" />
        <el-option label="女" value="2" />
      </el-select>

    </el-form-item>
    <el-form-item label="入職時間">
      <el-date-picker
        v-model="searchEmp.date"
        type="daterange"
        range-separator="到"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="search">查詢</el-button>
      <el-button type="info" @click="clear">清除</el-button>
    </el-form-item>
  </el-form>
 </div>

 <!-- 功能按鈕 -->
<div class="container">
   <el-button type="primary" @click="">+ 新增員工</el-button>
   <el-button type="danger" @click="">- 批量刪除</el-button>
</div>



 <!-- 表格 -->
<div class="container">
<el-table :data="empList" border style="width: 100%">
    <el-table-column type="selection" width="55" align="center"/>
    <el-table-column prop="name" label="姓名" width="120" align="center"/>
    <el-table-column label="性別" width="120" align="center">
        <template #default="scope">
            {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
    </el-table-column>
    <el-table-column label="頭像" width="120" align="center">
        <template #default="scope">
            <img :src="scope.row.image" height="40px">
        </template>
    </el-table-column>
    <el-table-column prop="deptName" label="所屬部門" width="120" align="center"/>
    <el-table-column label="職位" width="180" align="center">
        <template #default="scope">
            <span v-if="scope.row.job == 1">班導</span>
            <span v-else-if="scope.row.job == 2">講師</span>
            <span v-else-if="scope.row.job == 3">主任</span>
            <span v-else-if="scope.row.job == 4">負責人</span>
            <span v-else-if="scope.row.job == 5">諮詢師</span>
            <span v-else>其他</span>
        </template>
    </el-table-column>
    <el-table-column prop="entryDate" label="入職日期" width="200" align="center"/>
    <el-table-column prop="updateTime" label="最後操作時間" width="200" align="center"/>
    <el-table-column label="操作" width="180" >
        <template #default="scope" >
            <el-button type="primary" size="small" @click=""><el-icon><EditPen /></el-icon>
                編輯
            </el-button>
            <el-button type="danger" size="small" @click=""><el-icon><Delete /></el-icon>
                刪除
             </el-button> 
        </template>
    </el-table-column>
</el-table>
</div>



 <!-- 數據展示表格 -->
<div class="container">

<el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
/>

</div>

</template>

<style scoped>

.container{
    margin: 12px 0px;
}

</style>