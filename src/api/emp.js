import { request } from "@/utils/request";


// 查詢員工
export const queryPageApi = (name, gender, begin, end, page, pageSize) => {
    request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}


// 新增



// 根據id查詢


// 修改


// 刪除