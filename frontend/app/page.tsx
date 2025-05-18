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
          
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
             
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
            </svg>

            </div>
            <h3 className="font-semibold text-lg mb-2">Upload</h3>
            <p className="text-gray-600">
              Upload your documents in various formats including JPG, JPEG and PNG.
            </p>
          </div>

         
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
             
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>

            </div>
            <h3 className="font-semibold text-lg mb-2">Process</h3>
            <p className="text-gray-600">
              Our advanced OCR technology extracts and processes text from your documents accurately.
            </p>
          </div>

         
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
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
