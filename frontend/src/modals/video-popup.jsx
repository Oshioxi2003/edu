'use client';

import React from "react";
import Modal from "@/components/ui/Modal";

const VideoPopup = ({
  isVideoOpen,
  setIsVideoOpen,
  videoId = "d8w5SICzzxc",
}) => {
  return (
    <Modal
      isOpen={isVideoOpen}
      onClose={() => setIsVideoOpen(false)}
      size="xl"
    >
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </Modal>
  );
};

export default VideoPopup;
