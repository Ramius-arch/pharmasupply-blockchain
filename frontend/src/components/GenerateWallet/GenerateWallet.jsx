import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './GenerateWallet.css'; // Import component-specific CSS

const GenerateWallet = () => {
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateWallet = async () => {
    setLoading(true);
    setError('');
    setAddress('');
    setPrivateKey('');

    try {
      const response = await axios.post('/api/wallet/generate');
      setAddress(response.data.data.address);
      setPrivateKey(response.data.data.privateKey);
      toast.success('New wallet generated!');
    } catch (err) {
      console.error('Error generating wallet:', err);
      setError('Failed to generate wallet. Please try again.');
      toast.error('Failed to generate wallet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-wallet-container">
      <h1>Generate New Blockchain Wallet</h1>
      <p className="warning-text">
        WARNING: This generates an Ethereum private key. Keep it absolutely secret!
        Never share it. Loss of private key means loss of funds.
      </p>

      <button onClick={handleGenerateWallet} disabled={loading} className="generate-btn">
        {loading ? 'Generating...' : 'Generate Wallet'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {address && privateKey && (
        <div className="wallet-details">
          <h2>Generated Wallet Details:</h2>
          <div className="detail-group">
            <label>Address:</label>
            <p className="wallet-address">{address}</p>
            <button onClick={() => navigator.clipboard.writeText(address)} className="copy-btn">Copy Address</button>
          </div>
          <div className="detail-group">
            <label>Private Key:</label>
            <p className="wallet-private-key">{privateKey}</p>
            <button onClick={() => navigator.clipboard.writeText(privateKey)} className="copy-btn copy-private-key">Copy Private Key</button>
          </div>
          <p className="secure-storage-reminder">
            Securely store your private key offline. Do not keep it on this device or share it!
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerateWallet;
