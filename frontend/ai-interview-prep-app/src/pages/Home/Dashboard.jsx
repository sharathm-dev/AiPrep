import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import { CARD_BG } from '../../utils/data';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import SummaryCard from '../../components/cards/SummaryCard';
import moment from "moment";
import CreateSessionForm from "../Home/CreateSessionForm";
import Modal from '../../components/Model';
import DeleteAlertContent from '../../components/DeleteAlertContent';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [openDeleteALert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try{
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Sessions Delete Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:",error);
    }
   };

  useEffect(() => {
    fetchAllSessions();
  }, []);
  return (
    <div>
      <DashboardLayout>
        <div className='container mx-auto pt-4 pb-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
            {sessions.length > 0 ? (
            sessions?.map((data, index) => (
              <SummaryCard
                key={data?._id}
                color={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || "-"}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("DD MMM, YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))
            ) : (
              // Empty state message
              <div className="col-span-3 text-center text-gray-500 p-10">
                <h3 className="text-xl font-semibold">No Interview Sessions Found</h3>
                <p className="mt-2">Click the "Add New" button to create your first session!</p>
              </div>
            )}
          </div>

          <button className='h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20'
            onClick={() => setOpenCreateModal(true)}
          >
            <LuPlus className='text-2xl text-white' />
            Add New
          </button>
        </div>

        <Modal
          isOpen={openCreateModal}
          onClose={() => {
            setOpenCreateModal(false)
          }}
          hideHeader
        >
          <div>
            <CreateSessionForm />
          </div>
        </Modal>

        <Modal
          isOpen={openDeleteALert?.open}
          onClose={() => {
            setOpenDeleteAlert({ open: false, data: null});
          }}
          title="Delete Alert"
        >
          <div className="w-[30vw]">
            <DeleteAlertContent
              content="Are you sure you want to delete this session details?"
              onDelete={() => deleteSession(openDeleteALert.data)}
              />
          </div>
        </Modal>
      </DashboardLayout>
    </div>
  );
};


export default Dashboard
