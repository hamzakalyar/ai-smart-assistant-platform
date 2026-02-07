/**
 * User Profile Page
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);

        if (result.success) {
            setEditing(false);
        }

        setLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setEditing(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Profile</h1>

            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                    {!editing && (
                        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                            Edit
                        </Button>
                    )}
                </div>

                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <Input
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <div className="flex gap-4">
                            <Button type="submit" variant="primary" loading={loading}>
                                Save Changes
                            </Button>
                            <Button type="button" variant="ghost" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600">Name</label>
                            <p className="text-lg text-gray-800">{user?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <p className="text-lg text-gray-800">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Role</label>
                            <p className="text-lg text-gray-800 capitalize">{user?.role}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Member Since</label>
                            <p className="text-lg text-gray-800">
                                {user?.created_at && new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Account Actions</h2>
                <div className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
