import { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DynamicContainer from "../../components/DynamicContainer";
import { createMember } from "../../services/MemberService";
import { calculateAge } from "../../utils/memberUtils";
import axios from "axios";
import "./printStyles.css";  // 導入列印樣式表

const AddMember = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        birthday: "",
        address: "",
        phone: "",
        gender: "",
        bloodType: "",
        lineId: "",
        preferredTherapist: "",
        occupation: "",
        allergyNotes: "",
        specialRequests: "",
    });
    
    // 新增年齡狀態
    const [age, setAge] = useState("");

    // 當生日變更時，計算年齡
    useEffect(() => {
        if (form.birthday) {
            setAge(calculateAge(form.birthday));
        } else {
            setAge("");
        }
    }, [form.birthday]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        console.log("按下確認按鈕，準備提交表單", form);
        
        try {
            console.log("準備調用 createMember 函數");
            const result = await createMember({
                name: form.name,
                birthday: form.birthday,
                address: form.address,
                phone: form.phone,
                gender: form.gender,
                bloodType: form.bloodType,
                lineId: form.lineId,
                referral: form.preferredTherapist,
                occupation: form.occupation,
                note: form.specialRequests
            });
            
            console.log("createMember 函數返回結果:", result);
            alert("新增成功！");
            navigate("/member-info");
        } catch (error) {
            console.error("新增失敗詳情：", error);
            
            // 更詳細的錯誤信息
            if (axios.isAxiosError(error)) {
                console.error("請求配置:", error.config);
                console.error("響應狀態:", error.response?.status);
                console.error("響應數據:", error.response?.data);
                console.error("響應頭:", error.response?.headers);
                
                const errorMsg = error.response?.data?.error || error.message;
                alert(`新增會員時發生錯誤！${errorMsg}`);
            } else {
                alert("新增會員時發生未知錯誤！");
            }
        }
    };
    
    // 新增列印函數
    const handlePrint = () => {
        // 創建一個新的打印窗口
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('請允許打開彈出窗口以列印');
            return;
        }
        
        // 添加基本的HTML結構和樣式
        printWindow.document.write(`
            <html>
            <head>
                <title>會員基本資料表</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .form-row {
                        display: flex;
                        flex-wrap: wrap;
                        margin-bottom: 15px;
                    }
                    .form-group {
                        width: 50%;
                        padding: 0 10px;
                        box-sizing: border-box;
                        margin-bottom: 15px;
                    }
                    .form-label {
                        font-weight: bold;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .form-value {
                        border: 1px solid #ccc;
                        padding: 8px;
                        width: 100%;
                        box-sizing: border-box;
                    }
                </style>
            </head>
            <body>
                <h1>會員基本資料表</h1>
                <div class="form-container">
                    <div class="form-row">
                        <div class="form-group">
                            <div class="form-label">姓名</div>
                            <div class="form-value">${form.name || '&nbsp;'}</div>
                        </div>
                        <div class="form-group">
                            <div class="form-label">生日</div>
                            <div class="form-value">${form.birthday || '&nbsp;'}</div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <div class="form-label">年齡</div>
                            <div class="form-value">${age ? `${age}歲` : '&nbsp;'}</div>
                        </div>
                        <div class="form-group">
                            <div class="form-label">電話</div>
                            <div class="form-value">${form.phone || '&nbsp;'}</div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <div class="form-label">住址</div>
                            <div class="form-value">${form.address || '&nbsp;'}</div>
                        </div>
                        <div class="form-group">
                            <div class="form-label">性別</div>
                            <div class="form-value">${
                                form.gender === 'Male' ? '男' : 
                                form.gender === 'Female' ? '女' : 
                                form.gender === 'Other' ? '不想透露' : '&nbsp;'
                            }</div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <div class="form-label">血型</div>
                            <div class="form-value">${form.bloodType || '&nbsp;'}</div>
                        </div>
                        <div class="form-group">
                            <div class="form-label">Line ID</div>
                            <div class="form-value">${form.lineId || '&nbsp;'}</div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <div class="form-label">介紹人</div>
                            <div class="form-value">${form.preferredTherapist || '&nbsp;'}</div>
                        </div>
                        <div class="form-group">
                            <div class="form-label">備註</div>
                            <div class="form-value">${form.specialRequests || '&nbsp;'}</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        // 關閉文檔流
        printWindow.document.close();
        
        // 等待資源加載完成後打印
        printWindow.onload = function() {
            printWindow.focus(); // 確保焦點在打印窗口
            printWindow.print(); // 調用打印功能
            
            // 打印完成後關閉窗口（可選）
            // printWindow.close();
        };
    };

    // 定義表單內容
    const content = (
        <Form className="w-100">
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>姓名</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>生日</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthday"
                            value={form.birthday}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>年齡</Form.Label>
                        <Form.Control
                            type="text"
                            value={age ? `${age}歲` : ""}
                            readOnly
                            disabled
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>性別</Form.Label>
                        <Form.Select
                            name="gender"
                            value={form.gender}
                            onChange={handleSelectChange}
                        >
                            <option value="">請選擇</option>
                            <option value="Male">男</option>
                            <option value="Female">女</option>
                            <option value="Other">不想透露</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>血型</Form.Label>
                        <Form.Select
                            name="bloodType"
                            value={form.bloodType}
                            onChange={handleSelectChange}
                        >
                            <option value="">請選擇</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>電話</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Line ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="lineId"
                            value={form.lineId}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>介紹人</Form.Label>
                        <Form.Control
                            type="text"
                            name="preferredTherapist"
                            value={form.preferredTherapist}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>住址</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>備註</Form.Label>
                        <Form.Control
                            type="text"
                            name="specialRequests"
                            value={form.specialRequests}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <div className="d-flex gap-3 mt-4">
                <Button variant="info" className="text-white" onClick={handleSubmit}>
                    確認
                </Button>
                <Button variant="secondary" onClick={() => navigate("/member-info")}>
                    取消
                </Button>
                <Button variant="outline-info" onClick={handlePrint}>
                    列印
                </Button>
            </div>
        </Form>
    );

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* 使用標準Header組件 */}
            <Header title="新增會員基本資料 1.1.1.1.1" />
            
            {/* 使用DynamicContainer組件 */}
            <DynamicContainer 
                content={content} 
                className="p-4 align-items-start" 
            />
        </div>
    );
};

export default AddMember;
