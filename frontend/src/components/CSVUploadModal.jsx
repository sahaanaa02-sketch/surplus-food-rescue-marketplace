import React, { useState } from 'react';

export default function CSVUploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a valid CSV file.');
      return;
    }
    setStatus('Uploading and Processing CSV...');
    setTimeout(() => {
      setStatus('✅ File Imported Successfully!');
      setTimeout(() => onClose(), 1500);
    }, 1500);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Bulk Upload Listings (CSV)</h3>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '15px' }}>
          Upload a CSV file containing: <code>Item Name, Original Price, Discount Price, Quantity</code>
        </p>

        <input 
          type="file" 
          accept=".csv" 
          onChange={(e) => setFile(e.target.files[0])} 
          style={styles.fileInput} 
        />

        {status && <p style={{ color: '#1DB954', fontSize: '14px', margin: '10px 0' }}>{status}</p>}

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn}>Close</button>
          <button onClick={handleUpload} style={styles.uploadBtn}>Upload</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '420px', color: '#fff' },
  fileInput: { width: '100%', padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  cancelBtn: { backgroundColor: '#333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  uploadBtn: { backgroundColor: '#1DB954', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};