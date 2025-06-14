import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  const IDEA_API = 'https://68498f2f45f4c0f5ee71fed6.mockapi.io/ideas';          
  const STU_API = 'https://68498f2f45f4c0f5ee71fed6.mockapi.io/StuLogin';          

  const teacherData = JSON.parse(localStorage.getItem('user'));
  const TEACHER_ID = teacherData?.id;

 
  useEffect(() => {
    if (!teacherData || teacherData.role !== 'teacher') {
      Swal.fire("Error", "يجب أن تكون معلمًا لتصل لهذه الصفحة", "error").then(() => {
        navigate('/loginTeacher');
      });
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsRes = await axios.get(`${STU_API}?teacherId=${TEACHER_ID}`);
      const studentsList = studentsRes.data;
      setStudents(studentsList);

      const ideasRes = await axios.get(IDEA_API);
      const ideasList = ideasRes.data;

      const filteredIdeas = ideasList.filter(idea =>
        studentsList.some(student => student.id === idea.studentId)
      );

      setIdeas(filteredIdeas);
    } catch (err) {
      console.error("Error", err);
    }
  };


  const handleLogout = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out and redirected to the login page.",
        icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    confirmButtonText: "Yes",
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        navigate('/loginTeacher');

        Swal.fire(
          'success',
          'logout successful',
          'success'
        );
      }
    });
  };


  const handleUpdateStatus = async (id, status) => {
    let reason = '';
    if (status === 'مرفوضة') {
      const { value: inputReason } = await Swal.fire({
        title: ' reason',
        input: 'text',
        inputLabel: 'please write reason',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) return ' reason required!';
        }
      });

      if (!inputReason) return;
      reason = inputReason;
    }

    try {
      await axios.put(`${IDEA_API}/${id}`, { status, rejectionReason: reason });
      setIdeas(prev => prev.map(i => i.id === id ? { ...i, status, rejectionReason: reason } : i));
      Swal.fire("Success", `status updated to ${status}`, "success");
    } catch (err) {
      Swal.fire("Error", "error", "error");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/*  */}
      <div className="">
        <h1 className="text-2xl font-bold"> Welcome {teacherData?.fullName || ''}</h1>
        <p className="text-gray-600"></p>
      </div>

    
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
   Logout
        </button>
      </div>

      {/* student  */}
      <h2 className="text-xl font-semibold mb-4">Students Under My Supervision</h2>
      {students.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {students.map(student => (
            <li key={student.id} className="bg-orange-50 p-4 rounded shadow hover:shadow-md transition">
              <strong>{student.fullName}</strong> <br />  {student.email}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">No Students Under My Supervision</p>
      )}

      {/* Projects */}
      <h2 className="text-xl font-semibold mb-4">Projects Submitted by My Team</h2>
      {ideas.length > 0 ? (
        <table className="min-w-full bg-orange-50 border mb-8 shadow-sm">
          <thead className="">
            <tr>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">About</th>
              <th className="border px-4 py-2 text-left">Student</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Actions</th>
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
                  <td className="border px-4 py-2  capitalize text-center">
                    {idea.status === 'انتظار' && <span className="text-yellow-500">pending</span>}
                    {idea.status === 'مقبولة' && <span className="text-green-500">accepted</span>}
                    {idea.status === 'مرفوضة' && (
                      <div>
                        <span className="text-red-500">rejected</span>
                        <p className="text-sm mt-1">reason: {idea.rejectionReason || ' '}</p>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No project</p>
      )}
    </div>
  );
}

export default TeacherDashboard;