import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API';
import './Css/RegistrationVoter.css';

export default function RegistrationVoter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [isNicValidated, setIsNicValidated] = useState(false);
  const [divisionsLoading, setDivisionsLoading] = useState({
    electoral: false,
    polling: false,
    gn: false
  });
  
  const [divisionsData, setDivisionsData] = useState({
    electoral: [],
    polling: [],
    gn: []
  });

  const [formData, setFormData] = useState({
    sinhalaFullName: '',
    englishFullName: '',
    nic: '',
    gender: '',
    dob: '',
    address: '',
    mobileNumber: '',
    email: '',
    electoralDivision: '',
    pollingDivision: '',
    gramaniladhariDivision: ''
  });

  // Memoized validation functions
  const validateNIC = useCallback((nic) => {
    if (!nic) return { isValid: false, cleanNIC: '' };
    
    const cleanNIC = nic.replace(/\s/g, '').toUpperCase();
    
    const oldFormat = /^(\d{9})[VX]$/;
    const newFormat = /^\d{12}$/;
    
    if (oldFormat.test(cleanNIC)) {
      return { isValid: true, format: 'old', cleanNIC };
    } else if (newFormat.test(cleanNIC)) {
      return { isValid: true, format: 'new', cleanNIC };
    }
    
    return { isValid: false, cleanNIC };
  }, []);

  const extractGenderFromNIC = useCallback((nic) => {
    const validation = validateNIC(nic);
    if (!validation.isValid) return null;

    try {
      let days;
      
      if (validation.format === 'old') {
        days = parseInt(validation.cleanNIC.substring(2, 5));
      } else {
        days = parseInt(validation.cleanNIC.substring(4, 7));
      }
      
      return days > 500 ? 'Female' : 'Male';
    } catch (error) {
      console.error('Error extracting gender from NIC:', error);
      return null;
    }
  }, [validateNIC]);

  const extractDOBFromNIC = useCallback((nic) => {
    const validation = validateNIC(nic);
    if (!validation.isValid) return null;

    try {
      if (validation.format === 'old') {
        let year = parseInt(validation.cleanNIC.substring(0, 2));
        let days = parseInt(validation.cleanNIC.substring(2, 5));
        
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        const actualDays = days > 500 ? days - 500 : days;
        
        if (actualDays < 1 || actualDays > 366) {
          console.error('Invalid day of year in NIC:', actualDays);
          return null;
        }
        
        const date = new Date(fullYear, 0, 1);
        date.setDate(date.getDate() + (actualDays - 1));
       
        const year_str = date.getFullYear();
        const month_str = String(date.getMonth() + 1).padStart(2, '0');
        const day_str = String(date.getDate()).padStart(2, '0');
        return `${year_str}-${month_str}-${day_str}`;
      } else {
        const year = parseInt(validation.cleanNIC.substring(0, 4));
        let days = parseInt(validation.cleanNIC.substring(4, 7));
        
        const actualDays = days > 500 ? days - 500 : days;
        
        if (actualDays < 1 || actualDays > 366) {
          console.error('Invalid day of year in NIC:', actualDays);
          return null;
        }
        
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const maxDays = isLeapYear ? 366 : 365;
        
        if (actualDays > maxDays) {
          console.error('Day of year exceeds maximum for year:', actualDays, '>', maxDays);
          return null;
        }
        
        const date = new Date(year, 0, 1);
        date.setDate(date.getDate() + (actualDays - 1));
        
        const year_str = date.getFullYear();
        const month_str = String(date.getMonth() + 1).padStart(2, '0');
        const day_str = String(date.getDate()).padStart(2, '0');
        return `${year_str}-${month_str}-${day_str}`;
      }
    } catch (error) {
      console.error('Error extracting DOB from NIC:', error);
      return null;
    }
  }, [validateNIC]);

  // Enhanced division loading functions
  const loadElectoralDivisions = useCallback(async () => {
    try {
      setDivisionsLoading(prev => ({ ...prev, electoral: true }));
      
      const response = await API.get('/api/admin/get_divisions.php', {
        params: {
          hierarchy: 'electoral',
          active_only: true
        },
        timeout: 15000
      });
      
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setDivisionsData(prev => ({
          ...prev,
          electoral: response.data.data
        }));
      } else {
        throw new Error(response.data?.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error loading electoral divisions:', error);
      setDivisionsData(prev => ({ ...prev, electoral: [] }));
      
      if (error.code === 'ECONNABORTED') {
        setErrors(prev => ({
          ...prev,
          system: 'Loading divisions timed out. Please refresh the page.'
        }));
      }
    } finally {
      setDivisionsLoading(prev => ({ ...prev, electoral: false }));
    }
  }, []);

  const loadPollingDivisions = useCallback(async (electoralDivision) => {
    if (!electoralDivision) {
      setDivisionsData(prev => ({ ...prev, polling: [], gn: [] }));
      return;
    }
    
    try {
      setDivisionsLoading(prev => ({ ...prev, polling: true }));
      
      const response = await API.get('/api/admin/get_divisions.php', {
        params: {
          hierarchy: 'polling',
          electoral_division: electoralDivision,
          active_only: true
        },
        timeout: 10000
      });
      
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setDivisionsData(prev => ({
          ...prev,
          polling: response.data.data,
          gn: []
        }));
      } else {
        throw new Error(response.data?.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error loading polling divisions:', error);
      setDivisionsData(prev => ({ ...prev, polling: [], gn: [] }));
    } finally {
      setDivisionsLoading(prev => ({ ...prev, polling: false }));
    }
  }, []);

  const loadGNDivisions = useCallback(async (electoralDivision, pollingDivision) => {
    if (!electoralDivision || !pollingDivision) {
      setDivisionsData(prev => ({ ...prev, gn: [] }));
      return;
    }
    
    try {
      setDivisionsLoading(prev => ({ ...prev, gn: true }));
      
      const response = await API.get('/api/admin/get_divisions.php', {
        params: {
          hierarchy: 'gn',
          electoral_division: electoralDivision,
          polling_division: pollingDivision,
          active_only: true
        },
        timeout: 10000
      });
      
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setDivisionsData(prev => ({
          ...prev,
          gn: response.data.data
        }));
      } else {
        throw new Error(response.data?.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error loading GN divisions:', error);
      setDivisionsData(prev => ({ ...prev, gn: [] }));
    } finally {
      setDivisionsLoading(prev => ({ ...prev, gn: false }));
    }
  }, []);

  // Load electoral divisions on mount
  useEffect(() => {
    loadElectoralDivisions();
  }, [loadElectoralDivisions]);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Sinhala Full Name validation
    if (!formData.sinhalaFullName.trim()) {
      newErrors.sinhalaFullName = 'Full name in Sinhala is required';
    } else if (!/^[\u0D80-\u0DFF\s]+$/.test(formData.sinhalaFullName.trim())) {
      newErrors.sinhalaFullName = 'Full name should contain only Sinhala characters and spaces';
    } else if (formData.sinhalaFullName.trim().length < 2) {
      newErrors.sinhalaFullName = 'Full name must be at least 2 characters long';
    }

    // English Full Name validation
    if (!formData.englishFullName.trim()) {
      newErrors.englishFullName = 'Full name in English is required';
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.englishFullName.trim())) {
      newErrors.englishFullName = 'Full name should contain only English letters, spaces, periods, hyphens, and apostrophes';
    } else if (formData.englishFullName.trim().length < 2) {
      newErrors.englishFullName = 'Full name must be at least 2 characters long';
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
      
      if (birthDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      } else if (age < 18) {
        newErrors.dob = 'Voter must be at least 18 years old';
      } else if (formData.nic.trim()) {
        // Validate DOB matches NIC
        const nicDOB = extractDOBFromNIC(formData.nic);
        if (nicDOB && nicDOB !== formData.dob) {
          newErrors.dob = `Date of birth must exactly match with NIC. NIC indicates: ${nicDOB}`;
        } else if (!nicDOB && validateNIC(formData.nic).isValid) {
          newErrors.dob = 'Unable to extract valid date from NIC. Please check your NIC number.';
        }
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    } else if (!['Male', 'Female', 'Other'].includes(formData.gender)) {
      newErrors.gender = 'Please select a valid gender option';
    } else if (formData.nic.trim() && formData.gender !== 'Other') {
      // Validate gender matches NIC
      const nicGender = extractGenderFromNIC(formData.nic);
      if (nicGender && nicGender !== formData.gender) {
        newErrors.gender = `Gender must match with NIC. NIC indicates: ${nicGender}. You can select 'Other' if needed.`;
      }
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address (minimum 10 characters)';
    }

    // Mobile number validation (optional)
    if (formData.mobileNumber.trim()) {
      if (!/^07\d{8}$/.test(formData.mobileNumber.trim())) {
        newErrors.mobileNumber = 'Invalid mobile number format (should be 07xxxxxxxx)';
      }
    }

    // Email validation (optional)
    if (formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Division validations
    if (!formData.electoralDivision) {
      newErrors.electoralDivision = 'Electoral division is required';
    }

    if (!formData.pollingDivision) {
      newErrors.pollingDivision = 'Polling division is required';
    }

    if (!formData.gramaniladhariDivision) {
      newErrors.gramaniladhariDivision = 'Gramaniladhari division is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateNIC, extractDOBFromNIC, extractGenderFromNIC]);

  // Enhanced input change handler
  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;

    // Handle hierarchical division changes
    if (name === 'electoralDivision') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        pollingDivision: '',
        gramaniladhariDivision: ''
      }));
      
      await loadPollingDivisions(value);
    } else if (name === 'pollingDivision') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        gramaniladhariDivision: ''
      }));
      
      if (value && formData.electoralDivision) {
        await loadGNDivisions(formData.electoralDivision, value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Auto-extract DOB and Gender from NIC
    if (name === 'nic' && value.trim()) {
      try {
        const nicValidation = validateNIC(value);
        setIsNicValidated(nicValidation.isValid);

        if (nicValidation.isValid) {
          const extractedDOB = extractDOBFromNIC(value);
          const extractedGender = extractGenderFromNIC(value);
          
          setFormData(prev => ({
            ...prev,
            dob: extractedDOB || prev.dob,
            gender: extractedGender || prev.gender
          }));

          if (extractedDOB) {
            console.log('Auto-extracted DOB from NIC:', value, '->', extractedDOB);
          }
          if (extractedGender) {
            console.log('Auto-extracted Gender from NIC:', value, '->', extractedGender);
          }
        }
      } catch (error) {
        console.error('Error auto-extracting from NIC:', error);
        setIsNicValidated(false);
      }
    }

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [formData.electoralDivision, errors, validateNIC, extractDOBFromNIC, extractGenderFromNIC, loadPollingDivisions, loadGNDivisions]);

  // Enhanced form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData = {
        sinhalaFullName: formData.sinhalaFullName.trim(),
        englishFullName: formData.englishFullName.trim(),
        nic: formData.nic.trim().toUpperCase(),
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim(),
        electoralDivision: formData.electoralDivision,
        pollingDivision: formData.pollingDivision,
        gramaniladhariDivision: formData.gramaniladhariDivision
      };

      console.log('Submitting data...', submitData);
      
      const response = await API.post('/api/admin/register_voter.php', submitData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response received:', response.data);

      if (response.data?.status === 'success') {
        setSuccessData(response.data.data);
        setShowSuccessModal(true);
        handleClear();
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.message || 'Invalid data provided. Please check your inputs.';
          
          // Handle specific field errors
          if (data?.message?.includes('NIC already registered')) {
            setErrors(prev => ({ ...prev, nic: 'This NIC is already registered in the system' }));
          } else if (data?.message?.includes('Mobile number already registered')) {
            setErrors(prev => ({ ...prev, mobileNumber: 'This mobile number is already registered' }));
          } else if (data?.message?.includes('Email already registered')) {
            setErrors(prev => ({ ...prev, email: 'This email address is already registered' }));
          }
        } else if (status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.message || `Server error (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setErrors(prev => ({
        ...prev,
        system: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = useCallback(() => {
    setErrors({});
    setIsNicValidated(false);
    setFormData({
      sinhalaFullName: '',
      englishFullName: '',
      nic: '',
      gender: '',
      dob: '',
      address: '',
      mobileNumber: '',
      email: '',
      electoralDivision: '',
      pollingDivision: '',
      gramaniladhariDivision: ''
    });
    setDivisionsData(prev => ({
      ...prev,
      polling: [],
      gn: []
    }));
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  return (
    <>
      <div className="bg-container">
        <div className="form-container">
          <h1>
            ඡන්දදායකයින් ලියාපදිංචි කිරීමේ පත්‍රය<br />
            VOTER REGISTRATION FORM
          </h1>

          {errors.system && (
            <div className="system-error">
              <strong>Error:</strong> {errors.system}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <table className="form-table">
              <tbody>
                {/* Full Name in Sinhala */}
                <tr>
                  <td>Full Name in Sinhala<br />වාසගම සහිත නම (සිංහල)</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="sinhalaFullName" 
                      value={formData.sinhalaFullName}
                      onChange={handleInputChange}
                      placeholder="සිංහල අකුරින් නම ඇතුළත් කරන්න" 
                      required 
                      className={errors.sinhalaFullName ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.sinhalaFullName && <span className="error-text">{errors.sinhalaFullName}</span>}
                  </td>
                </tr>

                {/* Full Name in English */}
                <tr>
                  <td>Full Name in English<br />වාසගම සහිත නම (ඉංග්‍රීසි)</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="englishFullName" 
                      value={formData.englishFullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name in English" 
                      required 
                      className={errors.englishFullName ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.englishFullName && <span className="error-text">{errors.englishFullName}</span>}
                  </td>
                </tr>

                {/* NIC */}
                <tr>
                  <td>National Identity Card (NIC)<br />ජාතික හැඳුනුම්පත් අංකය</td>
                  <td colSpan="3">
                    <div className="nic-input-container">
                      <input 
                        type="text" 
                        name="nic" 
                        value={formData.nic}
                        onChange={handleInputChange}
                        placeholder="Enter valid Sri Lankan NIC (e.g., 123456789V or 200012345678)"
                        required
                        className={errors.nic ? 'error' : (isNicValidated ? 'validated' : '')}
                        disabled={loading}
                      />
                      {isNicValidated && <span className="validation-icon">✓</span>}
                    </div>
                    {errors.nic && <span className="error-text">{errors.nic}</span>}
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
                      disabled={loading}
                    />
                    {errors.dob && <span className="error-text">{errors.dob}</span>}
                    <small>Must be at least 18 years old</small>
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
                      disabled={loading}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male / පිරිමි</option>
                      <option value="Female">Female / ස්ත්‍රී</option>
                      <option value="Other">Other / වෙනත්</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                  </td>
                </tr>

                {/* Address */}
                <tr>
                  <td>Address<br />ලිපිනය</td>
                  <td colSpan="3">
                    <textarea 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter complete residential address"
                      required 
                      rows="3"
                      className={errors.address ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                    <small>Please provide complete residential address</small>
                  </td>
                </tr>

                {/* Mobile Number */}
                <tr>
                  <td>Mobile Number<br />ජංගම දුරකථන අංකය</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="mobileNumber" 
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="07xxxxxxxx (Optional)"
                      className={errors.mobileNumber ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
                    <small>Optional - For election notifications</small>
                  </td>
                </tr>

                {/* Email */}
                <tr>
                  <td>Email Address<br />විද්‍යුත් තැපැල් ලිපිනය</td>
                  <td colSpan="3">
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com (Optional)"
                      className={errors.email ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                    <small>Optional - For election notifications</small>
                  </td>
                </tr>

                {/* Electoral Division */}
                <tr>
                  <td>Electoral Division<br />මැතිවරණ දිස්ත්‍රික්කය</td>
                  <td colSpan="3">
                    <select 
                      name="electoralDivision" 
                      value={formData.electoralDivision}
                      onChange={handleInputChange}
                      required
                      className={errors.electoralDivision ? 'error' : ''}
                      disabled={loading || divisionsLoading.electoral}
                    >
                      <option value="">
                        {divisionsLoading.electoral ? 'Loading...' : 'Select Electoral Division'}
                      </option>
                      {divisionsData.electoral.map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                    {errors.electoralDivision && <span className="error-text">{errors.electoralDivision}</span>}
                  </td>
                </tr>

                {/* Polling Division */}
                <tr>
                  <td>Polling Division<br />ඡන්ද කොට්ඨාසය</td>
                  <td colSpan="3">
                    <select 
                      name="pollingDivision" 
                      value={formData.pollingDivision}
                      onChange={handleInputChange}
                      required
                      disabled={loading || !formData.electoralDivision || divisionsLoading.polling}
                      className={errors.pollingDivision ? 'error' : ''}
                    >
                      <option value="">
                        {divisionsLoading.polling ? 'Loading...' : 
                         !formData.electoralDivision ? 'Select Electoral Division first' : 
                         'Select Polling Division'}
                      </option>
                      {divisionsData.polling.map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                    {errors.pollingDivision && <span className="error-text">{errors.pollingDivision}</span>}
                  </td>
                </tr>

                {/* Gramaniladhari Division */}
                <tr>
                  <td>Gramaniladhari Division<br />ග්‍රාම නිලධාරි කොට්ඨාසය</td>
                  <td colSpan="3">
                    <select 
                      name="gramaniladhariDivision" 
                      value={formData.gramaniladhariDivision}
                      onChange={handleInputChange}
                      required
                      disabled={loading || !formData.pollingDivision || divisionsLoading.gn}
                      className={errors.gramaniladhariDivision ? 'error' : ''}
                    >
                      <option value="">
                        {divisionsLoading.gn ? 'Loading...' : 
                         !formData.pollingDivision ? 'Select Polling Division first' : 
                         'Select Gramaniladhari Division'}
                      </option>
                      {divisionsData.gn.map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                    {errors.gramaniladhariDivision && <span className="error-text">{errors.gramaniladhariDivision}</span>}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="button-group-v">
              <button type="submit" className="submit-btn-v" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Registering...
                  </>
                ) : (
                  'Register Voter'
                )}
              </button>
              <button type="button" className="clear-btn-v" onClick={handleClear} disabled={loading}>
                Clear Form
              </button>
              <button type="button" className="back-btn-v" onClick={handleBack} disabled={loading}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="modal-overlay" onClick={closeSuccessModal}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <div className="success-details">
              <div className="detail-row">
                <strong>NIC:</strong> 
                <span>{successData.nic}</span>
              </div>
              <div className="detail-row">
                <strong>Full Name (English):</strong> 
                <span>{successData.fullname_english}</span>
              </div>
              <div className="detail-row">
                <strong>Full Name (Sinhala):</strong> 
                <span>{successData.fullname_sinhala}</span>
              </div>
              <div className="detail-row">
                <strong>Electoral Division:</strong> 
                <span>{successData.electoral_division}</span>
              </div>
              <div className="detail-row">
                <strong>Polling Division:</strong> 
                <span>{successData.polling_division}</span>
              </div>
              <div className="detail-row">
                <strong>Gramaniladhari Division:</strong> 
                <span>{successData.gramaniladhari_division}</span>
              </div>
              <div className="detail-row">
                <strong>Division ID:</strong> 
                <span>{successData.division_id}</span>
              </div>
              <div className="detail-row">
                <strong>Verified DOB:</strong> 
                <span>{successData.extracted_dob}</span>
              </div>
              <div className="detail-row">
                <strong>Verified Gender:</strong> 
                <span>{successData.extracted_gender}</span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong> 
                <span className={`status ${successData.status.toLowerCase()}`}>
                  {successData.status}
                </span>
              </div>
              {successData.mobile_number && (
                <div className="detail-row">
                  <strong>Mobile:</strong> 
                  <span>{successData.mobile_number}</span>
                </div>
              )}
              {successData.email && (
                <div className="detail-row">
                  <strong>Email:</strong> 
                  <span>{successData.email}</span>
                </div>
              )}
              <div className="detail-row">
                <strong>Registration Time:</strong> 
                <span>{successData.registration_time}</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="close-modal-btn" onClick={closeSuccessModal}>
                Continue Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Processing your registration...</p>
          </div>
        </div>
      )}
    </>
  );
}