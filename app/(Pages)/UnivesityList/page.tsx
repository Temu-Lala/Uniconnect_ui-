"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface UniversityData {
  key: number;
  name: string;
  avatar: string | null;
  link: string;
}


const fetchData = async (
  setUniversityData: React.Dispatch<React.SetStateAction<UniversityData[]>>
) => {
  try {
    const response = await axios.get("/files/universityData.json");
    const fetchedData = response.data.map((item: any) => ({
      key: item.id,
      name: item.name,
      avatar: item.avatar,
      link: item.link, // Ensure this link is provided by your API
    }));
    setUniversityData(fetchedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default function UniversityPage() {
  const [universityData, setUniversityData] = useState<UniversityData[]>([]);

  useEffect(() => {
    fetchData(setUniversityData);
  }, []);



  return (
    <div className="">
      <table>
        {universityData.map((university) => (
          <tr key={university.key}>
            <td>
              <Link href={university.link}>
                <div className="flex w-full p-3 items-center gap-3 rounded-tl-xl rounded-bl-xl hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={university.avatar || "/images/universities/default-avatar.jpg"}
                      alt="Avatar"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="">
                    <p>{university.name}</p>
                  </div>
                </div>
              </Link>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
