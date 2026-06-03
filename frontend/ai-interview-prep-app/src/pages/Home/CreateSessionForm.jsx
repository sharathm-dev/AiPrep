import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Input/Input";
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const CreateSessionForm = () => {
    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        topicsToFocus: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();


        const { role, experience, topicsToFocus } = formData;

        // simple required-fields check
        if (!role || !experience || !topicsToFocus) {
            setError("Please fill all required fields.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            //Call AI API to generate questions
            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,
                {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                }
            );
            // should be array like [{questions, answer}]
            const generatedQuestions = aiResponse.data;

        // Extra check: If the AI response is not as expected
        if (!Array.isArray(generatedQuestions)) {
            throw new Error("Failed to get questions from AI.");
        }

        // Now, create the session with the *correct* array
        const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
            ...formData,
            questions: generatedQuestions, // This is now an array
        });

        if (response.data?.session?._id) {
            toast.success("Session created successfully!");
            // You should probably close the modal here, e.g., onClose();
            navigate(`/interview-prep/${response.data?.session?._id}`);
        }
    } catch (error) {
        let errorMsg;
        if (error.response && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else {
            errorMsg = "Something went wrong. Please try again.";
        }
        setError(errorMsg);
        toast.error(errorMsg); 
    } finally {
        setIsLoading(false);
    }
};
    return <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">
            Start a New Interview Journey
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-3">
            Fill out a few quick details and unlock your personalized set of
            interview questions!
        </p>

        <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
            <Input
                value={formData.role}
                onChange={({ target }) => handleChange("role", target.value)}
                label="Target Role"
                placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
                type="text"
            />


            <Input
                value={formData.experience}
                onChange={({ target }) => handleChange("experience", target.value)}
                label="Years of Experience"
                placeholder="(e.g., 1 Year, 3 Years, 5+ Years)"
                type="number"
            />

            <Input
                value={formData.topicsToFocus}
                onChange={({ target }) => handleChange("topicsToFocus", target.value)}
                label="topics to Focus on"
                placeholder="(Comma-separated, e.g., React, Node.js, MongoDB)"
                type="text"
            />

            <Input
                value={formData.description}
                onChange={({ target }) => handleChange("description", target.value)}
                label="description"
                placeholder="(Any specific goals or notes for this session)"
                type="text"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button
                type="submit"
                className="btn-primary w-full mt-2 flex justify-center items-center"
                disabled={isLoading}
            >

                {isLoading ? <SpinnerLoader /> : "Create Session"}
            </button>
        </form>
    </div>
};

export default CreateSessionForm; 