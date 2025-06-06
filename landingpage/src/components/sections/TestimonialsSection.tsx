import React from "react";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  image,
  rating,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <blockquote className="text-gray-700 mb-6 flex-grow">
        "{quote}"
      </blockquote>

      <div className="flex items-center">
        <img
          src={image}
          alt={author}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <div className="font-medium text-gray-900">{author}</div>
          <div className="text-gray-600 text-sm">
            {role}, {company}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        "Ai SEO Writer  has completely transformed our content strategy. We're now publishing 5x more content with half the resources. The ROI has been incredible.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechGrowth",
      image:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
    },
    {
      quote:
        "As a small business owner, I never had time to maintain a blog. Ai SEO Writer  does all the heavy lifting for me, and our organic traffic has increased by 230% in just 3 months.",
      author: "Michael Chen",
      role: "Founder",
      company: "Artisan Crafts",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
    },
    {
      quote:
        "Our agency now offers content marketing to all our clients without increasing our team size. Ai SEO Writer  has become our secret weapon for scaling our business.",
      author: "Jessica Winters",
      role: "CEO",
      company: "Digital Spark Agency",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-700">
            Don't just take our word for it. Here's what people love about Ai
            SEO Writer AI.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              image={testimonial.image}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
