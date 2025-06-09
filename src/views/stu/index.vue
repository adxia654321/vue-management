<script setup>
import { ref, onMounted } from 'vue'
import { queryAllApi as queryAllClazzApi } from '@/api/clazz'  // 這是你查詢班級列表的 API
import { queryPageApi, addApi, queryInfoApi, updateApi, deleteApi, queryAllApi } from "@/api/stu";

// 生命週期函數 呼叫查詢學生
onMounted(() => {
    search();   // 查詢所有學生
    queryAllClazzs() // 查詢所有班級
})


// 儲存班級清單
const clazzList = ref([])

// 儲存學生資訊
const stuList = ref([])


const searchStu = ref({
    name: '',
    degree: '',
    clazzId: ''  // 要記得用 clazzId 才能對應你的後端參數
})

// 分頁
const currentPage = ref(1)
const pageSize = ref(5)
const background = ref(true)
const total = ref(0);

// 獲得班級名稱
const getClazzName = (clazzId) => {
    const clazz = clazzList.value.find(c => c.id === clazzId)
    return clazz ? clazz.name : '-'
}

// 查詢所有班級
const queryAllClazzs = async () => {
    const result = await queryAllClazzApi();
    if (result.code) {
        clazzList.value = result.data.rows || result.data; // 依據你後端返回結構調整
    }
}

// 查詢學生列表
const search = async () => {
    const result = await queryPageApi(searchStu.value.name, searchStu.value.degree,
        searchStu.value.clazzId, currentPage.value, pageSize.value);
    if (result.code) {
        stuList.value = result.data.rows;
        total.value = result.data.total;
    }
}

// 清除後重新查詢全部資料
const clear = () => {
    searchStu.value = {
        name: '',
        degree: '',
        clazzId: ''
    };
    search();
};



</script>

<template>

    <h1>學生管理</h1>

    <!-- 搜索欄 -->
    <div class="container">
        <el-form :inline="true" :model="searchStu" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="searchStu.name" placeholder="請輸入學生姓名" />
            </el-form-item>

            <el-form-item label="學歷">
                <el-select v-model="searchStu.degree" placeholder="請選擇">
                    <el-option label="高中" value="1" />
                    <el-option label="二專" value="2" />
                    <el-option label="大學" value="3" />
                    <el-option label="碩士" value="4" />
                    <el-option label="博士" value="5" />
                </el-select>
            </el-form-item>

            <el-form-item label="所屬班級">
                <el-select v-model="searchStu.clazzId" placeholder="請選擇班級">
                    <el-option v-for="clazz in clazzList" :key="clazz.id" :label="clazz.name" :value="clazz.id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查詢</el-button>
                <el-button type="info" @click="clear">清除</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 功能按鈕 -->
    <div class="container">
        <el-button type="primary" @click="addEmp">+ 新增學生</el-button>
        <el-button type="danger" @click="deleteByIds">- 批量刪除</el-button>
    </div>


<div class="container">
    <el-table :data="stuList" border style="width: 100%" @selection-change="handleSelectionChange">

        <!-- 多選框欄位 -->
        <el-table-column type="selection" width="60" align="center" />

        <!-- 姓名欄位 -->
        <el-table-column prop="name" label="姓名" width="100" align="center" />

        <!-- 學號欄位 -->
        <el-table-column prop="no" label="學號" width="140" align="center" />

        <!-- 性別欄位 -->
        <el-table-column prop="gender" label="性別" width="80" align="center">
            <template #default="scope">
                <span>{{ scope.row.gender === 1 ? '男' : '女' }}</span>
            </template>
        </el-table-column>

        <!-- 學歷欄位 -->
        <el-table-column prop="degree" label="學歷" width="100" align="center">
            <template #default="scope">
                <span v-if="scope.row.degree == 1">高中</span>
                <span v-else-if="scope.row.degree == 2">二專</span>
                <span v-else-if="scope.row.degree == 3">大學</span>
                <span v-else-if="scope.row.degree == 4">碩士</span>
                <span v-else-if="scope.row.degree == 5">博士</span>
                <span v-else>未知</span>
            </template>
        </el-table-column>

        <!-- 所屬班級欄位 -->
        <el-table-column label="所屬班級" width="120" align="center">
            <template #default="scope">
                {{ getClazzName(scope.row.clazzId) }}
            </template>
        </el-table-column>

        <!-- 最後操作時間欄位 -->
        <el-table-column prop="updateTime" label="最後操作時間" width="180" align="center" />

        <!-- 操作欄位：不設定 width，自動撐滿 -->
        <el-table-column label="操作" align="center">
            <template #default="scope">
                <el-button type="primary" size="small" @click="edit(scope.row.id)">
                    <el-icon>
                        <EditPen />
                    </el-icon> 編輯
                </el-button>
                <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
                    <el-icon>
                        <Delete />
                    </el-icon> 刪除
                </el-button>
            </template>
        </el-table-column>

    </el-table>

</div>


    <!-- 數據展示表格 -->
    <div class="container">

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 30, 50, 75, 100]" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />

    </div>
















</template>

<style scoped>
.container {
    margin: 12px 0px;
}
</style>