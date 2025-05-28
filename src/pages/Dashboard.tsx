
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Calendar, Edit2, Trash2, LogOut, Filter } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(currentUser);
    setUser(userData);

    // Load tasks for this user
    const userTasks = JSON.parse(localStorage.getItem(`tasks_${userData.id}`) || '[]');
    setTasks(userTasks);
  }, [navigate]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTaskDate || null
    };

    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);
    setNewTask('');
    setNewTaskDate('');
    toast.success('Task added successfully!');
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
    
    const task = tasks.find(t => t.id === taskId);
    if (!task.completed) {
      toast.success('Task completed! 🎉');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
    toast.success('Task deleted');
  };

  const startEditing = (task) => {
    setEditingTask({ ...task, originalText: task.text });
  };

  const saveEdit = () => {
    if (!editingTask.text.trim()) return;

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id 
        ? { ...task, text: editingTask.text.trim() }
        : task
    );
    saveTasks(updatedTasks);
    setEditingTask(null);
    toast.success('Task updated');
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.filter(task => !task.completed).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-orange-600">{activeCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="sm:w-40"
            />
            <Button 
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newTask.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'completed', label: 'Completed' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filter === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(key)}
                    className={filter === key ? 'bg-blue-600' : ''}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filter === 'completed' ? 'No completed tasks yet' :
                   filter === 'active' ? 'No active tasks' : 'No tasks yet'}
                </p>
                {filter === 'all' && (
                  <p className="text-sm text-gray-400 mt-2">Add your first task above to get started!</p>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {task.completed && <CheckCircle className="w-3 h-3" />}
                    </button>

                    <div className="flex-1">
                      {editingTask && editingTask.id === task.id ? (
                        <Input
                          value={editingTask.text}
                          onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="mr-2"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {task.text}
                        </span>
                      )}
                      
                      {task.dueDate && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {editingTask && editingTask.id === task.id ? (
                      <>
                        <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(task)}
                          className="hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTask(task.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
