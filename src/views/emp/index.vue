<script setup>
import { ref, watch, onMounted } from "vue";
import { queryPageApi, addApi, queryInfoApi } from "@/api/emp";
import { queryAllApi as queryAllDeptApi } from "@/api/dept";
import { ElMessage } from 'element-plus'



// 職位列表數據
const jobs = ref([
  { name: '斑導', value: 1 },
  { name: '講師', value: 2 },
  { name: '主任', value: 3 },
  { name: '負責人', value: 4 },
  { name: '諮詢師', value: 5 },
  { name: '其他', value: 6 }
]);

// 性別列表數據
const genders = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 }
]);


// 部門列表數據
const depts = ref([])


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
  if (newVal.length == 2) {
    searchEmp.value.begin = newVal[0];
    searchEmp.value.end = newVal[1];
  } else {
    searchEmp.value.begin = '';
    searchEmp.value.end = '';
  }
})

// 生命週期函數
onMounted(() => {
  search();   // 查詢所有員工
  queryAllDepts();  // 查詢所有部門
})

// 生命週期函數 查詢所有部門
const queryAllDepts = async () => {
  const result = await queryAllDeptApi();
  if (result.code) {
    depts.value = result.data;
  }
}

// 查詢員工列表
const search = async () => {
  const result = await queryPageApi(searchEmp.value.name, searchEmp.value.gender,
    searchEmp.value.begin, searchEmp.value.end,
    currentPage.value, pageSize.value);
  if (result.code) {
    empList.value = result.data.rows;
    total.value = result.data.total;
  }
}

// 清空
const clear = () => {
  searchEmp.value = { name: '', gender: '', date: '', begin: '', end: '' };
  search();
}

// 員工列表數據
const empList = ref([])


// 分頁
const currentPage = ref(1)
const pageSize = ref(5)
const background = ref(true)
const total = ref(0);

// 每頁展示的紀錄數變化
const handleSizeChange = (val) => {

  search();
}

// 頁面變化時觸發
const handleCurrentChange = (val) => {

  search();
}


// 新增/修改表單
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})

// 控制彈窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增員工')

// 文件上傳
// 圖片上傳成功後觸發
const handleAvatarSuccess = (response) => {
  console.log(response);
  employee.value.image = response.data;
}

// 文件上傳之前觸發
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上傳圖片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上傳10M以內的圖片')
    return false
  }
  return true
}

const addEmp = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增員工';
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  }
  // 重置表單驗證規則-提示訊息 (再次點擊新增按鈕時候 不會跳出紅字提示名字規則)
   if (empFormRef.value) {
      empFormRef.value.resetFields()
    }
}

// 添加工作經歷
const addExprItem = () => {
  employee.value.exprList.push({ company: '', job: '', begin: '', end: '', exprDate: [] });
}

// 刪除工作經歷
const delExprItem = (index) => {
  employee.value.exprList.splice(index, 1)
}

// 監聽 exprList裡的變化 動態附值給begin end
watch(() => employee.value.exprList, (newVal, oldVal) => {
  if (employee.value.exprList && employee.value.exprList.length > 0) {
    employee.value.exprList.forEach((expr) => {
      expr.begin = expr.exprDate[0];
      expr.end = expr.exprDate[1];
    })
  }
}, { deep: true })  // 深度監聽

// 新增員工
const save = async () => {

  // 表單驗證
  if (!empFormRef.value) return;

    empFormRef.value.validate(async (valid) => {  // valid 表示是否驗證通過 true通過 false不通過
    if (valid) {
      const result = await addApi(employee.value);
      if (result.code) {
        ElMessage.success('新增成功');
        dialogVisible.value = false;
        search();
      } else {  // 失敗了
        ElMessage.error(result.msg);
      }

    } else {  // 驗證不通過
      ElMessage.error('請檢查名稱是否符合規定');
    }
  }
  )




}

// 表單引用 (表單驗證用的)
const empFormRef = ref();


