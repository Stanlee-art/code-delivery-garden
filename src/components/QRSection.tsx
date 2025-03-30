
import React from 'react';

export const QRSection: React.FC = () => {
  return (
    <section className="mt-12 border-t pt-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Scan to View Menu</h2>
      <div className="bg-white p-4 rounded-lg shadow-md inline-block">
        {/* This would be a placeholder QR code - in a real app, you'd generate one */}
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-sm text-gray-600">QR Code Placeholder</p>
        </div>
      </div>
    </section>
  );
};
