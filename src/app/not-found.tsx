import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#10131D] text-[#F7F8FC] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1E2433] border border-[#343B4D] rounded-xl p-8 text-center shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-[#20B8CF]/10 border border-[#20B8CF]/30 flex items-center justify-center text-[#20B8CF] mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#F7F8FC] mb-2">404 — Screen Not Found</h1>
        <p className="text-xs text-[#A6AEC0] mb-6">
          The requested route does not exist in the CreatorAI portal or access has been restricted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-[#7057E8] text-white rounded-md font-medium hover:bg-[#6045d8] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
