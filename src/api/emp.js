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


// 修改


// 刪除