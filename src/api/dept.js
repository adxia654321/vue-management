import request from "../utils/request";


// 查詢全部部門
export const queryAllApi = () => {
    return request.get('/depts');
} 

// 新增
export const addApi = (dept) => {
    return request.post('/depts', dept);
} 

// 根據id查詢
export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`);
} 

// 修改
export const updateApi = (dept) => {
    return request.put('/depts', dept);
} 

// 刪除
export const deleteByIdApi = (id) => {
    return request.delete(`/depts/${id}`);
} 


