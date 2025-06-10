<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/login';
import { useRouter } from 'vue-router';

const loginForm = ref({username:'', password:''})


const router = useRouter();

// 登入操作
const handleLogin = async () => {
  
  const result = await loginApi(loginForm.value);
  if(result.code){
    ElMessage.success('登入成功');

    // 跳轉頁面 - 首頁
    router.push('/index');
  }else{
    ElMessage.error(result.msg);
  }
  

}

// 重製
const handleReset = () => {
  loginForm.value = {username:'', password:''};
}
</script>

<template>
  <div class="login-container">
    <el-form class="login-card">
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
          <el-button type="default" @click="handleReset" class="btn-reset">
            重置
          </el-button>
        </div>
      </el-form>

  </div>
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

.login-card {
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
  margin-left: 60px;
  /* 整組往右移40px */
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
