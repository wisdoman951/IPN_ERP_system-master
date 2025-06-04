import axios from "axios";
import { base_url } from "./BASE_URL";

const API_URL = `${base_url}/api/medical-record`;

// 獲取所有健康檢查記錄
export const getAllMedicalRecords = async () => {
  const response = await axios.get(`${API_URL}/list`);
  return response.data;
};

// 搜尋健康檢查記錄
export const searchMedicalRecords = async (keyword: string) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { keyword }
  });
  return response.data;
};

// 新增健康檢查記錄
export const createMedicalRecord = async (data: {
  memberId: string;
  height: string;
  weight: string;
  bloodPressure: string;
  remark: string;
  symptom: string;
  familyHistory: string;
  restrictedGroup: string;
}) => {
  return axios.post(`${API_URL}/create`, data);
};

// 刪除健康檢查記錄
export const deleteMedicalRecord = async (recordId: number) => {
  return axios.delete(`${API_URL}/${recordId}`);
};

// 匯出健康檢查記錄
export const exportMedicalRecords = async () => {
  const response = await axios.get(`${API_URL}/export`, {
    responseType: "blob"
  });
  return response.data;
}; 