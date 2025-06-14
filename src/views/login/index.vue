<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi, adminLoginApi } from '@/api/login';
import { useRouter } from 'vue-router';
import { sendVerifyCodeApi, checkCodeApi, registerAdminApi } from '@/api/register'

const loginForm = ref({ username: '', password: '' })


const router = useRouter();

// 登入操作
const handleLogin = async () => {
  const result = await adminLoginApi(loginForm.value);
  if (result.code) {
    ElMessage.success('登入成功');
    // 儲存當前登入員工的資訊
    localStorage.setItem('loginUser', JSON.stringify(result.data));
    // 跳轉頁面 - 首頁
    router.push('/index');
  } else {
    ElMessage.error(result.msg);
  }


}

const registerDialogVisible = ref(false)
const registerForm = ref({
  username: '',
  password: '',
  email: '',
  code: ''
})

// 點擊「註冊」按鈕時開啟 Dialog
const handleRegisterClick = () => {
  registerDialogVisible.value = true
}

// 送出註冊資料
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.password || !registerForm.value.email || !registerForm.value.code) {
    ElMessage.warning('請填寫完整註冊資料與驗證碼');
    return;
  }
  try {
    // 先確認驗證碼
    const verifyResult = await checkCodeApi(registerForm.value.email, registerForm.value.code);
    if (!verifyResult.code) {
      ElMessage.error(verifyResult.msg || '驗證碼錯誤');
      return;
    }
    // 驗證碼正確，再送出註冊請求
    const registerResult = await registerAdminApi({
      username: registerForm.value.username,
      password: registerForm.value.password,
      email: registerForm.value.email,
    });
    if (registerResult.code) {
      ElMessage.success('註冊成功，請登入');
      registerDialogVisible.value = false;
      registerForm.value = { username: '', password: '', email: '', code: '' };
    } else {
      ElMessage.error(registerResult.msg || '註冊失敗');
    }
  } catch (error) {
    ElMessage.error('註冊發生錯誤');
  }
}

// 發送驗證碼
const sendVerifyCode = async () => {
  if (!registerForm.value.email) {
    ElMessage.warning('請先輸入 Email');
    return;
  }
  try {
    await sendVerifyCodeApi(registerForm.value.email);
    ElMessage.success('驗證碼已發送，請檢查信箱');
  } catch (error) {
    ElMessage.error('發送驗證碼失敗');
  }
}


</script>

<!-- 登入卡片 -->
<template>
  <div class="login-container">
    <el-form class="login-form">
      <div class="title">登入喔喔喔</div>

      <el-form-item label="帳號" class="form-item">
        <el-input v-model="loginForm.username" placeholder="請輸入帳號" />
      </el-form-item>

      <el-form-item label="密碼" class="form-item">
        <el-input v-model="loginForm.password" type="password" placeholder="請輸入密碼" />
      </el-form-item>

      <div class="button-group">
        <el-button type="primary" @click="handleLogin" :loading="loading" class="btn-login">
          登入
        </el-button>
        <el-button type="default" @click="handleRegisterClick" class="btn-reset">
          註冊
        </el-button>
      </div>
    </el-form>
  </div>


  <!-- 註冊 Dialog -->
  <el-dialog v-model="registerDialogVisible" title="註冊新管理員" width="400px">
    <el-form :model="registerForm" label-width="80px">
      <el-form-item label="帳號">
        <el-input v-model="registerForm.username" />
      </el-form-item>
      <el-form-item label="密碼">
        <el-input v-model="registerForm.password" type="password" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="registerForm.email" />
      </el-form-item>
      <el-form-item label="驗證碼">
        <div style="display: flex; gap: 8px;">
          <el-input v-model="registerForm.code" style="flex: 1;" />
          <el-button @click="sendVerifyCode" type="primary">發送驗證碼</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="registerDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleRegister">註冊</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  background: url('@/assets/image/登入背景2.jpg') no-repeat center center;
  background-size: cover;
}

.login-form {
  width: 400px;
  padding: 15px 30px 30px 30px;
  /* 上15px，右30px，下30px，左30px */
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: white;
}


.title {

  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  /* 保持標題和表單間距 */
  color: #333;
  position: relative;
  top: -2px;
}

.login-form {
  margin-top: -10px;
  /* 表單往上移一點 */
}

.form-item {
  margin-bottom: 10px;
  /* 兩個欄位靠近一點 */
}

.button-group {
  display: flex;
  justify-content: flex-start;
  /* 按鈕靠左排列 */
  margin-top: 30px;
  margin-left: 81px;

  gap: 3px;
  /* 按鈕間距 */
}


.btn-login,
.btn-reset {
  border-radius: 4px;
  /* 或 6px */
  width: 120px;
}

.btn-reset {
  background-color: #6c757d;
  /* 深灰色背景 */
  color: white;
  /* 白色文字 */
  border: none;
  /* 取消邊框 */
}

.btn-reset:hover {
  background-color: #5a6268;
  /* 滑鼠移上去深一點的灰 */
  color: white;
}
</style>
