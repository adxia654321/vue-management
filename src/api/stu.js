import  request  from "@/utils/request";


// 分頁查詢學生
export const queryPageApi = (name, degree, clazzId, page, pageSize) => {
   return request.get(`/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`)
}

// 查詢所有學生
export const queryAllApi = () => {
  return request.get('/students/list');
}

// 新增
export const addApi = (stu) => {
    return request.post('/students', stu);
} 

// 根據id查詢
export const queryInfoApi = (id) => request.get(`/students/${id}`);


// 修改
export const updateApi = (stu) => {
    return request.put('/students', stu);
} 


// 刪除
export const deleteApi = (ids) => request.delete(`/students?ids=${ids}`);