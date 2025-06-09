import request from "../utils/request";

// 查詢全部班級
export const queryAllApi = () => {
    return request.get('/clazzs/list');
} 

// 新增
export const addApi = (clazz) => {
    return request.post('/clazzs', clazz);
} 

// 根據id查詢
export const queryByIdApi = (id) => {
    return request.get(`/clazzs/${id}`);
} 

// 修改
export const updateApi = (clazz) => {
    return request.put('/clazzs', clazz);
} 


// 刪除
export const deleteByIdApi = (id) => {
    return request.delete(`/clazzs/${id}`);
} 
