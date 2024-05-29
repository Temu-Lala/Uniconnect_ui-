"use client"
import React, { useState, useEffect } from 'react';
import { FaPhone, FaPhoneSlash } from 'react-icons/fa';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

const VoiceCall = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [localTracks, setLocalTracks] = useState<IMicrophoneAudioTrack[]>([]);
  const appId = 'YOUR_APP_ID';
  const token = 'YOUR_TOKEN'; 
  const channelName = 'YOUR_CHANNEL_NAME';

  useEffect(() => {
    const initializeAgora = async () => {
      try {
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);
        await agoraClient.join(appId, channelName, token, null);
        console.log('AgoraRTC client initialized');
      } catch (error) {
        console.error('Failed to initialize AgoraRTC client', error);
      }
    };

    initializeAgora();

    return () => {
      if (client) {
        client.removeAllListeners();
        client.leave();
      }
    };
  }, [client]);

  const startCall = async () => {
    if (!client) return;
    try {
      const microphoneTrack: IMicrophoneAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalTracks([microphoneTrack]);
      await client.publish([microphoneTrack]);
      console.log('Local audio track published successfully');
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to publish local audio track', error);
    }
  };

  const handleStartCall = () => {
    if (client && !isCallActive) {
      startCall();
    }
  };

  const handleEndCall = () => {
    if (client && isCallActive) {
      localTracks.forEach(track => track.close());
      client.unpublish(localTracks).then(() => {
        console.log('Local tracks unpublished successfully');
        setIsCallActive(false);
        setLocalTracks([]);
      }).catch(error => {
        console.error('Failed to unpublish local tracks', error);
      });
    }
  };

  return (
    <div className="flex items-center justify-between h-screen bg-gray-200">
      <div className="p-8 flex flex-col items-center">
        <p className="text-2xl font-semibold mb-4">Voice Call</p>
        <div className="flex items-center space-x-4">
          {isCallActive ? (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleEndCall}
            >
              <FaPhoneSlash size={20} /> End Call
            </button>
          ) : (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleStartCall}
              >
                <FaPhone size={20} /> Start Voice Call
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleEndCall}
              >
                <FaPhoneSlash size={20} /> End Call
              </button>
            </>
          )}
        </div>
      </div>
      <div className="p-8 flex flex-col items-center">
        {/* Add components for displaying call duration, other participants, etc. */}
      </div>
    </div>
  );
};

export default VoiceCall;
