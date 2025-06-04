// src/hooks/useMedicalRecordForm.ts
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MedicalFormType,
    MemberData,
    MedicalRecordSubmitData,
    SelectedHealthStatusData, // 用於解析健康狀態
    SymptomData,            // 用於解析平時症狀
    FamilyHistoryData       // 用於解析家族病史 (雖然不適用對象通常不檢查這個)
} from "../types/medicalTypes";
import { checkMemberExists, createMedicalRecord } from "../services/ＭedicalService";
import { contraindicatedKeywords } from "../utils/symptomUtils"; // 匯入關鍵字

export const useMedicalRecordForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [memberData, setMemberData] = useState<MemberData | null>(null);
    const [isContraindicated, setIsContraindicated] = useState(false); // <--- 新增狀態

    const initialFormState: MedicalFormType = {
        memberId: "",
        name: "",
        height: "",
        weight: "",
        bloodPressure: "",
        remark: "",
        cosmeticSurgery: "",
        cosmeticDesc: "",
        symptom: undefined,
        familyHistory: undefined,
        healthStatus: undefined,
        symptomSummary: "",
        familySummary: "",
        healthStatusSummary: ""
    };

    const [form, setForm] = useState<MedicalFormType>(initialFormState);

    useEffect(() => {
        const savedData = localStorage.getItem('medicalRecordData');
        let currentFormData = { ...initialFormState };

        if (savedData) {
            try {
                const parsedData: MedicalFormType = JSON.parse(savedData);
                // 合併時，確保 initialFormState 的結構優先，避免 parsedData 中有舊的/不再使用的欄位污染
                currentFormData = {
                    ...initialFormState, // 使用最新的欄位結構
                    ...parsedData,       // 用 localStorage 的值覆蓋
                     // 確保摘要欄位也被正確載入
                    symptomSummary: parsedData.symptomSummary || "",
                    familySummary: parsedData.familySummary || "",
                    healthStatusSummary: parsedData.healthStatusSummary || "",
                };

            } catch (e) {
                console.error("解析 medicalRecordData 失敗", e);
            }
        }
        
        setForm(currentFormData);

        // 清除 location.state 中的標記，如果有的話
        // 因為現在都從 medicalRecordData 讀取，特定頁面標記可能不再那麼重要
        if (location.state?.fromSymptomsPage || location.state?.fromHealthStatusPage) {
            navigate(location.pathname, { replace: true, state: {} });
        }

    }, [location.state, navigate]); // 依賴 location.state 確保從其他頁面返回時能觸發 (雖然現在主要依賴 medicalRecordData)
    
    // 新增 useEffect 來檢查不適用對象
    useEffect(() => {
        let found = false;
        const lowerCaseKeywords = contraindicatedKeywords.map(k => k.toLowerCase());

        const checkText = (text: string | undefined): boolean => {
            if (!text) return false;
            const lowerText = text.toLowerCase();
            return lowerCaseKeywords.some(keyword => lowerText.includes(keyword));
        };

        const checkArray = (arr: string[] | undefined): boolean => {
            if (!arr || arr.length === 0) return false;
            return arr.some(item => checkText(item));
        };

        // 1. 檢查健康狀態 (form.healthStatus 是 JSON string of SelectedHealthStatusData)
        if (form.healthStatus) {
            try {
                const healthData: SelectedHealthStatusData = JSON.parse(form.healthStatus);
                if (checkArray(healthData.selectedStates) || checkText(healthData.otherText)) {
                    found = true;
                }
            } catch (e) { console.error("Error parsing healthStatus for contraindication: ", e); }
        }

        // 2. 檢查平時症狀 (form.symptom 是 JSON string of SymptomData)
        if (!found && form.symptom) {
            try {
                const symptomData: SymptomData = JSON.parse(form.symptom);
                const allSymptomTexts: string[] = [];
                if (symptomData.HPA) allSymptomTexts.push(...symptomData.HPA);
                if (symptomData.meridian) allSymptomTexts.push(...symptomData.meridian);
                if (symptomData.neckAndShoulder) allSymptomTexts.push(...symptomData.neckAndShoulder);
                if (symptomData.anus) allSymptomTexts.push(...symptomData.anus);
                
                if (checkArray(allSymptomTexts) || checkText(symptomData.symptomOthers)) {
                    found = true;
                }
            } catch (e) { console.error("Error parsing symptom for contraindication: ", e); }
        }
        
        // 3. 檢查家族病史 (通常不適用，但如果需要可以加入)
        // if (!found && form.familyHistory) {
        // try {
        // const familyData: FamilyHistoryData = JSON.parse(form.familyHistory);
        // if (checkArray(familyData.familyHistory) || checkText(familyData.familyHistoryOthers)) {
        // found = true;
        // }
        // } catch (e) { console.error("Error parsing familyHistory for contraindication: ", e); }
        // }

        setIsContraindicated(found);
    }, [form.healthStatus, form.symptom, form.familyHistory]); // 當這些相關的 JSON 字串變化時重新檢查


    const handleMemberChange = (memberId: string, name: string, memberDataResult: MemberData | null) => {
        setForm(prev => ({ ...prev, memberId, name }));
        setMemberData(memberDataResult);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };
    const preNavigationCheck = async () => {
        if (!form.memberId || !form.name || !form.height || !form.weight || !form.cosmeticSurgery) {
            setValidated(true); 
            setError("請先填寫完整的必要基本資料（會員、身高、體重、微整型）。");
            return false;
        }
        if (form.cosmeticSurgery === "Yes" && !form.cosmeticDesc) {
            setValidated(true);
            setError("請填寫微整型說明。");
            return false;
        }
        try {
            const memberExists = await checkMemberExists(form.memberId);
            if (!memberExists) {
                setError(`會員編號 ${form.memberId} 不存在，請先建立會員資料或確認編號是否正確。`);
                return false;
            }
            setError(""); 
            return true;
        } catch (err) {
            console.error("檢查會員存在失敗", err);
            setError("檢查會員資料時發生錯誤，請稍後再試。");
            return false;
        }
    };
    const handleOpenSelectionsPage = async () => {
        if (!await preNavigationCheck()) return;
        try {
            localStorage.setItem('medicalRecordData', JSON.stringify(form));
            navigate("/medical-record/symptoms-and-history");
        } catch (e) {
            console.error("儲存 medicalRecordData 到 localStorage 失敗:", e);
            setError("系統暫存資料時發生錯誤，請稍後再試。");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formElement = e.currentTarget as HTMLFormElement;
        
        if (formElement.checkValidity() === false || !form.symptomSummary || !form.familySummary || !form.healthStatusSummary) {
            e.stopPropagation();
            setValidated(true);
            if (!form.symptomSummary) setError("請先填寫平時症狀。");
            else if (!form.familySummary) setError("請先填寫家族病史。");
            else if (!form.healthStatusSummary) setError("請先選擇健康狀態。");
            return;
        }

        // 可以在這裡再次檢查 isContraindicated，如果為 true，可以彈出一個確認框
        if (isContraindicated) {
            if (!window.confirm("注意：此對象已被標記為不適用對象，您確定要提交嗎？")) {
                setSubmitLoading(false); // 如果使用者取消，重置 submitLoading
                return;
            }
        }

        setSubmitLoading(true);
        setError("");
        
        try {
            const dataToSubmit: MedicalRecordSubmitData & { symptomData?: string; healthStatusData?: string; cosmeticSurgeryDesc?: string } = {
                memberId: form.memberId,
                height: form.height,
                weight: form.weight,
                bloodPressure: form.bloodPressure,
                remark: form.remark,
                symptom: form.cosmeticSurgery === "Yes" ? 1 : 0,
                familyHistory: form.familyHistory || "",
                symptomData: form.symptom || "",
                healthStatusData: form.healthStatus || "",
                cosmeticSurgeryDesc: form.cosmeticDesc || ""
            };
            
            await createMedicalRecord(dataToSubmit);
            localStorage.removeItem('medicalRecordData');
            alert("健康檢查紀錄新增成功");
            navigate("/medical-record");
        } catch (err: any) {
            console.error("提交紀錄失敗", err);
            setError(err.response?.data?.error || "提交紀錄時發生錯誤。");
        } finally {
            setSubmitLoading(false);
        }
    };

    return {
        form,
        error,
        validated,
        submitLoading,
        memberData,
        isContraindicated, // <--- 導出 isContraindicated
        setError,
        setForm,
        handleMemberChange,
        handleChange,
        handleSelectChange,
        handleOpenSelectionsPage,
        handleSubmit
    };
};