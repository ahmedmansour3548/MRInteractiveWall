import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import THREEx from './threex-arpatternfile';

function AdminComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Tabs control
    const [activeTab, setActiveTab] = useState('models');

    // Members state
    const [members, setMembers] = useState([]);
    const [memberNames, setMemberNames] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [showNewMemberForm, setShowNewMemberForm] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', number: '', email: '', note: '', role: '' });
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editedMember, setEditedMember] = useState({});

    // Models state
    const [models, setModels] = useState([]);
    const [newModel, setNewModel] = useState({ modelName: '', labMemberID: '', modelFilePath: '', modelFileName: '' });
    const [editingModelId, setEditingModelId] = useState(null);
    const [editedModel, setEditedModel] = useState({});
    const [showModelPanel, setShowModelPanel] = useState(false);
    const [modelFile, setModelFile] = useState(null);

    const [exampleMarkerURL, setExampleMarkerURL] = useState('');
    const [innerImageURL, setInnerImageURL] = useState(null);
    const [fullMarkerURL, setFullMarkerURL] = useState(null);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [showMemberPanel, setShowMemberPanel] = useState(false);
    const [imageName, setImageName] = useState();
    const [patternRatio, setPatternRatio] = useState(50);
    const [imageSize, setImageSize] = useState(512);

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
        setEditedModel({});
        try {
            const response = await axios.get('https://localhost:7121/api/models');
            setModels(response.data);
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    };

    const handleAddNewModel = () => {
        setEditedModel({});
        setEditingModelId(null);
        setShowModelPanel(true);
    };

    const handleAddModel = async () => {
        try {
            await axios.post('https://localhost:7121/api/models', editedModel);
            setNewModel({ modelName: '', labMemberID: '', modelFilePath: '', modelFileName: '' });

            const formData = new FormData();
            formData.append('file', modelFile);
            console.log(modelFile);
            const response = await axios.post('https://localhost:7121/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                alert('File uploaded successfully!');
            } else {
                alert('Error uploading file. Please try again later.');
            }
            populateModels();
        } catch (error) {
            console.error('Error adding model:', error);
        }
    };

    const handleSaveEditModel = async () => {
        try {
            await axios.put(`https://localhost:7121/api/models/${editedModel.id}`, editedModel);
            setEditedModel({});
            setEditingModelId(null);
            populateModels();
            setShowModelPanel(false);
        } catch (error) {
            console.error('Error saving edited model:', error);
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
            const memberNames = response.data.map(member => member.name);
            setMemberNames(memberNames);
            setMembers(response.data);
            console.log("Number of members in database: " + memberNames.length);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };


    useEffect(() => {
        if (activeTab === 'members') {
            populateMembers();
        }
        else if (activeTab === 'models') {
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

    const handleAddNewMember = () => {
        setEditedMember({});
        setEditingMemberId(null);
        setShowMemberPanel(true);
    };

    const handleEditModel = (model) => {
        setEditedModel({ ...model });
        setEditingModelId(model.id);
        setShowModelPanel(true);
    };

    const handleCancelModelEdit = () => {
        setEditedModel({});
        setEditingModelId(null);
        setShowModelPanel(false);
    };

    // Function to handle image upload and display
    // Code logic from: https://github.com/jeromeetienne/AR.js/blob/master/three.js/examples/marker-training/examples/generator.html#L263
    const handleMarkerUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        setImageName(file.name);
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            setInnerImageURL(imageUrl);
            buildFullMarker(imageUrl);
        };
        reader.readAsDataURL(file);
    };

    const buildFullMarker = (imageUrl) => {
        THREEx.ArPatternFile.buildFullMarker(
            imageUrl,
            patternRatio / 100,
            imageSize,
            'black',
            function onComplete(markerUrl) {
                setFullMarkerURL(markerUrl);
                
                setShowDownloadButton(true);
            }
        );

        // Preview
        THREEx.ArPatternFile.buildFullMarker(
            imageUrl,
            patternRatio / 100,
            512,
            'black',
            function onComplete(markerUrl) {
                setExampleMarkerURL(markerUrl);
            }
        );
    };
    const handleDownloadPattern = () => {
        // Initiate download
        THREEx.ArPatternFile.encodeImageURL(fullMarkerURL, function onComplete(patternFileString) {
            THREEx.ArPatternFile.triggerDownload(patternFileString, "pattern-" + (imageName || "marker") + ".patt")
        })
    };

    const handleModelUpload = (event) => {
        setModelFile(event.target.files[0]);
    };

    const handleEditMember = (member) => {
        setEditedMember({ ...member });
        setEditingMemberId(member.id);
        setShowMemberPanel(true);
    };

    const handleCancelMemberEdit = () => {
        setEditedMember({}); // Reset editedMember state
        setEditingMemberId(null); // Reset editingMemberId state
        setShowMemberPanel(false);
    };

    const handleDeleteMember = async (memberId) => {
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

    const handleSaveEditMember = async (memberId) => {
        try {
            await axios.put(`https://localhost:7121/api/members/${memberId}`, editedMember);
            setEditedMember({}); // Reset editedMember state
            setEditingMemberId(null); // Reset editingMemberId state
            populateMembers(); // Refresh list
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const handlePatternRatioChange = (event) => {
        const newRatio = event.target.value;
        setPatternRatio(newRatio);
        buildFullMarker(innerImageURL);
    };

    const handleImageSizeChange = (event) => {
        const newSize = event.target.value;
        setImageSize(newSize);
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
            <button type="button" onClick={() => handleAddNewModel()}>Add New Model</button>

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
                                {model.modelName}
                            </td>
                            <td>
                                {model.labMemberID}
                            </td>
                            <td>
                                {model.modelFilePath}
                            </td>
                            <td>
                                {model.modelFileName}
                            </td>
                            <td>
                                <button onClick={() => handleEditModel(model)}>Edit</button>
                                <button onClick={() => handleDeleteModel(model.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {showModelPanel && (
                        <div className="floating-panel-overlay">
                            <div className="floating-panel">
                                {/* Title of the floating panel */}
                                <h3>{editingModelId !== null ? 'Edit Model' : 'Add New Model'}</h3>
                                {/* Input fields */}
                                <input
                                    type="text"
                                    placeholder="Model Name"
                                    value={editedModel ? editedModel.modelName : ''}
                                    onChange={(e) => setEditedModel({ ...editedModel, modelName: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Lab Member ID"
                                    value={editedModel ? editedModel.labMemberID : ''}
                                    onChange={(e) => setEditedModel({ ...editedModel, labMemberID: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Model File Path"
                                    value={editedModel ? editedModel.modelFilePath : ''}
                                    onChange={(e) => setEditedModel({ ...editedModel, modelFilePath: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Model File Name"
                                    value={editedModel ? editedModel.modelFileName : ''}
                                    onChange={(e) => setEditedModel({ ...editedModel, modelFileName: e.target.value })}
                                />
                                <input type="file" onChange={handleModelUpload} />
                                {/* Save and Cancel buttons */}
                                <button onClick={editingModelId !== null ? handleSaveEditModel : handleAddModel}>Save</button>
                                <button onClick={() => handleCancelModelEdit()}>Cancel</button>
                            </div>
                        </div>
                    )}
                </tbody>
            </table>
        </div>
    );



    const renderMembersTab = () => (
        <div>
            <h3>Members</h3>
            <button type="button" onClick={() => handleAddNewMember()}>Add New Member</button>

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
                                {member.name}
                            </td>
                            <td>
                                {member.number}
                            </td>
                            <td>
                                {member.email}
                            </td>
                            <td>
                                {member.note}
                            </td>
                            <td>
                                {member.role}
                            </td>
                            <td>
                                <button onClick={() => handleEditMember(member)}>Edit</button>
                                <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Floating panel for adding new member */}
            {showMemberPanel && (
                <div className="floating-panel-overlay">
                    <div className="floating-panel">
                        <h3>{editingMemberId !== null ? 'Edit Member' : 'Add New Member'}</h3>
                        {/* Input fields for adding or editing a member */}
                        <input type="text" placeholder="Name" value={editedMember.name} onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })} />
                        <input type="text" placeholder="Number" value={editedMember.number} onChange={(e) => setEditedMember({ ...editedMember, number: e.target.value })} />
                        <input type="text" placeholder="Email" value={editedMember.email} onChange={(e) => setEditedMember({ ...editedMember, email: e.target.value })} />
                        <input type="text" placeholder="Note" value={editedMember.note} onChange={(e) => setEditedMember({ ...editedMember, note: e.target.value })} />
                        <input type="text" placeholder="Role" value={editedMember.role} onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })} />
                        <h3>Upload Marker Image</h3>
                        <input type="file" accept=".png" onChange={handleMarkerUpload} />
                        {showDownloadButton && (
                            <button onClick={handleDownloadPattern}>Download Pattern</button>
                        )}
                        <div id="imageContainer">
                            {exampleMarkerURL && <img src={exampleMarkerURL} alt="Marker Preview" />}
                        </div>
                        {/* Pattern ratio and image size settings */}
                        {innerImageURL && (
                            <div>
                                <label htmlFor="patternRatioSlider">Pattern Ratio</label>
                                <input
                                    id="patternRatioSlider"
                                    type="range"
                                    min="10"
                                    max="90"
                                    value={patternRatio}
                                    onChange={handlePatternRatioChange}
                                />
                                <span>{patternRatio / 100}</span>
                            </div>
                        )}
                        {innerImageURL && (
                            <div>
                                <label htmlFor="imageSizeSlider">Image Size</label>
                                <input
                                    id="imageSizeSlider"
                                    type="range"
                                    min="150"
                                    max="2500"
                                    value={imageSize}
                                    onChange={handleImageSizeChange}
                                />
                                <span>{imageSize} px</span>
                            </div>
                        )}
                        <button onClick={editingMemberId !== null ? () => handleSaveEditMember(editingMemberId) : handleAddMember}>Save</button>
                        <button onClick={() => handleCancelMemberEdit()}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );

    if (!isLoggedIn) {
        return (
            <div className="admin-container">
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
