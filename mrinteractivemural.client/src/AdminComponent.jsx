import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import THREEx from './threex-arpatternfile';

function AdminComponent() {
    const [githubApiKey, setGithubApiKey] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Tabs control
    const [activeTab, setActiveTab] = useState('members');

    // Members state
    const [folderNames, setFolderNames] = useState({});
    const [patternFile, setPatternFile] = useState({});
    const [paramFile, setParamFile] = useState({});
    const [modelFile, setModelFile] = useState(null);

    const [exampleMarkerURL, setExampleMarkerURL] = useState('');
    const [innerImageURL, setInnerImageURL] = useState(null);
    const [fullMarkerURL, setFullMarkerURL] = useState(null);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [imageName, setImageName] = useState();
    const [patternRatio, setPatternRatio] = useState(50);
    const [imageSize, setImageSize] = useState(512);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // Authenticate using the GitHub API key
            const response = await axios.post('https://localhost:7121/api/admin/login', { githubApiKey });
            if (response.status === 200) {
                setIsLoggedIn(true);
                setLoginError('');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsLoggedIn(false);
            setLoginError('Failed to log in. Please check your API key.');
        }
    };

    const populateMembers = async () => {
        try {
            const response = await axios.get('https://localhost:7121/api/getFiles');
            setFolderNames(response.data);
        } catch (error) {
            console.error('Error fetching folders from GitHub repo:', error);
        }
    };

    useEffect(() => {
        populateMembers();
    }, []);

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
        THREEx.ArPatternFile.encodeImageURL(fullMarkerURL, function onComplete(patternFileString) {
            THREEx.ArPatternFile.triggerDownload(patternFileString, "pattern-" + (imageName || "marker") + ".patt")
        })
    };

    const handleModelUpload = (event) => {
        setModelFile(event.target.files[0]);
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
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model</th>
                        <th>Pattern</th>
                        <th>Param</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(folderNames).map((folderId) => (
                        <tr key={folderId}>
                            <td>{folderId}</td>
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
            {/* Floating panel for file uploads */}
            {innerImageURL && (
                <div className="floating-panel-overlay">
                    <div className="floating-panel">
                        <h3>Upload Files</h3>
                        <div>
                            <label htmlFor="modelUpload">Upload Model</label>
                            <input id="modelUpload" type="file" accept=".glb,.gltf" onChange={handleModelUpload} />
                        </div>
                        <div>
                            <label htmlFor="patternUpload">Upload .patt</label>
                            <input id="patternUpload" type="file" accept=".patt" onChange={(e) => setPatternFile(e.target.files[0])} />
                        </div>
                        <div>
                            <label htmlFor="paramUpload">Upload param.json</label>
                            <input id="paramUpload" type="file" accept=".json" onChange={(e) => setParamFile(e.target.files[0])} />
                        </div>
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
                        <button onClick={handleAddMember}>Save</button>
                        <button onClick={() => setShowMemberPanel(false)}>Cancel</button>
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
                        <label>GitHub API Key:</label>
                        <input type="text" value={githubApiKey} onChange={(e) => setGithubApiKey(e.target.value)} />
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