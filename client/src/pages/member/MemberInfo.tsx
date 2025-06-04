import React from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DynamicContainer from "../../components/DynamicContainer";
import ScrollableTable from "../../components/ScrollableTable";
// MemberInfo.tsx
import { formatGregorianBirthday, formatGender, calculateAge } from "../../utils/memberUtils";
import { useMemberManagement } from "../../hooks/useMemberManagement";
import "./memberInfo.css";

const MemberInfo: React.FC = () => {
    const navigate = useNavigate();
    const { 
        members, 
        keyword, 
        setKeyword, 
        selectedMemberIds, 
        handleCheckboxChange, 
        handleDelete, 
        handleSearch, 
        handleExport 
    } = useMemberManagement();
    
    // 定義表格標頭
    const tableHeader = (
        <tr>
            <th>勾選</th>
            <th>姓名</th>
            <th>編號</th>
            <th>生日</th>
            <th>年齡</th>
            <th>住址</th>
            <th>電話</th>
            <th>性別</th>
            <th>血型</th>
            <th>Line ID</th>
            <th>介紹人</th>
            <th>備註</th>
        </tr>
    );
    
    // 定義表格內容
    const tableBody = (
        members.length > 0 ? (
            members.map((member) => (
                <tr key={member.Member_ID}>
                    <td>
                        <Form.Check 
                            type="checkbox" 
                            checked={selectedMemberIds.includes(member.Member_ID)} 
                            onChange={(e) => handleCheckboxChange(member.Member_ID, e.target.checked)}
                        />
                    </td>
                    <td>{member.Name}</td>
                    <td>{String(member.Member_ID).padStart(4, '0')}</td>
                    {/* 使用 formatGregorianBirthday，並可以指定 'YYYY/MM/DD' 或 'YYYYMMDD' 格式 */}
                    <td>{formatGregorianBirthday(member.Birth, 'YYYY/MM/DD')}</td>
                    <td>{calculateAge(member.Birth)}</td> {/* 年齡 */}
                    <td>{member.Address}</td>
                    <td>{member.Phone}</td>
                    <td>{formatGender(member.Gender)}</td> {/* 性別 */}
                    <td>{member.BloodType}</td>
                    <td>{member.LineID}</td>
                    <td>{member.Referrer}</td>
                    <td>{member.Note}</td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={12} className="text-center text-muted py-5"> {/* 確保 colSpan 是 12 */}
                    尚無資料
                </td>
            </tr>
        )
    );
    
    // 定義頁面內容
    const content = (
        <div className="w-100">
            {/* 搜索區域 */}
            <div className="search-area mb-4">
                <Row className="align-items-center">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <Form.Control
                            type="text"
                            placeholder="姓名/電話/編號"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Col>
                    <Col
                        xs={12}
                        md={6}
                        className="d-flex justify-content-end gap-3"
                    >
                        <Button
                            variant="info"
                            className="text-white px-4"
                            onClick={handleSearch}
                        >
                            搜尋
                        </Button>
                        <Button
                            onClick={() => navigate("/add-member")}
                            variant="info"
                            className="text-white px-4"
                        >
                            新增
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* 使用可滾動表格組件 */}
            <ScrollableTable
                tableHeader={tableHeader}
                tableBody={tableBody}
            />

            {/* 底部按鈕區域 */}
            <div className="button-area mt-4">
                <Row className="justify-content-end g-3">
                    <Col xs="auto">
                        <Button variant="info" className="text-white px-4" onClick={handleExport}>
                            報表匯出
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button variant="info" className="text-white px-4" onClick={handleDelete}>
                            刪除
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button variant="info" className="text-white px-4">
                            修改
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button variant="info" className="text-white px-4">
                            確認
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
    
    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* Header */}
            <Header title="會員基本資料 1.1.1.1" />
            
            {/* 使用 DynamicContainer */}
            <DynamicContainer content={content} className="align-items-start" />
        </div>
    );
};

export default MemberInfo;
