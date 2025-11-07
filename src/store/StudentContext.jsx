import React, { createContext, useState, useEffect, useContext } from 'react';
import mockData from '../mock/data';

// 创建Context
const StudentContext = createContext();

// 导出Provider组件
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  // 初始化学生数据
  useEffect(() => {
    fetchStudents();
  }, []);

  // 获取学生数据
  const fetchStudents = () => {
    setStudents(mockData.students);
  };

  // 添加学生
  const addStudent = (student) => {
    const newStudent = { ...student, id: Date.now() };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  // 更新学生
  const updateStudent = (student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    return student;
  };

  // 删除学生
  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    return id;
  };

  // 获取所有学生
  const getAllStudents = () => students;

  // 获取学生数量
  const getStudentCount = () => students.length;

  // 提供Context值
  const contextValue = {
    students,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getAllStudents,
    getStudentCount
  };

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

// 自定义Hook，用于组件中访问Context
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};