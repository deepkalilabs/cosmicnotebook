'use client';

import { useState, useEffect, useRef } from 'react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';


export default function AudioPlayer() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const s3Client = new S3Client({
          region: 'us-west-1',
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
          },
        });

        const command = new GetObjectCommand({
          Bucket: 'voice-audio-cosmic',
          Key: 'nick_medme.m4a',
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('Signed URL:', signedUrl); // Debug: Verify URL
        setAudioUrl(signedUrl);


        const audio = new Audio(signedUrl);
        audioRef.current = audio;

        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
          console.log('Duration loaded:', audio.duration);
        });
        audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          console.log('Audio ended');
        });
        audio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          setError('Audio failed to load');
        });
        audio.addEventListener('canplay', () => {
          console.log('Audio ready to play');
        });

        return () => {
          audio.pause();
          audio.removeEventListener('loadedmetadata', () => {});
          audio.removeEventListener('timeupdate', () => {});
          audio.removeEventListener('ended', () => {});
          audio.removeEventListener('error', () => {});
          audio.removeEventListener('canplay', () => {});
          audio.remove();
        };
      } catch (err) {
        console.error('Error fetching audio:', err);
        setError('Failed to load audio from S3');
      }
    };

    fetchAudio();
  }, []);

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      console.log('Audio not ready');
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        console.log('Paused');
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        console.log('Playing');
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Playback error: ' + (err as Error).message);
    }
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        {error}
      </div>
    );
  }

  if (!audioUrl) {
    return <div>Loading audio...</div>;
  }

  return (
    <div className="w-full flex items-center gap-4 px-6">
      {/* Play/Pause Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={togglePlayPause}
          disabled={!audioRef.current || duration === 0}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Slider */}
      <div className="flex-1">
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={handleSeek}
          disabled={!audioRef.current || duration === 0}
        />
      </div>

      {/* Time Display */}
      <div className="min-w-[4rem] text-sm text-muted-foreground">
        {formatTime(currentTime)}
      </div>
    </div>
  );
}