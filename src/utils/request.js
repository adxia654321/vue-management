import axios from 'axios';


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
        return Promise.reject(error)
    }
)


export default request


