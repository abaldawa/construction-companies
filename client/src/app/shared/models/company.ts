/**
 * @author Abhijit Baldawa
 */

export interface Company {
  id: string;
  companyName: string; //MONGO id
  country: string; // ex: EA
  companyLogo: string; // ex: fac3dc30-132b-4d08-a3b7-ffac832b5579
  speciality: string;
  countryLogo: string; //ex: everair-gde-online.everhub.aero
}