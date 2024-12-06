"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface UniversityData {
  key: number;
  id: number;
  name: string;
  avatar: string | null;

}


const fetchData = async (
  setUniversityData: React.Dispatch<React.SetStateAction<UniversityData[]>>
) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get("http://127.0.0.1:8000/university-profiles/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if(response.status == 200){
      const fetchedData = response.data.map((item: any) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        avatar: item.profile_photo,
      }));
      setUniversityData(fetchedData);
      
    } else {
      console.log("Error fetching universities");
    }
    
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
    <div className="h-full">
      <table>
        {universityData.map((university) => (
          <tr key={university.key}>
            <td>
              <Link href={`/universities/profile/${university.id}`}>
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
