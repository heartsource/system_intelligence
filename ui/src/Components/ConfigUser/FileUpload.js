import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [files, setFiles] = useState(null);

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading files: ', error);
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
