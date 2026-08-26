'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Camera, Save } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+91 98765 43210',
    dob: '1995-08-15',
    gender: 'Male',
    bio: 'Coffee enthusiast and event planner. Love exploring new cafes around the city!',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-12">
      <div className="h-32 bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] w-full flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white mt-8 flex items-center">
          <User className="mr-3" size={28} /> Edit Profile
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E8DED5] p-6 sm:p-8"
        >
          <div className="flex flex-col items-center mb-8 border-b border-[#E8DED5] pb-8">
            <div className="relative group cursor-pointer">
              <img 
                src="https://i.pravatar.cc/150?u=johndoe" 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-full border-4 border-[#FFF8F0] shadow-md object-cover transition-opacity group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-[#6F4E37]" />
              </div>
            </div>
            <p className="text-sm text-[#A67B5B] mt-3 font-medium">Click to change photo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-[#E8DED5] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37] outline-none transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-[#E8DED5] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37] outline-none transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-[#E8DED5] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37] outline-none transition-shadow" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(gender => (
                  <label key={gender} className="flex items-center cursor-pointer">
                    <input type="radio" name="gender" value={gender} checked={formData.gender === gender} onChange={handleChange} className="w-4 h-4 text-[#6F4E37] border-gray-300 focus:ring-[#6F4E37]" />
                    <span className="ml-2 text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full p-4 border border-[#E8DED5] rounded-lg focus:ring-[#6F4E37] focus:border-[#6F4E37] outline-none transition-shadow" placeholder="Tell us a bit about yourself..."></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#6F4E37] text-white rounded-lg hover:bg-[#A67B5B] transition-colors font-medium shadow-sm">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
