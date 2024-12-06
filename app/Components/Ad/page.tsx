"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import Image from "next/image"

interface Advertisement {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  call_to_action: string;
  budget: number;
  start_date: string;
  end_date: string;
  platform: string;
  keywords: string;
  landing_page_url: string;
  status: string;
}

const AdvertisementsPage = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get<Advertisement[]>(
          "http://127.0.0.1:8000/advertisements/"
        );
        setAdvertisements(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch advertisements");
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const openModal = (ad: Advertisement) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-md font-bold mb-4">AD</h1>
      <ul className="flex flex-col gap-6 py-2 h-full rounded-lg">
        {advertisements.length === 0 ? (
          <>
            <div className="flex flex-col gap-4 w-full">
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
            <div className="mt-3 flex flex-col gap-4 w-full">
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
            <div className="mt-3 flex flex-col gap-4 w-full">
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          </>
        ) : (
          advertisements.map((ad) => (
            <div
              key={ad.id}
              onClick={() => openModal(ad)}
              className="cursor-pointer relative mx-2 shadow-lg rounded-lg flex flex-col h-48 bg-base-100 hover:bg-base-100/80"
            >
              <h2 className="text-md font-bold capitalize">{ad.title}</h2>
              <p className="text-sm">{ad.description.slice(0, 70)}...</p>
              <div className="w-full overflow-hidden">
                {ad.image && (
                  <Image src={ad.image} alt={ad.title} width={250} height={192} className="w-full h-full object-cover"/>
                )}
              </div>
              <p className="absolute bottom-1 left-1 text-sm p-2 rounded-md bg-blue-600/70 text-white">Status: {ad.status}</p>
            </div>
          ))
        )}
      </ul>
      {selectedAd && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-[65vw] h-[80vh]">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedAd.title}</h2>
            <p className="mb-4">{selectedAd.description}</p>
            {selectedAd.image && (
              <img
                src={selectedAd.image}
                alt={selectedAd.title}
                className="w-full h-auto mb-4"
              />
            )}
            {selectedAd.video && (
              <video
                src={selectedAd.video}
                controls
                className="w-full h-auto mb-4"
              />
            )}
            <div className="flex flex-col">
            <p>Call to Action: {selectedAd.call_to_action}</p>
            <p>Budget: ${selectedAd.budget}</p>
            <p>Start Date: {selectedAd.start_date}</p>
            <p>End Date: {selectedAd.end_date}</p>
            <p>Platform: {selectedAd.platform}</p>
            <p>Keywords: {selectedAd.keywords}</p>
            </div>
            
            <a
              href={selectedAd.landing_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-4"
            >
              Learn More
            </a>
            <p className="mt-4">Status: {selectedAd.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementsPage;
