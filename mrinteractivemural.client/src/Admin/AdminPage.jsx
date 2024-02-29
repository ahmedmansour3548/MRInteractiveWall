import { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    

    const center = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: '24px',
        color: 'Black',
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('file', file);
            console.log(file)

            const response = await axios.post('https://localhost:7121/api/move', formData.name, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('File uploaded successfully:', response.data);
            console.log('Name:', name);
            console.log('Email:', email);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div style={center}>
            <h1>Admin Page</h1>
            <div>
                <label>Name:</label>
                <input
                type="text"
                value={name}
                onChange={handleNameChange}
                required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                />
            </div>
            <h2>Upload the files to the server here.</h2>
            <br></br>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default AdminPage;