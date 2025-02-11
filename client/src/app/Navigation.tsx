import React from 'react';
import { Briefcase, Heart, CheckSquare, X, Settings, User } from 'lucide-react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 z-50 shadow-lg">
      <ul className="flex justify-around items-center w-full">
        <li className="flex flex-col items-center justify-center cursor-pointer group">
          <Link href="/jobFeed" className="flex flex-col items-center justify-center text-xs text-gray-800 hover:text-blue-500">
            <Briefcase size={20} />
            Job Feed
          </Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer group">
          <Link href="/matches" className="flex flex-col items-center justify-center text-xs text-gray-800 hover:text-blue-500">
            <Heart size={20} />
            Matches
          </Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer group">
          <Link href="/applied" className="flex flex-col items-center justify-center text-xs text-gray-800 hover:text-blue-500">
            <CheckSquare size={20} />
            Applied
          </Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer group">
          <Link href="/skippedJobs" className="flex flex-col items-center justify-center text-xs text-gray-800 hover:text-blue-500">
            <X size={20} />
            Skipped
          </Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer group">
          <Link href="/preferences" className="flex flex-col items-center justify-center text-xs text-gray-800 hover:text-blue-500">
            <Settings size={20} />
            Preferences
          </Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer group">
          <Link href="/userProfile" className="flex flex-col items-center justify-center text-xs text-gray-800 hover:text-blue-500">
            <User size={20} />
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
