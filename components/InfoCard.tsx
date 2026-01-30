
import React from 'react';

interface InfoCardProps {
  title: string;
  message: string;
}

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const InfoCard: React.FC<InfoCardProps> = ({ title, message }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4 border border-gray-700">
      <div className="flex-shrink-0">
         <InfoIcon className="w-6 h-6 text-blue-400 mt-1" />
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-gray-400 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default InfoCard;
