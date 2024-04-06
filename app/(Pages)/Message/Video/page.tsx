"use client"
import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const Video = () => {
  const [client, setClient] = useState(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  const appId = 'YOUR_APP_ID';
  const token = 'YOUR_TOKEN'; // You may need to generate a token from your server
  const channelName = 'YOUR_CHANNEL_NAME';

  useEffect(() => {
    const initializeAgora = async () => {
      try {
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setClient(agoraClient);
        await agoraClient.initialize({ appId });
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
  }, []);

  const joinChannel = async () => {
    try {
      const uid = await client.join({ token, channelName });
      console.log('User ' + uid + ' joined channel successfully');
      setIsVideoActive(true);
      setIsAudioActive(true);

      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      await client.publish(videoTrack);
      setLocalVideoTrack(videoTrack);

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish(audioTrack);
      setLocalAudioTrack(audioTrack);
    } catch (error) {
      console.error('Join channel failed', error);
    }
  };

  const toggleVideo = async () => {
    if (isVideoActive) {
      try {
        await client.unpublish(localVideoTrack);
        setLocalVideoTrack(null);
        setIsVideoActive(false);
      } catch (error) {
        console.error('Failed to unpublish local video track', error);
      }
    } else {
      try {
        await joinChannel();
      } catch (error) {
        console.error('Failed to join channel and start video', error);
      }
    }
  };

  const toggleAudio = async () => {
    if (isAudioActive) {
      try {
        await client.unpublish(localAudioTrack);
        setLocalAudioTrack(null);
        setIsAudioActive(false);
      } catch (error) {
        console.error('Failed to unpublish local audio track', error);
      }
    } else {
      try {
        await joinChannel();
      } catch (error) {
        console.error('Failed to join channel and start audio', error);
      }
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
              onClick={() => { toggleVideo(); toggleAudio(); }} // Toggle both video and audio
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
              onClick={() => { toggleAudio(); toggleVideo(); }} // Toggle both audio and video
            >
              <FaMicrophone size={20} /> Unmute
            </button>
          )}
        </div>
        <div className="mt-8">
          {localVideoTrack && <video ref={(node) => (node.srcObject = localVideoTrack.mediaStream)} autoPlay />}
        </div>
      </div>
    </div>
  );
};

export default Video;
