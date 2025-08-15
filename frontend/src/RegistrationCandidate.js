import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API';
import './Css/RegistrationCandidate.css';

export default function RegistrationCandidate() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    userNameSinhala: '',
    userNameEnglish: '',
    nic: '',
    dob: '',
    gender: '',
    electionId: '',
    partyId: '',
    candidateId: ''
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

  // Fixed NIC validation function
  const validateNIC = (nic) => {
    const cleanNIC = nic.replace(/\s/g, '').toUpperCase();
    const oldFormat = /^(\d{9})[VX]$/;
    const newFormat = /^\d{12}$/;
    
    if (oldFormat.test(cleanNIC)) {
      return { isValid: true, format: 'old', cleanNIC };
    } else if (newFormat.test(cleanNIC)) {
      return { isValid: true, format: 'new', cleanNIC };
    }
    
    return { isValid: false, cleanNIC };
  };

  // Extract gender from NIC - NEW FUNCTION
  const extractGenderFromNIC = (nic) => {
    const validation = validateNIC(nic);
    if (!validation.isValid) return null;

    try {
      let days;
      
      if (validation.format === 'old') {
        // Old format: YYDDDXXXV
        days = parseInt(validation.cleanNIC.substring(2, 5));
      } else {
        // New format: YYYYDDDXXXXX
        days = parseInt(validation.cleanNIC.substring(4, 7));
      }
      
      // If days > 500, it's female, otherwise male
      return days > 500 ? 'Female' : 'Male';
    } catch (error) {
      console.error('Error extracting gender from NIC:', error);
      return null;
    }
  };

  // Fixed extract date of birth from NIC - matches PHP logic exactly
  const extractDOBFromNIC = (nic) => {
    const validation = validateNIC(nic);
    if (!validation.isValid) return null;

    try {
      if (validation.format === 'old') {
        // Old format: YYDDDXXXV
        let year = parseInt(validation.cleanNIC.substring(0, 2));
        let days = parseInt(validation.cleanNIC.substring(2, 5));
        
        // Determine full year (assuming birth years 1900-2099)
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        
        // Calculate actual days (subtract 500 if female - days > 500)
        const actualDays = days > 500 ? days - 500 : days;
        
        // Create date from January 1st + (days - 1) - matches PHP logic
        const date = new Date(fullYear, 0, 1); // January 1
        date.setDate(date.getDate() + (actualDays - 1)); // Add (actualDays - 1) days
        
        // Format as YYYY-MM-DD using local date to avoid timezone issues
        const year_str = date.getFullYear();
        const month_str = String(date.getMonth() + 1).padStart(2, '0');
        const day_str = String(date.getDate()).padStart(2, '0');
        return `${year_str}-${month_str}-${day_str}`;
      } else {
        // New format: YYYYDDDXXXXX
        const year = parseInt(validation.cleanNIC.substring(0, 4));
        let days = parseInt(validation.cleanNIC.substring(4, 7));
        
        // Calculate actual days (subtract 500 if female - days > 500)
        const actualDays = days > 500 ? days - 500 : days;
        
        // Validate day range (1-366 for leap years)
        if (actualDays < 1 || actualDays > 366) {
          console.error('Invalid day of year in NIC:', actualDays);
          return null;
        }
        
        // Check if it's a leap year
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const maxDays = isLeapYear ? 366 : 365;
        
        if (actualDays > maxDays) {
          console.error('Day of year exceeds maximum for year:', actualDays, '>', maxDays);
          return null;
        }
        
        // Create date from January 1st + (days - 1) - matches PHP logic exactly
        const date = new Date(year, 0, 1); // January 1
        date.setDate(date.getDate() + (actualDays - 1)); // Add (actualDays - 1) days
        
        // Format as YYYY-MM-DD using local date to avoid timezone issues
        const year_str = date.getFullYear();
        const month_str = String(date.getMonth() + 1).padStart(2, '0');
        const day_str = String(date.getDate()).padStart(2, '0');
        return `${year_str}-${month_str}-${day_str}`;
      }
    } catch (error) {
      console.error('Error extracting DOB from NIC:', error);
      return null;
    }
  };

  // Generate next candidate ID
  const generateCandidateId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `CANDIDATE${timestamp}`;
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation - allow more characters including common punctuation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name should contain only English letters, spaces, periods, hyphens, and apostrophes';
    }

    // Sinhala User Name validation - improved Unicode range
    if (!formData.userNameSinhala.trim()) {
      newErrors.userNameSinhala = 'User name in Sinhala is required';
    } else if (!/^[\u0D80-\u0DFF\s]+$/.test(formData.userNameSinhala.trim())) {
      newErrors.userNameSinhala = 'User name should contain only Sinhala characters and spaces';
    }

    // English User Name validation
    if (!formData.userNameEnglish.trim()) {
      newErrors.userNameEnglish = 'User name in English is required';
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.userNameEnglish.trim())) {
      newErrors.userNameEnglish = 'User name should contain only English letters, spaces, periods, hyphens, and apostrophes';
    }

    // NIC validation
    if (!formData.nic.trim()) {
      newErrors.nic = 'National Identity Card (NIC) is required';
    } else {
      const nicValidation = validateNIC(formData.nic);
      if (!nicValidation.isValid) {
        newErrors.nic = 'Please enter a valid Sri Lankan NIC (e.g., 123456789V or 200012345678)';
      }
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      
      if (age < 35) {
        newErrors.dob = 'Candidate must be at least 35 years old for presidential election';
      }

      // Check if birthDate is in the future
      if (birthDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }

      // Validate DOB matches NIC exactly - strict validation
      if (formData.nic.trim()) {
        const nicDOB = extractDOBFromNIC(formData.nic);
        if (nicDOB && nicDOB !== formData.dob) {
          newErrors.dob = `Date of birth must exactly match with NIC. NIC indicates: ${nicDOB}`;
        } else if (!nicDOB) {
          newErrors.dob = 'Unable to extract valid date from NIC. Please check your NIC number.';
        }
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Election and Party validation
    if (!formData.electionId) {
      newErrors.electionId = 'Election selection is required';
    }

    if (!formData.partyId) {
      newErrors.partyId = 'Party selection is required';
    }

    // Candidate ID validation - improved pattern
    if (!formData.candidateId.trim()) {
      newErrors.candidateId = 'Candidate ID is required';
    } else if (!/^CANDIDATE\d{1,10}$/.test(formData.candidateId.trim())) {
      newErrors.candidateId = 'Candidate ID must be in format CANDIDATE followed by numbers (e.g., CANDIDATE1, CANDIDATE123456)';
    }

    // Image validation
    if (!imageFile) {
      newErrors.image = 'Candidate image is required';
    } else {
      // Additional file validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (imageFile.size > maxSize) {
        newErrors.image = 'Image file size must be less than 5MB';
      } else if (!allowedTypes.includes(imageFile.type)) {
        newErrors.image = 'Please select a valid image file (JPEG, PNG, or GIF)';
      }
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

    // Auto-extract DOB and Gender from NIC - UPDATED
    if (name === 'nic' && value.trim()) {
      try {
        // Extract DOB
        const extractedDOB = extractDOBFromNIC(value);
        if (extractedDOB) {
          setFormData(prev => ({
            ...prev,
            dob: extractedDOB
          }));
          console.log('Auto-extracted DOB from NIC:', value, '->', extractedDOB);
        } else {
          console.log('Could not extract DOB from NIC:', value);
        }

        // Extract Gender - NEW FEATURE
        const extractedGender = extractGenderFromNIC(value);
        if (extractedGender) {
          setFormData(prev => ({
            ...prev,
            gender: extractedGender
          }));
          console.log('Auto-extracted Gender from NIC:', value, '->', extractedGender);
        } else {
          console.log('Could not extract gender from NIC:', value);
        }
      } catch (error) {
        console.error('Error auto-extracting from NIC:', error);
        // Don't update DOB or Gender if extraction fails
      }
    }

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePartyChange = (e) => {
    const selectedPartyId = e.target.value;
    setFormData(prev => ({
      ...prev,
      partyId: selectedPartyId
    }));

    // Find and set party details
    const party = parties.find(party => party.Party_ID === selectedPartyId);
    if (party) {
      setSelectedParty(party);
    } else {
      setSelectedParty(null);
    }

    // Clear error
    if (errors.partyId) {
      setErrors(prev => ({
        ...prev,
        partyId: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Image file:', imageFile);
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setLoading(true);

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      
      // Append all form data
      submitData.append('fullName', formData.fullName.trim());
      submitData.append('userNameSinhala', formData.userNameSinhala.trim());
      submitData.append('userNameEnglish', formData.userNameEnglish.trim());
      submitData.append('nic', formData.nic.trim());
      submitData.append('dob', formData.dob);
      submitData.append('gender', formData.gender);
      submitData.append('electionId', formData.electionId);
      submitData.append('partyId', formData.partyId);
      submitData.append('candidateId', formData.candidateId.trim());

      // Append image file if selected
      if (imageFile) {
        submitData.append('candidateImage', imageFile);
      }

      console.log('Submitting data...');
      
      const response = await API.post('/api/admin/register_candidate.php', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Response received:', response.data);

      if (response.data.status === 'success') {
        const selectedPartyData = parties.find(p => p.Party_ID === formData.partyId);
        const selectedElection = elections.find(e => e.Election_ID === formData.electionId);
        
        setSuccessData({
          candidateId: formData.candidateId,
          fullName: formData.fullName,
          partyName: selectedPartyData ? selectedPartyData.PartyName_English : 'Unknown',
          electionType: selectedElection ? selectedElection.Election_Type : 'Unknown',
          extractedDOB: response.data.data.extracted_dob,
          submittedDOB: response.data.data.submitted_dob
        });
        setShowSuccessModal(true);
        handleClear();
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Registration failed: ' + errorMessage);
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
    setSelectedParty(null);
    setErrors({});
    setFormData({
      fullName: '',
      userNameSinhala: '',
      userNameEnglish: '',
      nic: '',
      dob: '',
      gender: '',
      electionId: '',
      partyId: '',
      candidateId: ''
    });
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const generateNewCandidateId = () => {
    const newId = generateCandidateId();
    setFormData(prev => ({
      ...prev,
      candidateId: newId
    }));
    
    // Clear candidate ID error if exists
    if (errors.candidateId) {
      setErrors(prev => ({
        ...prev,
        candidateId: ''
      }));
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  // Function to get party logo URL with proper path handling
  const getPartyLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    
    // Extract filename from the full path
    const filename = logoPath.split('\\').pop().split('/').pop();
    
    // Return the web-accessible URL
    return `http://localhost/PROJECT/backend/uploads/candidate_symbols/${filename}`;
  };

  return (
    <>
      <div className="bg-container">
        <div className="form-container">
          <h1>
            අපේක්ෂකයා ලියාපදිංචි කිරීමේ පෝරමය<br />
            CANDIDATE REGISTRATION FORM
          </h1>

          <form onSubmit={handleSubmit}>
            <table className="form-table">
              <tbody>
                {/* Full Name */}
                <tr>
                  <td>Full Name<br />වාසගම සහිත නම</td>
                  <td>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name in English" 
                      required 
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </td>
                </tr>

                {/* User Name in Sinhala */}
                <tr>
                  <td>User Name in Sinhala<br />පරිශීලක නාමය (සිංහල)</td>
                  <td>
                    <input 
                      type="text" 
                      name="userNameSinhala" 
                      value={formData.userNameSinhala}
                      onChange={handleInputChange}
                      placeholder="සිංහල අකුරින් නම ඇතුළත් කරන්න"
                      required 
                      className={errors.userNameSinhala ? 'error' : ''}
                    />
                    {errors.userNameSinhala && <span className="error-text">{errors.userNameSinhala}</span>}
                  </td>
                </tr>

                {/* User Name in English */}
                <tr>
                  <td>User Name in English<br />පරිශීලක නාමය (ඉංග්‍රීසි)</td>
                  <td>
                    <input 
                      type="text" 
                      name="userNameEnglish" 
                      value={formData.userNameEnglish}
                      onChange={handleInputChange}
                      placeholder="Enter name in English"
                      required 
                      className={errors.userNameEnglish ? 'error' : ''}
                    />
                    {errors.userNameEnglish && <span className="error-text">{errors.userNameEnglish}</span>}
                  </td>
                </tr>

                {/* NIC */}
                <tr>
                  <td>National Identity Card (NIC)<br />ජාතික හැඳුනුම්පත් අංකය</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="nic" 
                      value={formData.nic}
                      onChange={handleInputChange}
                      placeholder="Enter valid Sri Lankan NIC (e.g., 123456789V or 200012345678)"
                      required
                      className={errors.nic ? 'error' : ''}
                    />
                    {errors.nic && <span className="error-text">{errors.nic}</span>}
                    <small>Date of birth and gender will be automatically filled from NIC</small>
                  </td>
                </tr>

                {/* Date of Birth */}
                <tr>
                  <td>Date of Birth<br />උපන්දිනය</td>
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
                    <small>Auto-filled from NIC - Must be at least 35 years old</small>
                  </td>
                </tr>

                {/* Gender */}
                <tr>
                  <td>Gender<br />ස්ත්‍රී/පුරුෂභාවය</td>
                  <td>
                    <select 
                      name="gender" 
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className={errors.gender ? 'error' : ''}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male / පුරුෂ</option>
                      <option value="Female">Female / ස්ත්‍රී</option>
                      <option value="Other">Other / වෙනත්</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                    <small>Auto-filled from NIC (Male if day ≤ 500, Female if day > 500)</small>
                  </td>
                </tr>

                {/* Candidate Image */}
                <tr>
                  <td>Candidate Image<br />අපේක්ෂකගේ ඡායාරූපය</td>
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
                    <td></td>
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                      <div className="image-preview">
                        <p>Candidate Image Preview:</p>
                        <img
                          src={selectedImage}
                          alt="Candidate Preview"
                          className="preview-image"
                        />
                      </div>
                    </td>
                  </tr>
                )}

                {/* Election Selection */}
                <tr>
                  <td>Election<br />මැතිවරණය</td>
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
                          {election.Election_ID} - {election.Election_Type} ({election.Date})
                        </option>
                      ))}
                    </select>
                    {errors.electionId && <span className="error-text">{errors.electionId}</span>}
                  </td>
                </tr>

                {/* Party Selection */}
                <tr>
                  <td>Political Party<br />දේශපාලන පක්ෂය</td>
                  <td>
                    <select 
                      name="partyId" 
                      value={formData.partyId}
                      onChange={handlePartyChange}
                      required
                      className={errors.partyId ? 'error' : ''}
                    >
                      <option value="">Select Political Party</option>
                      {parties.map(party => (
                        <option key={party.Party_ID} value={party.Party_ID}>
                          {party.Party_ID} - {party.PartyName_English}
                        </option>
                      ))}
                    </select>
                    {errors.partyId && <span className="error-text">{errors.partyId}</span>}
                  </td>
                </tr>

                {/* Party Information Display */}
                {selectedParty && (
                  <tr>
                    <td>Selected Party Details<br />තෝරාගත් පක්ෂයේ විස්තර</td>
                    <td colSpan="3">
                      <div className="party-details">
                        <div className="party-info">
                          <div className="party-text-info">
                            <div className="party-field">
                              <label>Party ID / පක්ෂ අංකය:</label>
                              <input 
                                type="text" 
                                value={selectedParty.Party_ID} 
                                readOnly 
                                className="readonly-field"
                              />
                            </div>
                            <div className="party-field">
                              <label>Party Name (English) / පක්ෂ නාමය (ඉංග්‍රීසි):</label>
                              <input 
                                type="text" 
                                value={selectedParty.PartyName_English} 
                                readOnly 
                                className="readonly-field"
                              />
                            </div>
                            <div className="party-field">
                              <label>Party Name (Sinhala) / පක්ෂ නාමය (සිංහල):</label>
                              <input 
                                type="text" 
                                value={selectedParty.PartyName_Sinhala} 
                                readOnly 
                                className="readonly-field"
                              />
                            </div>
                          </div>
                          {selectedParty.Party_Logo && (
                            <div className="party-logo">
                              <p>Party Logo / පක්ෂ ලාංඡනය:</p>
                              <img
                                src={getPartyLogoUrl(selectedParty.Party_Logo)}
                                alt={`${selectedParty.PartyName_English} Logo`}
                                className="preview-logo"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div style={{ display: 'none' }} className="logo-error">
                                Logo not available or failed to load
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Candidate ID */}
                <tr>
                  <td>Candidate ID<br />අපේක්ෂක හැඳුනුම්පත් අංකය</td>
                  <td>
                    <div className="candidate-id-container">
                      <input 
                        type="text" 
                        name="candidateId" 
                        value={formData.candidateId}
                        onChange={handleInputChange}
                        placeholder="Format: CANDIDATE1, CANDIDATE2, etc." 
                        required 
                        className={errors.candidateId ? 'error' : ''}
                      />
                      <button 
                        type="button" 
                        className="generate-btn"
                        onClick={generateNewCandidateId}
                      >
                        Generate
                      </button>
                    </div>
                    {errors.candidateId && <span className="error-text">{errors.candidateId}</span>}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Register Candidate'
                )}
              </button>
              <button type="button" className="clear-btn" onClick={handleClear}>
                Clear Form
              </button>
              <button type="button" className="back-btn" onClick={handleBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <div className="success-details">
              <p><strong>Candidate ID:</strong> {successData?.candidateId}</p>
              <p><strong>Full Name:</strong> {successData?.fullName}</p>
              <p><strong>Political Party:</strong> {successData?.partyName}</p>
              <p><strong>Election:</strong> {successData?.electionType}</p>
              {successData?.extractedDOB && (
                <p><strong>Verified DOB:</strong> {successData.extractedDOB}</p>
              )}
            </div>
            <p className="success-message">
              The candidate has been successfully registered for the presidential election with verified NIC information.
            </p>
            <button className="close-modal-btn" onClick={closeSuccessModal}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}