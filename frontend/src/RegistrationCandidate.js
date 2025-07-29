// TEMP: forcing git to detect change
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API';

export default function RegistrationCandidate() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);

  const [formData, setFormData] = useState({
    sinhalaName: '',
    fullName: '',
    sinhalaUserName: '',
    userName: '',
    id: '',
    dob: '',
    gender: '',
    address: '',
    electionId: '',
    partyId: '',
    candidateId: '',
    candidateNumber: ''
  });

  // Load elections and parties on component mount
  useEffect(() => {
    loadElections();
    loadParties();
  }, []);

  const loadElections = async () => {
    try {
      const response = await API.get('/api/admin/get_elections.php');
      if (response.data.status === 'success') {
        setElections(response.data.data);
      }
    } catch (error) {
      console.error('Error loading elections:', error);
    }
  };

  const loadParties = async () => {
    try {
      const response = await API.get('/api/admin/get_parties.php');
      if (response.data.status === 'success') {
        setParties(response.data.data);
      }
    } catch (error) {
      console.error('Error loading parties:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.sinhalaName.trim()) newErrors.sinhalaName = 'Sinhala name is required';
    if (!formData.userName.trim()) newErrors.userName = 'User name is required';
    if (!formData.sinhalaUserName.trim()) newErrors.sinhalaUserName = 'Sinhala user name is required';
    if (!formData.candidateId.trim()) newErrors.candidateId = 'Candidate ID is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.electionId) newErrors.electionId = 'Election ID is required';
    if (!formData.partyId) newErrors.partyId = 'Party ID is required';

    // NIC validation
    const nicPattern = /^(\d{9}[vVxX]|\d{12})$/;
    if (!formData.id.trim()) {
      newErrors.id = 'NIC is required';
    } else if (!nicPattern.test(formData.id)) {
      newErrors.id = 'Invalid NIC format';
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 35) {
        newErrors.dob = 'Candidate must be at least 35 years old';
      }
    }

    // Candidate number validation
    if (!formData.candidateNumber) {
      newErrors.candidateNumber = 'Candidate number is required';
    } else if (isNaN(formData.candidateNumber) || formData.candidateNumber < 1) {
      newErrors.candidateNumber = 'Candidate number must be a positive number';
    }

    // Image validation
    if (!imageFile) {
      newErrors.image = 'Candidate image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append image file if selected
      if (imageFile) {
        submitData.append('candidateImage', imageFile);
      }

      const response = await API.post('/api/admin/register_candidate.php', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        alert('Candidate Registration Successful!');
        handleClear();
      } else {
        alert(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert('Registration failed: ' + error.response.data.message);
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or GIF)');
        e.target.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5000000) {
        alert('Image file size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImageFile(null);
    setErrors({});
    setFormData({
      sinhalaName: '',
      fullName: '',
      sinhalaUserName: '',
      userName: '',
      id: '',
      dob: '',
      gender: '',
      address: '',
      electionId: '',
      partyId: '',
      candidateId: '',
      candidateNumber: ''
    });
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  return (
    <>
      <div className="bg-container">
        <div className="form-container">
          <h1>
            අපේක්ෂකයා ලියාපදිංචි කිරීමේ පෝරමය<br />
            REGISTRATION FORM CANDIDATE
          </h1>

          <form onSubmit={handleSubmit}>
            <table className="form-table">
              <tbody>
                {/* Sinhala Name */}
                <tr>
                  <td>සම්පූර්ණ නම</td>
                  <td>
                    <input 
                      type="text" 
                      name="sinhalaName" 
                      value={formData.sinhalaName}
                      onChange={handleInputChange}
                      placeholder="සම්පූර්ණ නම" 
                      required 
                      className={errors.sinhalaName ? 'error' : ''}
                    />
                    {errors.sinhalaName && <span className="error-text">{errors.sinhalaName}</span>}
                  </td>
                </tr>

                {/* Full Name */}
                <tr>
                  <td>Full Name</td>
                  <td>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name" 
                      required 
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </td>
                </tr>

                {/* Sinhala User Name */}
                <tr>
                  <td>නාම ලේකනයේ නම</td>
                  <td>
                    <input 
                      type="text" 
                      name="sinhalaUserName" 
                      value={formData.sinhalaUserName}
                      onChange={handleInputChange}
                      required 
                      className={errors.sinhalaUserName ? 'error' : ''}
                    />
                    {errors.sinhalaUserName && <span className="error-text">{errors.sinhalaUserName}</span>}
                  </td>
                </tr>

                {/* User Name */}
                <tr>
                  <td>User Name</td>
                  <td>
                    <input 
                      type="text" 
                      name="userName" 
                      value={formData.userName}
                      onChange={handleInputChange}
                      required 
                      className={errors.userName ? 'error' : ''}
                    />
                    {errors.userName && <span className="error-text">{errors.userName}</span>}
                  </td>
                </tr>

                {/* NIC */}
                <tr>
                  <td>ජා.හැ.අන්කය<br />ID</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="id" 
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="NIC Number (e.g., 123456789V or 123456789012)"
                      required
                      className={errors.id ? 'error' : ''}
                    />
                    {errors.id && <span className="error-text">{errors.id}</span>}
                  </td>
                </tr>

                {/* Date of Birth */}
                <tr>
                  <td>උපන් දිනය<br />Date of Birth</td>
                  <td>
                    <input 
                      type="date" 
                      name="dob" 
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className={errors.dob ? 'error' : ''}
                    />
                    {errors.dob && <span className="error-text">{errors.dob}</span>}
                  </td>
                </tr>

                {/* Gender */}
                <tr>
                  <td>ස්ත්‍රී/පුරුෂ<br />Gender</td>
                  <td>
                    <select 
                      name="gender" 
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className={errors.gender ? 'error' : ''}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                  </td>
                </tr>

                {/* Address */}
                <tr>
                  <td>ලිපිනය<br />Address</td>
                  <td colSpan="3">
                    <textarea 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Complete Address"
                      required 
                      rows="3"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </td>
                </tr>

                {/* Candidate Image */}
                <tr>
                  <td>ඡායාරූපය<br />Candidate Image</td>
                  <td colSpan="3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      required
                      className={errors.image ? 'error' : ''}
                    />
                    {errors.image && <span className="error-text">{errors.image}</span>}
                    <small>Max size: 5MB. Supported formats: JPEG, PNG, GIF</small>
                  </td>
                </tr>

                {selectedImage && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      <img
                        src={selectedImage}
                        alt="Candidate Preview"
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          objectFit: 'cover', 
                          marginTop: '10px', 
                          borderRadius: '10px',
                          border: '2px solid #ddd'
                        }}
                      />
                    </td>
                  </tr>
                )}

                {/* Election ID */}
                <tr>
                  <td>Election ID</td>
                  <td>
                    <select 
                      name="electionId" 
                      value={formData.electionId}
                      onChange={handleInputChange}
                      required
                      className={errors.electionId ? 'error' : ''}
                    >
                      <option value="">Select Election</option>
                      {elections.map(election => (
                        <option key={election.Election_ID} value={election.Election_ID}>
                          {election.Election_ID} - {election.Election_Type}
                        </option>
                      ))}
                    </select>
                    {errors.electionId && <span className="error-text">{errors.electionId}</span>}
                  </td>
                </tr>

                {/* Party ID */}
                <tr>
                  <td>Party ID</td>
                  <td>
                    <select 
                      name="partyId" 
                      value={formData.partyId}
                      onChange={handleInputChange}
                      required
                      className={errors.partyId ? 'error' : ''}
                    >
                      <option value="">Select Party</option>
                      {parties.map(party => (
                        <option key={party.Party_ID} value={party.Party_ID}>
                          {party.Party_ID} - {party.PartyName_English}
                        </option>
                      ))}
                    </select>
                    {errors.partyId && <span className="error-text">{errors.partyId}</span>}
                  </td>
                </tr>

                {/* Candidate ID */}
                <tr>
                  <td>Candidate ID</td>
                  <td>
                    <input 
                      type="text" 
                      name="candidateId" 
                      value={formData.candidateId}
                      onChange={handleInputChange}
                      placeholder="Unique Candidate ID" 
                      required 
                      className={errors.candidateId ? 'error' : ''}
                    />
                    {errors.candidateId && <span className="error-text">{errors.candidateId}</span>}
                  </td>
                </tr>

                {/* Candidate Number */}
                <tr>
                  <td>Candidate Number</td>
                  <td>
                    <input 
                      type="number" 
                      name="candidateNumber" 
                      value={formData.candidateNumber}
                      onChange={handleInputChange}
                      placeholder="Ballot Number" 
                      required 
                      min="1"
                      className={errors.candidateNumber ? 'error' : ''}
                    />
                    {errors.candidateNumber && <span className="error-text">{errors.candidateNumber}</span>}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="submit-btn" onClick={handleClear}>
                Clear
              </button>
              <button type="button" className="submit-btn" onClick={handleBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .error {
          border: 2px solid #ff4444 !important;
        }
        .error-text {
          color: #ff4444;
          font-size: 12px;
          display: block;
          margin-top: 5px;
        }
        .form-table input, .form-table select, .form-table textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .button-group {
          margin-top: 20px;
          text-align: center;
        }
        .submit-btn {
          margin: 0 10px;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-btn:hover {
          background-color: #0056b3;
        }
        .submit-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}