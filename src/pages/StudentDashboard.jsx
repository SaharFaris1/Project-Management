import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [approvedIdeas, setApprovedIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({ title: '', description: '' });
  const [student, setStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [teamMembers, setTeamMembers] = useState([{ name: '', contact: '' }]);
  const IDEA_API = 'https://68498f2f45f4c0f5ee71fed6.mockapi.io/ideas';       
  const STU_API = 'https://68498f2f45f4c0f5ee71fed6.mockapi.io/StuLogin';       
  const TEACHER_API = 'https://68459cbcfc51878754dbc94d.mockapi.io/TeacherLogin';       

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      Swal.fire("Error", "firstly Login please", "error");
      navigate('/loginStu');
      return;
    }

    setStudent(user);

    const fetchAndSetData = async () => {
      try {
        const ideasRes = await axios.get(`${IDEA_API}?studentId=${user.id}`);
        const ideaList = ideasRes.data;
        setIdeas(ideaList);
        setApprovedIdeas(ideaList.filter(i => i.status === 'مقبولة'));

        if (user.teacherId) {
          const teacherRes = await axios.get(`${TEACHER_API}/${user.teacherId}`);
          setTeacher(teacherRes.data);
        }
      } catch (err) {
        console.error("Error please try again", err);
      }
    };

    fetchAndSetData();
    const interval = setInterval(fetchAndSetData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleChange = (e) => {
    setNewIdea({
      ...newIdea,
      [e.target.name]: e.target.value
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeam = [...teamMembers];
    updatedTeam[index][field] = value;
    setTeamMembers(updatedTeam);
  };

  const addTeamMemberField = () => {
    setTeamMembers([...teamMembers, { name: '', contact: '' }]);
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const ideaExists = ideas.some(i => i.title === newIdea.title);
    if (ideaExists) {
      Swal.fire("Error", "  Idea alreay Exist", "error");
      return;
    }

    const validTeam = teamMembers.every(m => m.name && m.contact);
    if (!validTeam) {
      Swal.fire("Error", "Please fill all fileds", "error");
      return;
    }

    try {
      const response = await axios.post(IDEA_API, {
        ...newIdea,
        studentId: user.id,
        status: 'pending',
        teamMembers: teamMembers.filter(m => m.name && m.contact)
      });

      setIdeas([...ideas, response.data]);
      setNewIdea({ title: '', description: '' });
      setTeamMembers([{ name: '', contact: '' }]);
      Swal.fire("Success", "Idea added successful", "success");
    } catch (err) {
      console.error(" Error   ", err);
      Swal.fire("Error", "Error please try again", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/loginStu');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome {student?.fullName}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* display teacher*/}
      {teacher && (
        <div className="mb-6 bg-blue-50 p-4 rounded border border-blue-200 shadow-md">
          <h2 className="font-semibold text-lg">المعلم المسؤول:</h2>
          <p><strong>الاسم:</strong> {teacher.fullName}</p>
          <p><strong>البريد:</strong> {teacher.email}</p>
        </div>
      )}

      {/*  Accepted Ideas */}
      <h2 className="text-xl font-semibold mb-2"> My Project</h2>
      {approvedIdeas.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {approvedIdeas.map(idea => (
            <li key={idea.id} className="bg-orange-50 p-4 rounded shadow hover:shadow-md transition">
              <h3 className="font-bold text-gray-800">{idea.title}</h3>
              <p className='text-gray-500'>{idea.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">No Projects</p>
      )}

      {/* Add new Project*/}
      <h2 className="text-xl font-semibold mb-2"> Add New Project </h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mb-6 space-y-4">
        <div>
          <label className="block font-bold mb-1">Title </label>
          <input
            type="text"
            name="title"
            value={newIdea.title}
            onChange={handleChange}
            placeholder=" title of project"
            className="w-full border-b-2 bg-orange-50 border-b-amber-500 px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1"> About Project</label>
          <textarea
            name="description"
            value={newIdea.description}
            onChange={handleChange}
            placeholder=" about your project"
            className="w-full border-b-2 bg-orange-50 border-b-amber-500 px-4 py-2"
            required
          />
        </div>

        {/* Team member */}
        <div>
          <label className="block font-bold mb-2">Team Member</label>
          {teamMembers.map((member, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Name "
                value={member.name}
                onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                className="w-1/2 border-b-2 bg-orange-50 border-b-amber-500 px-3 py-1"
                required
              />
              <input
                type="email"
                placeholder=" Email"
                value={member.contact}
                onChange={(e) => handleTeamMemberChange(index, 'contact', e.target.value)}
                className="w-1/2 border-b-2 bg-orange-50 border-b-amber-500 px-3 py-1"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addTeamMemberField}
            className="mt-2 text-blue-800 hover:text-orange-400"
          >
           Add Member +
          </button>
        </div>

        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
        Send
        </button>
      </form>

      {/* Status*/}
      <h2 className="text-xl font-semibold mb-2"> Project Status </h2>
      {ideas.length > 0 ? (
        <table className="min-w-full bg-white border mb-6">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">About</th>
              <th className="border px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map(idea => (
              <tr key={idea.id}>
                <td className="border px-4 py-2">{idea.title}</td>
                <td className="border px-4 py-2">{idea.description}</td>
                <td className="border px-4 py-2 text-center">
                  {idea.status === 'انتظار' && <span className="text-yellow-500"> pending</span>}
                  {idea.status === 'مقبولة' && <span className="text-green-500">accepted</span>}
                  {idea.status === 'مرفوضة' && (
                    <div>
                      <span className="text-red-500">rejected</span>
                      <p className="text-sm mt-1">reason: {idea.rejectionReason || 'لم يتم تحديد سبب'}</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 mb-6">No Project</p>
      )}

      {/* team member*/}
      {ideas.length > 0 ? (
        ideas.map(idea => (
          <div key={idea.id} className="mt-6">
            <h2 className="text-xl font-semibold mb-2"> Team Member <br />{idea.title}</h2>
            <ul className="list-disc pl-5 space-y-1">
              {idea.teamMembers && idea.teamMembers.length > 0 ? (
                idea.teamMembers.map((member, idx) => (
                  <li key={idx}>{member.name} - {member.contact}</li>
                ))
              ) : (
                <li className="text-gray-500"></li>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-6">No Project</p>
      )}
    </div>
  );
}

export default StudentDashboard;