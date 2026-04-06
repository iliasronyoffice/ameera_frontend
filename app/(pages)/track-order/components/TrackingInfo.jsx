"use client";
export default function TrackingInfo({ steadfastId }) {
  if (!steadfastId) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold mb-3">Tracking Information</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Courier</p>
          <p className="text-sm font-medium">Steadfast</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tracking ID</p>
          <p className="text-sm font-medium">{steadfastId}</p>
        </div>
      </div>
    </div>
  );
}