const rules = ref({
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    { min: 2, max: 20, message: '用戶名長度應在2到20個字符之間', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '請輸入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名長度應在2到10個字符之間', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '請選擇性別', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '請輸入手機號碼', trigger: 'blur' },
    { pattern: /^09\d{8}$/, message: '請輸入有效的台灣手機號碼', trigger: 'blur' }
  ]
});


// 修改
const edit = async (id) => {
  const result = await queryInfoApi(id);
  if(result.code){
    dialogVisible.value = true;
    dialogTitle.value = '修改員工';
    employee.value = result.data;

    // 對工作經歷進行處理
    let exprList = employee.value.exprList;
    if(exprList && exprList.length > 0){
      exprList.forEach((expr) => {
        expr.exprDate = [expr.begin, expr.end];
      })
    }

  }
}

</script>





<template>

  <h1>員工管理</h1>

  <!-- 搜索欄 -->
  <div class="container">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="請輸入員工姓名" />

      </el-form-item>
      <el-form-item label="性別">
        <el-select v-model="searchEmp.gender" placeholder="請選擇">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>

      </el-form-item>
      <el-form-item label="入職時間">
        <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="到" start-placeholder="開始日期"
          end-placeholder="結束日期" value-format="YYYY-MM-DD" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查詢</el-button>
        <el-button type="info" @click="clear">清除</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按鈕 -->
  <div class="container">
    <el-button type="primary" @click="addEmp">+ 新增員工</el-button>
    <el-button type="danger" @click="">- 批量刪除</el-button>
  </div>


  <!-- 表格 -->
  <div class="container">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" width="120" align="center" />
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
      <el-table-column prop="deptName" label="所屬部門" width="120" align="center" />
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
      <el-table-column prop="entryDate" label="入職日期" width="200" align="center" />
      <el-table-column prop="updateTime" label="最後操作時間" width="200" align="center" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon>
              <EditPen />
            </el-icon>
            編輯
          </el-button>
          <el-button type="danger" size="small" @click=""><el-icon>
              <Delete />
            </el-icon>
            刪除
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


  <!-- 新增和修改員工的對話框 -->

  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="employee" :rules="rules" ref="empFormRef" label-width="80px">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用戶名" prop="username">
            <el-input v-model="employee.username" placeholder="請輸入員工用戶名，2-20個字" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="請輸入員工用戶名，2-20個字" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性別" prop="gender">
            <el-select v-model="employee.gender" placeholder="請選擇性別" style="width: 100%;">
              <el-option v-for="g in genders" :key="g.value" :label="g.name" :value="g.value"></el-option>

            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手機號" prop="phone">
            <el-input v-model="employee.phone" placeholder="請輸入員工手機號"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="職位">
            <el-select v-model="employee.job" placeholder="請選擇職位" style="width: 100%;">
              <el-option v-for="j in jobs" :key="j.value" :label="j.name" :value="j.value"></el-option>

            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="薪資">
            <el-input v-model="employee.salary" placeholder="請輸入員工薪資"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所屬部門">
            <el-select v-model="employee.deptId" placeholder="請選擇部門" style="width: 100%;">
              <el-option v-for="d in depts" :key="d.id" :label="d.name" :value="d.id"></el-option>

            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入職日期">
            <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="選擇日期"
              format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="頭像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工作經歷 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作經歷">
            <el-button type="success" size="small" @click="addExprItem">+ 添加工作經歷</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 .. 工作經歷-->
      <el-row :gutter="3" v-for="(expr, index) in employee.exprList" :key="index">

        <el-col :span="10">
          <el-form-item size="small" label="時間" label-width="80px">
            <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="到" start-placeholder="開始日期"
              end-placeholder="結束日期" format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input placeholder="請輸入公司名稱" v-model="expr.company"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="職位" label-width="60px">
            <el-input placeholder="請輸入職位" v-model="expr.job"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="delExprItem(index)"> - 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按鈕 -->
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

.avatar {
  height: 40px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色虛線邊框 */
  border: 1px dashed var(--el-border-color);
}
</style>