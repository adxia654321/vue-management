import request from "../utils/request";


// 查詢全部部門
export const queryAllApi = () => {
    return request.get('/depts');
} 


// 新增

export const addApi = (dept) => {
    return request.post('/depts', dept);
} 


// 修改




// 刪除


