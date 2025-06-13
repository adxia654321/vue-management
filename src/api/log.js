import  request  from "@/utils/request";


// 查詢log
export const queryLogApi = () => {
   return request.get('/operateLog')
}
