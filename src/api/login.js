import  request  from "@/utils/request";

// 登入
export const loginApi = (data) => request.post("/login", data);

// admin login
export const adminLoginApi = (data) => request.post("/admin/login", data);