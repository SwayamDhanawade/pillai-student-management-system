import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import StudentDetails from './pages/StudentDetails';
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;