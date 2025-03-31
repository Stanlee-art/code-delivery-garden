
import React from 'react';
import { QrCode, Instagram, Facebook, Twitter } from 'lucide-react';

export const QRSection: React.FC = () => {
  return (
    <section className="qr-section">
      <h2>Scan to View Menu</h2>
      <div className="bg-white p-4 rounded-lg shadow-md inline-block">
        {/* This div will be replaced by your custom QR code image in index.html */}
        <div className="qr-code-placeholder w-48 h-48 flex items-center justify-center">
          <QrCode className="w-32 h-32 text-gray-400" />
          <p className="text-sm text-gray-600 absolute">QR Code Placeholder</p>
        </div>
      </div>
      <p className="text-sm mt-2 text-gray-600">
        You can replace this QR code by adding your custom image in index.html
      </p>
    </section>
  );
};
