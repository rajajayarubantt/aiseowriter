import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './Button';
import Link from 'next/link';

interface UseCaseCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ title, description, image, link }) => {
    return (
      <Link href={link} className="bg-white p-2 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover rounded-xl" 
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-4 flex-grow">{description}</p>
          <Button variant="text" className="self-start">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Link>
    );
};

export default UseCaseCard;