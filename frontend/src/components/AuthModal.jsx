import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import PasswordInput from './PasswordInput';

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const { login, register } = useAuth();
  const { t } = useLanguage();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchMode = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      setSubmitting(true);
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError(t('auth.passwordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    try {
      setSubmitting(true);
      await register(name, email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Close when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleBackdropClick}>
      <div className="auth-modal-content">
        {/* Close button */}
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Tab switcher */}
        <div className="auth-modal-tabs">
          <button
            className={`auth-modal-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            {t('nav.login')}
          </button>
          <button
            className={`auth-modal-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            {t('nav.register')}
          </button>
        </div>

        {error && (
          <div className="auth-error-alert" role="alert" style={{ marginTop: '1rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form" style={{ marginTop: '1.25rem' }}>
            <div className="auth-modal-icon">🔐</div>
            <p className="auth-modal-subtitle">{t('auth.loginSubtitle')}</p>

            <div className="field">
              <label htmlFor="modal-login-email">{t('auth.email')}</label>
              <input
                id="modal-login-email"
                type="email"
                className="input"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="modal-login-password">{t('auth.password')}</label>
              <PasswordInput
                id="modal-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={submitting}
            >
              {submitting ? t('auth.loggingIn') : t('auth.loginBtn')}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="auth-form" style={{ marginTop: '1.25rem' }}>
            <div className="auth-modal-icon">✨</div>
            <p className="auth-modal-subtitle">{t('auth.registerSubtitle')}</p>

            <div className="field">
              <label htmlFor="modal-reg-name">{t('auth.name')}</label>
              <input
                id="modal-reg-name"
                type="text"
                className="input"
                placeholder={t('auth.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="modal-reg-email">{t('auth.email')}</label>
              <input
                id="modal-reg-email"
                type="email"
                className="input"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="modal-reg-password">{t('auth.password')}</label>
              <PasswordInput
                id="modal-reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="modal-reg-confirm">{t('auth.confirmPassword')}</label>
              <PasswordInput
                id="modal-reg-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={submitting}
            >
              {submitting ? t('auth.registering') : t('auth.registerBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

