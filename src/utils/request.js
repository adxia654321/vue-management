import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'
import  router  from "../router";

const request = axios.create({
    baseURL: '/api',
    timeout: 600000
})

// axios的請求 request 攔截器 - 獲取localStorage中的token
request.interceptors.request.use( 
    (config) => {
        const loginUser = JSON.parse(localStorage.getItem('loginUser'))
        if(loginUser && loginUser.token){
            config.headers.token = loginUser.token
        }
        return config
    },
    (error) => {   //失敗
        return Promise.reject(error)
    }
)


// axios的回應 response 攔截器
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if(error.response.status === 401){  // 沒登入 沒token的話    ===是全等 先比較類型 在比較值
            // 提示訊息
            ElMessage.error('登入超時, 請重新登入');
            // 跳轉到登入頁面
            router.push('/login');         
        }else{
            ElMessage.error('後端Api訪問異常');
        }
        return Promise.reject(error)
    }
)


export default request


