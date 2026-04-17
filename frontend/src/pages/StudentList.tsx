import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '@/lib/api';
import { Trash2, Edit, Search, User, X, Users, GraduationCap, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '@/components/StatsCard';
import Modal from '@/components/Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getThumbnailUrl(thumbnailUrl: string | null): string {
  if (!thumbnailUrl) return '';
  if (thumbnailUrl.startsWith('http')) return thumbnailUrl;
  return `${API_URL}${thumbnailUrl}`;
}

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="h-12 bg-gray-100 dark:bg-gray-700 border-b"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b dark:border-gray-700 last:border-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState('');
  const [deleteAdmissionNumber, setDeleteAdmissionNumber] = useState('');
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteName('');
    },
    onError: () => {
      toast.error('Failed to delete student');
      setShowDeleteModal(false);
    },
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch = !search ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = !courseFilter || student.course === courseFilter;
    const matchesYear = yearFilter === '' || student.year === yearFilter;
    return matchesSearch && matchesCourse && matchesYear;
  });

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const newAdmissions = students.filter(s => {
    const created = new Date(s.createdAt);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;

  const uniqueCourses = [...new Set(students.map(s => s.course))].sort();
  const uniqueYears = [...new Set(students.map(s => s.year))].sort((a, b) => a - b);

  const handleDelete = (id: number, name: string, admissionNumber: string) => {
    setDeleteId(id);
    setDeleteName(name);
    setDeleteAdmissionNumber(admissionNumber);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TableSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Students"
          value={students.length}
          icon={Users}
          iconColor="text-indigo-600"
        />
        <StatsCard
          title="New Admissions"
          value={newAdmissions}
          subtitle="This month"
          icon={Calendar}
          iconColor="text-emerald-600"
        />
        <StatsCard
          title="Active Courses"
          value={uniqueCourses.length}
          icon={GraduationCap}
          iconColor="text-violet-600"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, admission no, or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-w-[140px]"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : '')}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-w-[120px]"
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admission No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mobile No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {search ? 'No students found matching your search' : 'No students yet'}
                      </p>
                      {!search && (
                        <button
                          onClick={() => navigate('/students/new')}
                          className="mt-4 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-medium"
                        >
                          Add your first student
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.thumbnailUrl ? (
                        <img
                          src={getThumbnailUrl(student.thumbnailUrl)}
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center">
                          <User className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {student.admissionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      Year {student.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.mobileNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-4 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/students/${student.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.name, student.admissionNumber)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {filteredStudents.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {search ? 'No students found' : 'No students yet'}
              </p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="p-4">
                <div className="flex items-start gap-4">
                  {student.thumbnailUrl ? (
                    <img
                      src={getThumbnailUrl(student.thumbnailUrl)}
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.admissionNumber}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {student.course} • Year {student.year}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="text-gray-600 dark:text-gray-400 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/students/${student.id}/edit`)}
                        className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.name, student.admissionNumber)}
                        className="text-red-600 dark:text-red-400 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you want to delete ${deleteAdmissionNumber} - ${deleteName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </main>
  );
}