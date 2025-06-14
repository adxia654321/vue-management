import  request  from "@/utils/request";

// 查詢所有admin
export const queryAllAdminApi = () => {
    return request.get('/admin');
} 