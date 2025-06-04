import axios from "axios";
import { base_url } from "./BASE_URL";

const API_URL = `${base_url}/api/medical-record`;

// 取得所有健康檢查紀錄
export const getAllMedicalRecords = async () => {
    const res = await axios.get(`${API_URL}/list`);
    return res.data;
};

// 搜尋健康檢查紀錄
export const searchMedicalRecords = async (keyword: string) => {
    const res = await axios.get(`${API_URL}/search`, {
        params: { keyword }
    });
    return res.data;
};

// 刪除單筆紀錄
export const deleteMedicalRecord = async (id: number) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

// 新增健康檢查紀錄
export const createMedicalRecord = async (data: any) => {
    try {
        const res = await axios.post(`${API_URL}/create`, data);
        return res.data;
    } catch (error: any) {
        // 重新拋出錯誤，讓組件可以處理
        throw error;
    }
};

// 匯出 Excel
export const exportMedicalRecords = async () => {
    const res = await axios.get(`${API_URL}/export`, {
        responseType: "blob",
    });

    const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "健康檢查紀錄.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// 檢查會員是否存在
export const checkMemberExists = async (memberId: string) => {
  try {
    const res = await axios.get(`${base_url}/api/member/check/${memberId}`);
    return res.data.exists;
  } catch (error) {
    console.error("檢查會員存在失敗", error);
    return false;
  }
};

// 根據ID取得會員資料
export const getMemberById = async (memberId: string) => {
  try {
    const res = await axios.get(`${base_url}/api/member/${memberId}`);
    return res.data;
  } catch (error) {
    console.error("獲取會員資料失敗", error);
    throw error;
  }
};
