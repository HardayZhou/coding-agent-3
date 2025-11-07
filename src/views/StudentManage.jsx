import React, { useState, useEffect } from 'react';
import { useStudentContext } from '../store/StudentContext';

const StudentManage = () => {
  const { students, fetchStudents, addStudent, updateStudent, deleteStudent } = useStudentContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    name: '',
    age: '',
    gender: '',
    subject: '',
    score: '',
    hobby: []
  });
  const hobbies = ['看书', '画画', '音乐', '运动', '编程', '游戏', '旅游'];

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEditStudent = (student) => {
    setShowEditModal(true);
    setFormData(student);
  };

  const handleDeleteStudent = (id) => {
    if (confirm('确定要删除该学生吗？')) {
      deleteStudent(id);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (showEditModal) {
      updateStudent(formData);
    } else {
      addStudent(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setFormData({
      class: '',
      name: '',
      age: '',
      gender: '',
      subject: '',
      score: '',
      hobby: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const hobby = checked 
          ? [...prev.hobby, value]
          : prev.hobby.filter(item => item !== value);
        return { ...prev, [name]: hobby };
      });
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="student-manage">
      <div className="container">
        <h2>学生信息管理</h2>
        <div className="action-bar">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            添加学生
          </button>
        </div>
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>班级</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>性别</th>
                <th>学科</th>
                <th>成绩</th>
                <th>爱好</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.class}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.gender}</td>
                  <td>{student.subject}</td>
                  <td>{student.score}</td>
                  <td>{student.hobby.join(', ')}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleEditStudent(student)}>
                      编辑
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDeleteStudent(student.id)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑模态框 */}
      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>{showEditModal ? '编辑学生' : '添加学生'}</h3>
            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label>班级:</label>
                <input
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  type="text"
                  required
                />
              </div>
              <div className="form-group">
                <label>姓名:</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  required
                />
              </div>
              <div className="form-group">
                <label>年龄:</label>
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  type="number"
                  min="6"
                  max="12"
                  required
                />
              </div>
              <div className="form-group">
                <label>性别:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div className="form-group">
                <label>学科:</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">请选择</option>
                  <option value="语文">语文</option>
                  <option value="数学">数学</option>
                  <option value="英语">英语</option>
                  <option value="科学">科学</option>
                  <option value="音乐">音乐</option>
                  <option value="美术">美术</option>
                  <option value="体育">体育</option>
                </select>
              </div>
              <div className="form-group">
                <label>成绩:</label>
                <input
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="form-group">
                <label>爱好:</label>
                <div className="checkbox-group">
                  {hobbies.map(hobby => (
                    <label key={hobby}>
                      <input
                        type="checkbox"
                        name="hobby"
                        value={hobby}
                        checked={formData.hobby.includes(hobby)}
                        onChange={handleInputChange}
                      />
                      {hobby}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={closeModal}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .student-manage {
          padding: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .action-bar {
          margin-bottom: 20px;
          text-align: right;
        }

        .table-container {
          overflow-x: auto;
        }

        .student-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          background-color: white;
        }

        .student-table th,
        .student-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .student-table th {
          background-color: #f5f7fa;
          font-weight: 600;
          color: #333;
        }

        .student-table tr:hover {
          background-color: #f5f7fa;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background-color: #409EFF;
          color: white;
        }

        .btn-primary:hover {
          background-color: #66b1ff;
        }

        .btn-edit {
          background-color: #67C23A;
          color: white;
          margin-right: 8px;
        }

        .btn-edit:hover {
          background-color: #85ce61;
        }

        .btn-delete {
          background-color: #F56C6C;
          color: white;
        }

        .btn-delete:hover {
          background-color: #f78989;
        }

        .btn-cancel {
          background-color: #909399;
          color: white;
          margin-right: 8px;
        }

        .btn-cancel:hover {
          background-color: #a6a9ad;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          position: relative;
        }

        .close {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 24px;
          cursor: pointer;
          color: #909399;
        }

        .close:hover {
          color: #333;
        }

        h3 {
          margin-bottom: 20px;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #409EFF;
        }

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: normal;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};

export default StudentManage;