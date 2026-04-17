import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api';
import { ArrowLeft, Edit, User, Mail, Phone, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getPhotoUrl(photoUrl: string | null): string {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http')) return photoUrl;
  return `${API_URL}${photoUrl}`;
}

function DetailsSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = Number(id);

  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => studentApi.getById(studentId),
    enabled: !isNaN(studentId),
  });

  if (isNaN(studentId)) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Invalid student ID</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !student) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Student Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">The student you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </button>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const photoUrl = getPhotoUrl(student.photoUrl);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to List
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo Section */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-gray-200 dark:ring-gray-700">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center">
                    <User className="h-16 w-16 text-indigo-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">{student.admissionNumber}</p>
                </div>
                <button
                  onClick={() => navigate(`/students/${student.id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Course */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.course}</p>
                  </div>
                </div>

                {/* Year */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Year {student.year}</p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-violet-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(student.dateOfBirth)}</p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <User className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.gender}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.email}</p>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mobile Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.mobileNumber}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2 flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{student.address}</p>
                  </div>
                </div>

                {/* Created At */}
                <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Student added on {formatDate(student.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}