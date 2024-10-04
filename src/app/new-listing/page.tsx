'use server';
import { createCompany } from "@/app/actions/workosActions";
import { getUser } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import Link from "next/link";
import { revalidatePath } from 'next/cache';

export default async function NewListingPage() {
  if (!process.env.WORKOS_API_KEY) {
    throw new Error('WORKOS_API_KEY is not defined in environment variables');
  }

  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  const { user } = await getUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl font-semibold text-red-600">You need to be logged in to post a job</div>
      </div>
    );
  }

  const organizationMemberships = await workos.userManagement.listOrganizationMemberships({
    userId: user.id,
  });

  if (!organizationMemberships?.data || organizationMemberships.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-blue-700 font-medium">
          No companies found assigned to your user
        </div>
        <Link
          className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          href={'/new-company'}>
          Create a new company
        </Link>
      </div>
    );
  }

  const activeOrganizationMemberships = organizationMemberships.data.filter(om => om.status === 'active');
  const organizationsNames = {};

  for (const activeMembership of activeOrganizationMemberships) {
    const organization = await workos.organizations.getOrganization(activeMembership.organizationId);
    organizationsNames[organization.id] = organization.name;
  }

  async function deleteCompany(formData: FormData) {
    'use server'
    const orgId = formData.get('orgId') as string;
    // Implement your deletion logic here
    console.log(`Deleting company with ID: ${orgId}`);
    // After deletion, you might want to refresh the data
    revalidatePath('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-2xl mx-auto">
        <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white">Your Companies</h2>
          <p className="text-blue-100 mt-1">Select a company to create a job ad for</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.keys(organizationsNames).map(orgId => (
              <div key={orgId} className="flex justify-between items-center bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-700">{organizationsNames[orgId]}</span>
                <div className="flex items-center gap-2">
                  <form action={deleteCompany}>
                    <input type="hidden" name="orgId" value={orgId} />
                    <button type="submit" className="p-2 text-red-500 hover:text-red-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </form>
                  <Link
                    href={'/new-listing/' + orgId}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                    Select
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 p-6 border-t">
          <Link
            href={'/new-company'}
            className="block w-full px-6 py-3 bg-green-500 text-white text-center font-semibold rounded-md hover:bg-green-600 transition-colors">
            Create a new company
          </Link>
        </div>
      </div>
    </div>
  );
}