import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegestationCandidate() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registration Successful');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSymbolChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSymbol(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setSelectedSymbol(null);
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
                {/* Two textboxes for Name */}
                <tr>
                  <td>සම්පූර්ණ නම</td>
                  <td>
                    <input type="text" name="sinhalaName" placeholder="සම්පූර්ණ නම" required />
                  </td>
                </tr>
                <tr>
                  <td>Full Name</td>
                  <td>
                    <input type="text" name="fullName" placeholder="Full Name" required />
                  </td>
                </tr>

                <tr>
                  <td>නාම ලේකනයේ  නම</td>
                  <td>
                    <input type="text" name="sinhalaUserName" required />
                  </td>
                </tr>
                <tr>
                  <td>User Name</td>
                  <td>
                    <input type="text" name="userName" required />
                  </td>
                </tr>

                <tr>
                  <td>ජා.හැ.අන්කය<br />ID</td>
                  <td colSpan="3">
                    <input type="text" name="id" />
                  </td>
                </tr>

                <tr>
                  <td>උපන් දිනය<br />Date of Birth</td>
                  <td>
                    <input type="text" name="dob" />
                  </td>
                </tr>

                <tr>
                  <td>ස්ත්‍රී/පුරුෂ<br />Gender</td>
                  <td>
                    <select name="gender">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td>ලිපිනය<br />Address</td>
                  <td colSpan="3">
                    <input type="text" name="address" required />
                  </td>
                </tr>

                {/* Candidate Image */}
                <tr>
                  <td>ඡායාරූපය<br />Candidate Image</td>
                  <td colSpan="3">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </td>
                </tr>

                {selectedImage && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      <img
                        src={selectedImage}
                        alt="Candidate Preview"
                        style={{ width: '150px', height: '150px', objectFit: 'cover', marginTop: '10px', borderRadius: '10px' }}
                      />
                    </td>
                  </tr>
                )}

                {/* New Fields */}
                <tr>
                  <td>Election ID</td>
                  <td>
                    <input type="text" name="electionId" placeholder="Election ID" required />
                  </td>
                </tr>
                <tr>
                  <td>Party ID</td>
                  <td>
                    <input type="text" name="partyId" placeholder="Party ID" required />
                  </td>
                </tr>
                <tr>
                  <td>Candidate ID</td>
                  <td>
                    <input type="text" name="candidateId" placeholder="Candidate ID" required />
                  </td>
                </tr>
                <tr>
                  <td>Candidate Number</td>
                  <td>
                    <input type="text" name="candidateNumber" placeholder="Candidate Number" required />
                  </td>
                </tr>

                {/* Candidate Symbol */}
                <tr>
                  <td>ලාංචනය<br />Candidate Symbol</td>
                  <td colSpan="3">
                    <input type="file" accept="image/*" onChange={handleSymbolChange} />
                  </td>
                </tr>

                {selectedSymbol && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      <img
                        src={selectedSymbol}
                        alt="Candidate Symbol Preview"
                        style={{ width: '150px', height: '150px', objectFit: 'contain', marginTop: '10px', borderRadius: '10px' }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="button-group">
              <button type="submit" className="submit-btn">Submit</button>
              <button type="reset" className="submit-btn" onClick={handleClear}>Clear</button>
              <button type="button" className="submit-btn" onClick={handleBack}>Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
