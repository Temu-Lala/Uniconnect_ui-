"use client"
import React, { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const Video = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);

  const appId = 'YOUR_APP_ID';
  const token = 'YOUR_TOKEN'; 
  const channelName = 'YOUR_CHANNEL_NAME';

  useEffect(() => {
    const initializeAgora = async () => {
      try {
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);
        await agoraClient.join(appId, channelName, token);
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
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);

      await client.publish([videoTrack, audioTrack]);
      console.log('Local video and audio tracks published successfully');
      setIsVideoActive(true);
      setIsAudioActive(true);
    } catch (error) {
      console.error('Failed to publish local tracks', error);
    }
  };

  const toggleVideo = async () => {
    if (!client || !localVideoTrack) return;

    try {
      if (isVideoActive) {
        await client.unpublish(localVideoTrack);
        localVideoTrack.close();
        setLocalVideoTrack(null);
        setIsVideoActive(false);
      } else {
        await startCall();
      }
    } catch (error) {
      console.error('Failed to toggle video track', error);
    }
  };

  const toggleAudio = async () => {
    if (!client || !localAudioTrack) return;

    try {
      if (isAudioActive) {
        await client.unpublish(localAudioTrack);
        localAudioTrack.close();
        setLocalAudioTrack(null);
        setIsAudioActive(false);
      } else {
        await startCall();
      }
    } catch (error) {
      console.error('Failed to toggle audio track', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="p-8 flex flex-col items-center">
        <p className="text-2xl font-semibold mb-4">Video Call</p>
        <div className="flex items-center space-x-4">
          {isVideoActive ? (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={toggleVideo}
            >
              <FaVideoSlash size={20} /> Turn Off Video
            </button>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => { toggleVideo(); toggleAudio(); }} 
            >
              <FaVideo size={20} /> Turn On Video
            </button>
          )}
          {isAudioActive ? (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={toggleAudio}
            >
              <FaMicrophoneSlash size={20} /> Mute
            </button>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => { toggleAudio(); toggleVideo(); }} 
            >
              <FaMicrophone size={20} /> Unmute
            </button>
          )}
        </div>
        <div className="mt-8">
          {localVideoTrack && (
            <video
              ref={(node) => {
                if (node && localVideoTrack) {
                  localVideoTrack.play(node);
                }
              }}
              autoPlay
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Video;
