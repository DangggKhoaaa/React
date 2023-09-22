// import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import RegisterForm from './component/Register';
import ListStudents from './component/student/Students';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import { useState } from 'react';
import Navbar from './component/navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import PostList from './component/post/PostList';
import CreatePost from './component/post/CreatePost';
import Left from './component/navbar/LeftSideBar';
import UpdatePost from './component/post/UpdatePost';


function App() {
  const [students, setStudents] = useState([]);

  return (
    <div className="App d-flex">
      <Left />
      <div style={{ width: "100%" }}>
        <Navbar />
        <Routes>
          <Route path='/' element={<ListStudents studentList={students} setStudentList={setStudents} />} />
          <Route path='/student/list' element={<ListStudents studentList={students} setStudentList={setStudents} />} />
          <Route path='/post/list' element={<PostList />} />
          <Route path='/post/create' element={<CreatePost />} />
          <Route path='/post/update/:page/:postId' element={<UpdatePost />} />
        </Routes>

      </div>

    </div>
  );
}

export default App;
