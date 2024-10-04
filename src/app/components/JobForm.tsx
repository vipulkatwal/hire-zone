'use client';
import {saveJobAction} from "@/app/actions/jobActions";
import ImageUpload from "@/app/components/ImageUpload";
import type {Job} from "@/models/Job";
import {faEnvelope, faMobile, faPerson, faPhone, faStar, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, RadioGroup, TextArea, TextField, Theme} from "@radix-ui/themes";
import {redirect} from "next/navigation";
import {useState} from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

export default function JobForm({orgId, jobDoc}: {orgId: string; jobDoc?: Job}) {
  const [countryId, setCountryId] = useState(jobDoc?.countryId || 0);
  const [stateId, setStateId] = useState(jobDoc?.stateId || 0);
  const [cityId, setCityId] = useState(jobDoc?.cityId || 0);
  const [countryName, setCountryName] = useState(jobDoc?.country || '');
  const [stateName, setStateName] = useState(jobDoc?.state || '');
  const [cityName, setCityName] = useState(jobDoc?.city || '');

  async function handleSaveJob(data: FormData) {
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
        className="container mx-auto px-4 py-8 max-w-3xl font-sans bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a Job</h2>
        {jobDoc && (
          <input type="hidden" name="id" value={jobDoc?._id}/>
        )}
        <TextField.Root name="title" placeholder="Enter job title" defaultValue={jobDoc?.title || ''} className="mb-6 w-full"/>
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remote Work</label>
            <RadioGroup.Root defaultValue={jobDoc?.remote || 'hybrid'} name="remote">
              <div className="space-y-2">
                <RadioGroup.Item value="onsite" className="flex items-center">
                  <span className="ml-2">On-site</span>
                </RadioGroup.Item>
                <RadioGroup.Item value="hybrid" className="flex items-center">
                  <span className="ml-2">Hybrid</span>
                </RadioGroup.Item>
                <RadioGroup.Item value="remote" className="flex items-center">
                  <span className="ml-2">Fully remote</span>
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <RadioGroup.Root defaultValue={jobDoc?.type || 'full'} name="type">
              <div className="space-y-2">
                <RadioGroup.Item value="project" className="flex items-center">
                  <span className="ml-2">Project</span>
                </RadioGroup.Item>
                <RadioGroup.Item value="part" className="flex items-center">
                  <span className="ml-2">Part-time</span>
                </RadioGroup.Item>
                <RadioGroup.Item value="full" className="flex items-center">
                  <span className="ml-2">Full-time</span>
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
            <TextField.Root name="salary" defaultValue={jobDoc?.salary || ''} className="w-full">
              <TextField.Slot>
                ₹
              </TextField.Slot>
              <TextField.Slot>
                LPA
              </TextField.Slot>
            </TextField.Root>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <CountrySelect
              defaultValue={countryId ? {id:countryId,name:countryName} : 0}
              onChange={(e:any) => {
                setCountryId(e.id);
                setCountryName(e.name);
              }}
              placeHolder="Select Country"
              className="w-full sm:w-1/3"
            />
            <StateSelect
              defaultValue={stateId ? {id:stateId,name:stateName} : 0}
              countryid={countryId}
              onChange={(e:any) => {
                setStateId(e.id);
                setStateName(e.name);
              }}
              placeHolder="Select State"
              className="w-full sm:w-1/3"
            />
            <CitySelect
              defaultValue={cityId ? {id:cityId,name:cityName} : 0}
              countryid={countryId}
              stateid={stateId}
              onChange={(e:any) => {
                setCityId(e.id);
                setCityName(e.name);
              }}
              placeHolder="Select City"
              className="w-full sm:w-1/3"
            />
          </div>
        </div>
        <div className="sm:flex mb-6">
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Job Icon</h3>
            <ImageUpload name="jobIcon" icon={faStar} defaultValue={jobDoc?.jobIcon || ''} />
          </div>
          <div className="grow">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Person</h3>
            <div className="flex gap-2">
              <div className="w-1/4">
                <ImageUpload name="contactPhoto" icon={faUser} defaultValue={jobDoc?.contactPhoto || ''} />
              </div>
              <div className="grow flex flex-col gap-2">
                <TextField.Root
                  placeholder="John Doe"
                  name="contactName"
                  defaultValue={jobDoc?.contactName || ''}
                  className="w-full"
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faUser}/>
                  </TextField.Slot>
                </TextField.Root>
                <TextField.Root
                  placeholder="Phone"
                  type="tel"
                  name="contactPhone"
                  defaultValue={jobDoc?.contactPhone || ''}
                  className="w-full"
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faPhone}/>
                  </TextField.Slot>
                </TextField.Root>
                <TextField.Root
                  placeholder="Email"
                  type="email"
                  name="contactEmail"
                  defaultValue={jobDoc?.contactEmail || ''}
                  className="w-full"
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faEnvelope}/>
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>
          </div>
        </div>
        <TextArea
          defaultValue={jobDoc?.description || ''}
          placeholder="Enter job description"
          resize="vertical"
          name="description"
          className="mb-6 w-full"
        />
        <div className="flex justify-center">
          <Button size="3" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <span className="px-8">Save Job</span>
          </Button>
        </div>
      </form>
    </Theme>
  );
}