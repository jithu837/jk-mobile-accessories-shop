import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/AdminLogin.css';

export const AdminLogin = () => {
  const { sendOtp, verifyOtpAndLogin } = useShop();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const validatePhone = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const handleSendOtp = () => {
    setError('');
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    const cleanedPhone = phone.replace(/\D/g, '');
    sendOtp(cleanedPhone);
    setOtpSent(true);
    setLoading(false);
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setError('');
    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    const cleanedPhone = phone.replace(/\D/g, '');
    const result = verifyOtpAndLogin(cleanedPhone, otp.trim());
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError('');
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔒</div>
          <h1>Admin Login</h1>
          <p>JK Mobile Accessories</p>
        </div>

        <div className="login-body">
          {!otpSent ? (
            <>
              <div className="form-group">
                <label htmlFor="phone">Mobile Number</label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    maxLength={12}
                    disabled={loading}
                  />
                </div>
              </div>

              {error && <div className="login-error">{error}</div>}

              <button
                className="btn btn-primary btn-block"
                onClick={handleSendOtp}
                disabled={loading || phone.replace(/\D/g, '').length !== 10}
              >
                {loading ? 'Sending...' : '📩 Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="otp-info">
                <p>
                  OTP sent to <strong>+91 {phone}</strong>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  disabled={loading}
                  className="otp-input"
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button
                className="btn btn-primary btn-block"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : '🔓 Verify & Login'}
              </button>

              <div className="resend-section">
                {countdown > 0 ? (
                  <span className="countdown-text">Resend OTP in {countdown}s</span>
                ) : (
                  <button className="resend-btn" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                className="back-btn"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                  setCountdown(0);
                }}
              >
                ← Change Number
              </button>
            </>
          )}
        </div>

        <div className="login-footer">
          <p>🔐 Secure Admin Access Only</p>
        </div>
      </div>
    </div>
  );
};

