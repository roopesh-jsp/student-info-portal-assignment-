import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../components/SideBar";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [auth.currentUser]);

  const fetchStudents = async () => {
    const studentCollection = collection(db, "students");
    const studentSnapshot = await getDocs(studentCollection);
    const studentList = studentSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(studentList);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Add Student Modal using FormData
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudent = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, "students"), newStudent);
      setModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Error adding student: ", error);
    }
  };

  // Handle Edit Student Modal using FormData
  const handleEditStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedStudent = Object.fromEntries(formData.entries());

    try {
      const studentRef = doc(db, "students", selectedStudent.id);
      await setDoc(studentRef, updatedStudent);
      setEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Error editing student: ", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const studentRef = doc(db, "students", id);
      await deleteDoc(studentRef);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
        <div>
          <h2>Students List</h2>
          <button onClick={() => setModalOpen(true)}>Add Student</button>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Roll Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.section}</td>
                  <td>{student.rollNumber}</td>
                  <td className="flex">
                    <FaEye onClick={() => openViewModal(student)} />
                    <FaEdit onClick={() => openEditModal(student)} />
                    <FaTrashAlt onClick={() => deleteStudent(student.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Add Student */}
          {modalOpen && (
            <div className="modal">
              <form onSubmit={handleAddStudent}>
                <h3>Add Student</h3>
                <label>
                  Name:
                  <input type="text" name="name" required />
                </label>
                <label>
                  Class:
                  <input type="text" name="class" required />
                </label>
                <label>
                  Section:
                  <input type="text" name="section" required />
                </label>
                <label>
                  Roll Number:
                  <input type="text" name="rollNumber" required />
                </label>
                {/* Additional fields */}
                <label>
                  Email:
                  <input type="email" name="email" required />
                </label>
                <label>
                  Phone Number:
                  <input type="tel" name="phone" required />
                </label>
                <label>
                  Address:
                  <input type="text" name="address" required />
                </label>
                <label>
                  Date of Birth:
                  <input type="date" name="dob" required />
                </label>
                <label>
                  Parent Name:
                  <input type="text" name="parentName" required />
                </label>
                <label>
                  Parent Contact:
                  <input type="tel" name="parentContact" required />
                </label>
                <label>
                  Gender:
                  <select name="gender" required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Grade:
                  <input type="text" name="grade" required />
                </label>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Close
                </button>
              </form>
            </div>
          )}

          {/* Modal for Edit Student */}
          {editModalOpen && (
            <div className="modal">
              <form onSubmit={handleEditStudent}>
                <h3>Edit Student</h3>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedStudent.name}
                    required
                  />
                </label>
                {/* Repeat the fields here, same as Add Student */}
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditModalOpen(false)}>
                  Close
                </button>
              </form>
            </div>
          )}

          {/* Modal for View Student */}
          {viewModalOpen && (
            <div className="view-modal">
              <div>
                <h3>Student Details</h3>
                <p>
                  <strong>Name: </strong>
                  {selectedStudent.name}
                </p>
                <p>
                  <strong>Class: </strong>
                  {selectedStudent.class}
                </p>
                <p>
                  <strong>Section: </strong>
                  {selectedStudent.section}
                </p>
                <p>
                  <strong>Roll Number: </strong>
                  {selectedStudent.rollNumber}
                </p>
                <p>
                  <strong>Email: </strong>
                  {selectedStudent.email}
                </p>
                <p>
                  <strong>Phone: </strong>
                  {selectedStudent.phone}
                </p>
                <p>
                  <strong>Address: </strong>
                  {selectedStudent.address}
                </p>
                <p>
                  <strong>Date of Birth: </strong>
                  {selectedStudent.dob}
                </p>
                <p>
                  <strong>Parent Name: </strong>
                  {selectedStudent.parentName}
                </p>
                <p>
                  <strong>Parent Contact: </strong>
                  {selectedStudent.parentContact}
                </p>
                <p>
                  <strong>Gender: </strong>
                  {selectedStudent.gender}
                </p>
                <p>
                  <strong>Grade: </strong>
                  {selectedStudent.grade}
                </p>
                <button onClick={() => setViewModalOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsPage;
