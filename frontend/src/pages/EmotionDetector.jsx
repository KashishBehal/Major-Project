import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import '../focus.css';
const EmotionDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [focusedTime, setFocusedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const expressionsConsideredFocused = ['neutral', 'happy', 'surprised']; // You can adjust this

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectExpressions();
        };
      })
      .catch((err) => console.error("Camera error:", err));
  };

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
  };

  const detectExpressions = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight
    };
    faceapi.matchDimensions(canvas, displaySize);

    const id = setInterval(async () => {
      if (!video || video.paused || video.ended) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceExpressions(canvas, resized);

      if (resized.length > 0) {
        const expression = resized[0].expressions;
        const maxExpr = Object.keys(expression).reduce((a, b) =>
          expression[a] > expression[b] ? a : b
        );

        if (expressionsConsideredFocused.includes(maxExpr)) {
          setFocusedTime(prev => prev + 0.2); // since we run every 200ms
        }
      }
    }, 200);

    setIntervalId(id);
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div  className='focus1' style={{ position: 'relative', margin: 'auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '10px' }}>DON'T DISTRACT  YOURSELF</h2>
      <h2>FOCUS ROOM</h2>
      <video className='focus2'
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="660"
        style={{ borderRadius: '10px' }}
      />
      <canvas
      className='focus3'
        ref={canvasRef}
        width="720"
        height="560"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        ⏱️ Time focused on task: <strong>{focusedTime.toFixed(1)} seconds</strong>
      </div>
    </div>
  );
};

export default EmotionDetector;