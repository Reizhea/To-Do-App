import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthFromStorage, logout } from '../redux/authSlice';
import WeatherBanner from '../components/WeatherBanner';
import QuoteBanner from '../components/Quotebanner';
import { toast } from 'react-toastify';
import { getDeadlineLabel } from '../utils/deadlineHelpers';
import { FaEllipsisV } from 'react-icons/fa';

import {
  loadTasksFromStorage,
  addTask,
  deleteTask,
  completeTask,
  sortByPriority,
  sortByDeadline,
} from '../redux/tasksSlice';
import { addFolder, loadFoldersFromStorage } from '../redux/foldersSlice';
import {
  Button,
  Form,
  Badge,
  Modal,
  InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FaTrash,
  FaCheck,
  FaSignOutAlt,
  FaSortAmountDown,
  FaSortAmountUpAlt,
  FaBars,
  FaPlus,
} from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const tasks = useSelector((state) => state.tasks.tasks);
  const folders = useSelector((state) => state.folders.folders);

  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [outdoor, setOutdoor] = useState(false);
  const [folder, setFolder] = useState('');
  const [showQuotes, setShowQuotes] = useState(
    JSON.parse(localStorage.getItem('showQuotes')) ?? true
  );
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [filterView, setFilterView] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    dispatch(loadAuthFromStorage());
    dispatch(loadTasksFromStorage());
    dispatch(loadFoldersFromStorage());
    if (!auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, dispatch, navigate]);

  const toggleQuotes = () => {
    setShowQuotes((prev) => {
      localStorage.setItem('showQuotes', JSON.stringify(!prev));
      return !prev;
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskName.trim() !== '' && deadline) {
      dispatch(
        addTask({
          id: Date.now(),
          name: taskName,
          priority,
          deadline,
          outdoor,
          folder: folder || null,
        })
      );
      setTaskName('');
      setPriority('Medium');
      setDeadline('');
      setOutdoor(false);
      setFolder('');
      setShowTaskModal(false);
      toast.success('✅ Task added successfully!');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleCreateFolder = (e) => {
    if (e.key === 'Enter' && newFolderName.trim() !== '') {
      const createdName = newFolderName.trim();
      dispatch(addFolder(createdName));
      setNewFolderName('');
      setFolder(createdName);
      setCreatingFolder(false);
      toast.success(`Folder "${createdName}" created!`);
    }
  };
  

  const filterTasks = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (deadlineDate - today) / (1000 * 60 * 60 * 24)
    );
    if (filterView === 'today') return diffDays === 0 && !task.completed;
    if (filterView === 'week') return diffDays >= 0 && diffDays <= 6 && !task.completed;
    if (filterView === 'completed') return task.completed;
    if (filterView === 'folder' && selectedFolder)
      return task.folder === selectedFolder && !task.completed;
    return !task.completed;
  };

  const hasOutdoorToday = tasks
  .filter((t) => !t.completed)
  .some((task) => {
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    return task.outdoor && deadlineDate.toDateString() === today.toDateString();
  });


  return (
    <>
      <div className="mobile-header">
        <h5>Hello, {auth.user?.username}</h5>
        <FaBars size={24} onClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div style={{ display: 'flex', height: '100vh' }}>
        <div
          className={`sidebar ${sidebarOpen ? 'open' : ''}`}
          style={{
            width: '250px',
            background: '#fff',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          <Button
            variant="success"
            className="w-100"
            style={{ borderRadius: '12px', fontWeight: '500' }}
            onClick={() => { setShowTaskModal(true); setSidebarOpen(false); }}
          >
            + Add Task
          </Button>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            <p onClick={() => { setFilterView('all'); setSelectedFolder(null); setSidebarOpen(false); }}>All Tasks</p>
            <p onClick={() => { setFilterView('today'); setSelectedFolder(null); setSidebarOpen(false); }}>Today</p>
            <p onClick={() => { setFilterView('week'); setSelectedFolder(null); setSidebarOpen(false); }}>This Week</p>
            <p onClick={() => { setFilterView('completed'); setSelectedFolder(null); setSidebarOpen(false); }}>Completed Tasks</p>
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px'
              }}
              onClick={() => setShowFolders(!showFolders)}
            >
              <strong>Folders</strong>
              <span>{showFolders ? '▼' : '▶'}</span>
            </div>
            {showFolders && (
              <ul style={{ listStyle: 'none', paddingLeft: '10px', marginTop: '10px' }}>
                {folders.map((folderName, index) => (
                  <li
                    key={index}
                    style={{ cursor: 'pointer', margin: '4px 0' }}
                    onClick={() => { setFilterView('folder'); setSelectedFolder(folderName); setSidebarOpen(false); }}
                  >
                    &nbsp;&nbsp;{folderName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Form.Check
              type="switch"
              label="Show Quotes"
              checked={showQuotes}
              onChange={toggleQuotes}
            />
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              style={{ marginTop: '20px' }}
            >
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        </div>

        <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
          {hasOutdoorToday && <WeatherBanner />}
          {showQuotes && <QuoteBanner />}
          <h3>My Tasks</h3>

          <div className="d-flex justify-content-end mb-4 gap-3">
            <Button variant="outline-dark" onClick={() => dispatch(sortByPriority())}>
              <FaSortAmountDown /> Sort by Priority
            </Button>
            <Button variant="outline-dark" onClick={() => dispatch(sortByDeadline())}>
              <FaSortAmountUpAlt /> Sort by Deadline
            </Button>
          </div>

          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '20px'
          }}>
            {tasks.filter(filterTasks).length === 0 ? (
              <p className="text-center text-muted">No tasks in this view.</p>
            ) : (
              tasks.filter(filterTasks).map((task) => (
                <div
  key={task.id}
  className="task-card d-flex justify-content-between align-items-center mb-3 p-3"
  style={{
    background: task.completed ? '#e0e0e0' : '#f9f9f9',
    borderRadius: '12px',
    borderLeft: `4px solid ${
      task.priority === 'High'
        ? '#ff6b6b'
        : task.priority === 'Medium'
        ? '#ffa502'
        : '#2ed573'
    }`,
    opacity: task.completed ? 0.6 : 1,
  }}
>
  <div>
    <h5>{task.name}</h5>
    <div className="d-flex gap-3 small text-muted">
      <Badge
        bg={
          task.priority === 'High'
            ? 'danger'
            : task.priority === 'Medium'
            ? 'warning'
            : 'success'
        }
      >
        {task.priority}
      </Badge>
      <Badge bg="secondary">{getDeadlineLabel(task.deadline)}</Badge>
      {task.folder && <Badge bg="secondary">📁 {task.folder}</Badge>}
    </div>
  </div>
  <div style={{ position: 'relative' }}>
    <Button
      variant="dark"
      style={{
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
      onClick={() =>
        setOpenDropdownId((prev) => (prev === task.id ? null : task.id))
      }
    >
      <FaEllipsisV />
    </Button>

    {openDropdownId === task.id && (
      <div className="task-dropdown">
        <div
          onClick={() => {
            dispatch(completeTask(task.id));
            toast.success('Task marked completed!');
            setOpenDropdownId(null);
          }}
        >
          Complete
        </div>
        <div
          onClick={() => {
            dispatch(deleteTask(task.id));
            toast.info('Task deleted');
            setOpenDropdownId(null);
          }}
        >
          Delete
        </div>
        <div onClick={() => setOpenDropdownId(null)}>Cancel</div>
      </div>
    )}
  </div>
</div>

              ))
            )}
          </div>
        </div>
      </div>

      <div className="floating-add-btn" onClick={() => setShowTaskModal(true)}>
        <FaPlus size={22} />
      </div>

      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Form.Group className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Folder (optional)</Form.Label>
              {creatingFolder ? (
                <InputGroup>
                    <Form.Control
                    type="text"
                    placeholder="New folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={handleCreateFolder}
                    />
                </InputGroup>
                ) : (
                <Form.Select
                    value={folder}
                    onChange={(e) => {
                    if (e.target.value === '__create_new__') {
                        setCreatingFolder(true);
                    } else {
                        setFolder(e.target.value);
                    }
                    }}
                >
                    <option value="">None</option>
                    {folders.map((f, index) => (
                    <option key={index} value={f}>{f}</option>
                    ))}
                    <option value="__create_new__">+ Create new folder</option>
                </Form.Select>
                )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Outdoor activity?"
                checked={outdoor}
                onChange={(e) => setOutdoor(e.target.checked)}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              style={{
                border: 'none',
              }}
            >
              Add Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dashboard;
