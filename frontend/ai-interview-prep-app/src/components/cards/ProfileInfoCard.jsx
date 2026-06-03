import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { LuUser } from "react-icons/lu"; // Import a user icon

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    };

    return (
    user && (
        <div className='flex items-center gap-3'>
            {/* Change Made: Conditionally render the image or a fallback icon */}
            {user.profileImageUrl ? (
                <img
                    src={user.profileImageUrl}
                    alt="Profile" // It's important to add an alt attribute
                    className='w-11 h-11 bg-gray-300 rounded-full object-cover'
                />
            ) : (
                <div className='w-11 h-11 flex items-center justify-center bg-gray-200 rounded-full'>
                    <LuUser className='w-6 h-6 text-gray-500' />
                </div>
            )}
            
            <div>
                <div className='text-[15px] text-black font-bold leading-3'>
                    {user.name || ""}
                </div>
                <button
                    className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
    );
}

export default ProfileInfoCard;