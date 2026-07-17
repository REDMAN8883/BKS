import React from "react";
import { ThreeDot } from "react-loading-indicators";
import "../css/LoadingOverlay.css"

export default function LoadingOverlay({ visible, text = "Un momento, estamos sacando el pan del horno..." }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
        <ThreeDot 
        variant="bounce" 
        color="#b96707" 
        size="medium" 
        text="" 
        textColor="" />
        <p>style={{ marginTop: '15px' }}{text}</p>
    </div>
    );
}
