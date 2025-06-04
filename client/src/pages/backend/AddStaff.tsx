import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import IconButton from "../../components/IconButton";

const AddStaff: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        // Step 1
        fillDate: "", onboardDate: "", name: "", gender: "", birthday: "",
        nationality: "", education: "", maritalStatus: "",
        applyPosition: "", positionLevel: "",
        phone: "", idNumber: "", address1: "", contactPhone1: "",
        address2: "", contactPhone2: "",

        // Step 2
        familyName: "", familyRelation: "", familyAge: "", familyJobUnit: "", familyJob: "", familyPhone: "",
        emergencyName: "", emergencyRelation: "", emergencyAge: "", emergencyPhone: "", emergencyJobUnit: "", emergencyJob: "", emergencyJobPhone: "",
        graduationDegree: "", graduationSchool: "", major: "", graduationDate: "",

        // Step 3
        workPeriod: "", companyName: "", deptJob: "", supervisor: "", workPhone: "", salary: "",
        hasOtherJob: "", otherJobUnit: "",
        probationSalary: "", probationPeriod: "", probationTime: "", probationRemark: "",
        officialDate: "", officialRemark: "",
        licenseApprovedDate: "", licenseNotApprovedDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const renderStep1 = () => (
        <>
            <Row>
                <Col md={6}><Form.Group><Form.Label>填表日期</Form.Label><Form.Control name="fillDate" value={formData.fillDate} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>入職日期</Form.Label><Form.Control name="onboardDate" value={formData.onboardDate} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={4}><Form.Group><Form.Label>姓名</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>性別</Form.Label><Form.Control name="gender" value={formData.gender} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>出生年月日</Form.Label><Form.Control name="birthday" value={formData.birthday} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={4}><Form.Group><Form.Label>國籍</Form.Label><Form.Control name="nationality" value={formData.nationality} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>學歷</Form.Label><Form.Control name="education" value={formData.education} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>婚否</Form.Label><Form.Control name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={6}><Form.Group><Form.Label>應聘職位</Form.Label><Form.Control name="applyPosition" value={formData.applyPosition} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>入職職位</Form.Label><Form.Control name="positionLevel" value={formData.positionLevel} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={6}><Form.Group><Form.Label>手機號碼</Form.Label><Form.Control name="phone" value={formData.phone} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>身份證字號</Form.Label><Form.Control name="idNumber" value={formData.idNumber} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={6}><Form.Group><Form.Label>戶籍地</Form.Label><Form.Control name="address1" value={formData.address1} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>連絡電話</Form.Label><Form.Control name="contactPhone1" value={formData.contactPhone1} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={6}><Form.Group><Form.Label>通訊地</Form.Label><Form.Control name="address2" value={formData.address2} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>連絡電話</Form.Label><Form.Control name="contactPhone2" value={formData.contactPhone2} onChange={handleChange} /></Form.Group></Col>
            </Row>
        </>
    );

    const renderStep2 = () => (
        <>
            <h5 className="fw-bold mt-4">家庭狀況</h5>
            <Row>
                <Col md={3}><Form.Group><Form.Label>姓名</Form.Label><Form.Control name="familyName" value={formData.familyName} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>關係</Form.Label><Form.Control name="familyRelation" value={formData.familyRelation} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>年齡</Form.Label><Form.Control name="familyAge" value={formData.familyAge} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>工作單位</Form.Label><Form.Control name="familyJobUnit" value={formData.familyJobUnit} onChange={handleChange} /></Form.Group></Col>
            </Row>
            {/* 其他家庭、緊急聯絡人欄位略，同樣邏輯... */}
            <h5 className="fw-bold mt-4">畢業學校</h5>
            <Row>
                <Col md={3}><Form.Group><Form.Label>學籍</Form.Label><Form.Control name="graduationDegree" value={formData.graduationDegree} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>學校</Form.Label><Form.Control name="graduationSchool" value={formData.graduationSchool} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>專業科目</Form.Label><Form.Control name="major" value={formData.major} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>畢業日期</Form.Label><Form.Control name="graduationDate" value={formData.graduationDate} onChange={handleChange} /></Form.Group></Col>
            </Row>
        </>
    );

    const renderStep3 = () => (
        <>
            <h5 className="fw-bold mt-4">工作經驗</h5>
            <Row>
                <Col md={4}><Form.Group><Form.Label>工作總時間</Form.Label><Form.Control name="workPeriod" value={formData.workPeriod} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>公司名稱</Form.Label><Form.Control name="companyName" value={formData.companyName} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>主管名稱</Form.Label><Form.Control name="supervisor" value={formData.supervisor} onChange={handleChange} /></Form.Group></Col>
            </Row>
            {/* 可依需要加入 "是否有其他工作" checkbox 群組 */}
            <h5 className="fw-bold mt-4">以下內容由公司填寫</h5>
            <Row>
                <Col md={3}><Form.Group><Form.Label>試用期</Form.Label><Form.Control name="probationPeriod" value={formData.probationPeriod} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>時間</Form.Label><Form.Control name="probationTime" value={formData.probationTime} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>薪資</Form.Label><Form.Control name="probationSalary" value={formData.probationSalary} onChange={handleChange} /></Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>備註</Form.Label><Form.Control name="probationRemark" value={formData.probationRemark} onChange={handleChange} /></Form.Group></Col>
            </Row>
            {/* 批准資格等欄位依照同樣方式擴充 */}
        </>
    );

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            <header className="d-flex justify-content-between align-items-center bg-info px-4 py-3 app-header">
                <h1 className="text-white fw-bold fs-4 m-0">分店後台管理 - 新增入職簡歷 (1.1.5.1.1)</h1>
                <div className="d-flex gap-3">
                    <IconButton.HomeButton onClick={() => navigate("/")} />
                    <IconButton.CloseButton onClick={() => navigate(-1)} />
                </div>
            </header>
            <Container className="my-4">
                <Col xs={9} className="ms-auto">
                
                <Form>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="info">刪除</Button>
                        <Button variant="info">修改</Button>
                        {currentStep < 3 ? (
                            <Button variant="info" onClick={nextStep}>下一頁</Button>
                        ) : (
                            <Button variant="info">儲存</Button>
                        )}
                    </div>
                </Form>
                </Col>
            </Container>
        </div>
    );
};

export default AddStaff;
