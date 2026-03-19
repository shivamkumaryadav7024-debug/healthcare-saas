import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import Button from './Button';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory?: string;
  lastVisit?: string;
  status: string;
  appointmentDate?: string;
}

interface EditPatientModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Patient>(patient);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(patient);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, patient]);

  // Validation functions
  const validateForm = (data: Patient): FormErrors => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      newErrors.name = 'Patient name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (data.name.length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || data.email.trim().length === 0) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!data.phone || data.phone.trim().length === 0) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    // Date of Birth validation
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'Patient must be at least 18 years old';
      }
    }

    // Address validation
    if (!data.address || data.address.trim().length === 0) {
      newErrors.address = 'Address is required';
    } else if (data.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (touched[name]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof FormErrors];
      setErrors(newErrors);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
    // Validate this field
    const fieldErrors = validateForm(formData);
    if (fieldErrors[fieldName as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldErrors[fieldName as keyof FormErrors],
      }));
    } else {
      const newErrors = { ...errors };
      delete newErrors[fieldName as keyof FormErrors];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
    } else {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        address: true,
      });
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && touched.name && touched.email && touched.phone && touched.dateOfBirth && touched.address;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Patient Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.name && touched.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.name && touched.name && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <FiAlertCircle size={16} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.email && touched.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.email && touched.email && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <FiAlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.phone && touched.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.phone && touched.phone && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <FiAlertCircle size={16} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onBlur={() => handleBlur('dateOfBirth')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.dateOfBirth && touched.dateOfBirth
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.dateOfBirth && touched.dateOfBirth && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <FiAlertCircle size={16} />
                  <span>{errors.dateOfBirth}</span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onBlur={() => handleBlur('address')}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.address && touched.address
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.address && touched.address && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <FiAlertCircle size={16} />
                <span>{errors.address}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FiSave}
              iconPosition="left"
              className={`flex-1 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isFormValid}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
