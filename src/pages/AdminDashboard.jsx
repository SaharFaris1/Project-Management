import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AdminChart from '../components/AdminChart';

function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [searchName, setSearchName] = useState('');

  const STU_API = 'https://68498f2f45f4c0f5ee71fed6.mockapi.io/StuLogin';  
  const IDEA_API = 'https://68498f2f45f4c0f5ee71fed6.mockapi.io/ideas';  
  const TEACHER_API = 'https://68459cbcfc51878754dbc94d.mockapi.io/TeacherLogin';  


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsRes = await axios.get(STU_API);
      const teachersRes = await axios.get(TEACHER_API);
      const ideasRes = await axios.get(IDEA_API);

      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setIdeas(ideasRes.data);
    } catch (err) {
      console.error("ِError", err);
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  // ---Add stu ---
  const handleAddStudent = async () => {
    const { value: formValues } = await Swal.fire({
      title: '  New Student',
      html:
        `<input id="studentName" class="swal2-input" placeholder="Full Name">` +
        `<input id="studentEmail" class="swal2-input" placeholder="Email">` +
        `<input type="password" id="studentPassword" class="swal2-input" placeholder="Password">` ,
        
      focusConfirm: false,
      preConfirm: () => {
        return {
          fullName: document.getElementById('studentName').value,
          email: document.getElementById('studentEmail').value,
          password: document.getElementById('studentPassword').value,
          teacherId: document.getElementById('teacherId')?.value || ''
        };
      },
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Add'
    });

    if (formValues && formValues.fullName && formValues.email && formValues.password) {
      try {
        const res = await axios.post(STU_API, {
          ...formValues,
          role: 'student'
        });
        setStudents(prev => [...prev, res.data]);
        Swal.fire("Success", "Added Successful", "success");
      } catch (err) {
        Swal.fire("Error", "Error", "error");
      }
    }
  };

  // ---  add teacher ---
  const handleAddTeacher = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Teacher',
      html:
        `<input id="teacherName" class="swal2-input" placeholder="Full Name">` +
        `<input id="teacherEmail" class="swal2-input" placeholder="Email">` +
        `<input type="password" id="teacherPassword" class="swal2-input" placeholder="Password">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          fullName: document.getElementById('teacherName').value,
          email: document.getElementById('teacherEmail').value,
          password: document.getElementById('teacherPassword').value,
          role: 'teacher'
        };
      },
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Add'
    });

    if (formValues && formValues.fullName && formValues.email && formValues.password) {
      try {
        const res = await axios.post(TEACHER_API, formValues);
        setTeachers(prev => [...prev, res.data]);
        Swal.fire("Success", "Added Successful", "success");
      } catch (err) {
        Swal.fire("Error", "Error ", "error");
      }
    }
  };

  // --- Delete student ---
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`${STU_API}/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
      Swal.fire("Success", "Deleted Successful", "success");
    } catch (err) {
      Swal.fire("Error", "Error", "error");
    }
  };

  // --- Delete Teacher  ---
  const handleDeleteTeacher = async (id) => {
    try {
      await axios.delete(`${TEACHER_API}/${id}`);
      setTeachers(prev => prev.filter(t => t.id !== id));
      Swal.fire("Success", "Deleted Successful", "success");
    } catch (err) {
      Swal.fire("Error", "Error", "error");
    }
  };

  // --- Assign teacher---
  const handleAssignTeacher = async (studentId, teacherId) => {
    try {
      await axios.put(`${STU_API}/${studentId}`, { teacherId });
      setStudents(prev =>
        prev.map(student => student.id === studentId ? { ...student, teacherId } : student)
      );
      Swal.fire("Success", "Assign Success", "success");
    } catch (err) {
      Swal.fire("Error", "Error", "error");
    }
  };

  // --- update status ---
  const handleUpdateStatus = async (ideaId, status) => {
    let reason = '';
    if (status === 'مرفوضة') {
      const { value: inputReason } = await Swal.fire({
        title: 'Reason',
        input: 'text',
        inputLabel: 'Please Write Reason',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) return 'Reason Required !';
        }
      });
      if (!inputReason) return;
      reason = inputReason;
    }

    try {
      await axios.put(`${IDEA_API}/${ideaId}`, { status, rejectionReason: reason });
      setIdeas(prev =>
        prev.map(idea => idea.id === ideaId ? { ...idea, status, rejectionReason: reason } : idea)
      );
      Swal.fire("Success", `Status updated to${status}`, "success");
    } catch (err) {
      Swal.fire("Error", "error", "error");
    }
  };

  // --- delete idea ---
  const handleDeleteIdea = async (id) => {
    try {
      await axios.delete(`${IDEA_API}/${id}`);
      setIdeas(prev => prev.filter(i => i.id !== id));
      Swal.fire("Success", "Deleted Successful", "success");
    } catch (err) {
      Swal.fire("Error", "error", "error");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Access Control</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
       Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          type="button"
          onClick={handleAddStudent}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
       Add Student 
        </button>
        <button
          type="button"
          onClick={handleAddTeacher}
          className="bg-orange-300 font-bold text-white px-4 py-2 rounded hover:bg-orange-400"
        >
       Add Teacher
        </button>
      </div>

      {/*  search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder=" Search"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full bg-orange-50 border-b-2 rounded border-b-orange-400 p-2 mb-4"
        />

        {/*  Student Table */}
        <h2 className="font-semibold text-lg mb-2">Student</h2>
        <table className="min-w-full  bg-orange-50 border mb-6 shadow-sm">
          <thead className="">
            <tr>
              <th className="border px-4 py-2"> Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Teacher</th>
              <th className="border px-4 py-2">Change Teacher</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter(s => s.fullName?.toLowerCase().includes(searchName.toLowerCase()))
              .map(student => {
                const assignedTeacher = teachers.find(t => t.id === student.teacherId);

                return (
                  <tr key={student.id}>
                    <td className="border px-4 py-2">{student.fullName}</td>
                    <td className="border px-4 py-2">{student.email}</td>
                    <td className="border px-4 py-2">{assignedTeacher?.fullName || 'لا يوجد'}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={student.teacherId || ''}
                        onChange={(e) => handleAssignTeacher(student.id, e.target.value)}
                        className="border p-1 rounded w-full"
                      >
                        <option value=""> Choose Teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* teacher table */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Teachers</h2>
        <table className="min-w-full  bg-orange-50 border mb-6 shadow-sm">
          <thead className="">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td className="border px-4 py-2">{teacher.fullName}</td>
                <td className="border px-4 py-2">{teacher.email}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                   Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project table */}
      <h2 className="font-semibold text-lg mb-2">Projects</h2>
      <table className="min-w-full bg-orange-50 border shadow-sm">
        <thead className="">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">About</th>
            <th className="border px-4 py-2">Student</th>
            <th className="border px-4 py-2">Team Member</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map(idea => {
            const ideaStudent = students.find(s => s.id === idea.studentId);
            return (
              <tr key={idea.id}>
                <td className="border px-4 py-2">{idea.title}</td>
                <td className="border px-4 py-2">{idea.description}</td>
                <td className="border px-4 py-2">{ideaStudent?.fullName || 'غير موجود'}</td>
                <td className="border px-4 py-2">
                  {idea.teamMembers && idea.teamMembers.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {idea.teamMembers.map((member, idx) => (
                        <li key={idx}>{member.name} - {member.contact}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">no members</span>
                  )}
                </td>
                <td className="border px-4 py-2 capitalize text-center">
                  {idea.status === 'انتظار' && <span className="text-yellow-500">pending</span>}
                  {idea.status === 'مقبولة' && <span className="text-green-500">accepted</span>}
                  {idea.status === 'مرفوضة' && (
                    <div>
                      <span className="text-red-500">rejected</span>
                      <p className="text-sm mt-1">reason: {idea.rejectionReason || 'لم يتم تحديد سبب'}</p>
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(idea.id, 'مقبولة')}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(idea.id, 'مرفوضة')}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    reject
                  </button>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;