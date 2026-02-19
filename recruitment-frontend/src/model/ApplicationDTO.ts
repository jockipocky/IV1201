/**
 * File to keep both the application status enum as well as the application DTO.
 * Instances of ApplicationDTO are generated when we get back results from the request
 * of getAllApplications().
 * 
 */

export enum ApplicationStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  UNHANDLED = 'UNHANDLED',
}

export interface ApplicationDTO {
  applicationId: number;

  applicant: {
    firstName: string;
    lastName: string;
    personNumber: string;
    email: string;
  };

  competences: {
    name: string;
    yearsOfExperience: number;
  }[];

  availability: {
    fromDate: string;
    toDate: string;
  }[];

  status: ApplicationStatus;

  lastUpdated: string; //ISO timestamp, useful for concurrency handling later i think?
}