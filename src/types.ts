import { Gender } from "./services/growthCalculations";

export interface ChildProfile {
  id: string;
  name: string;
  gender: Gender;
  birthday: string; // ISO date
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string; // ISO date
  ageInMonths: number;
  height: number; // cm
  weight: number; // kg
  headCircumference: number; // cm
  heightPercentile?: number;
  weightPercentile?: number;
  headPercentile?: number;
}
