import  request  from "@/utils/request";

// 查詢員工職位統計數據
export const queryJobApi = () => {
    return request.get('/report/empJobData');
}

// 查詢員工性別統計數據
export const queryGenderApi = () => {
    return request.get('/report/empGenderData');
}

// 查詢學生學歷統計數據
export const queryDegreeApi = () => {
    return request.get('/report/studentDegreeData');
}

// 查詢班級人數統計數據
export const queryStuCountApi = () => {
    return request.get('/report/studentCountData');
}

