
import { type ApplicationDTO, ApplicationStatus } from "@/model/ApplicationDTO";

/**
 * Converts the raw Axios response from getApplications() 
 * into an array of ApplicationDTOs for the store s owe can use it in our components
 */
export function mapApplicationsResponse(response: any): ApplicationDTO[] {
  // Safely get the applications array from response
  const rawApplications = response?.data?.result?.applications ?? [];
  console.log("Raw applications we think? : ", rawApplications);
  return rawApplications.map((app: any): ApplicationDTO => ({
    applicationId: app.person_id,
    applicant: {
      firstName: app.first_name,
      lastName: app.last_name,
      personNumber: app.person_number,
      email: app.email,
    },
    competences: Array.isArray(app.competences)
      ? app.competences.map((c: any) => ({
          name: c.name,
          yearsOfExperience: c.yearsOfExperience,
        }))
      : [],
    availability: Array.isArray(app.availability)
      ? app.availability.map((a: any) => ({
          fromDate: a.fromDate,
          toDate: a.toDate,
        }))
      : [],
    status: (ApplicationStatus[app.status as keyof typeof ApplicationStatus] ??
      ApplicationStatus.UNHANDLED),
    lastUpdated: new Date().toISOString(), // placeholder for now
  }));
}
