<script setup>
import { ref, onMounted } from 'vue';
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept';
import { ElMessage, ElMessageBox } from 'element-plus';


// 生命週期函數
onMounted(() => {
    search();
})

// 部門信息List
const deptList = ref([])


// 查詢
const search = async () =>{
    const result = await queryAllApi();
    if(result.code){  
        deptList.value = result.data;
    }
}

// 對話框
const dialogFormVisible = ref(false);
const dept = ref({ name: '' });
const formTitle = ref('');

// 新增部門
const addDept = () => {
    dialogFormVisible.value = true;
    formTitle.value = '新增部門';
    dept.value = {name: ''};
    // 重置表單驗證規則-提示訊息 (再次點擊新增部門按鈕時候 不會跳出紅字提示名字規則)
     if (deptFormRef.value) {
        deptFormRef.value.resetFields()
     }
}

// 保存部門
const save = async () => {
    // 表單驗證
    if(!deptFormRef.value) return;

    deptFormRef.value.validate(async (valid) =>{  // valid 表示是否驗證通過 true通過 false不通過
      if(valid){

      let result;
            
      if(dept.value.id){
        result = await updateApi(dept.value);
      } else {
        result = await addApi(dept.value);
      }

        if(result.code){
        // 提示信息
        ElMessage.success('操作成功');
        // 關閉對話框
        dialogFormVisible.value = false;
        //重新查詢列表
        search();
        } else {
            ElMessage.error(result.msg);
        }
    }else{  // 驗證不通過
              ElMessage.error('請檢查名稱是否符合規定');
      }   
    }
)
}


// 表單提交驗證
const rules = ref({
  name: [
    { required: true, message: '部門名稱必須填寫 ! ', trigger: 'blur' },
    { min: 2, max: 10, message: '部門名稱需在2-10字之間', trigger: 'blur' },
  ]
})

const deptFormRef = ref();


// 按修改時 需要回顯資料
const edit = async (id) => {
  formTitle.value = '修改部門';
  // 重置表單驗證規則-提示訊息
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }

  const result = await queryByIdApi(id);
  if(result.code){
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
}

// 刪除部門
const delById = async (id) => {
  // 彈出確認框
   ElMessageBox.confirm(
    '你確定要刪除此部門嗎?',
    '提示',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const result = await deleteByIdApi(id);
      if(result.code){
        ElMessage.success('刪除成功');
        search();
      }else{
        ElMessage.error(result.msg);
      }

    })
    .catch(() => {
     ElMessage.info('取消刪除')
    })
}


</script>

<template>
    <h1>部門管理</h1>
    <div class="container">
        <el-button type="primary" @click="addDept">+ 新增部門</el-button>
    </div>

    <!--表格-->
    <div class="container">
        <el-table :data="deptList" border style="width: 100%">
            <el-table-column type="index" label="No." width="100" align="center"/>
            <el-table-column prop="name" label="部門名稱" width="260" align="center"/>
            <el-table-column prop="updateTime" label="最後操作時間" width="300" align="center"/>
            <el-table-column label="操作" align="center">
                <template #default="scope" >
                    <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon><EditPen /></el-icon>
                        編輯
                    </el-button>
                    <el-button type="danger" size="small" @click="delById(scope.row.id)"><el-icon><Delete /></el-icon>
                        刪除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 對話框 -->
     <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部門名稱" label-width="80px" prop="name">
        <el-input v-model="dept.name"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="save">
          確定
        </el-button>
      </div>


    </template>
  </el-dialog>

</template>

<style scoped>
.container {
    margin: 20px 0px;
}
</style>