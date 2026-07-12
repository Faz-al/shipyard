import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Code2 } from 'lucide-react';
import { DashboardLayout, PageHead, Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { enableDeveloperWorkspace, enableTesterWorkspace, setPreferredWorkspace } from '../lib/api';

export function EnableTesterWorkspace() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    deviceModel: profile?.device_model || '',
    androidVersion: profile?.android_version || '',
    country: profile?.country || 'India',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await enableTesterWorkspace(form);
      await refreshProfile();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Add a workspace"
        title="Become a Shipyard tester"
        description="Use the same account and email. We only need your primary Android device details."
      />
      <Card className="form-card workspace-onboarding">
        <div className="onboarding-icon"><Smartphone /></div>
        <form onSubmit={submit} className="form-grid">
          <label>
            Device model
            <input
              required
              placeholder="For example: Samsung Galaxy A54"
              value={form.deviceModel}
              onChange={(e) => setForm({ ...form, deviceModel: e.target.value })}
            />
          </label>
          <label>
            Android version
            <input
              required
              placeholder="For example: Android 14"
              value={form.androidVersion}
              onChange={(e) => setForm({ ...form, androidVersion: e.target.value })}
            />
          </label>
          <label className="full">
            Country
            <input
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </label>
          {error && <div className="alert error full">{error}</div>}
          <div className="full actions">
            <button className="button" disabled={busy}>
              {busy ? 'Enabling tester workspace…' : 'Enable tester workspace'}
            </button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export function EnableDeveloperWorkspace() {
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const enable = async () => {
    setBusy(true);
    setError('');
    try {
      await enableDeveloperWorkspace();
      await setPreferredWorkspace('developer');
      await refreshProfile();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Add a workspace"
        title="Enable developer tools"
        description="Create and manage release tests without creating another account."
      />
      <Card className="workspace-callout">
        <div className="onboarding-icon"><Code2 /></div>
        <h2>Developer workspace</h2>
        <p>You will be able to create projects, pay for testing plans and track tester evidence.</p>
        {error && <div className="alert error">{error}</div>}
        <button className="button" onClick={enable} disabled={busy}>
          {busy ? 'Enabling…' : 'Enable developer workspace'}
        </button>
      </Card>
    </DashboardLayout>
  );
}
