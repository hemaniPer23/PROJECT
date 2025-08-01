import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API';
import './Css/RegistrationVoter.css';

export default function RegistrationVoter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    sinhalaName: '',
    fullName: '',
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

  // Hierarchical division data
  const divisionData = {
    'Galle': {
      'Balapitiya': [
        'Balapitiya',
        'Madurawela',
        'Gonapinuwala',
        'Pahala Balapitiya',
        'Udawalawe'
      ],
      'Akmeemana': [
        'Akmeemana',
        'Tawalama',
        'Bataduwa',
        'Mahamodara',
        'Kataluwa'
      ],
      'Galle': [
        'Galle Four Gravets',
        'Hirimbura',
        'Dadalla',
        'Unawatuna',
        'Poddala'
      ],
      'Hiniduma': [
        'Hiniduma',
        'Neluwa',
        'Nagoda',
        'Thawalama',
        'Bope-Poddala'
      ]
    },
    'Matara': {
      'Hakmana': [
        'Hakmana',
        'Urubokka',
        'Pitabeddara',
        'Malimbada',
        'Thihagoda'
      ],
      'Matara': [
        'Matara Four Gravets',
        'Kotuwegoda',
        'Kekanadurra',
        'Kirinda',
        'Weherahena'
      ],
      'Weligama': [
        'Weligama',
        'Mirissa',
        'Kamburugamuwa',
        'Kapparatota',
        'Bandarawela'
      ],
      'Akuressa': [
        'Akuressa',
        'Malimbada',
        'Athuraliya',
        'Morawaka',
        'Pasgoda'
      ]
    },
    'Colombo': {
      'Colombo Central': [
        'Colombo 01',
        'Colombo 02',
        'Colombo 11',
        'Colombo 13',
        'Colombo 14'
      ],
      'Colombo East': [
        'Colombo 04',
        'Colombo 05',
        'Colombo 06',
        'Battaramulla',
        'Thalawathugoda'
      ],
      'Colombo West': [
        'Colombo 15',
        'Kelaniya',
        'Peliyagoda',
        'Wattala',
        'Hendala'
      ],
      'Kaduwela': [
        'Kaduwela',
        'Malabe',
        'Athurugiriya',
        'Koswatta',
        'Nawala'
      ]
    },
    'Kandy': {
      'Kandy': [
        'Kandy Four Gravets',
        'Mahaiyawa',
        'Kundasale',
        'Tennekumbura',
        'Madawala Bazaar'
      ],
      'Gampola': [
        'Gampola',
        'Nawalapitiya',
        'Pusselawa',
        'Kotmale',
        'Ramboda'
      ],
      'Dambulla': [
        'Dambulla',
        'Galewela',
        'Ukuwela',
        'Naula',
        'Laggala'
      ],
      'Teldeniya': [
        'Teldeniya',
        'Kundasale',
        'Wattegama',
        'Panvila',
        'Madugoda'
      ]
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.sinhalaName.trim()) newErrors.sinhalaName = 'Sinhala name is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.electoralDivision) newErrors.electoralDivision = 'Electoral division is required';
    if (!formData.pollingDivision) newErrors.pollingDivision = 'Polling division is required';
    if (!formData.gramaniladhariDivision) newErrors.gramaniladhariDivision = 'Gramaniladhari division is required';

    // NIC validation
    const nicPattern = /^(\d{9}[vVxX]|\d{12})$/;
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!nicPattern.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format';
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dob = 'Voter must be at least 18 years old';
      }
    }

    // Mobile number validation (optional but validate if provided)
    if (formData.mobileNumber && !/^07\d{8}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format (should be 07xxxxxxxx)';
    }

    // Email validation (optional but validate if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle hierarchical division changes
    if (name === 'electoralDivision') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        pollingDivision: '',
        gramaniladhariDivision: ''
      }));
    } else if (name === 'pollingDivision') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        gramaniladhariDivision: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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
      const response = await API.post('/api/admin/register_voter.php', formData);

      if (response.data.status === 'success') {
        alert('Voter Registration Successful!');
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

  const handleClear = () => {
    setErrors({});
    setFormData({
      sinhalaName: '',
      fullName: '',
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
  };

  // Get available polling divisions for selected electoral division
  const getPollingDivisions = () => {
    if (!formData.electoralDivision || !divisionData[formData.electoralDivision]) {
      return [];
    }
    return Object.keys(divisionData[formData.electoralDivision]);
  };

  // Get available GN divisions for selected electoral and polling divisions
  const getGNDivisions = () => {
    if (!formData.electoralDivision || !formData.pollingDivision || 
        !divisionData[formData.electoralDivision] || 
        !divisionData[formData.electoralDivision][formData.pollingDivision]) {
      return [];
    }
    return divisionData[formData.electoralDivision][formData.pollingDivision];
  };

  return (
    <>
      <div className="bg-container">
        <div className="form-container">
          <h1>
            ඡන්දදායකයින් ලියාපදිංචි කිරීමේ පෝරමය<br />
            REGISTRATION FORM VOTERS
          </h1>

          <form onSubmit={handleSubmit}>
            <table className="form-table">
              <tbody>
                {/* Sinhala Name */}
                <tr>
                  <td>සම්පූර්ණ නම</td>
                  <td colSpan="3">
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
                  <td colSpan="3">
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

                {/* NIC */}
                <tr>
                  <td>ජා.හැ.අන්කය<br />ID</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="nic" 
                      value={formData.nic}
                      onChange={handleInputChange}
                      placeholder="NIC Number (e.g., 123456789V or 123456789012)"
                      required
                      className={errors.nic ? 'error' : ''}
                    />
                    {errors.nic && <span className="error-text">{errors.nic}</span>}
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
                      <option value="Male">පිරිමි/Male</option>
                      <option value="Female">ගැහැණු/Female</option>
                      <option value="Other">වෙනත්/Other</option>
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

                {/* Mobile Number */}
                <tr>
                  <td>ජංගම දූරකථන අංකය<br />Mobile Number</td>
                  <td colSpan="3">
                    <input 
                      type="text" 
                      name="mobileNumber" 
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="07xxxxxxxx (Optional)"
                      className={errors.mobileNumber ? 'error' : ''}
                    />
                    {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
                  </td>
                </tr>

                {/* Email */}
                <tr>
                  <td>විද්‍යුත් තැපෑල<br />Email</td>
                  <td colSpan="3">
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com (Optional)"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </td>
                </tr>

                {/* Electoral Division */}
                <tr>
                  <td>මැතිවරණ දිස්ත්‍රික්කය<br />Electoral Division</td>
                  <td colSpan="3">
                    <select 
                      name="electoralDivision" 
                      value={formData.electoralDivision}
                      onChange={handleInputChange}
                      required
                      className={errors.electoralDivision ? 'error' : ''}
                    >
                      <option value="">Select Electoral Division</option>
                      {Object.keys(divisionData).map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                    {errors.electoralDivision && <span className="error-text">{errors.electoralDivision}</span>}
                  </td>
                </tr>

                {/* Polling Division */}
                <tr>
                  <td>ඡන්ද ශාඛාව<br />Polling Division</td>
                  <td colSpan="3">
                    <select 
                      name="pollingDivision" 
                      value={formData.pollingDivision}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.electoralDivision}
                      className={errors.pollingDivision ? 'error' : ''}
                    >
                      <option value="">Select Polling Division</option>
                      {getPollingDivisions().map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                    {errors.pollingDivision && <span className="error-text">{errors.pollingDivision}</span>}
                  </td>
                </tr>

                {/* Gramaniladhari Division */}
                <tr>
                  <td>ග්‍රාම නිලධාරී ශාඛාව<br />Gramaniladhari Division</td>
                  <td colSpan="3">
                    <select 
                      name="gramaniladhariDivision" 
                      value={formData.gramaniladhariDivision}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.pollingDivision}
                      className={errors.gramaniladhariDivision ? 'error' : ''}
                    >
                      <option value="">Select Gramaniladhari Division</option>
                      {getGNDivisions().map(division => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                    {errors.gramaniladhariDivision && <span className="error-text">{errors.gramaniladhariDivision}</span>}
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
        .form-table select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
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