// components/UserEnrollmentsList.jsx
export default function UserEnrollmentsList({ users, enrollments }) {
  // Calcular total pagado por usuario
  const usersWithPayments = users.map(user => {
    const userEnrollments = enrollments.filter(e => e.userId === user._id);
    const totalPaid = userEnrollments.reduce((sum, enrollment) => sum + (enrollment.amountPaid || 0), 0);
    
    return {
      ...user,
      enrolledCourses: userEnrollments.map(e => e.courseName),
      totalPaid,
      enrollmentCount: userEnrollments.length
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Usuarios, Inscripciones y Pagos
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Cursos Inscritos</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total Inscripciones</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total Pagado</th>
            </tr>
          </thead>
          <tbody>
            {usersWithPayments.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {user.enrolledCourses.length > 0 ? (
                    <div className="space-y-1">
                      {user.enrolledCourses.map((course, index) => (
                        <span key={index} className="block text-sm text-gray-600">
                          • {course}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No inscrito</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-800">
                    {user.enrollmentCount}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-green-600">
                    ${user.totalPaid.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {usersWithPayments.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No hay usuarios con inscripciones
          </p>
        )}
      </div>
    </div>
  );
}