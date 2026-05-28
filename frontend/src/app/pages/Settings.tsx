import { User, Bell, Lock, Globe, Mail, Shield, Eye, EyeOff, Download, Trash2, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function Settings() {
  const { user, login } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.fullName || "",
    studentId: user?.studentId || "",
    email: user?.email || "",
  });

  // Update profileData when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName,
        studentId: user.studentId,
        email: user.email,
      });
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    eventReminders: true,
    newEventAlerts: true,
    emailNotifications: false,
  });

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    dataSharing: true,
    activityTracking: true,
  });

  const handleSaveChanges = () => {
    // Update the user data in auth context
    login({
      fullName: profileData.name,
      studentId: profileData.studentId,
      email: profileData.email,
    });
    
    alert(`Settings Saved Successfully! ✓\n\nProfile:\n• Name: ${profileData.name}\n• Student ID: ${profileData.studentId}\n• Email: ${profileData.email}\n\nNotifications:\n• Event Reminders: ${notifications.eventReminders ? 'On' : 'Off'}\n• New Event Alerts: ${notifications.newEventAlerts ? 'On' : 'Off'}\n• Email Notifications: ${notifications.emailNotifications ? 'On' : 'Off'}`);
  };

  const handleCancel = () => {
    if (confirm("Discard all unsaved changes?")) {
      // Reset to original user data
      if (user) {
        setProfileData({
          name: user.fullName,
          studentId: user.studentId,
          email: user.email,
        });
      }
      setNotifications({
        eventReminders: true,
        newEventAlerts: true,
        emailNotifications: false,
      });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      alert("Password must contain uppercase, lowercase, and numbers.");
      return;
    }

    alert("Password changed successfully! ✓\n\nYou will be logged out and need to sign in with your new password.");
    setShowChangePasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDownloadData = () => {
    alert("Download Your Data\n\nPreparing your data for download...\n\nThis includes:\n• Profile information\n• Event registrations\n• Activity history\n• Preferences\n\nYou will receive a download link via email within 24 hours.");
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    alert("Account Deletion Request Submitted\n\nYour account and all associated data will be permanently deleted within 30 days.\n\nYou will receive a confirmation email with instructions to cancel this request if needed.");
    setShowDeleteConfirm(false);
  };

  const handleSavePrivacySettings = () => {
    alert(`Privacy Settings Updated! ✓\n\nProfile Visibility: ${privacySettings.profileVisibility}\nData Sharing: ${privacySettings.dataSharing ? 'Enabled' : 'Disabled'}\nActivity Tracking: ${privacySettings.activityTracking ? 'Enabled' : 'Disabled'}`);
    setShowPrivacyModal(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-gray-800">Settings</h2>
      
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-[#1e40af]" />
          <h3 className="font-semibold text-gray-800">Profile Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                value={profileData.studentId}
                onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                placeholder="Enter your student ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              placeholder="Enter your email address"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-[#1e40af]" />
          <h3 className="font-semibold text-gray-800">Notification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-800">Event Reminders</p>
              <p className="text-sm text-gray-600">Receive reminders before events start</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={notifications.eventReminders} onChange={(e) => setNotifications({ ...notifications, eventReminders: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e40af]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-800">New Event Alerts</p>
              <p className="text-sm text-gray-600">Get notified when new events are created</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={notifications.newEventAlerts} onChange={(e) => setNotifications({ ...notifications, newEventAlerts: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e40af]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={notifications.emailNotifications} onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e40af]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-[#1e40af]" />
          <h3 className="font-semibold text-gray-800">Security Settings</h3>
        </div>
        
        <div className="space-y-4">
          <button 
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
            onClick={() => setShowChangePasswordModal(true)}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Change Password</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button 
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
            onClick={() => setShowPrivacyModal(true)}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Privacy Settings</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-[#1e40af] text-white py-3 px-6 rounded-lg hover:bg-[#1e3a8a] transition-colors" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-[#1e40af] text-white p-6 flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-semibold">Change Password</h3>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1e40af] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#1e40af] text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Privacy Settings</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Visibility */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Profile Visibility</h4>
                <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                >
                  <option value="public">Public - Anyone can see my profile</option>
                  <option value="university">University Only - Only university members</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>

              {/* Data Sharing */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Data Sharing Preferences</h4>
                    <p className="text-sm text-gray-600 mt-1">Allow sharing of anonymized data for event analytics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={privacySettings.dataSharing} 
                      onChange={(e) => setPrivacySettings({ ...privacySettings, dataSharing: e.target.checked })} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e40af]"></div>
                  </label>
                </div>
              </div>

              {/* Account Activity */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Account Activity Tracking</h4>
                    <p className="text-sm text-gray-600 mt-1">Track your activity for personalized recommendations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={privacySettings.activityTracking} 
                      onChange={(e) => setPrivacySettings({ ...privacySettings, activityTracking: e.target.checked })} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e40af]"></div>
                  </label>
                </div>
              </div>

              {/* Download Your Data */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Download Your Data</h4>
                <p className="text-sm text-gray-600 mb-4">Request a copy of all your personal data stored in our system</p>
                <button
                  onClick={handleDownloadData}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Request Data Download
                </button>
              </div>

              {/* Delete Account */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-red-600">Delete Account</h4>
                <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrivacySettings}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Save Privacy Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Delete Account?</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This will permanently remove all your data including:
              </p>
              
              <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
                <li>Profile information</li>
                <li>Event registrations</li>
                <li>Activity history</li>
                <li>Preferences and settings</li>
              </ul>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ This action cannot be undone!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
