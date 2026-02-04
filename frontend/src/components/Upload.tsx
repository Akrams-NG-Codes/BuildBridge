import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Upload as UploadIcon, MessageSquare } from 'lucide-react';

export function Upload() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [uploadType, setUploadType] = useState('note');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/api/projects/').then(res => res.data),
  });

  const { data: updates = [] } = useQuery({
    queryKey: ['updates', selectedProject],
    queryFn: () => selectedProject 
      ? api.get(`/api/updates/?project=${selectedProject}`).then(res => res.data)
      : Promise.resolve([]),
    enabled: !!selectedProject,
  });

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/api/updates/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updates', selectedProject] });
      setDescription('');
      setFile(null);
      setUploadType('note');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (data: { update: number; text: string }) => api.post('/api/updates/comments/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updates', selectedProject] });
      setCommentText('');
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !description) return;

    const formData = new FormData();
    formData.append('project', selectedProject.toString());
    formData.append('type', uploadType);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    uploadMutation.mutate(formData as any);
  };

  const handleComment = (e: React.FormEvent, updateId: number) => {
    e.preventDefault();
    if (!commentText) return;

    commentMutation.mutate({
      update: updateId,
      text: commentText,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Project Updates</h1>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add Update</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Project</option>
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="note">Note</option>
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />

          {uploadType !== 'note' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
              />
              {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UploadIcon size={20} />
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* Updates List */}
      {selectedProject && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Updates</h2>
          {updates.map((update: any) => (
            <div key={update.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {update.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(update.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{update.description}</p>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-3">
                <form
                  onSubmit={(e) => handleComment(e, update.id)}
                  className="flex gap-2 mb-3"
                >
                  <input
                    type="text"
                    placeholder="Add comment..."
                    value={selectedUpdate === update.id ? commentText : ''}
                    onChange={(e) => {
                      setSelectedUpdate(update.id);
                      setCommentText(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="submit"
                    disabled={commentMutation.isPending}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    <MessageSquare size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
