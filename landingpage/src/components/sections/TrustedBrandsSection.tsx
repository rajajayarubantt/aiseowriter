import React from 'react';

const TrustedBrandsSection: React.FC = () => {
  const brands = [
    { name: 'Company One', logo: 'https://images.pexels.com/photos/618613/pexels-photo-618613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Company Two', logo: 'https://images.pexels.com/photos/618613/pexels-photo-618613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Company Three', logo: 'https://images.pexels.com/photos/618613/pexels-photo-618613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Company Four', logo: 'https://images.pexels.com/photos/618613/pexels-photo-618613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Company Five', logo: 'https://images.pexels.com/photos/618613/pexels-photo-618613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 font-medium">
            Trusted by innovative brands worldwide
          </p>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {brands.map((brand, index) => (
              <div 
                key={index} 
                className="w-24 md:w-32 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`} 
                  className="max-h-10 max-w-full object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsSection;