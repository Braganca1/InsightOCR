// frontend/app/page.tsx
import CTAButtons from '../components/CTAButtons';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 w-full">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Document Intelligence{' '}
            <span className="text-purple-600">Made Simple</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Upload your documents, extract text with OCR, and get AI-powered insights and explanations instantly.
          </p>

          {/* Dynamic CTA buttons */}
          <CTAButtons />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Simple, powerful document processing in three easy steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Upload */}
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
              {/* Upload Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3M8 7h8m0 0l-3-3m3 3l-3 3" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Upload</h3>
            <p className="text-gray-600">
              Upload your documents in various formats including PDF, JPEG, PNG, and TIFF.
            </p>
          </div>

          {/* Step 2: Process */}
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
              {/* Document Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7v10M17 7v10M7 7h10M7 17h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Process</h3>
            <p className="text-gray-600">
              Our advanced OCR technology extracts and processes text from your documents accurately.
            </p>
          </div>

          {/* Step 3: Analyze */}
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
              {/* Question Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Analyze</h3>
            <p className="text-gray-600">
              Ask questions about your documents and get AI-powered insights and explanations.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
