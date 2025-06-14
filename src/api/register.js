import  request  from "@/utils/request";

// 發送 Email 驗證碼
export const sendVerifyCodeApi = (email) => {
  return request.post(`/email/send?email=${encodeURIComponent(email)}`)
}

// 提交註冊資訊
export const registerAdminApi = (data) => {
  return request.post('/admin/register', data)
}

// 驗證碼確認
export const checkCodeApi = (email, code) => {
  return request.post(`/email/check?email=${email}&code=${code}`)
}