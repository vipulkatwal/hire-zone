'use client';
import { useState } from 'react';
import TimeAgo from "@/app/components/TimeAgo";
import { Job } from "@/models/Job";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import Image from 'next/image'; // Import Image from next/image

export default function JobRow({ jobDoc }: { jobDoc: Job }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative transition-all hover:shadow-xl border border-gray-100">
      <button
        className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full transition-all"
        onClick={toggleLike}
        aria-label={liked ? 'Unlike job' : 'Like job'}
      >
        <FontAwesomeIcon
          className={`h-5 w-5 transition-colors duration-300 ${liked ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
          icon={faHeart}
        />
      </button>

      <div className="flex gap-4 items-start">
        <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-white">
          {jobDoc?.jobIcon ? (
            <Image // Use Image instead of img
              className="w-full h-full object-contain p-2"
              src={jobDoc.jobIcon}
              alt={`${jobDoc.orgName} logo`}
              width={56} // Specify a width (adjust as necessary)
              height={56} // Specify a height (adjust as necessary)
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
              No icon
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${jobDoc.orgId}`}
                className="text-gray-600 text-sm font-medium hover:text-gray-800 hover:underline block truncate"
              >
                {jobDoc.orgName || 'Unknown Organization'}
              </Link>

              <h2 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600">
                <Link href={`/show/${jobDoc._id}`} className="hover:underline">
                  {jobDoc.title}
                </Link>
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="capitalize">{jobDoc.remote}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{jobDoc.city}, {jobDoc.country}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="capitalize">{jobDoc.type}-time</span>

                {jobDoc.isAdmin && (
                  <>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <Link
                      href={`/jobs/edit/${jobDoc._id}`}
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <button
                      type="button"
                      onClick={async () => {
                        await axios.delete(`/api/jobs?id=${jobDoc._id}`);
                        window.location.reload();
                      }}
                      className="text-red-500 hover:text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {jobDoc.createdAt && (
              <div className="text-sm text-gray-500 flex-shrink-0 py-8">
                <TimeAgo createdAt={jobDoc.createdAt} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
