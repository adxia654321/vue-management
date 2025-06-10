<script setup>
import { ref, onMounted } from 'vue'
import { queryAllApi as queryAllClazzApi } from '@/api/clazz'  // 這是你查詢班級列表的 API
import { queryPageApi, addApi, queryInfoApi, updateApi, deleteApi, queryAllApi } from "@/api/stu";
import { ElMessage, ElMessageBox } from 'element-plus'
import { EditPen, Delete } from '@element-plus/icons-vue'

// 生命週期函數 呼叫查詢學生
onMounted(() => {
    search();   // 查詢所有學生
    queryAllClazzs() // 查詢所有班級
})

// 分頁功能
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重新查詢第一頁
  search();
};

// 分頁功能
const handleCurrentChange = (val) => {
  currentPage.value = val;
  search();
};

// 新增修改表單狀態
const dialogVisible = ref(false)
const dialogTitle = ref('')  // 預設標題可空

// 表單的 ref
const stuFormRef = ref(null)

// 規則
const rules = ref({
    name: [
        { required: true, message: '請輸入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '姓名長度應在2到10個字符之間', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '請選擇性別', trigger: 'change' }
    ],
    no: [
        { required: true, message: '請輸入學號', trigger: 'blur' },
        { pattern: /^[sS]\d{9}$/, message: '學號必須以 s 開頭並接 9 位數字（共10碼）', trigger: 'blur' }
    ],
    degree: [
        { required: true, message: '請選擇學歷', trigger: 'change' }
    ],
    clazzId: [
        { required: true, message: '請選擇所屬班級', trigger: 'change' }
    ]
});



// 儲存班級清單
const clazzList = ref([])

// 儲存學生資訊
const stuList = ref([])


const searchStu = ref({
    name: '',
    degree: '',
    clazzId: ''  // 要記得用 clazzId 才能對應你的後端參數
})


// 新增/修改表單
const student = ref({
    id: null,        // 主鍵（新增時可為 null）
    name: '',        // 學生姓名
    no: '',          // 學號
    gender: null,    // 性別（1: 男, 2: 女）
    degree: '',      // 學歷（1-5）
    clazzId: ''      // 班級 ID
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

const addStu = () => {
    dialogVisible.value = true;
    dialogTitle.value = '新增學生';
    student.value = {
        id: null,        // 主鍵（新增時可為 null）
        name: '',        // 學生姓名
        no: '',          // 學號
        gender: null,    // 性別（1: 男, 2: 女）
        degree: '',      // 學歷（1-5）
        clazzId: ''      // 班級 ID
    }
    // 重置表單驗證規則-提示訊息 (再次點擊新增按鈕時候 不會跳出紅字提示名字規則)
    if (stuFormRef.value) {
        stuFormRef.value.resetFields()
    }
}

// 新增或修改學生
const save = async () => {

    // 表單驗證
    if (!stuFormRef.value) return;

    stuFormRef.value.validate(async (valid) => {
        if (valid) {
            let result;

            if (student.value.id) {
                // 存在 ID，執行修改操作
                result = await updateApi(student.value);
            } else {
                // 不存在 ID，執行新增操作
                result = await addApi(student.value);
            }

            if (result.code) {
                ElMessage.success(student.value.id ? '修改成功' : '新增成功');
                dialogVisible.value = false;
                search();
            } else {
                ElMessage.error(result.msg || '操作失敗');
            }

        } else {
            ElMessage.error('請檢查欄位是否符合規定');
        }
    });
}

// 紀錄勾選的學生的id
const selectedIds = ref([]);


// 複選框勾選發生變化時觸發   selection是當前選中的元素(是一組陣列[])
const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map(item => item.id);
}

// 批量刪除員工
const deleteByIds = () => {
    // 彈出確認框
    ElMessageBox.confirm(
        '你確定要刪除此學生嗎?',
        '提示',
        {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            if (selectedIds.value && selectedIds.value.length > 0) {
                const result = await deleteApi(selectedIds.value);
                if (result.code) {
                    ElMessage.success('刪除成功');
                    search();
                } else {
                    ElMessage.error(result.msg);
                }
            } else {
                ElMessage.info('你並未選擇任何要刪除的學生');
            }

        }).catch(() => {
            ElMessage.info('取消刪除')
        })
}

// 修改
const edit = async (id) => {
    const result = await queryInfoApi(id);
    if (result.code) {
        dialogVisible.value = true;
        dialogTitle.value = '修改學生';
        student.value = result.data;
    }
}


// 刪除學生
const deleteById = (id) => {
    // 彈出確認框
    ElMessageBox.confirm(
        '你確定要刪除此學生嗎?',
        '提示',
        {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const result = await deleteApi(id);
            if (result.code) {
                ElMessage.success('刪除成功');
                search();
            } else {
                ElMessage.error(result.msg);
            }

        })
        .catch(() => {
            ElMessage.info('取消刪除')
        })
}



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
        <el-button type="primary" @click="addStu">+ 新增學生</el-button>
        <el-button type="danger" @click="deleteByIds">- 批量刪除</el-button>
    </div>


    <div class="container">
        <el-table :data="stuList" border style="width: 100%" @selection-change="handleSelectionChange">

            <!-- 多選框欄位 -->
            <el-table-column type="selection" width="60" align="center" />

            <!-- 姓名欄位 -->
            <el-table-column prop="name" label="姓名" width="150" align="center" />

            <!-- 學號欄位 -->
            <el-table-column prop="no" label="學號" width="190" align="center" />

            <!-- 性別欄位 -->
            <el-table-column prop="gender" label="性別" width="110" align="center">
                <template #default="scope">
                    <span>{{ scope.row.gender === 1 ? '男' : '女' }}</span>
                </template>
            </el-table-column>

            <!-- 學歷欄位 -->
            <el-table-column prop="degree" label="學歷" width="150" align="center">
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
            <el-table-column label="所屬班級" width="200" align="center">
                <template #default="scope">
                    {{ getClazzName(scope.row.clazzId) }}
                </template>
            </el-table-column>

            <!-- 最後操作時間欄位 -->
            <el-table-column prop="updateTime" label="最後操作時間" width="200" align="center" />

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



    <!-- 新增和修改學生的對話框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
        <el-form :model="student" :rules="rules" ref="stuFormRef" label-width="80px">
            <!-- 第一行：姓名 + 學號 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="student.name" placeholder="請輸入學生姓名，2-20個字" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="學號" prop="no">
                        <el-input v-model="student.no" placeholder="請輸入學生學號" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第二行：性別 + 學歷 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="性別" prop="gender">
                        <el-select v-model="student.gender" placeholder="請選擇性別" style="width: 100%;">
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="學歷" prop="degree">
                        <el-select v-model="student.degree" placeholder="請選擇學歷" style="width: 100%;">
                            <el-option label="高中" value="1" />
                            <el-option label="二專" value="2" />
                            <el-option label="大學" value="3" />
                            <el-option label="碩士" value="4" />
                            <el-option label="博士" value="5" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第三行：所屬班級 -->
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="班級" prop="clazzId">
                        <el-select v-model="student.clazzId" placeholder="請選擇所屬班級" style="width: 100%;">
                            <el-option v-for="clazz in clazzList" :key="clazz.id" :label="clazz.name"
                                :value="clazz.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 對話框底部按鈕 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </span>
        </template>
    </el-dialog>












</template>

<style scoped>
.container {
    margin: 12px 0px;
}
</style>