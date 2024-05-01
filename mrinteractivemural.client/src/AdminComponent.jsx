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

    const [folderNames, setFolderNames] = useState({});
    const [patternFile, setPatternFile] = useState({});
    const [paramFile, setParamFile] = useState({});

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


    const populateMembers = async () => {
        try {
            const response = await axios.get('https://localhost:7121/api/getFiles');
            // Set folderNames as an object
            setFolderNames(response.data);
            console.log("Number of folders in GitHub repo: " + Object.keys(response.data).length);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching folders from GitHub repo:', error);
        }
    };



    useEffect(() => {
            populateMembers();
    }, []);

    const handleAddMember = async () => {
        try {
            // Generate folder name for the new member
            const folderName = Object.keys(folderNames).length + 1;

            // Upload member data along with files to GitHub
            const formData = new FormData();

            // Append folder name, model, .patt, and .json files
            formData.append('folderName', folderName);
            formData.append('modelFile', modelFile);
            formData.append('pattFile', patternFile);
            formData.append('paramFile', paramFile);

            // Call the API to upload member data and files to GitHub
            await axios.post('https://localhost:7121/api/uploadNewMember', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Reset form and refresh members list
            setNewMember({ name: '', number: '', email: '', note: '', role: '' });
            setShowNewMemberForm(false);
            populateMembers();
        } catch (error) {
            console.error('Error adding new member:', error);
        }
    };



    const handleAddNewMember = () => {
        setEditedMember({});
        setEditingMemberId(null);
        setShowMemberPanel(true);
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
    const handleDeleteFolder = async (folderId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this folder?");
        if (userConfirmed) {
            try {
                await axios.delete(`https://localhost:7121/api/deleteGitHubFolder/${folderId}`);
                populateMembers(); // Refresh list
            } catch (error) {
                console.error('Error deleting folder:', error);
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


    const extractFilename = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const renderMembersTab = () => (
        <div>
            <h3>Members</h3>
            <button type="button" onClick={() => handleAddNewMember()}>Add New Member</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model</th>
                        <th>Pattern</th>
                        <th>Param</th>
                        <th>Action</th> {/* New column for delete button */}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(folderNames).map((folderId) => (
                        <tr key={folderId}>
                            <td>{folderId}</td>
                            {/* Display the filenames of model, pattern, and param */}
                            <td><a href={folderNames[folderId].model} target="_blank" rel="noopener noreferrer">{extractFilename(folderNames[folderId].model)}</a></td>
                            <td><a href={folderNames[folderId].pattern} target="_blank" rel="noopener noreferrer">{extractFilename(folderNames[folderId].pattern)}</a></td>
                            <td><a href={folderNames[folderId].param} target="_blank" rel="noopener noreferrer">{extractFilename(folderNames[folderId].param)}</a></td>
                            <td>
                                <button onClick={() => handleDeleteFolder(folderId)}>Delete</button>
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

                        {/* File upload UI elements */}
                        <div>
                            <label htmlFor="modelUpload">Upload Model</label>
                            <input id="modelUpload" type="file" accept=".glb,.gltf" onChange={(e) => setModelFile(e.target.files[0])} />
                        </div>
                        <div>
                            <label htmlFor="patternUpload">Upload .patt</label>
                            <input id="patternUpload" type="file" accept=".patt" onChange={(e) => setPatternFile(e.target.files[0])} />
                        </div>
                        <div>
                            <label htmlFor="paramUpload">Upload param.json</label>
                            <input id="paramUpload" type="file" accept=".json" onChange={(e) => setParamFile(e.target.files[0])} />
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
                {renderMembersTab()}
            </div>
        );
    }
}

export default AdminComponent;
