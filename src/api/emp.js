import  request  from "@/utils/request";


// 查詢員工
export const queryPageApi = (name, gender, begin, end, page, pageSize) => {
   return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}


// 新增
export const addApi = (emp) => {
    return request.post('/emps', emp);
} 

// 根據id查詢
export const queryInfoApi = (id) => request.get(`/emps/${id}`);


// 修改
export const updateApi = (emp) => {
    return request.put('/emps', emp);
} 


// 刪除
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`);