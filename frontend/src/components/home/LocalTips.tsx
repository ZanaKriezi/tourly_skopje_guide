import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

interface LocalTip {
  id: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
  link?: string;
}

interface LocalTipsProps {
  tips: LocalTip[];
  title: string;
  subtitle?: string;
}

const LocalTips: React.FC<LocalTipsProps> = ({ tips, title, subtitle }) => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-montserrat font-bold text-3xl text-text mb-3">{title}</h2>
          {subtitle && (
            <p className="font-inter text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map(tip => (
            <div 
              key={tip.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start">
                {tip.icon && (
                  <div className="text-primary mr-4">
                    {tip.icon}
                  </div>
                )}
                <div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">{tip.title}</h3>
                  <p className="font-inter text-gray-600 mb-4">{tip.content}</p>
                  {tip.link && (
                    <Link to={tip.link}>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalTips;