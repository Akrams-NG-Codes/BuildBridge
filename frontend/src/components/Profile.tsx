import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function Profile() {
  const { user: currentUser, logout } = useStore();
  const queryClient = useQueryClient();
  const [showNotification, setShowNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/api/auth/profile/').then(res => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/api/auth/profile/', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      setShowNotification({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setShowNotification(null), 3000);
    },
    onError: () => {
      setShowNotification({ type: 'error', message: 'Failed to update profile' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  const displayProfile = profile || currentUser;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

      {showNotification && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          showNotification.type === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {showNotification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{showNotification.message}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Username:</span> {displayProfile?.username}</p>
            <p><span className="font-medium">Role:</span> {displayProfile?.role || 'Not specified'}</p>
            <p><span className="font-medium">Account Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                displayProfile?.verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {displayProfile?.verified ? 'Verified' : 'Unverified'}
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h2>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout();
            }
          }}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
