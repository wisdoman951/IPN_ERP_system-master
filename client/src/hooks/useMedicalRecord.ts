import { useState, useEffect } from 'react';
import { 
    getAllMedicalRecords, 
    searchMedicalRecords, 
    deleteMedicalRecord, 
    exportMedicalRecords 
} from '../services/ＭedicalService';

// 定義健康檢查紀錄的常量
export enum HealthRecordIndex {
    ID = 0,
    MEMBER_ID = 1,
    NAME = 2,
    HEIGHT = 3,
    WEIGHT = 4,
    BLOOD_PRESSURE = 5,
    MEDICAL_HISTORY = 6,
    MICRO_SURGERY = 7,
    MICRO_SURGERY_NOTES = 8
}

// 更新類型定義，使用陣列形式
export type MedicalRecordType = any[];

/**
 * 健康檢查紀錄管理相關的自定義 Hook
 */
export const useMedicalRecordManagement = () => {
    const [searchValue, setSearchValue] = useState("");
    const [records, setRecords] = useState<MedicalRecordType[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // 頁面載入時取得所有健康檢查紀錄
    useEffect(() => {
        fetchAllRecords();
    }, []);

    // 獲取所有健康檢查紀錄
    const fetchAllRecords = async () => {
        try {
            const data = await getAllMedicalRecords();
            setRecords(data);
            console.log("獲取到的資料:", data); // 用於調試查看資料結構
        } catch (err) {
            console.error("載入紀錄失敗", err);
        }
    };

    // 處理搜尋
    const handleSearch = async () => {
        try {
            const data = await searchMedicalRecords(searchValue);
            setRecords(data);
        } catch (err) {
            console.error("搜尋失敗", err);
        }
    };

    // 處理checkbox的變更
    const handleCheckboxChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        }
    };

    // 處理刪除
    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert("請先勾選要刪除的資料！");
            return;
        }

        if (!window.confirm("確定要刪除所選的紀錄嗎？")) return;

        try {
            for (const id of selectedIds) {
                await deleteMedicalRecord(id);
            }
            alert("刪除成功！");
            setSelectedIds([]);
            fetchAllRecords();
        } catch (err) {
            console.error("刪除失敗", err);
            alert("刪除過程中發生錯誤");
        }
    };

    // 處理匯出報表
    const handleExport = async () => {
        try {
            await exportMedicalRecords();
        } catch (err) {
            console.error("匯出失敗", err);
            alert("匯出報表失敗！");
        }
    };

    return {
        records,
        searchValue,
        setSearchValue,
        selectedIds,
        handleCheckboxChange,
        handleDelete,
        handleSearch,
        fetchAllRecords,
        handleExport
    };
}; 