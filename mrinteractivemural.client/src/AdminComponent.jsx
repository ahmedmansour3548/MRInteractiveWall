import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function AdminComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Tabs control
    const [activeTab, setActiveTab] = useState('models');

    // Members state
    const [members, setMembers] = useState([]);
    const [showNewMemberForm, setShowNewMemberForm] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', number: '', email: '', note: '', role: '' });
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editedMember, setEditedMember] = useState({});

    // Models state
    const [models, setModels] = useState([]);
    const [showNewModelForm, setShowNewModelForm] = useState(false);
    const [newModel, setNewModel] = useState({ modelName: '', labMemberID: '', modelFilePath: '', modelFileName: '' });
    const [editingModelId, setEditingModelId] = useState(null);
    const [editedModel, setEditedModel] = useState({});


    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://localhost:7121/api/admin/login', { username, password });
            if (response.status === 200) {
                setIsLoggedIn(true);
                setLoginError('');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsLoggedIn(false);
            setLoginError('Failed to log in. Please check your credentials.');
        }
    };

    const populateModels = async () => {
        try {
            const response = await axios.get('https://localhost:7121/api/models');
            setModels(response.data);
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    };

    const handleAddModel = async () => {
        try {
            console.log(newModel);
            await axios.post('https://localhost:7121/api/models', newModel);
            setNewModel({ modelName: '', labMemberID: '', modelFilePath: '', modelFileName: '' });
            setShowNewModelForm(false);
            populateModels();
        } catch (error) {
            console.error('Error adding model:', error);
        }
    };

    const handleEditModel = (model) => {
        setEditingModelId(model.id);
        setEditedModel({ ...model });
    };

    const handleSaveEditModel = async (modelId) => {
        const updatedModel = {
            ...editedModel, // Spread existing fields
            id: modelId, // Ensure correct ID is used, assuming `editedModel` does not store it
            
        };

        try {
            await axios.put(`https://localhost:7121/api/models/${modelId}`, updatedModel, {
                headers: { 'Content-Type': 'application/json' }
            });
            setEditingModelId(null); // Exit edit mode
            setEditedModel({}); // Clear the edited model data
            populateModels(); // Refresh the models list
        } catch (error) {
            console.error('Error saving model:', error);
        }
    };


    const handleDeleteModel = async (modelId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this model?");
        if (userConfirmed) {
            try {
                await axios.delete(`https://localhost:7121/api/models/${modelId}`);
                populateModels();
            } catch (error) {
                console.error('Error deleting model:', error);
            }
        }
    };


    const populateMembers = async () => {
        try {
            const response = await axios.get('https://localhost:7121/api/members');
            setMembers(response.data);
            console.log("Number of members in database: " + response.data.length);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };


    useEffect(() => {
        if (activeTab === 'members') {
            populateMembers();
        }
        else if(activeTab === 'models') {
            populateModels();
        }
    }, [activeTab]);

    const handleAddMember = async () => {
        try {
            await axios.post('https://localhost:7121/api/members', newMember);
            setNewMember({ name: '', number: '', email: '', note: '', role: '' }); // Reset new member form
            setShowNewMemberForm(false); // Hide the form
            populateMembers(); // Refresh the members list
        } catch (error) {
            console.error('Error adding new member:', error);
        }
    };


    const handleEdit = (member) => {
        setEditingMemberId(member.id);
        setEditedMember({ ...member });
    };

    const handleDelete = async (memberId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this member?");
        if (userConfirmed) {
            try {
                await axios.delete(`https://localhost:7121/api/members/${memberId}`);
                populateMembers(); // Refresh list
            } catch (error) {
                console.error('Error deleting member:', error);
            }
        }
    };

    const handleSaveEdit = async (memberId) => {
        try {
            await axios.put(`https://localhost:7121/api/members/${memberId}`, editedMember);
            setEditingMemberId(null); // Exit edit mode
            setEditedMember({}); // Clear the edited member data
            populateMembers(); // Refresh list
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const renderTabs = () => (
        <div>
            <button onClick={() => setActiveTab('models')}>Models</button>
            <button onClick={() => setActiveTab('members')}>Members</button>
        </div>
    );

    const renderModelsTab = () => (
        <div>
            <h3>Models</h3>
            <button type="button" onClick={() => setShowNewModelForm(!showNewModelForm)}>Add New Model</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model Name</th>
                        <th>Lab Member ID</th>
                        <th>Model File Path</th>
                        <th>Model File Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model) => (
                        <tr key={model.id}>
                            <td>{model.id}</td>
                            <td>
                                {editingModelId === model.id ? (
                                    <input
                                        type="text"
                                        value={editedModel.modelName}
                                        onChange={(e) => setEditedModel({ ...editedModel, modelName: e.target.value })}
                                    />
                                ) : (
                                    model.modelName
                                )}
                            </td>
                            <td>
                                {editingModelId === model.id ? (
                                    <input
                                        type="number"
                                        value={editedModel.labMemberID}
                                        onChange={(e) => setEditedModel({ ...editedModel, labMemberID: e.target.value })}
                                    />
                                ) : (
                                    model.labMemberID
                                )}
                            </td>
                            <td>
                                {editingModelId === model.id ? (
                                    <input
                                        type="text"
                                        value={editedModel.modelFilePath}
                                        onChange={(e) => setEditedModel({ ...editedModel, modelFilePath: e.target.value })}
                                    />
                                ) : (
                                    model.modelFilePath
                                )}
                            </td>
                            <td>
                                {editingModelId === model.id ? (
                                    <input
                                        type="text"
                                        value={editedModel.modelFileName}
                                        onChange={(e) => setEditedModel({ ...editedModel, modelFileName: e.target.value })}
                                    />
                                ) : (
                                    model.modelFileName
                                )}
                            </td>
                            <td>
                                {editingModelId === model.id ? (
                                    <>
                                        <button onClick={() => handleSaveEditModel(model.id)}>Save</button>
                                        <button onClick={() => setEditingModelId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditModel(model)}>Edit</button>
                                        <button onClick={() => handleDeleteModel(model.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {showNewModelForm && (
                        <tr>
                            <td>{models.length + 1}</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Model Name"
                                    value={newModel.modelName}
                                    onChange={(e) => setNewModel({ ...newModel, modelName: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Lab Member ID"
                                    value={newModel.labMemberID}
                                    onChange={(e) => setNewModel({ ...newModel, labMemberID: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Model File Path"
                                    value={newModel.modelFilePath}
                                    onChange={(e) => setNewModel({ ...newModel, modelFilePath: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Model File Name"
                                    value={newModel.modelFileName}
                                    onChange={(e) => setNewModel({ ...newModel, modelFileName: e.target.value })}
                                />
                            </td>
                            <td>
                                <button onClick={handleAddModel}>Save</button>
                                <button onClick={() => setShowNewModelForm(false)}>Cancel</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );



    const renderMembersTab = () => (
        <div>
            <h3>Members</h3>
            <button type="button" onClick={() => setShowNewMemberForm(!showNewMemberForm)}>Add New Member</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Number</th>
                        <th>Email</th>
                        <th>Note</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>
                                {editingMemberId === member.id ? (
                                    <input type="text" value={editedMember.name || ''} onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })} />
                                ) : (
                                    member.name
                                )}
                            </td>
                            <td>
                                {editingMemberId === member.id ? (
                                    <input type="text" value={editedMember.number || ''} onChange={(e) => setEditedMember({ ...editedMember, number: e.target.value })} />
                                ) : (
                                    member.number
                                )}
                            </td>
                            <td>
                                {editingMemberId === member.id ? (
                                    <input type="text" value={editedMember.email || ''} onChange={(e) => setEditedMember({ ...editedMember, email: e.target.value })} />
                                ) : (
                                    member.email
                                )}
                            </td>
                            <td>
                                {editingMemberId === member.id ? (
                                    <input type="text" value={editedMember.note || ''} onChange={(e) => setEditedMember({ ...editedMember, note: e.target.value })} />
                                ) : (
                                    member.note
                                )}
                            </td>
                            <td>
                                {editingMemberId === member.id ? (
                                    <input type="text" value={editedMember.role || ''} onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })} />
                                ) : (
                                    member.role
                                )}
                            </td>
                            <td>
                                {editingMemberId === member.id ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(member.id)}>Save</button>
                                        <button onClick={() => setEditingMemberId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(member)}>Edit</button>
                                        <button onClick={() => handleDelete(member.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {showNewMemberForm && (
                        <tr>
                            <td>{members.length + 1}</td>
                            <td><input type="text" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} /></td>
                            <td><input type="text" placeholder="Number" value={newMember.number} onChange={(e) => setNewMember({ ...newMember, number: e.target.value })} /></td>
                            <td><input type="text" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} /></td>
                            <td><input type="text" placeholder="Note" value={newMember.note} onChange={(e) => setNewMember({ ...newMember, note: e.target.value })} /></td>
                            <td><input type="text" placeholder="Role" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} /></td>
                            <td>
                                <button onClick={handleAddMember}>Save</button>
                                <button onClick={() => setShowNewMemberForm(false)}>Cancel</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );





    if (!isLoggedIn) {
        return (
            <div className = "admin-container">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
            </div>
        );
    } else {
        return (
            <div className="admin-container">
                <h2>VARLAB Mixed Reality Interactive Mural Admin Panel</h2>
                {renderTabs()}
                {activeTab === 'models' ? renderModelsTab() : renderMembersTab()}
            </div>
        );
    }
}

export default AdminComponent;
