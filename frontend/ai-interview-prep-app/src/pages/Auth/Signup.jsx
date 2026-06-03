import React, { useContext, useState }  from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import ProfilePhotoSelector from '../../components/Input/ProfilePhotoSelector';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadimage';


const Signup = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //handle signup form
  const handleSignup = async (e) => {
    e.preventDefault();
      let profileImageUrl = "";

      if (!fullName) {
        setError("Full Name is required.");
        return;
      }
      if (!email) {
        setError("Email is required.");
        return;
      }
      if (!password) {
        setError("Password is required.");
        return;
      }
      setError("");

      // signup API Call
      try {
        // Upload profile picture if selected
        if (profilePic) {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: fullName,
          email,
          password,
          profileImageUrl,
        });

        const {token} = response.data;
        
        if (token) {
          localStorage.setItem("token", token);
          updateUser(response.data);
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
  };

  return <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
    <h3 className="text-lg font-semibold text-black">
      Create Account </h3>
    <p className="text-xs text-slate-700 mt-[5px] mb-6">
      Join us today and create your account.
    </p>

    <form onSubmit={handleSignup}>

      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
         <Input
           value={fullName}
           onChange={({ target }) => setFullName(target.value)}
           label="Full Name"
           placeholder="John Doe"
           type="text"
         />

         <Input
           value={email}
           onChange={({ target }) => setEmail(target.value)}
           label="Email Address"
           placeholder="john@example.com"
           type="text"
         />

         <Input
           value={password}
           onChange={({ target }) => setPassword(target.value)}
           label="Password"
           placeholder="Min 8 Characters"
           type="password"
         />

       </div>
       {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

       <button type="submit" className="btn-primary">
         Sign Up
       </button>

       <p className="text-[13px] text-slate-800 mt-3">
        Already have an account?{" "}
        <button 
        className="font-medium text-primary underline cursor-pointer"
        onClick={() => {
          setCurrentPage("login");
        }}
        >
          Login
        </button>
      </p>
    </form>
  </div>;
};

export default Signup