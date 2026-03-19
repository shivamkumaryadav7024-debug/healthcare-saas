import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { initializeMockData, updatePatient } from '../store/patientSlice';
import { sendSuccessPushNotification, sendErrorPushNotification, sendPushNotification } from '../utils/toast';
import { FiArrowLeft, FiPhone, FiMail, FiMessageCircle, FiEdit2, FiCalendar, FiGift, FiUser as FiGender, FiFileText } from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import EditPatientModal from '../components/EditPatientModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';

const PatientDetailsPage: React.FC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patient);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  useEffect(() => {
    if (patients.length === 0) {
      dispatch(initializeMockData());
    }
  }, [dispatch, patients.length]);

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h1>
          <Button onClick={() => navigate('/patients')} variant="primary">
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const handleRescheduleAppointment = (newDate: string) => {
    const updatedPatient = { ...patient, appointmentDate: newDate };
    dispatch(updatePatient(updatedPatient));
    sendSuccessPushNotification(
      `✓ Appointment Rescheduled for ${patient.name}`,
      {
        body: `New appointment date: ${newDate}`,
        requireInteraction: false,
      }
    );
  };

  const handleSendMessage = () => {
    sendPushNotification(
      `📧 Message Sent to ${patient.name}`,
      {
        body: 'Your message has been queued for delivery',
        requireInteraction: false,
      }
    );
  };

  const handleEditPatient = (updatedPatient: any) => {
    // Dispatch action to update patient in Redux store
    dispatch(updatePatient(updatedPatient));
    sendSuccessPushNotification(
      `✓ Patient Information Updated`,
      {
        body: `${updatedPatient.name} details have been saved successfully`,
        requireInteraction: false,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/patients')}
            variant="secondary"
            size="sm"
            icon={FiArrowLeft}
            iconPosition="left"
          >
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {patient.name}
              </h1>
              <p className="text-gray-600">{patient.email}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span
                className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  patient.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {patient.status}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card title="Date of Birth" value={patient.dateOfBirth} icon={<FiGift size={24} className="text-pink-600" />} />
          <Card title="Gender" value={patient.gender} icon={<FiGender size={24} className="text-indigo-600" />} />
          <Card title="Phone" value={patient.phone} icon={<FiPhone size={24} className="text-blue-600" />} />
          <Card title="Last Visit" value={patient.lastVisit} icon={<FiCalendar size={24} className="text-orange-600" />} />
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Address</h2>
          <p className="text-gray-700">{patient.address}</p>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Medical History</h2>
          <p className="text-gray-700 mb-4">{patient.medicalHistory || 'No medical history'}</p>
          <div className="flex gap-2">
            <Button onClick={handleSendMessage} size="sm" variant="secondary" icon={FiFileText} iconPosition="left">
              View Full Records
            </Button>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment</h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Next Appointment: </span>
                {patient.appointmentDate}
              </p>
              <p className="text-gray-600 text-sm">
                Call ahead 15 minutes before your appointment
              </p>
            </div>
            <Button
              onClick={() => setIsRescheduleModalOpen(true)}
              size="sm"
              className="mt-4 sm:mt-0"
              icon={FiCalendar}
              iconPosition="left"
            >
              Reschedule
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="primary" size="sm" onClick={() => sendPushNotification(`📞 Calling ${patient.phone}`, { body: 'Call initiated...', requireInteraction: false })} icon={FiPhone} iconPosition="left">
              Call
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSendMessage} icon={FiMail} iconPosition="left">
              Email
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSendMessage} icon={FiMessageCircle} iconPosition="left">
              Message
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsEditModalOpen(true)} icon={FiEdit2} iconPosition="left">
              Edit
            </Button>
          </div>
        </div>

        {/* Edit Patient Modal */}
        <EditPatientModal
          patient={patient}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditPatient}
        />

        {/* Reschedule Appointment Modal */}
        <RescheduleAppointmentModal
          patientName={patient.name}
          currentDate={patient.appointmentDate}
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          onSave={handleRescheduleAppointment}
        />
      </div>
    </div>
  );
};

export default PatientDetailsPage;
