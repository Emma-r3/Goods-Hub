import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span style={{ fontSize: '2.5rem' }}>✨</span>
          <h1>{t('auth.registerTitle')}</h1>
          <p>{t('auth.registerSubtitle')}</p>
        </div>

        {error && (
          <div className="auth-error-alert" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '1.25rem' }}>
          <div className="field">
            <label htmlFor="reg-name">{t('auth.name')}</label>
            <input
              id="reg-name"
              type="text"
              className="input"
              placeholder={t('auth.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="reg-email">{t('auth.email')}</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password">{t('auth.password')}</label>
            <input
              id="reg-password"
              type="password"
              className="input"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="field">
            <label htmlFor="reg-confirm">{t('auth.confirmPassword')}</label>
            <input
              id="reg-confirm"
              type="password"
              className="input"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
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

        <div className="auth-footer">
          {t('auth.haveAccount')}
          <Link to="/login">{t('auth.signInHere')}</Link>
        </div>
      </div>
    </div>
  );
}

