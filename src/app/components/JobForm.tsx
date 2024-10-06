'use client';
import { saveJobAction } from "@/app/actions/jobActions";
import ImageUpload from "@/app/components/ImageUpload";
import type { Job } from "@/models/Job";
import { faEnvelope, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";

// Update the props type to include className
export default function JobForm({ orgId, jobDoc, className }: { orgId: string; jobDoc?: Job; className?: string }) {
  const [countryId, setCountryId] = useState(jobDoc?.countryId || 0);
  const [stateId, setStateId] = useState(jobDoc?.stateId || 0);
  const [cityId, setCityId] = useState(jobDoc?.cityId || 0);
  const [countryName, setCountryName] = useState(jobDoc?.country || '');
  const [stateName, setStateName] = useState(jobDoc?.state || '');
  const [cityName, setCityName] = useState(jobDoc?.city || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm(data: FormData) {
    const errors: Record<string, string> = {};
    const requiredFields = ['title', 'salary', 'description', 'contactName', 'contactPhone', 'contactEmail'];
    requiredFields.forEach(field => {
      if (!data.get(field)) {
        errors[field] = `${field} is required`;
      }
    });

    if (!countryId || !stateId || !cityId) {
      errors['location'] = "Location fields (Country, State, City) are required.";
    }

    return errors;
  }

  async function handleSaveJob(data: FormData) {
    const formErrors = validateForm(data);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    data.set('country', countryName.toString());
    data.set('state', stateName.toString());
    data.set('city', cityName.toString());
    data.set('countryId', countryId.toString());
    data.set('stateId', stateId.toString());
    data.set('cityId', cityId.toString());
    data.set('orgId', orgId);
    const jobDoc = await saveJobAction(data);
    redirect(`/jobs/${jobDoc.orgId}`);
  }

  return (
    <Theme>
      <form
        action={handleSaveJob}
        className={`container mx-auto px-4 py-8 max-w-4xl font-sans bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-xl ${className}`}
      >
        <h2 className="text-3xl font-bold text-indigo-800 mb-8 text-center">Create New Job Posting</h2>
        {jobDoc && <input type="hidden" name="id" value={jobDoc?._id} />}

        <div className="mb-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-indigo-700 mb-2">Job Title</label>
              <TextField.Root name="title" placeholder="Job Title" defaultValue={jobDoc?.title || ''} className="w-full text-lg" />
              {errors.title && <p className="text-red-600">{errors.title}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-indigo-700 mb-2">Salary (LPA)</label>
              <TextField.Root name="salary" defaultValue={jobDoc?.salary || ''} className="w-full">
                <TextField.Slot>₹</TextField.Slot>
              </TextField.Root>
              {errors.salary && <p className="text-red-600">{errors.salary}</p>}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-2">Work Environment</label>
            <RadioGroup.Root defaultValue={jobDoc?.remote || 'hybrid'} name="remote" className="flex flex-col space-y-2">
              <RadioGroup.Item value="onsite" className="flex items-center">
                <span className="ml-2 text-sm">On-site</span>
              </RadioGroup.Item>
              <RadioGroup.Item value="hybrid" className="flex items-center">
                <span className="ml-2 text-sm">Hybrid</span>
              </RadioGroup.Item>
              <RadioGroup.Item value="remote" className="flex items-center">
                <span className="ml-2 text-sm">Remote</span>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-700 mb-2">Employment Type</label>
            <RadioGroup.Root defaultValue={jobDoc?.type || 'full'} name="type" className="flex flex-col space-y-2">
              <RadioGroup.Item value="project" className="flex items-center">
                <span className="ml-2 text-sm">Project</span>
              </RadioGroup.Item>
              <RadioGroup.Item value="part" className="flex items-center">
                <span className="ml-2 text-sm">Part-time</span>
              </RadioGroup.Item>
              <RadioGroup.Item value="full" className="flex items-center">
                <span className="ml-2 text-sm">Full-time</span>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </div>
        </div>



        <div className="mb-8">
          <label className="block text-sm font-semibold text-indigo-700 mb-2">Job Location</label>
          <div className="grid md:grid-cols-3 gap-4">
            <CountrySelect
              defaultValue={countryId ? { id: countryId, name: countryName } : 0}
              onChange={(e: any) => {
                setCountryId(e.id);
                setCountryName(e.name);
              }}
              placeHolder="Select Country"
              className="w-full"
            />
            <StateSelect
              defaultValue={stateId ? { id: stateId, name: stateName } : 0}
              countryid={countryId}
              onChange={(e: any) => {
                setStateId(e.id);
                setStateName(e.name);
              }}
              placeHolder="Select State"
              className="w-full"
            />
            <CitySelect
              defaultValue={cityId ? { id: cityId, name: cityName } : 0}
              countryid={countryId}
              stateid={stateId}
              onChange={(e: any) => {
                setCityId(e.id);
                setCityName(e.name);
              }}
              placeHolder="Select City"
              className="w-full"
            />
          </div>
          {errors.location && <p className="text-red-600">{errors.location}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Job Details</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <ImageUpload name="jobIcon" icon={faStar} defaultValue={jobDoc?.jobIcon || ''} />
              </div>
              <TextArea
                defaultValue={jobDoc?.description || ''}
                placeholder="Describe the job role, responsibilities, and requirements"
                resize="vertical"
                name="description"
                className="w-full min-h-[200px]"
              />
              {errors.description && <p className="text-red-600">{errors.description}</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Contact Information</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-start mb-4">
                <ImageUpload name="contactPhoto" icon={faUser} defaultValue={jobDoc?.contactPhoto || ''} className="w-24 h-24 mb-4" />
                <TextField.Root
                  placeholder="Recruiter's Name"
                  name="contactName"
                  defaultValue={jobDoc?.contactName || ''}
                  className="w-full"
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faUser} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.contactName && <p className="text-red-600">{errors.contactName}</p>}
              </div>
              <div className="flex flex-col items-start mb-4">
                <TextField.Root
                  placeholder="Recruiter's Phone"
                  name="contactPhone"
                  defaultValue={jobDoc?.contactPhone || ''}
                  className="w-full"
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faPhone} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.contactPhone && <p className="text-red-600">{errors.contactPhone}</p>}
              </div>
              <div className="flex flex-col items-start mb-4">
                <TextField.Root
                  placeholder="Recruiter's Email"
                  name="contactEmail"
                  defaultValue={jobDoc?.contactEmail || ''}
                  className="w-full"
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.contactEmail && <p className="text-red-600">{errors.contactEmail}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="w-full max-w-xs bg-indigo-600 text-white hover:bg-indigo-700">
            Create a Job
          </Button>
        </div>
      </form>
    </Theme>
  );
}
