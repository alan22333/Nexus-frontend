'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import accountApi from '../services/accountApi';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // 个人信息表单数据
  const [profileData, setProfileData] = useState({
    gender: 0,
    phone: '',
    qq: '',
    wechat: '',
    bio: '',
    privacy: {
      is_phone_public: false,
      is_email_public: false,
      is_qq_public: false,
      is_wechat_public: false,
      is_gender_public: false
    }
  });

  // 加载个人信息
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await accountApi.getProfile();
        if (response.code === 0 && response.data) {
          setProfileData({
            gender: response.data.gender || 0,
            phone: response.data.phone || '',
            qq: response.data.qq || '',
            wechat: response.data.wechat || '',
            bio: response.data.bio || '',
            privacy: response.data.privacy || {
              is_phone_public: false,
              is_email_public: false,
              is_qq_public: false,
              is_wechat_public: false,
              is_gender_public: false
            }
          });
          setAvatarPreview(response.data.avatar || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
        
        // 在开发阶段，使用模拟数据
        if (process.env.NODE_ENV === 'development') {
          setProfileData({
            gender: 1,
            phone: '13812345678',
            qq: '123456789',
            wechat: 'my-wechat-id',
            bio: 'This is a sample bio for development.',
            privacy: {
              is_phone_public: true,
              is_email_public: true,
              is_qq_public: false,
              is_wechat_public: false,
              is_gender_public: true
            }
          });
          setAvatarPreview(user?.avatar || '');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, router]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理隐私设置变化
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: checked
      }
    }));
  };

  // 处理头像选择
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setSaving(true);
      
      // 更新个人信息
      const response = await accountApi.updateProfile(profileData);
      
      // 如果有头像文件，上传头像
      if (avatarFile) {
        await accountApi.uploadAvatar(avatarFile);
      }
      
      setSuccess('Profile updated successfully');
      
      // 更新用户信息
      if (user) {
        setUser({
          ...user,
          avatar: avatarPreview || user.avatar
        });
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
      
      // 在开发阶段，模拟成功
      if (process.env.NODE_ENV === 'development') {
        setSuccess('Profile updated successfully (Mock)');
        if (user) {
          setUser({
            ...user,
            avatar: avatarPreview || user.avatar
          });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">个人资料</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}
            
            {/* 基本信息 */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">基本信息</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* 头像上传 */}
                <div className="mb-4 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-2">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Avatar
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
                    上传头像
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="flex-1">
                  {/* 用户名和邮箱（只读） */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        用户名
                      </label>
                      <input 
                        type="text" 
                        value={user?.username || ''}
                        className="w-full p-2 border rounded bg-gray-100" 
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        邮箱
                      </label>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        className="w-full p-2 border rounded bg-gray-100" 
                        disabled
                      />
                    </div>
                  </div>
                  
                  {/* 性别 */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      性别
                    </label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value={0}>保密</option>
                      <option value={1}>男</option>
                      <option value={2}>女</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 联系方式 */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">联系方式</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    手机号码
                  </label>
                  <input 
                    type="text" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded" 
                    placeholder="请输入手机号码"
                  />
                  <div className="mt-1 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_phone_public"
                      checked={profileData.privacy.is_phone_public}
                      onChange={handlePrivacyChange}
                      className="mr-2" 
                    />
                    <span className="text-sm text-gray-600">公开</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    QQ
                  </label>
                  <input 
                    type="text" 
                    name="qq"
                    value={profileData.qq}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded" 
                    placeholder="请输入QQ号码"
                  />
                  <div className="mt-1 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_qq_public"
                      checked={profileData.privacy.is_qq_public}
                      onChange={handlePrivacyChange}
                      className="mr-2" 
                    />
                    <span className="text-sm text-gray-600">公开</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    微信
                  </label>
                  <input 
                    type="text" 
                    name="wechat"
                    value={profileData.wechat}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded" 
                    placeholder="请输入微信号"
                  />
                  <div className="mt-1 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_wechat_public"
                      checked={profileData.privacy.is_wechat_public}
                      onChange={handlePrivacyChange}
                      className="mr-2" 
                    />
                    <span className="text-sm text-gray-600">公开</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    邮箱隐私设置
                  </label>
                  <div className="p-2 border rounded bg-gray-50 h-10 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_email_public"
                      checked={profileData.privacy.is_email_public}
                      onChange={handlePrivacyChange}
                      className="mr-2" 
                    />
                    <span className="text-sm text-gray-600">公开邮箱</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 个人简介 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                个人简介
              </label>
              <textarea 
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" 
                rows="4"
                placeholder="请输入个人简介"
              />
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                {saving ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}