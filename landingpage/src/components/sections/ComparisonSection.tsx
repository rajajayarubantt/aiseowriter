import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ComparisonSection: React.FC = () => {
  const Benifits = [
    "No-Click Posting",
    "Ranks top on Google",
    "Auto Publishes Everywhere",
    "Cost-Effective",
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Why Use AI?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Traditional Blogging vs. AI SEO Writer
          </h2>
          <p className="text-lg text-gray-700">
            See how Ai SEO Writer transforms your content workflow and delivers
            better results.
          </p>
          <div className="mx-auto text-center mt-4">
            {Benifits.map((b, idx) => (
              <span
                key={`benifits-${idx}`}
                className="inline-block mr-2 px-3 py-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-indigo-100 rounded-full text-sm font-medium mb-4"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Way */}
          <div className="bg-white rounded-xl shadow p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Traditional Way
              </h3>
              <p className="text-gray-600">
                Manual content creation and publishing
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    Time-Consuming Research
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Hours spent researching topics and keywords
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    Slow Content Creation
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Days or weeks to write a single quality article
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    Manual Publishing
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Manual formatting and platform-specific uploading
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    Inconsistent Schedule
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Content creation often gets pushed aside for other
                    priorities
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    Limited Content Volume
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Only able to produce a few articles per month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Way */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Ai SEO Writer Way</h3>
              <p className="text-indigo-100">
                Automated content creation and publishing
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium">Automated Research</h4>
                  <p className="text-indigo-100 text-sm">
                    AI automatically researches trending topics and keywords
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium">Rapid Content Generation</h4>
                  <p className="text-indigo-100 text-sm">
                    Generate multiple articles in minutes, not days
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium">No-Click Publishing</h4>
                  <p className="text-indigo-100 text-sm">
                    Automatically format and publish across multiple platforms
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium">Consistent Schedule</h4>
                  <p className="text-indigo-100 text-sm">
                    Set it and forget it scheduling ensures regular content
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="font-medium">Unlimited Content Potential</h4>
                  <p className="text-indigo-100 text-sm">
                    Scale to dozens or hundreds of articles per month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
