import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Weight, Calendar, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Gender } from '../services/growthCalculations';

export interface Measurement {
  date: string;
  height: string;
  weight: string;
}

export interface AssessmentData {
  gender: Gender;
  birthday: string;
  fatherHeight?: string;
  motherHeight?: string;
  measurements: Measurement[];
}

interface GrowthAssessmentFormProps {
  initialData?: AssessmentData | null;
  onSubmit: (data: AssessmentData) => void;
}

const BoyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
    <path d="M9 7L10.5 5L12 7L13.5 5L15 7V9H9V7Z" fill="#FBBF24" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#7DD3FC" />
    <circle cx="9" cy="15" r="1" fill="#0369A1" />
    <circle cx="15" cy="15" r="1" fill="#0369A1" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GirlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
    <path d="M8 8C8 8 10 6 12 6C14 6 16 8 16 8L15 10H9L8 8Z" fill="#FBBF24" />
    <circle cx="12" cy="6" r="1" fill="#F59E0B" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#F9A8D4" />
    <circle cx="9" cy="15" r="1" fill="#9D174D" />
    <circle cx="15" cy="15" r="1" fill="#9D174D" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GrowthAssessmentForm: React.FC<GrowthAssessmentFormProps> = ({ initialData, onSubmit }) => {
  const { t } = useTranslation();
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'boy');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [fatherHeight, setFatherHeight] = useState(initialData?.fatherHeight || '');
