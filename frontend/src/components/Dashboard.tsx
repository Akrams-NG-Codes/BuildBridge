import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { FolderKanban, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects/');
      return data.results || data;
    },
  });

  const stats = [
    { label: 'Active Projects', value: projects?.filter((p: any) => p.status === 'active').length || 0, icon: FolderKanban, color: 'bg-blue-500' },
    { label: 'Completed', value: projects?.filter((p: any) => p.status === 'completed').length || 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending', value: projects?.filter((p: any) => p.status === 'on_hold').length || 0, icon: Clock, color: 'bg-yellow-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2">
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
        {projects?.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="text-gray-600 mt-1">Create your first project to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects?.slice(0, 5).map((project: any) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.location}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(project.created_at))} ago
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
