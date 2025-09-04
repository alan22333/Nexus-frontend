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
        
        // 检查用户认证状态
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        console.log('Current token:', token ? 'exists' : 'missing');
        console.log('Current user:', userData ? JSON.parse(userData) : 'missing');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }
        
        // 调用真实API获取数据
        const response = await accountApi.getProfile();
        console.log('Profile response:', response);
        
        if (response.code === 0 && response.data) {
          // 将后端返回的扁平化数据转换为前端期望的嵌套格式
          setProfileData({
            gender: response.data.gender || 0,
            phone: response.data.phone || '',
            qq: response.data.qq || '',
            wechat: response.data.wechat || '',
            bio: response.data.bio || '',
            privacy: {
              is_phone_public: response.data.is_phone_public || false,
              is_email_public: response.data.is_email_public || false,
              is_qq_public: response.data.is_qq_public || false,
              is_wechat_public: response.data.is_wechat_public || false,
              is_gender_public: response.data.is_gender_public || false
            }
          });
          setAvatarPreview(response.data.avatar || '');
          console.log('Profile data loaded successfully');
        } else {
          console.error('Invalid response format:', response);
          // 如果是认证错误，跳转到登录页面
          if (response.code === 30002) {
            console.log('Token invalid, redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          }
          setError('获取个人资料失败');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        
        // 检查是否是认证错误
        if (err.message.includes('认证Token无效') || err.message.includes('30002')) {
          console.log('Authentication failed, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        
        setError(`加载个人资料失败: ${err.message}`);
        
        // 设置默认的空数据，让用户可以填写新信息
        setProfileData({
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
        setAvatarPreview('');
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
      
      // 转换数据格式为后端期望的格式
      const updateData = {
        gender: profileData.gender,
        phone: profileData.phone,
        qq: profileData.qq,
        wechat: profileData.wechat,
        bio: profileData.bio,
        // 将嵌套的privacy对象扁平化
        is_phone_public: profileData.privacy.is_phone_public,
        is_email_public: profileData.privacy.is_email_public,
        is_qq_public: profileData.privacy.is_qq_public,
        is_wechat_public: profileData.privacy.is_wechat_public,
        is_gender_public: profileData.privacy.is_gender_public
      };
      
      console.log('Sending update data:', updateData);
      
      // 更新个人信息
      const response = await accountApi.updateProfile(updateData);
      
      console.log('Update response:', response);
      
      // 如果有头像文件，上传头像
      if (avatarFile) {
        const avatarResponse = await accountApi.uploadAvatar(avatarFile);
        console.log('Avatar upload response:', avatarResponse);
      }
      
      setSuccess('个人资料更新成功！');
      
      // 更新用户信息
      if (user) {
        setUser({
          ...user,
          avatar: avatarPreview || user.avatar
        });
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(`更新失败: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人资料</h1>
          <p className="text-gray-600">管理您的个人信息和隐私设置</p>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载个人资料中...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}
            
            {/* 基本信息 */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">基本信息</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* 头像上传 */}
                <div className="flex flex-col items-center min-w-fit">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3 border-2 border-gray-300 shadow-sm">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {!avatarPreview && (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
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
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        用户名
                      </label>
                      <input 
                        type="text" 
                        value={user?.username || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none" 
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        邮箱
                      </label>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none" 
                        disabled
                      />
                    </div>
                  </div>
                  
                  {/* 性别 */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      性别
                    </label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    手机号码
                  </label>
                  <input 
                    type="text" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                    placeholder="请输入手机号码"
                  />
                  <div className="mt-2 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_phone_public"
                      checked={profileData.privacy.is_phone_public}
                      onChange={handlePrivacyChange}
                      className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-600">公开显示</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    QQ
                  </label>
                  <input 
                    type="text" 
                    name="qq"
                    value={profileData.qq}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                    placeholder="请输入QQ号码"
                  />
                  <div className="mt-2 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_qq_public"
                      checked={profileData.privacy.is_qq_public}
                      onChange={handlePrivacyChange}
                      className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-600">公开显示</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    微信
                  </label>
                  <input 
                    type="text" 
                    name="wechat"
                    value={profileData.wechat}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                    placeholder="请输入微信号"
                  />
                  <div className="mt-2 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_wechat_public"
                      checked={profileData.privacy.is_wechat_public}
                      onChange={handlePrivacyChange}
                      className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-600">公开显示</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    邮箱隐私设置
                  </label>
                  <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_email_public"
                      checked={profileData.privacy.is_email_public}
                      onChange={handlePrivacyChange}
                      className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-600">公开显示邮箱</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 个人简介 */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                个人简介
              </label>
              <textarea 
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical" 
                rows="4"
                placeholder="请输入个人简介"
              />
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                {saving && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {saving ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}